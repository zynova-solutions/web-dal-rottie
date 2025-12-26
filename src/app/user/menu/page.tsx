"use client";
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaSearch, FaTimes, FaLeaf } from 'react-icons/fa';
import { useCart } from '../../../components/cart/CartContext';
import { fetchDishes, getMyOrders } from '../../../services/apiService';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React from 'react';
import UserHeader from '@/components/layout/UserHeader';

interface Dish {
	id: number | string;
	dishId?: string;
	name: { de: string; en: string } | string;
	price: number;
	desc?: string;
	description?: { de: string; en: string } | string;
	img?: string;
	photoUrl?: string;
	isVeg?: boolean;
	available?: boolean;
	soldOut?: boolean;
	categoryId?: number;
	categoryName?: { de: string; en: string } | string;
}

interface CategoryDishes {
	[categoryName: string]: Dish[];
}

// Order history types
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
	status: string;
	items: OrderItem[];
	total: number;
	createdAt: string;
	estimatedDeliveryTime?: string;
}

export default function MenuPage() {
	const router = useRouter();
	const [dishes, setDishes] = useState<Dish[]>([]);
	const [categories, setCategories] = useState<CategoryDishes>({});
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedCategory, setSelectedCategory] = useState<string>('All');
	const [mounted, setMounted] = useState(false);
	const { addItem } = useCart();
	const [lang] = React.useState(() => Cookies.get('NEXT_LOCALE') || 'en');
	const [isLoggedIn, setIsLoggedIn] = React.useState(false);

	// Order states
	const [orders, setOrders] = useState<Order[]>([]);
		// Removed unused states: ordered, cancelled, returned
	const [summaryCounts, setSummaryCounts] = useState({ orderedCount: 0, cancelledCount: 0, returnedCount: 0 });
	const [ordersLoading, setOrdersLoading] = useState(false);
	const [ordersError, setOrdersError] = useState("");
	const [showOrderHistory, setShowOrderHistory] = useState(false);
	const [orderFilter, setOrderFilter] = useState<'all' | 'completed' | 'cancelled' | 'returned'>('all');

	// Check authentication status for order history
	React.useEffect(() => {
		const token = Cookies.get('token') || localStorage.getItem('token');
		if (token) {
			setIsLoggedIn(true);
		}
	}, []);

		// Mounted state to prevent hydration issues
		useEffect(() => {
			setMounted(true);
		}, []);

		const loadDishes = React.useCallback(async (retryCount = 0) => {
			const maxRetries = 3;
			try {
				console.log('loadDishes called, attempt:', retryCount + 1);
				setLoading(true);
				setError(null);

				console.log('Calling fetchDishes API...');
				const response = await fetchDishes();
				console.log('fetchDishes response:', response);

				if (response?.data) {
					// Backend returns dishes grouped by category
					const categoryData = response.data as CategoryDishes;

					// Flatten all dishes into a single array
					const allDishes: Dish[] = [];
					Object.entries(categoryData).forEach(([categoryName, dishes]) => {
						dishes.forEach(dish => {
							allDishes.push({
								...dish,
								id: dish.dishId || dish.id,
								categoryName: categoryName
							});
						});
					});

					setDishes(allDishes);
					setCategories(categoryData);
					setLoading(false);
				} else {
					setDishes([]);
					setLoading(false);
				}
			} catch (err) {
				console.error('Failed to load dishes:', err, 'Retry count:', retryCount);

				// Retry logic with exponential backoff
				if (retryCount < maxRetries) {
					const delay = Math.min(1000 * Math.pow(2, retryCount), 5000); // Max 5 seconds
					console.log(`Retrying in ${delay}ms...`);
					setTimeout(() => loadDishes(retryCount + 1), delay);
				} else {
					setError(err instanceof Error ? err.message : 'Failed to load menu');
					setLoading(false);
				}
			}
		}, []);

	// Load dishes when component mounts
	useEffect(() => {
		loadDishes();
	}, [loadDishes]);

	// Reload dishes when language changes
	useEffect(() => {
		if (dishes.length > 0) {
			// Force re-render when language changes to update displayed text
			setDishes(d => [...d]);
		}
	}, [lang, dishes.length]);

	// Extract multilingual text
	const getText = (text: { de: string; en: string } | string | undefined, fallback = '') => {
		if (!text) return fallback;
		if (typeof text === 'object') {
			return text[lang as 'en' | 'de'] || text.en || text.de || fallback;
		}
		return text;
	};

	const handleAddToCart = (dish: Dish) => {
		addItem({
			id: String(dish.id || dish.dishId),
			name: getText(dish.name),
			price: dish.price,
			quantity: 1,
			image: dish.photoUrl || dish.img || '/images/logo.png'
		});
	};

	// Filter dishes based on search and category
	const filteredDishes = dishes
		.filter(dish => dish.available !== false && dish.soldOut !== true)
		.filter(dish => {
			// Category filter
			if (selectedCategory !== 'All' && dish.categoryName !== selectedCategory) {
				return false;
			}
			// Search filter
			if (searchQuery) {
				const dishName = getText(dish.name).toLowerCase();
				const dishDesc = getText(dish.description || dish.desc).toLowerCase();
				const query = searchQuery.toLowerCase();
				return dishName.includes(query) || dishDesc.includes(query);
			}
			return true;
		});

	// Get category names with proper ordering (matching reference site)
	const categoryOrder = [
		'Soups',
		'Soups & Salads',
		'Salads',
		'Platters',
		'Combos',
		'Tandoori Specialties',
		'Main Course',
		'Main Course - Vegetarian',
		'Rice & Biryani',
		'Snacks',
		'Chaat & Snacks',
		'Breads',
		'Side Dishes',
		'Chutneys',
		'Desserts',
		'Beverages',
		'Soft Drinks',
		'Hot Drinks'
	];

	const categoryNames = ['All', ...Object.keys(categories).sort((a, b) => {
		const indexA = categoryOrder.indexOf(a);
		const indexB = categoryOrder.indexOf(b);

		// If both categories are in the order list, sort by that order
		if (indexA !== -1 && indexB !== -1) return indexA - indexB;

		// If only A is in the list, it comes first
		if (indexA !== -1) return -1;

		// If only B is in the list, it comes first
		if (indexB !== -1) return 1;

		// Otherwise, sort alphabetically
		return a.localeCompare(b);
	})];



	// Fetch orders
	useEffect(() => {
		if (isLoggedIn) {
			fetchOrders();
		}
	}, [isLoggedIn]);

	const fetchOrders = async () => {
		setOrdersLoading(true);
		setOrdersError("");
		try {
			const token = Cookies.get('token') || localStorage.getItem('token');
			if (!token) return;
			const data = await getMyOrders(token);
			if (data.statusCode === 200 && data.data) {
				setOrders(data.data.allOrders || []);
			// Removed setOrdered, setCancelled, setReturned
				setSummaryCounts({
					orderedCount: data.data.summaryCounts.orderedCount || 0,
					cancelledCount: data.data.summaryCounts.cancelledCount || 0,
					returnedCount: data.data.summaryCounts.returnedCount || 0,
				});
			} else {
				setOrders([]);
			// Removed setOrdered, setCancelled, setReturned
				setSummaryCounts({ orderedCount: 0, cancelledCount: 0, returnedCount: 0 });
			}
		} catch (err) {
			setOrdersError(err instanceof Error ? err.message : 'Failed to load orders');
		} finally {
			setOrdersLoading(false);
		}
	};

	const getStatusText = (status: string) => {
		switch (status) {
			case 'pending': return 'Order Received';
			case 'confirmed': return 'Confirmed';
			case 'preparing': return 'Preparing';
			case 'out-for-delivery': return 'Out for Delivery';
			case 'delivered': return 'Delivered';
			case 'cancelled': return 'Cancelled';
			case 'returned': return 'Returned';
			default: return status;
		}
	};

	// Don't render until mounted to prevent hydration issues
	if (!mounted) {
		return (
			<div className="min-h-screen bg-white flex items-center justify-center">
				<div className="animate-pulse text-2xl font-bold text-[#7a1313]">Loading...</div>
			</div>
		);
	}

	return (
		<>
			<UserHeader />

			{/* Main Content */}
			<div className="min-h-screen">
				<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
					{/* Search and Filter Section */}
					<div className="mb-8">
						<h1 className="text-4xl font-extrabold text-[#7a1313] mb-6">Our Menu</h1>

						{/* Search Bar */}
						<div className="relative mb-4">
							<input
								type="text"
								placeholder="Search for dishes..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="w-full px-5 py-3 pl-12 pr-12 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-[#7a1313] text-lg transition"
							/>
							<FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl" />
							{searchQuery && (
								<button
									onClick={() => setSearchQuery('')}
									className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
								>
									<FaTimes />
								</button>
							)}
						</div>

						{/* Category Navigation - Only show when not searching */}
						{!searchQuery && (
							<div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
								<div className="flex items-center justify-between mb-3">
									<div className="text-sm font-semibold text-gray-600">Quick Jump to:</div>
									{/* <button
										onClick={() => setSelectedCategory('All')}
										className={`text-sm px-4 py-1.5 rounded-lg transition-colors ${selectedCategory === 'All'
												? 'bg-[#7a1313] text-white'
												: 'bg-gray-100 hover:bg-gray-200 text-gray-700'
											}`}
									>
										View All
									</button> */}
								</div>
								{/* Horizontally scrollable on mobile, wraps on desktop */}
								<div className="flex gap-2 overflow-x-auto sm:overflow-x-visible sm:flex-wrap whitespace-nowrap pb-1 -mx-2 px-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
								{categoryNames.slice(1).map((category) => {
								const count = categories[category]?.length || 0;
							if (count === 0) return null;
							return (
								<button
									key={category}
									onClick={() => {
										setSelectedCategory(category);
										const element = document.getElementById(category.toLowerCase().replace(/\s+/g, '-'));
										if (element) {
											element.scrollIntoView({ behavior: 'smooth', block: 'start' });
										}
									}}
									className={`text-sm px-4 py-2 rounded-lg transition-all flex-shrink-0 ${selectedCategory === category
										? 'bg-[#7a1313] text-white shadow-md'
										: 'bg-gray-50 hover:bg-[#7a1313] hover:text-white text-gray-700'
									}`}
								>
									{category}
									<span className="ml-1.5 text-xs opacity-75">({count})</span>
								</button>
							);
						})}
						</div>
							</div>
						)}
					</div>

					{/* Results Count */}
					{!loading && (
						<div className="mb-4 text-gray-600">
							Showing <span className="font-semibold text-[#7a1313]">{filteredDishes.length}</span> dishes
							{searchQuery && <span> for "{searchQuery}"</span>}
						</div>
					)}

					{/* Loading State */}
					{loading && (
						<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
							{[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
								<div key={i} className="bg-white rounded-2xl shadow-md p-5 animate-pulse">
									<div className="w-full h-48 bg-gray-200 rounded-xl mb-4" />
									<div className="h-6 bg-gray-200 rounded mb-2" />
									<div className="h-4 bg-gray-200 rounded mb-3 w-3/4" />
									<div className="h-8 bg-gray-200 rounded w-24 mb-3" />
									<div className="h-12 bg-gray-200 rounded-full" />
								</div>
							))}
						</div>
					)}

					{/* Error State */}
					{error && (
						<div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl">
							<div className="flex items-start gap-3">
								<span className="text-2xl flex-shrink-0">⚠️</span>
								<div className="flex-1">
									<div className="font-semibold mb-1">Error loading menu</div>
									<div className="text-sm mb-3">{error}</div>
									<button
										onClick={() => loadDishes(0)}
										className="px-4 py-2 bg-[#7a1313] text-white rounded-lg hover:bg-[#a31a1a] transition text-sm font-medium"
									>
										Retry
									</button>
								</div>
							</div>
						</div>
					)}

					{/* Empty State */}
					{!loading && !error && filteredDishes.length === 0 && (
						<div className="text-center py-16">
							<div className="text-6xl mb-4">🍽️</div>
							<h3 className="text-2xl font-bold text-gray-700 mb-2">No dishes found</h3>
							<p className="text-gray-500">
								{searchQuery
									? `No results for "${searchQuery}". Try a different search.`
									: 'No dishes available in this category.'}
							</p>
							{searchQuery && (
								<button
									onClick={() => setSearchQuery('')}
									className="mt-4 px-6 py-2 bg-[#7a1313] text-white rounded-full hover:bg-[#a31a1a] transition"
								>
									Clear Search
								</button>
							)}
						</div>
					)}

					{/* Dishes - Group by Category or Flat List */}
					{!loading && !error && filteredDishes.length > 0 && (
						<div className="space-y-8">
							{selectedCategory === 'All' && !searchQuery ? (
								// Grouped by Category
								categoryNames.slice(1).map(categoryName => {
									const categoryDishes = filteredDishes.filter(
										dish => dish.categoryName === categoryName
									);

									if (categoryDishes.length === 0) return null;

									return (
										<div key={categoryName} className="scroll-mt-24" id={categoryName.toLowerCase().replace(/\s+/g, '-')}>
											{/* Category Header */}
											<div className="flex items-center gap-3 mb-4">
												<h2 className="text-2xl font-bold text-[#7a1313]">
													{categoryName}
												</h2>
												<div className="h-px flex-1 bg-gradient-to-r from-[#7a1313]/20 to-transparent"></div>
												<span className="text-sm text-gray-500">
													{categoryDishes.length} {categoryDishes.length === 1 ? 'item' : 'items'}
												</span>
											</div>

											{/* Dishes in this category */}
											<div className="space-y-4">
												{categoryDishes.map((dish) => (
													<div
														key={dish.id || dish.dishId}
														className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
													>
														<div className="flex flex-col sm:flex-row gap-4 p-4">
															{/* Image */}
															<div className="relative w-full sm:w-32 h-80 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
																<Image
																	src={dish.photoUrl || dish.img || '/images/logo.png'}
																	alt={getText(dish.name)}
																	fill
																	className="object-cover"
																/>
																{dish.isVeg && (
																	<div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
																		<FaLeaf className="text-xs" /> Veg
																	</div>
																)}
															</div>

															{/* Content */}
															<div className="flex-1 min-w-0">
																<h3 className="font-bold text-lg text-gray-800 mb-1">
																	{getText(dish.name)}
																</h3>

																{(dish.description || dish.desc) && (
																	<p className="text-gray-600 text-sm mb-2 line-clamp-2">
																		{getText(dish.description || dish.desc)}
																	</p>
																)}

																<div className="flex items-center gap-2 mt-2">
																	<span className="text-2xl font-bold text-[#7a1313]">
																		€{dish.price.toFixed(2)}
																	</span>
																</div>
															</div>

															{/* Add to Cart Button */}
															<div className="flex items-center sm:items-start">
																<button
																	onClick={() => handleAddToCart(dish)}
																	className="w-full sm:w-auto bg-[#7a1313] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#a31a1a] transition-all flex items-center justify-center gap-2 whitespace-nowrap"
																>
																	<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
																	</svg>
																	Add
																</button>
															</div>
														</div>
													</div>
												))}
											</div>
										</div>
									);
								})
							) : (
								// Flat list when filtering
								<div className="space-y-4">
									{filteredDishes.map((dish) => (
										<div
											key={dish.id || dish.dishId}
											className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden border border-gray-100"
										>
											<div className="flex flex-col sm:flex-row gap-4 p-4">
												{/* Image */}
												<div className="relative w-full sm:w-32 h-80 flex-shrink-0 rounded-lg overflow-hidden bg-gray-100">
													<Image
														src={dish.photoUrl || dish.img || '/images/logo.png'}
														alt={getText(dish.name)}
														fill
														className="object-cover"
													/>
													{dish.isVeg && (
														<div className="absolute top-2 left-2 bg-green-500 text-white px-2 py-0.5 rounded text-xs font-semibold flex items-center gap-1">
															<FaLeaf className="text-xs" /> Veg
														</div>
													)}
												</div>

												{/* Content */}
												<div className="flex-1 min-w-0">
													<div className="flex items-start gap-2 mb-1">
														<h3 className="font-bold text-lg text-gray-800">
															{getText(dish.name)}
														</h3>
														<span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded whitespace-nowrap">
															{getText(dish.categoryName)}
														</span>
													</div>													{(dish.description || dish.desc) && (
														<p className="text-gray-600 text-sm mb-2 line-clamp-2">
															{getText(dish.description || dish.desc)}
														</p>
													)}

													<div className="flex items-center gap-2 mt-2">
														<span className="text-2xl font-bold text-[#7a1313]">
															€{dish.price.toFixed(2)}
														</span>
													</div>
												</div>

												{/* Add to Cart Button */}
												<div className="flex items-center sm:items-start">
													<button
														onClick={() => handleAddToCart(dish)}
														className="bg-[#7a1313] text-white px-4 py-2 rounded-lg font-semibold hover:bg-[#a31a1a] transition-all flex items-center gap-2 whitespace-nowrap"
													>
														<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
															<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
														</svg>
														Add
													</button>
												</div>
											</div>
										</div>
									))}
								</div>
							)}
						</div>
					)}

					{/* User Order History Section */}
					{isLoggedIn && (
						<div className="mb-8">
							<button
								className="w-full flex items-center justify-between px-6 py-4 bg-white rounded-xl shadow border border-gray-200 hover:shadow-md transition font-bold text-lg text-[#7a1313]"
								onClick={() => setShowOrderHistory(v => !v)}
							>
								<span>My Order History</span>
								<span className="text-sm font-normal text-gray-500">{showOrderHistory ? 'Hide' : 'Show'}</span>
							</button>
							{showOrderHistory && (
								<div className="mt-4">
									{ordersLoading ? (
										<div className="text-center py-8 text-gray-500">Loading orders...</div>
									) : ordersError ? (
										<div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">{ordersError}</div>
									) : (
										<>
											{/* Order Status Filter */}
											<div className="flex gap-2 mb-4">
												<button
													className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all ${orderFilter === 'all' ? 'bg-[#7a1313] text-white border-[#7a1313]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
													onClick={() => setOrderFilter('all')}
												>All</button>
												<button
													className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all ${orderFilter === 'completed' ? 'bg-[#7a1313] text-white border-[#7a1313]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
													onClick={() => setOrderFilter('completed')}
												>Completed</button>
												<button
													className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all ${orderFilter === 'cancelled' ? 'bg-[#7a1313] text-white border-[#7a1313]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
													onClick={() => setOrderFilter('cancelled')}
												>Cancelled</button>
												<button
													className={`px-4 py-2 rounded-lg font-semibold text-sm border transition-all ${orderFilter === 'returned' ? 'bg-[#7a1313] text-white border-[#7a1313]' : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100'}`}
													onClick={() => setOrderFilter('returned')}
												>Returned</button>
											</div>
											<div className="flex gap-4 mb-4">
												<div className="bg-gray-50 rounded-lg px-4 py-2 text-center flex-1">
													<div className="font-bold text-lg text-[#7a1313]">{summaryCounts.orderedCount}</div>
													<div className="text-xs text-gray-600">Ordered</div>
												</div>
												<div className="bg-gray-50 rounded-lg px-4 py-2 text-center flex-1">
													<div className="font-bold text-lg text-[#7a1313]">{summaryCounts.cancelledCount}</div>
													<div className="text-xs text-gray-600">Cancelled</div>
												</div>
												<div className="bg-gray-50 rounded-lg px-4 py-2 text-center flex-1">
													<div className="font-bold text-lg text-[#7a1313]">{summaryCounts.returnedCount}</div>
													<div className="text-xs text-gray-600">Returned</div>
												</div>
											</div>
											{/* Filter orders based on status */}
											{(() => {
												let filteredOrders = orders;
												if (orderFilter === 'completed') {
													filteredOrders = orders.filter(o => o.status === 'delivered' || o.status === 'completed');
												} else if (orderFilter === 'cancelled') {
													filteredOrders = orders.filter(o => o.status === 'cancelled');
												} else if (orderFilter === 'returned') {
													filteredOrders = orders.filter(o => o.status === 'returned');
												}
												return (
													<div className="space-y-4">
														{filteredOrders.length === 0 ? (
															<div className="bg-white rounded-xl shadow p-8 text-center text-gray-500">No orders found for this filter.</div>
														) : (
															filteredOrders.map(order => (
																<div key={order.id} className="bg-white rounded-xl shadow p-4 border border-gray-100">
																	<div className="flex items-center justify-between mb-2">
																		<div>
																			<span className="font-bold text-[#7a1313]">Order #{order.orderNumber}</span>
																			<span className="ml-3 text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
																		</div>
																		<div className="px-3 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-700">{getStatusText(order.status)}</div>
																	</div>
																	<div className="flex flex-wrap gap-2 mb-2">
																		{order.items && order.items.slice(0, 5).map((item, idx) => (
																			<span key={idx} className="bg-gray-50 rounded px-2 py-1 text-sm text-gray-700">{item.quantity}x {item.name}</span>
																		))}
																		{order.items && order.items.length > 5 && (
																			<span className="text-xs text-gray-500">+{order.items.length - 5} more</span>
																		)}
																	</div>
																	<div className="flex items-center justify-between">
																		<span className="font-bold text-[#7a1313]">€{order.total?.toFixed(2) ?? '0.00'}</span>
																		<button
																			className="text-sm text-[#7a1313] hover:underline"
																			onClick={() => router.push(`/user/orders/${order.id}`)}
																		>View Details →</button>
																	</div>
																</div>
															))
														)}
													</div>
												);
											})()}
										</>
									)}
								</div>
							)}
						</div>
					)}
				</div>
			</div>
		</>
	);
}
