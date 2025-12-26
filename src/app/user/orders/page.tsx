"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaShoppingBag, FaCheckCircle, FaClock, FaTimes, FaSearch } from "react-icons/fa";
import Cookies from "js-cookie";
import UserHeader from '@/components/layout/UserHeader';
import InvoiceGenerator from '@/components/invoice/InvoiceGenerator';

interface OrderItem {
  dishId: string;
  quantity: number;
  price: string;
}

interface PaymentMetadataItem {
  name: {
    de: string;
    en: string;
  };
  dishId: string;
  quantity: number;
  lineTotal: number;
  unitPrice: number;
}

interface Payment {
  id: string;
  orderId: string;
  paymentMethod: string;
  paymentStatus: string;
  transactionId: string;
  orderReferenceId?: string | null;
  signature?: string | null;
  amount: string;
  currency: string;
  retryCount: number;
  maxRetries: number;
  lastFailureReason?: string | null;
  lastFailureMessage?: string | null;
  refundStatus?: string | null;
  refundAmount?: string | null;
  refundDate?: string | null;
  paymentDate: string;
  metadata?: {
    items?: PaymentMetadataItem[];
    [key: string]: unknown;
  };
  createdAt: string;
  updatedAt: string;
}

interface Order {
  id: string;
  orderNo: string;
  userId: string;
  couponId?: string | null;
  deliveryProvider?: string;
  woltDeliveryId?: string | null;
  deliveryStatus: string;
  deliveryTrackingUrl?: string | null;
  deliveryAddress?: string;
  area?: string;
  pinCode?: string;
  latitude?: string;
  longitude?: string;
  totalAmount: string;
  currency: string;
  notes?: string | null;
  cancelReason?: string | null;
  cancelDate?: string | null;
  orderDate: string;
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  payment?: Payment;
  estimatedDeliveryTime?: string;
}

type OrderFilter = 'all' | 'pending' | 'completed' | 'cancelled';


export default function OrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<OrderFilter>('all');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchOrders = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      if (!token) {
        // If no token, redirect to signin
        router.push('/user/signin?returnUrl=/user/orders');
        return;
      }

      const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
      const response = await fetch(`${API_URL}/api/orders/my-orders`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          // Unauthorized - redirect to signin
          router.push('/user/signin?returnUrl=/user/orders');
          return;
        }
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      
      // Handle the actual backend response structure
      if (data.statusCode === 200 && data.data) {
        setOrders(data.data.allOrders || []);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
      case 'delivered':
        return <FaCheckCircle className="text-green-600" />;
      case 'cancelled':
        return <FaTimes className="text-red-600" />;
      case 'pending':
      case 'confirmed':
      case 'preparing':
      case 'out-for-delivery':
      case 'out for delivery':
      case 'in kitchen':
      case 'accepted':
        return <FaClock className="text-orange-600" />;
      default:
        return <FaClock className="text-gray-600" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
      case 'preparing':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'out-for-delivery':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'cancelled':
        return 'text-red-600 bg-red-50 border-red-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Order Received';
      case 'confirmed':
        return 'Confirmed';
      case 'preparing':
        return 'Preparing';
      case 'out-for-delivery':
        return 'Out for Delivery';
      case 'delivered':
        return 'Delivered';
      case 'cancelled':
        return 'Cancelled';
      default:
        return status;
    }
  };

  const filterOrders = (orders: Order[]) => {
    let filtered = orders;

    // Filter by status
    if (filter === 'pending') {
      // Active orders: pending, confirmed, preparing, out for delivery, in kitchen, accepted
      filtered = filtered.filter(o => {
        const status = o.deliveryStatus.toLowerCase();
        return ['pending', 'confirmed', 'preparing', 'out-for-delivery', 'out for delivery', 'in kitchen', 'accepted'].includes(status);
      });
    } else if (filter === 'completed') {
      // Completed orders: delivered
      filtered = filtered.filter(o => {
        const status = o.deliveryStatus.toLowerCase();
        return status === 'delivered';
      });
    } else if (filter === 'cancelled') {
      // Cancelled orders
      filtered = filtered.filter(o => {
        const status = o.deliveryStatus.toLowerCase();
        return status === 'cancelled';
      });
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(o => 
        o.orderNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.orderItems.some(item => item.dishId.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return filtered;
  };

  // Helper function to get display items from order (either from orderItems or payment metadata)
  const getDisplayItems = (order: Order): Array<{ name: string; quantity: number; dishId: string }> => {
    // If order has orderItems with data, use them
    if (order.orderItems && order.orderItems.length > 0) {
      return order.orderItems.map(item => ({
        name: `Dish #${item.dishId.substring(0, 8)}`, // Fallback name
        quantity: item.quantity,
        dishId: item.dishId
      }));
    }
    
    // Otherwise, try to get items from payment metadata
    if (order.payment?.metadata?.items && Array.isArray(order.payment.metadata.items)) {
      return order.payment.metadata.items.map(item => ({
        name: item.name?.en || item.name?.de || 'Unknown Dish',
        quantity: item.quantity,
        dishId: item.dishId
      }));
    }
    
    return [];
  };

  const filteredOrders = filterOrders(orders);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e30232] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Orders</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchOrders}
            className="btn btn-primary w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <FaShoppingBag className="text-3xl text-[#e30232]" />
            <h1 className="text-3xl font-bold text-gray-800">Order History</h1>
          </div>

          {/* Search & Filter */}
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* Search */}
            <div className="flex-1 relative">
              <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by order number or item name..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232]"
              />
            </div>

            {/* Filter Buttons */}
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'all' 
                    ? 'bg-[#e30232] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All Orders
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'pending' 
                    ? 'bg-[#e30232] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Active
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'completed' 
                    ? 'bg-[#e30232] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => setFilter('cancelled')}
                className={`px-4 py-2 rounded-lg font-semibold transition ${
                  filter === 'cancelled' 
                    ? 'bg-[#e30232] text-white' 
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>

          <div className="mt-4 text-sm text-gray-600">
            Showing {filteredOrders.length} of {orders.length} orders
          </div>
        </div>

        {/* Orders List */}
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <FaShoppingBag className="text-6xl text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {searchQuery ? 'No matching orders' : 'No orders yet'}
            </h2>
            <p className="text-gray-600 mb-6">
              {searchQuery 
                ? 'Try adjusting your search or filter' 
                : 'Start your first order to see your order history here'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => router.push('/user/menu')}
                className="btn btn-primary"
              >
                Browse Menu
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer border-2 border-transparent hover:border-[#e30232]"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div className="flex items-center gap-3 mb-2 md:mb-0">
                    <div className="text-2xl">
                      {getStatusIcon(order.deliveryStatus)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">
                        Order #{order.orderNo}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className={`${getStatusColor(order.deliveryStatus)} px-4 py-2 rounded-lg font-semibold border-2`}>
                      {getStatusText(order.deliveryStatus)}
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-[#e30232]">€{order.totalAmount ? Number(order.totalAmount).toFixed(2) : '0.00'}</p>
                    </div>
                  </div>
                </div>

                {/* Order Items Preview */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {getDisplayItems(order).slice(0, 5).map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2 whitespace-nowrap flex-shrink-0"
                    >
                      <span className="text-sm text-gray-700">
                        {item.quantity}x {item.name}
                      </span>
                    </div>
                  ))}
                  {getDisplayItems(order).length > 5 && (
                    <div className="text-sm text-gray-600 px-3 py-2 whitespace-nowrap">
                      +{getDisplayItems(order).length - 5} more
                    </div>
                  )}
                  {getDisplayItems(order).length === 0 && (
                    <div className="text-sm text-gray-500 italic px-3 py-2">
                      No items available
                    </div>
                  )}
                </div>

                {/* Estimated Delivery Time */}
                {order.estimatedDeliveryTime && order.deliveryStatus.toLowerCase() !== 'delivered' && order.deliveryStatus.toLowerCase() !== 'cancelled' && (
                  <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                    <FaClock className="text-orange-500" />
                    <span>Estimated delivery: {order.estimatedDeliveryTime}</span>
                  </div>
                )}

                <div className="mt-4 text-right space-x-4">
                    {order.deliveryStatus.toLowerCase() !== 'delivered' && order.deliveryTrackingUrl && order.deliveryTrackingUrl.trim() !== '' && (
                      <a
                        href={order.deliveryTrackingUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[#e30232] hover:underline font-semibold"
                      >
                        Track Your Order
                      </a>
                    )}
                    <button
                      className="text-sm text-[#e30232] hover:underline font-semibold"
                      onClick={() => { setSelectedOrder(order); setShowModal(true); }}
                    >
                      View Details →
                    </button>
                    
                    <InvoiceGenerator
                      isPOS={true}
                      invoiceData={{
                        orderNo: order.orderNo,
                        orderDate: order.orderDate,
                        customerName: 'Customer',
                        deliveryAddress: order.deliveryAddress,
                        paymentMethod: order.payment?.paymentMethod || 'N/A',
                        items: getDisplayItems(order).map(item => ({
                          name: item.name,
                          quantity: item.quantity,
                          price: order.orderItems.find(oi => oi.dishId === item.dishId)?.price 
                            ? parseFloat(order.orderItems.find(oi => oi.dishId === item.dishId)!.price) 
                            : 0,
                          total: item.quantity * (order.orderItems.find(oi => oi.dishId === item.dishId)?.price 
                            ? parseFloat(order.orderItems.find(oi => oi.dishId === item.dishId)!.price) 
                            : 0)
                        })),
                        subtotal: order.totalAmount ? parseFloat(order.totalAmount) : 0,
                        total: order.totalAmount ? parseFloat(order.totalAmount) : 0,
                        currency: order.currency || '€'
                      }}
                      buttonText="🖨️ POS Print"
                      buttonClassName="text-sm text-purple-600 hover:underline font-semibold"
                    />
                </div>
                {/* Modal for order details */}
                {showModal && selectedOrder && selectedOrder.id === order.id && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-xl shadow-lg p-8 max-w-2xl w-full relative">
                      <button className="absolute top-4 right-4 text-gray-500 hover:text-[#e30232] text-xl" onClick={() => setShowModal(false)}>&times;</button>
                      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
                        <h2 className="text-2xl font-bold text-[#e30232]">Order Details</h2>
                        <div className="flex gap-2">
                          
                          <InvoiceGenerator
                            isPOS={true}
                            invoiceData={{
                              orderNo: selectedOrder.orderNo,
                              orderDate: selectedOrder.orderDate,
                              customerName: 'Customer',
                              deliveryAddress: selectedOrder.deliveryAddress,
                              paymentMethod: selectedOrder.payment?.paymentMethod || 'N/A',
                              items: getDisplayItems(selectedOrder).map(item => ({
                                name: item.name,
                                quantity: item.quantity,
                                price: selectedOrder.orderItems.find(oi => oi.dishId === item.dishId)?.price 
                                  ? parseFloat(selectedOrder.orderItems.find(oi => oi.dishId === item.dishId)!.price) 
                                  : 0,
                                total: item.quantity * (selectedOrder.orderItems.find(oi => oi.dishId === item.dishId)?.price 
                                  ? parseFloat(selectedOrder.orderItems.find(oi => oi.dishId === item.dishId)!.price) 
                                  : 0)
                              })),
                              subtotal: selectedOrder.totalAmount ? parseFloat(selectedOrder.totalAmount) : 0,
                              total: selectedOrder.totalAmount ? parseFloat(selectedOrder.totalAmount) : 0,
                              currency: selectedOrder.currency || '€'
                            }}
                            buttonText="🖨️ POS Print"
                            buttonClassName="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 transition-colors text-sm font-semibold"
                          />
                        </div>
                      </div>
                      <div className="mb-4 space-y-2">
                        <div className="flex"><div className="font-semibold w-1/3">Order No:</div><div className="w-2/3">{selectedOrder.orderNo}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Status:</div><div className="w-2/3">{getStatusText(selectedOrder.deliveryStatus)}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Amount:</div><div className="w-2/3">€{selectedOrder.totalAmount ? Number(selectedOrder.totalAmount).toFixed(2) : '0.00'}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Delivery Address:</div><div className="w-2/3">{selectedOrder.deliveryAddress}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Area:</div><div className="w-2/3">{selectedOrder.area}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Pin Code:</div><div className="w-2/3">{selectedOrder.pinCode}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Order Date:</div><div className="w-2/3">{new Date(selectedOrder.orderDate).toLocaleString()}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Payment Method:</div><div className="w-2/3">{selectedOrder.payment?.paymentMethod}</div></div>
                        <div className="flex"><div className="font-semibold w-1/3">Payment Status:</div><div className="w-2/3">{selectedOrder.payment?.paymentStatus}</div></div>
                        <div className="flex items-start"><div className="font-semibold w-1/3">Order Items:</div>
                          <div className="w-2/3">
                            {getDisplayItems(selectedOrder).length > 0 ? (
                              <ul className="list-disc pl-6">
                                {getDisplayItems(selectedOrder).map((item, idx) => (
                                  <li key={idx}>
                                    {item.name} - Quantity: {item.quantity}
                                    {selectedOrder.orderItems[idx]?.price && ` - €${selectedOrder.orderItems[idx].price}`}
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-gray-500 italic">No items available</p>
                            )}
                          </div>
                        </div>
                        {selectedOrder.notes && (
                          <div className="flex"><div className="font-semibold w-1/3">Notes:</div><div className="w-2/3">{selectedOrder.notes}</div></div>
                        )}
                        {selectedOrder.cancelReason && (
                          <div className="flex"><div className="font-semibold w-1/3">Cancel Reason:</div><div className="w-2/3">{selectedOrder.cancelReason}</div></div>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Back Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/')}
            className="btn bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
    </>
  );
}
