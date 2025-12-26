"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FaCheckCircle, FaClock, FaMapMarkerAlt, FaPhone, FaReceipt, FaMotorcycle } from "react-icons/fa";
import Cookies from "js-cookie";
import Image from "next/image";

interface OrderItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'confirmed' | 'preparing' | 'out-for-delivery' | 'delivered' | 'cancelled';
  items: OrderItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryAddress: {
    street: string;
    houseNumber: string;
    city: string;
    postalCode: string;
  };
  phone: string;
  estimatedDeliveryTime: string;
  createdAt: string;
  paymentMethod: string;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchOrderDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const fetchOrderDetails = async () => {
    try {
      const token = Cookies.get('token') || localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:4000/api/orders/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order details');
      }

      const data = await response.json();
      setOrder(data);
    } catch (err) {
      console.error('Error fetching order:', err);
      setError(err instanceof Error ? err.message : 'Failed to load order details');
    } finally {
      setLoading(false);
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
        return 'Order Confirmed';
      case 'preparing':
        return 'Preparing Your Food';
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#e30232] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order Not Found</h2>
          <p className="text-gray-600 mb-6">{error || 'Unable to load order details'}</p>
          <button
            onClick={() => router.push('/user/orders')}
            className="btn btn-primary w-full"
          >
            View All Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Success Header */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6 text-center">
          <div className="inline-block bg-green-100 rounded-full p-4 mb-4">
            <FaCheckCircle className="text-5xl text-green-600" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600 mb-4">Thank you for your order. We've received it and will start preparing shortly.</p>
          
          {/* Order Number */}
          <div className="inline-block bg-gray-100 rounded-lg px-6 py-3">
            <p className="text-sm text-gray-600">Order Number</p>
            <p className="text-2xl font-bold text-[#e30232]">#{order.orderNumber}</p>
          </div>
        </div>

        {/* Order Status & Estimated Time */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Status Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaMotorcycle className="text-2xl text-[#e30232]" />
              <h2 className="text-xl font-bold text-gray-800">Order Status</h2>
            </div>
            <div className={`${getStatusColor(order.status)} border-2 rounded-lg px-4 py-3 font-semibold text-center`}>
              {getStatusText(order.status)}
            </div>
          </div>

          {/* Estimated Time Card */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaClock className="text-2xl text-[#e30232]" />
              <h2 className="text-xl font-bold text-gray-800">Estimated Delivery</h2>
            </div>
            <div className="bg-orange-50 border-2 border-orange-200 rounded-lg px-4 py-3 text-center">
              <p className="text-2xl font-bold text-orange-600">{order.estimatedDeliveryTime}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <FaReceipt className="text-2xl text-[#e30232]" />
            <h2 className="text-xl font-bold text-gray-800">Order Details</h2>
          </div>

          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-center gap-4 border-b border-gray-200 pb-4 last:border-b-0 last:pb-0">
                {item.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                    <Image
                      src={item.image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">€{(item.price * item.quantity).toFixed(2)}</p>
                  <p className="text-sm text-gray-600">€{item.price.toFixed(2)} each</p>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="border-t-2 border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>€{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-700">
              <span>Delivery Fee</span>
              <span>{order.deliveryFee === 0 ? 'FREE' : `€${order.deliveryFee.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-800 pt-2 border-t border-gray-200">
              <span>Total</span>
              <span className="text-[#e30232]">€{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Delivery Info */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          {/* Delivery Address */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaMapMarkerAlt className="text-2xl text-[#e30232]" />
              <h2 className="text-xl font-bold text-gray-800">Delivery Address</h2>
            </div>
            <div className="text-gray-700 space-y-1">
              <p className="font-semibold">
                {order.deliveryAddress.street} {order.deliveryAddress.houseNumber}
              </p>
              <p>
                {order.deliveryAddress.postalCode} {order.deliveryAddress.city}
              </p>
            </div>
          </div>

          {/* Contact & Payment */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <FaPhone className="text-2xl text-[#e30232]" />
              <h2 className="text-xl font-bold text-gray-800">Contact & Payment</h2>
            </div>
            <div className="text-gray-700 space-y-2">
              <p>
                <span className="font-semibold">Phone:</span> {order.phone}
              </p>
              <p>
                <span className="font-semibold">Payment:</span> {order.paymentMethod}
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid md:grid-cols-2 gap-4">
          <button
            onClick={() => router.push('/user/orders')}
            className="btn bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 w-full"
          >
            View Order History
          </button>
          <button
            onClick={() => router.push('/user/menu')}
            className="btn btn-primary w-full"
          >
            Order Again
          </button>
        </div>

        {/* Help Text */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>Need help with your order?</p>
          <a href="/en/contact" className="text-[#e30232] hover:underline font-semibold">
            Contact Support
          </a>
        </div>
      </div>
    </div>
  );
}
