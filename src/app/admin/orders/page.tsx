"use client";
import { useState, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { fetchKanbanOrders, updateOrderStatusKanban, fetchOrderById } from "@/services/apiService";
import { useCallback } from "react";
import { DndContext, closestCenter, useDroppable, useDraggable, DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { generatePOSBill } from "@/utils/posBillGenerator";
import { useOrderNotification } from "@/hooks/useOrderNotification";

// Hardcoded statuses for Kanban/Table
const statuses = [
	"Pending",
	"Accepted",
	"In Kitchen",
	"Ready",
	"Out for Delivery",
	"Delivered",
	"Cancelled",
	"Refunded",
];
const kanbanStatuses = [
	"Pending",
	"Accepted",
	"In Kitchen",
	"Ready",
	"Out for Delivery",
];

const statusColors = {
	Pending: {
		bg: 'bg-yellow-100',
		border: 'border-yellow-400',
		dot: 'bg-yellow-400',
		text: 'text-yellow-800',
		badge: 'bg-yellow-100 text-yellow-800',
	},
	Accepted: {
		bg: 'bg-orange-100',
		border: 'border-orange-400',
		dot: 'bg-orange-400',
		text: 'text-orange-800',
		badge: 'bg-orange-100 text-orange-800',
	},
	"In Kitchen": {
		bg: 'bg-amber-100',
		border: 'border-amber-400',
		dot: 'bg-amber-400',
		text: 'text-amber-800',
		badge: 'bg-amber-100 text-amber-800',
	},
	Ready: {
		bg: 'bg-green-100',
		border: 'border-green-400',
		dot: 'bg-green-400',
		text: 'text-green-800',
		badge: 'bg-green-100 text-green-800',
	},
	"Out for Delivery": {
		bg: 'bg-emerald-100',
		border: 'border-emerald-400',
		dot: 'bg-emerald-400',
		text: 'text-emerald-800',
		badge: 'bg-emerald-100 text-emerald-800',
	},
	Delivered: {
		bg: 'bg-gray-100',
		border: 'border-gray-400',
		dot: 'bg-gray-400',
		text: 'text-gray-800',
		badge: 'bg-gray-100 text-gray-800',
	},
	Cancelled: {
		bg: 'bg-red-100',
		border: 'border-red-400',
		dot: 'bg-red-400',
		text: 'text-red-800',
		badge: 'bg-red-100 text-red-800',
	},
	Refunded: {
		bg: 'bg-blue-100',
		border: 'border-blue-400',
		dot: 'bg-blue-400',
		text: 'text-blue-800',
		badge: 'bg-blue-100 text-blue-800',
	},
} as const;

// Adjusted `StatusColors` type to allow string indexing
interface StatusColors {
	[key: string]: {
		bg: string;
		border: string;
		dot: string;
		text: string;
		badge: string;
	};
}



const statusColorsTyped: StatusColors = statusColors;


// --- Order type for API data ---
export interface Order {
	id: string;
	orderNo: string;
	userId: string;
	placedAt: string;
	customer: string;
	items: number;
	amount: string | number;  // Changed to support string amounts
	payment: string;
	status: string;
	zone: string;
	rider: string;
	channel: string;
	coupon: string;
	address: string;
	notes: string;
	deliveryTrackingUrl?: string;
	timeline: Array<{ label: string; time: string; icon: string }>;
	itemsList: Array<{ name: string; qty: number; price: number; variants: string[]; addons: string[] }>;
	activity: Array<{ user: string; action: string; time: string }>;
}

// --- UNDO: Remove getStatusColor helper and related types ---
// Remove mockOrders, use real API data

export default function OrdersPage() {
	const [orders, setOrders] = useState<Order[]>([]);
	const [previousOrderCount, setPreviousOrderCount] = useState<number>(0);
	const { playNotificationSound, showNotification } = useOrderNotification();
	const [selectedStatus, setSelectedStatus] = useState<string | null>(null);

	// --- TEST NOTIFICATION BUTTON ---
	const handleTestNotification = () => {
		playNotificationSound();
		showNotification('Test Notification', 'This is a test notification for new orders.');
	};

	// TODO: Replace with secure token management
	// Socket.io ref to persist connection
	const socketRef = useRef<Socket | null>(null);

	useEffect(() => {
		async function loadOrders() {
			try {
				// Check if admin is logged in
				const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('dalrotti_admin_token') : null;
				if (!adminToken) {
					console.error('No admin token found. Redirecting to login...');
					window.location.href = '/admin/signin';
					return;
				}

				const data = await fetchKanbanOrders(adminToken);
				console.log('Raw API response:', data);

				// Define the API response type
				interface LocalizedString {
					en: string;
					de: string;
				}

				interface UserInfo {
					name?: string;
					email?: string;
				}

				interface KanbanOrderResponse {
					id: string;
					orderNo: string | LocalizedString;
					customer: string | LocalizedString | UserInfo;
					user?: UserInfo;
					amount: string | LocalizedString;
					paymentMethod: string | LocalizedString;
					paymentStatus: string | LocalizedString;
					coupon: string | LocalizedString;
					orderDate: string;
					notes: string | LocalizedString | null;
					userId?: string;
					customerId?: string;
				}

				// The API returns data in format: { Pending: [], Accepted: [], etc. }
				const kanbanData = data?.data || {};
				console.log('Kanban data:', kanbanData);

				// Convert Kanban format to flat array of orders
				const allOrders: Order[] = Object.entries(kanbanData).flatMap(([status, orders]) => {
					return Array.isArray(orders) ? (orders as KanbanOrderResponse[]).map((order) => {
						console.log('Processing order:', order, 'with status:', status);
						// Helper function to extract string value from potential localized string
						const getString = (value: unknown): string => {
							if (typeof value === 'object' && value !== null && 'en' in value) {
								return (value as { en: string }).en;
								return (value as { en: string }).en;
							}
							return value !== undefined && value !== null ? String(value) : '';
						};

						const amount = getString(order.amount);
						const numericAmount = amount.replace('EUR ', '').trim();

						// Extract customer name from multiple possible sources
						let customerName = 'Guest';

						// Check if user object exists with name
						if (order.user && typeof order.user === 'object' && order.user.name) {
							customerName = order.user.name;
						}
						// Check if customer is an object with name property
						else if (order.customer && typeof order.customer === 'object' && 'name' in order.customer && order.customer.name) {
							customerName = order.customer.name;
						}
						// Check if customer is a simple string
						else if (typeof order.customer === 'string' && order.customer.trim() !== '') {
							customerName = order.customer;
						}
						// Check if customer is a localized string
						else {
							const customerStr = getString(order.customer);
							if (customerStr && customerStr.trim() !== '' && customerStr !== 'undefined') {
								customerName = customerStr;
							}
						}

						return {
							id: order.id,
							orderNo: getString(order.orderNo),
							userId: order.userId || order.customerId || getString(order.customer),
							placedAt: order.orderDate ? new Date(order.orderDate).toLocaleString() : '',
							customer: customerName,
							items: 1, // Default value as it's not in the API response
							amount: parseFloat(numericAmount) || 0,
							payment: getString(order.paymentMethod) || 'N/A',
							status, // Use the status from Kanban column directly
							zone: 'N/A', // Default as it's not in the API response
							rider: 'N/A', // Default as it's not in the API response
							channel: 'N/A', // Default as it's not in the API response
							coupon: getString(order.coupon) || '-',
							address: 'N/A', // Default as it's not in the API response
							notes: getString(order.notes || ''),
							timeline: [],
							itemsList: [],
							activity: [],
						};
					}) : [];
				});

				// Check for new orders and play notification sound
				if (previousOrderCount > 0 && allOrders.length > previousOrderCount) {
					const newOrderCount = allOrders.length - previousOrderCount;
					playNotificationSound();
					showNotification(
						'New Order Received! 🎉',
						`You have ${newOrderCount} new order${newOrderCount > 1 ? 's' : ''}`
					);
				}

				setPreviousOrderCount(allOrders.length);
				setOrders(allOrders);
			} catch (err) {
				console.error('Failed to fetch orders', err);
				setOrders([]);
			}
		}

		// Initial load
		// loadOrders();

		// --- SOCKET.IO SETUP ---
		// Use same backend URL as API
		const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
		// Only connect if window exists (client side)
		if (typeof window !== 'undefined') {
			if (!socketRef.current) {
				socketRef.current = io(backendUrl, {
					transports: ['websocket'],
					path: '/socket.io',
				});
			}
			const socket = socketRef.current;
			// Listen for new order event (adjust event name if needed)
			socket.on('orderCreated', () => {
				playNotificationSound();
				showNotification('New Order Received! 🎉', 'A new order has been placed.');
				// Optionally, you can add the new order to state directly, or reload all orders:
				loadOrders();
			});
		}

		// Poll for new orders every 30 seconds (fallback)
		// const pollInterval = setInterval(() => {
		// 	loadOrders();
		// }, 30000);
			loadOrders();


		// Cleanup
		return () => {
			// clearInterval(pollInterval);
			if (socketRef.current) {
				socketRef.current.disconnect();
				socketRef.current = null;
			}
		};
	}, [previousOrderCount, playNotificationSound, showNotification]);
	const [drawer, setDrawer] = useState<string | null>(null);
	const [activeTab, setActiveTab] = useState<'kanban' | 'table'>('kanban');
	// ...existing KanbanCard, KanbanColumn, handleDragEnd, etc...
	// ...existing code...

	// Map orders directly to their status columns
	const kanbanOrdersByStatus = kanbanStatuses.reduce((acc, status) => {
		acc[status] = orders.filter((o) => o.status === status);
		console.log(`Orders in ${status}:`, acc[status]);
		return acc;
	}, {} as Record<string, Order[]>);

	// --- Customer lookup by userId (mock, replace with real data if available) ---
	// Example: const customers = [{ id: '...', name: '...' }, ...] 
	// Removed unused customer lookup logic

	// Function to download POS bill
	const handleDownloadBill = useCallback(async (orderId: string) => {
		try {
			const res = await fetchOrderById(orderId);
			if (!res || !res.data) {
				alert('Failed to fetch order details');
				return;
			}

			const order = res.data;
			console.log('Order data for bill:', order);
			console.log('Order items:', order.orderItems);
			console.log('Payment metadata:', order.payment?.metadata);

			// Helper function to get display items (same logic as user-side)
			const getDisplayItems = () => {
				// First, try to get items from payment metadata (preferred - has actual dish names)
				if (order.payment?.metadata?.items && Array.isArray(order.payment.metadata.items)) {
					console.log('Using items from payment metadata');
					return order.payment.metadata.items.map((item: Record<string, unknown>) => {
						const itemName = item.name as { en?: string; de?: string } | undefined;
						return {
							name: itemName?.en || itemName?.de || (item.dishName as string) || 'Unknown Dish',
							quantity: (item.quantity as number) || 1,
							dishId: item.dishId as string,
							price: parseFloat(String(item.price || '0'))
						};
					});
				}

				// Otherwise, try to get items from orderItems
				if (order.orderItems && Array.isArray(order.orderItems) && order.orderItems.length > 0) {
					console.log('Using items from orderItems');
					return order.orderItems.map((item: Record<string, unknown>) => ({
						name: (item.dishName as string) || (item.name as string) || `Dish #${String(item.dishId).substring(0, 8)}`,
						quantity: (item.quantity as number) || 1,
						dishId: item.dishId as string,
						price: parseFloat(String(item.price || '0'))
					}));
				}

				console.warn('No items found in payment metadata or orderItems');
				return [];
			};

			const displayItems = getDisplayItems();
			console.log('Display items:', displayItems);

			// Build items array for the bill
			const items = displayItems.map((item: { name: string; quantity: number; price: number; dishId: string }) => ({
				name: item.name,
				quantity: item.quantity,
				price: item.price,
				total: item.quantity * item.price
			}));

			// Calculate subtotal from items
			let subtotal = items.reduce((sum: number, item: { total: number }) => sum + item.total, 0);

			// If subtotal is 0, try to use order's total amount as fallback
			if (subtotal === 0 && (order.totalAmount || order.amount)) {
				subtotal = typeof order.totalAmount === 'number' ? order.totalAmount :
					typeof order.amount === 'number' ? order.amount :
						parseFloat(String(order.totalAmount || order.amount || 0));
			}

			// Calculate totals
			const discount = typeof order.discount === 'number' ? order.discount :
				typeof order.discountAmount === 'number' ? order.discountAmount : 0;
			const deliveryCharge = typeof order.deliveryFee === 'number' ? order.deliveryFee :
				typeof order.deliveryCharge === 'number' ? order.deliveryCharge : 0;
			const tax = subtotal * 0.19; // 19% VAT
			const total = subtotal - discount + deliveryCharge;

			console.log('Calculated totals:', { subtotal, discount, deliveryCharge, tax, total });
			console.log('Items to be printed:', items);

			// Check if we have items to print
			if (items.length === 0) {
				console.warn('No items found for bill. Adding placeholder item.');
				items.push({
					name: 'Order Items',
					quantity: 1,
					price: subtotal,
					total: subtotal
				});
			}

			// Get delivery address
			let deliveryAddress = '';
			if (order.deliveryAddress && typeof order.deliveryAddress === 'object') {
				const addr = order.deliveryAddress;
				deliveryAddress = [
					addr.street,
					addr.houseNumber,
					`${addr.postalCode} ${addr.city}`,
					addr.country
				].filter(Boolean).join(', ');
			}

			console.log('Generating bill with data:', {
				orderNo: order.orderNo || orderId,
				customerName: order.user?.name || 'Guest',
				itemsCount: items.length,
				items: items,
				subtotal,
				total
			});

			generatePOSBill({
				orderNo: order.orderNo || orderId,
				orderDate: order.orderDate ? new Date(order.orderDate).toLocaleString() : new Date().toLocaleString(),
				customerName: order.user?.name || 'Guest',
				customerEmail: order.user?.email,
				items,
				subtotal,
				discount,
				deliveryCharge,
				tax,
				total,
				paymentMethod: order.paymentMethod || 'N/A',
				paymentStatus: order.paymentStatus,
				deliveryStatus: order.deliveryStatus,
				deliveryAddress,
				notes: order.notes,
				couponCode: order.couponId
			});
		} catch (err) {
			console.error('Error generating bill:', err);
			alert('Failed to generate bill');
		}
	}, []);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;
		if (!over) return;
		const [orderId, fromStatus] = String(active.id).split("__");
		const toStatus = String(over.id);
		if (fromStatus === toStatus) return;
		// Optimistically update UI
		setOrders((prev) =>
			prev.map((o) => (o.id === orderId ? { ...o, status: toStatus } : o))
		);
		// Use Kanban-optimized endpoint
		try {
			await updateOrderStatusKanban(orderId, toStatus);
		} catch (err) {
			console.error('Failed to update order status:', err);
			// Revert UI update on error
			setOrders((prev) =>
				prev.map((o) => (o.id === orderId ? { ...o, status: fromStatus } : o))
			);
		}
	};
	function KanbanCard({ order, status }: { order: Order; status: string }) {
		const { setNodeRef, attributes, listeners, isDragging } = useDraggable({
			id: `${order.id}__${status}`,
		});
		return (
			<div
				ref={setNodeRef}
				{...attributes}
				className={`group bg-white hover:bg-gray-50 rounded-2xl shadow-xl p-4 mb-4 border-l-4 ${isDragging ? 'border-blue-400 scale-95' : `${statusColorsTyped[order.status]?.border || 'border-[#7a1313]'}`} transition-all duration-200 ring-1 ring-gray-100 hover:ring-2 hover:ring-[#7a1313]`}
				style={{ opacity: isDragging ? 0.6 : 1, boxShadow: isDragging ? '0 4px 24px 0 rgba(122,19,19,0.10)' : undefined, minWidth: 0 }}
			>
				<div {...listeners} className="cursor-grab">
					<div className="flex justify-between items-center mb-1 flex-nowrap gap-2">
						<span className="font-bold text-base tracking-tight text-[#7a1313] whitespace-nowrap">
							{order.orderNo}
						</span>
						<span className="text-[11px] text-gray-400 font-mono whitespace-nowrap overflow-hidden text-ellipsis max-w-[90px] text-right"
							title={order.placedAt}>
							{order.placedAt}
						</span>
					</div>
					<div className="font-semibold text-xs mb-1 flex items-center gap-1 min-w-0">
						<span className={`inline-block w-2 h-2 rounded-full ${statusColorsTyped[order.status]?.dot || 'bg-[#7a1313]'} mr-1`}></span>
						<span className="text-gray-800 truncate" title={order.customer}>
							{order.customer}
						</span>
					</div>
					<div className="flex gap-2 text-xs mb-1">
						<span className="font-bold text-[#7a1313]">
							€{Number(order.amount).toFixed(2)}
						</span>
						<span className="px-2 py-0.5 rounded bg-gray-100 text-gray-700">
							{order.items} items
						</span>
					</div>
					<div className="flex gap-2 text-xs mb-1">
						<span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-semibold">
							{order.payment}
						</span>
						<span className="bg-gray-100 text-gray-700 px-2 py-0.5 rounded">
							{order.zone}
						</span>
					</div>
				</div>
				<div className="flex gap-2 mt-2">
					<button className="text-xs text-[#7a1313] font-semibold underline underline-offset-2 hover:text-[#a31e1e] transition"
						onClick={(e) => {
							e.stopPropagation();
							setDrawer(order.id);
						}}>
						View
					</button>
					{order.deliveryTrackingUrl && order.deliveryTrackingUrl.trim() !== '' && (
						<a
							href={order.deliveryTrackingUrl}
							target="_blank"
							rel="noopener noreferrer"
							className="text-xs text-blue-600 font-semibold underline underline-offset-2 hover:text-blue-700 transition"
						>
							Track
						</a> 
					)}
					<button
						className="text-xs text-green-600 font-semibold underline underline-offset-2 hover:text-green-700 transition"
						onClick={(e) => {
							e.stopPropagation();
							console.log('Bill button clicked for order:', order.id);
							handleDownloadBill(order.id);
						}}
					>
						Bill
					</button>
				</div>
			</div>
		);
	}
	function KanbanColumn({ status, orders }: { status: string; orders: Order[] }) {
		const { setNodeRef, isOver } = useDroppable({ id: status });
		console.log(`Rendering KanbanColumn for ${status}:`, orders);
		return (
			<div
				ref={setNodeRef}
				className={`flex-1 min-w-[290px] max-w-xs px-2 pb-6 rounded-2xl transition-all duration-200 ${isOver ? 'ring-2 ring-[#7a1313]/40 scale-[1.02]' : ''} ${statusColorsTyped[status]?.bg || 'bg-[#faf7f6]'} shadow-inner`}
				style={{ minHeight: 500 }}
			>
				<div className={`sticky top-0 z-10 pt-4 pb-2 mb-3 rounded-t-2xl ${statusColorsTyped[status]?.bg || 'bg-[#fff8f6]'}`}>
					<h3 className={`text-lg font-extrabold mb-1 flex items-center gap-2 tracking-tight ${statusColorsTyped[status]?.text || 'text-[#7a1313]'}`}>
						<span className={`inline-block w-2 h-2 rounded-full ${statusColorsTyped[status]?.dot || 'bg-[#7a1313]'}`}></span>
						{status}
						<span className="bg-gray-200 text-gray-700 rounded-full px-2 text-xs font-semibold ml-auto">{orders.length}</span>
					</h3>
				</div>
				<div className="flex flex-col gap-2">
					{orders.map((order: Order) => (
						<KanbanCard key={order.id} order={order} status={status} />
					))}
				</div>
			</div>
		);
	}
	// --- Order details state for full data ---
	interface UserInfo {
		name?: string;
		email?: string;
	}
	interface OrderDetail {
		id: string;
		orderNo?: string;
		orderDate?: string;
		user?: UserInfo;
		deliveryStatus?: string;
		deliveryProvider?: string;
		deliveryTrackingUrl?: string;
		payment?: string;
		couponId?: string;
		notes?: string;
		[key: string]: unknown;
	}
	interface OrderDish {
		dishId?: string;
		dishName?: string;
		dishInfo?: { name?: string; description?: string };
		quantity?: number;
		price?: number;
		[key: string]: unknown;
	}
	const [orderDetail, setOrderDetail] = useState<OrderDetail | null>(null);
	const [orderDishes, setOrderDishes] = useState<OrderDish[]>([]);

	// Fetch dish details by id
	const fetchDishById = useCallback(async (dishId: string) => {
		const baseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL || '';
		const adminToken = typeof window !== 'undefined' ? sessionStorage.getItem('dalrotti_admin_token') : null;
		try {
			const res = await fetch(`${baseUrl}/api/dishes/get/${dishId}`, {
				headers: adminToken ? {
					'Authorization': `Bearer ${adminToken}`
				} : {}
			});
			if (!res.ok) return null;
			const data = await res.json();
			return data?.data || null;
		} catch {
			return null;
		}
	}, []);		// Fetch full order data and dish details when drawer is opened
	useEffect(() => {
		if (drawer) {
			(async () => {
				const res = await fetchOrderById(drawer);
				if (res && res.data) {
					const o = res.data;
					setOrderDetail(o);
					// Fetch all dish details for orderItems
					if (Array.isArray(o.orderItems)) {
						const dishDetails = await Promise.all(
							o.orderItems.map(async (item: OrderDish) => {
								const dish = await fetchDishById(item.dishId ? String(item.dishId) : "");
								return {
									...item,
									dishInfo: dish,
								};
							})
						);
						setOrderDishes(dishDetails);
					} else {
						setOrderDishes([]);
					}
				} else {
					setOrderDetail(null);
					setOrderDishes([]);
				}
			})();
		} else {
			setOrderDetail(null);
			setOrderDishes([]); 
		}
	}, [drawer, fetchDishById]);

	// --- RENDER ---
	return (
		<div className="p-4 md:p-8 bg-gradient-to-br from-gray-50 to-white min-h-screen">

			{/* Test Notification Button for Admin Debugging */}
			<div
				className="flex justify-between mb-6 ">
				<h1 className="text-3xl font-extrabold tracking-tight text-[#7a1313] flex items-center gap-2">
					<span>📦</span> Orders
				</h1>
				<button
					onClick={handleTestNotification}
					style={{
						background: '#7a1313',
						color: 'white',
						padding: '8px 16px',
						borderRadius: '6px',
						fontWeight: 600,
						cursor: 'pointer',
						border: 'none',
						boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
					}}
				>
					Test Notification
				</button>
			</div>
			{/* Tabs */}
			<div className="flex gap-2 my-6">
				<button
					className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-all ${activeTab === 'kanban' ? 'border-[#7a1313] text-[#7a1313] bg-white shadow' : 'border-transparent text-gray-500 bg-gray-100'}`}
					onClick={() => setActiveTab('kanban')}
				>
					Kanban View
				</button>
				<button
					className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-all ${activeTab === 'table' ? 'border-[#7a1313] text-[#7a1313] bg-white shadow' : 'border-transparent text-gray-500 bg-gray-100'}`}
					onClick={() => setActiveTab('table')}
				>
					Table View
				</button>
			</div>

			{/* Kanban Board */}
			{activeTab === 'kanban' && (
				<div className="mb-10 overflow-x-auto bg-gradient-to-br from-[#fff8f6] to-[#f7eaea] rounded-2xl p-4 shadow-inner border border-[#f3e0e0]">
					<DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
						<div className="flex gap-6 min-w-[900px]">
							{kanbanStatuses.map((status) => (
								<SortableContext key={status} items={kanbanOrdersByStatus[status] || []} strategy={verticalListSortingStrategy}>
									<KanbanColumn status={status} orders={kanbanOrdersByStatus[status] || []} />
								</SortableContext>
							))}
						</div>
					</DndContext>
				</div>
			)}

			{/* Table View (restored old table/filter UI, now attractive) */}
			{activeTab === 'table' && (
				<div className="bg-white rounded-2xl shadow-2xl p-6 border border-[#f3e8e8] max-w-full">
					{/* Responsive Filter/Status Card */}
					<div className="w-full rounded-xl mb-4 p-3 bg-[#f9f7f6] sm:bg-white flex flex-col gap-3 sm:gap-2">
						<div className="flex flex-col sm:flex-row sm:items-center gap-2">
							<div className="flex flex-nowrap gap-2 overflow-x-auto whitespace-nowrap sm:flex-wrap sm:overflow-visible sm:whitespace-normal flex-1 pb-1 scrollbar-hide">
								<button
									className={`px-4 py-2 rounded-full border border-red-800 text-red-800 font-semibold transition ${selectedStatus === null ? 'bg-red-100' : 'bg-white hover:bg-red-100'} ${selectedStatus === null ? '' : 'hover:text-red-800'}`}
									onClick={() => setSelectedStatus(null)}
								>
									All
								</button>
								{statuses.map((status) => {
									const border = statusColorsTyped[status]?.border || 'border-[#7a1313]';
									const text = statusColorsTyped[status]?.text || 'text-[#7a1313]';
									let hoverBg = 'hover:bg-red-100';
									let activeBg = '';
									if (border.includes('border-yellow-400')) { hoverBg = 'hover:bg-yellow-100'; activeBg = 'bg-yellow-100'; }
									else if (border.includes('border-orange-400')) { hoverBg = 'hover:bg-orange-100'; activeBg = 'bg-orange-100'; }
									else if (border.includes('border-amber-400')) { hoverBg = 'hover:bg-amber-100'; activeBg = 'bg-amber-100'; }
									else if (border.includes('border-green-400')) { hoverBg = 'hover:bg-green-100'; activeBg = 'bg-green-100'; }
									else if (border.includes('border-emerald-400')) { hoverBg = 'hover:bg-emerald-100'; activeBg = 'bg-emerald-100'; }
									else if (border.includes('border-gray-400')) { hoverBg = 'hover:bg-gray-100'; activeBg = 'bg-gray-100'; }
									else if (border.includes('border-red-400')) { hoverBg = 'hover:bg-red-100'; activeBg = 'bg-red-100'; }
									else if (border.includes('border-blue-400')) { hoverBg = 'hover:bg-blue-100'; activeBg = 'bg-blue-100'; }
									const borderColor = border.replace('border-', 'text-');
									return (
										<button
											key={status}
											className={`px-4 py-2 rounded-full border font-semibold transition ${border} ${text} ${selectedStatus === status ? activeBg : 'bg-white'} ${hoverBg} hover:${borderColor}`}
											onClick={() => setSelectedStatus(status)}
										>
											{status}
										</button>
									);
								})}
							</div>
						</div>
						<div className="flex flex-col sm:flex-row flex-wrap gap-2">
							<input type="date" className="border-2 border-[#f3e8e8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#7a1313] transition w-full sm:w-auto" placeholder="dd-mm-yyyy" />
							<input type="text" className="border-2 border-[#f3e8e8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#7a1313] transition w-full sm:w-auto" placeholder="All Payment Types" />
							<input type="text" className="border-2 border-[#f3e8e8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#7a1313] transition w-full sm:w-auto" placeholder="All Channels" />
							<input type="text" className="border-2 border-[#f3e8e8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#7a1313] transition w-full sm:w-auto" placeholder="All Zones" />
							<input type="text" className="border-2 border-[#f3e8e8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#7a1313] transition w-full sm:w-auto" placeholder="Rider" />
							<input type="text" className="border-2 border-[#f3e8e8] rounded-lg px-3 py-2 focus:outline-none focus:border-[#7a1313] transition w-full sm:w-auto" placeholder="Coupon" />
						</div>
					</div>
					<button className="bg-green-600 text-white px-5 py-2 rounded-lg font-semibold mb-4 shadow hover:bg-green-700 transition">Accept Selected</button>
					<div className="overflow-x-auto rounded-xl">
						<table className="min-w-full text-sm border-separate border-spacing-y-1">
							<thead className="sticky top-0 z-10">
								<tr className="bg-[#f3e8e8] text-[#7a1313] text-base">
									<th className="px-4 py-3 text-left font-bold">Order #</th>
									<th className="px-4 py-3 text-left font-bold">Placed at</th>
									<th className="px-4 py-3 text-left font-bold">Customer</th>
									<th className="px-4 py-3 text-left font-bold">Items</th>
									<th className="px-4 py-3 text-left font-bold">Amount</th>
									<th className="px-4 py-3 text-left font-bold">Payment</th>
									<th className="px-4 py-3 text-left font-bold">Status</th>
									<th className="px-4 py-3 text-left font-bold">Rider</th>
									<th className="px-4 py-3 text-left font-bold">Coupon</th>
									<th className="px-4 py-3 text-left font-bold">Actions</th>
								</tr>
							</thead>
							<tbody>
								{orders.length === 0 ? (
									<tr>
										<td colSpan={12} className="text-center py-8 text-gray-400">No orders found.</td>
									</tr>
								) : (
									orders.map((order, idx) => (
										<tr key={order.id} className={`transition rounded-lg ${idx % 2 === 0 ? 'bg-white' : 'bg-[#faf7f6]'} hover:bg-[#f3e8e8]/60`}>
											<td className="px-4 py-3 font-bold text-[#7a1313]">{order.orderNo}</td>
											<td className="px-4 py-3">{order.placedAt}</td>
											<td className="px-4 py-3">{order.customer}</td>
											<td className="px-4 py-3">{order.items}</td>
											<td className="px-4 py-3">€{Number(order.amount).toFixed(2)}</td>
											<td className="px-4 py-3">{order.payment}</td>
											<td className="px-4 py-3">
												<span className={`px-3 py-1 rounded-full text-xs font-bold shadow-sm ${statusColorsTyped[order.status]?.badge || 'bg-gray-100 text-gray-700'}`}>{order.status}</span>
											</td>
											<td className="px-4 py-3">{order.rider}</td>
											<td className="px-4 py-3">{order.coupon}</td>
											<td className="px-4 py-3">
												<button className="text-xs text-blue-600 underline font-semibold mr-2" onClick={() => setDrawer(order.id)}>View</button>
												<button className="text-xs text-green-600 underline font-semibold" onClick={() => handleDownloadBill(order.id)}>Bill</button>
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>
				</div>
			)}

			{/* Order Details Drawer/Page (unchanged) */}
			{drawer && orderDetail ? (
				<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-end z-50">
					<div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto relative animate-slideInRight rounded-l-xl border-l-4 border-[#7a1313]">
						<button
							className="absolute top-2 right-2 text-2xl font-bold text-[#7a1313] hover:text-red-600"
							onClick={() => setDrawer(null)}
						>
							&times;
						</button>
						<h2 className="text-2xl font-extrabold mb-2 text-[#7a1313]">
							Order {orderDetail?.orderNo ?? ''}
						</h2>
						<div className="mb-2 text-sm text-gray-600">
							Placed at: {orderDetail?.orderDate && typeof orderDetail.orderDate === 'string' ? new Date(orderDetail.orderDate).toLocaleString() : ''}
						</div>
						<div className="mb-2 text-sm">
							Customer: <span className="font-semibold">{orderDetail?.user && typeof orderDetail.user === 'object' && 'name' in orderDetail.user ? orderDetail.user.name : ''}</span>
						</div>
						<div className="mb-2 text-sm">
							Email: <span className="font-semibold">{orderDetail?.user && typeof orderDetail.user === 'object' && 'email' in orderDetail.user ? orderDetail.user.email : ''}</span>
						</div>
						<div className="mb-2 text-sm">Delivery Provider: {typeof orderDetail?.deliveryProvider === 'string' ? orderDetail.deliveryProvider : ''}</div>
						<div className="mb-2 text-sm">
							<div className="flex items-center justify-between gap-4">
								<span>Delivery Status: {orderDetail?.deliveryStatus}</span>
								{orderDetail?.deliveryTrackingUrl && orderDetail.deliveryTrackingUrl.trim() !== '' && (
									<a
										href={orderDetail.deliveryTrackingUrl}
										target="_blank"
										rel="noopener noreferrer"
										className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors inline-flex items-center gap-1"
									>
										<span>Track Order</span>
										<svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
										</svg>
									</a>
								)}
							</div>
						</div>
						<div className="mb-2 text-sm">Payment: {typeof orderDetail?.payment === 'string' ? orderDetail.payment : ''}</div>
						<div className="mb-2 text-sm">Coupon: {typeof orderDetail?.couponId === 'string' ? orderDetail.couponId : ''}</div>
						<div className="mb-2 text-sm">Notes: {typeof orderDetail?.notes === 'string' ? orderDetail.notes : ''}</div>
						<div className="mb-4">
							<h3 className="font-semibold mb-1 text-lg text-[#1a1a1a]">Items</h3>
							<ul className="space-y-2">
								{orderDishes.map((item, idx) => (
									<li key={idx} className="flex flex-col bg-gray-50 rounded-lg p-3 border border-gray-200">
										<div className="flex items-center gap-2 font-semibold text-[#7a1313]">
											<span>{item.dishInfo && typeof item.dishInfo === 'object' && 'name' in item.dishInfo ? item.dishInfo.name : item.dishId}</span>
											<span className="text-xs text-gray-500 font-normal">x{typeof item.quantity === 'number' ? item.quantity : ''}</span>
											<span className="ml-auto font-bold">€{typeof item.price === 'number' ? item.price : ''}</span>
										</div>
										{item.dishInfo && typeof item.dishInfo === 'object' && 'description' in item.dishInfo && item.dishInfo.description && (
											<div className="text-xs text-gray-500 mt-1">{item.dishInfo.description}</div>
										)}
									</li>
								))}
							</ul>
						</div>

						<div className="mb-4">
							<h3 className="font-semibold mb-1">Activity Log</h3>
							<ul className="pl-2">
								{orderDetail?.deliveryStatus && (
									<li className="inline-block px-3 py-1 rounded bg-[#7a1313] text-white text-xs font-semibold mr-2 mb-2">
										{orderDetail.deliveryStatus}
									</li>
								)}
							</ul>
						</div>
						{/* Action Bar: Only show button for current delivery status */}
						<div className="flex flex-wrap gap-2 mt-4">
							{orderDetail?.deliveryStatus === 'Pending' && (
								<button
									className="bg-green-600 text-white px-3 py-1 rounded shadow text-xs font-semibold hover:bg-green-700"
									onClick={async () => {
										const res = await updateOrderStatusKanban(orderDetail.id, 'Accepted');
										if (res) setOrderDetail((prev) => prev ? { ...prev, deliveryStatus: 'Accepted' } : prev);
									}}
								>
									Accept
								</button>
							)}
							{orderDetail?.deliveryStatus === 'Accepted' && (
								<button
									className="bg-yellow-600 text-white px-3 py-1 rounded shadow text-xs font-semibold hover:bg-yellow-700"
									onClick={async () => {
										const res = await updateOrderStatusKanban(orderDetail.id, 'In Kitchen');
										if (res) setOrderDetail((prev) => prev ? { ...prev, deliveryStatus: 'In Kitchen' } : prev);
									}}
								>
									Move to Kitchen
								</button>
							)}
							{orderDetail?.deliveryStatus === 'In Kitchen' && (
								<button
									className="bg-blue-600 text-white px-3 py-1 rounded shadow text-xs font-semibold hover:bg-blue-700"
									onClick={async () => {
										const res = await updateOrderStatusKanban(orderDetail.id, 'Ready');
										if (res) setOrderDetail((prev) => prev ? { ...prev, deliveryStatus: 'Ready' } : prev);
									}}
								>
									Mark Ready
								</button>
							)}
							{orderDetail?.deliveryStatus === 'Ready' && (
								<button
									className="bg-purple-600 text-white px-3 py-1 rounded shadow text-xs font-semibold hover:bg-purple-700"
									onClick={async () => {
										const res = await updateOrderStatusKanban(orderDetail.id, 'Out for Delivery');
										if (res) setOrderDetail((prev) => prev ? { ...prev, deliveryStatus: 'Out for Delivery' } : prev);
									}}
								>
									Out for Delivery
								</button>
							)}
							{orderDetail?.deliveryStatus === 'Out for Delivery' && (
								<button
									className="bg-gray-600 text-white px-3 py-1 rounded shadow text-xs font-semibold hover:bg-gray-700"
									onClick={async () => {
										const res = await updateOrderStatusKanban(orderDetail.id, 'Delivered');
										if (res) setOrderDetail((prev) => prev ? { ...prev, deliveryStatus: 'Delivered' } : prev);
									}}
								>
									Delivered
								</button>
							)}
						</div>

						{/* Download POS Bill Button */}
						<div className="mt-6 pt-4 border-t border-gray-200">
							<button
								className="w-full bg-green-600 text-white px-4 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
								onClick={() => handleDownloadBill(drawer)}
							>
								<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
								</svg>
								Download POS Bill
							</button>
						</div>
					</div>
				</div>
			) : null}
		</div>
	);
}

