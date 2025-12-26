"use client";
// Checkout page with multiple layers of error handling:
// 1. ErrorBoundary to catch any unexpected errors
// 2. Try-catch blocks to handle API data processing errors
// 3. Custom Image component with loading state and error handling
// 4. Retry mechanism for API data
// 5. Fallbacks for when API data is unavailable
// 6. Fixed cart persistence issue by relying solely on CartContext

import React, { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useCart, CART_KEY } from '../../../components/cart/CartContext';
import { fetchDishes } from '../../../services/apiService';
import { initiatePayment, mapCartItemsToOrderItems, simulatePaymentSuccess } from '../../../services/orderApi';
import DeliveryAddressInput from "../../../components/DeliveryAddressInput";
import { isAddressInDeliveryArea } from '../../../utils/deliveryAreaValidator';
import { geocodeAddress, getDistanceFromLatLonInKm, RESTAURANT_LAT, RESTAURANT_LNG } from '../../../utils/googleMapsUtils';
import UserHeader from '@/components/layout/UserHeader';

// Define a type for dish data
interface DishData {
  name: string;
  price: number;
  img?: string;
  desc?: string;
  likes?: number;
  id?: string;
}

// Error boundary for catching unexpected errors
class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Checkout page error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-[#f7f3ef] to-[#fff8f6] flex items-center justify-center p-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
            <h2 className="text-red-600 text-xl font-bold mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-4">
              {this.state.error?.message || "An unexpected error occurred. Please try again."}
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 bg-[#7a1313] text-white rounded hover:bg-[#4a2c0a] transition"
              >
                Try Again
              </button>
              <button
                onClick={() => window.history.back()}
                className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
              >
                Go Back
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function CheckoutPage() {
	console.log("Rendering CheckoutPage");
	
	const router = useRouter();
	
	// Get cart and setCart from context
	const { cart, setCart } = useCart();
	console.log("Cart from useCart:", cart);
	
	// Log the current cart state, but don't modify it
	useEffect(() => {
		console.log("Initial render on checkout page, cart.items.length:", cart.items.length);
		
		// We're no longer forcing any cart items - the cart will be whatever is in the context
		// Items should only appear when users add them from the menu
	
		
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
	const [method, setMethod] = useState("pickup");
	const [tip, setTip] = useState(0);
	const [promo, setPromo] = useState("");
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [phone, setPhone] = useState("");
	const [notes, setNotes] = useState("");
	
	// Delivery address states
	const [street, setStreet] = useState("");
	const [postalCode, setPostalCode] = useState("");
	const [city, setCity] = useState("Frankfurt am Main");
	const [isAddressValid, setIsAddressValid] = useState(false);
	const [addressValidationError, setAddressValidationError] = useState<string | null>(null);

	// Saved addresses state
	const [savedAddresses, setSavedAddresses] = useState<Array<{ id: string; label: string; address: string; area: string; postalCode: string; latitude?: number; longitude?: number; isDefault?: boolean }>>([]);
	const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
	const [addressLoading, setAddressLoading] = useState(false);
	const [addressError, setAddressError] = useState<string | null>(null);
	// Using hardcoded data, so we don't need dishData state
	// const [dishData, setDishData] = useState<Record<string, DishData>>({}); 
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	
	// Authentication state
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
	
	// Check authentication status and fetch saved addresses
	useEffect(() => {
		const token = Cookies.get('token') || localStorage.getItem('token');
		const userStr = localStorage.getItem('user');

		if (token && userStr) {
			try {
				const userData = JSON.parse(userStr);
				setUser(userData);
				setIsLoggedIn(true);
				// Pre-fill form with user data
				if (userData.name) {
					const nameParts = userData.name.split(' ');
					setFirstName(nameParts[0] || '');
					setLastName(nameParts.slice(1).join(' ') || '');
				}
				if (userData.email) {
					setEmail(userData.email);
				}
						// Fetch saved addresses from /api/address
						setAddressLoading(true);
						fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000'}/api/address`, {
							headers: {
								'Authorization': `Bearer ${token}`,
								'Content-Type': 'application/json',
							},
						})
							.then(res => res.json())
							.then(data => {
								if (Array.isArray(data.data)) {
									setSavedAddresses(data.data);
								}
							})
							.catch(err => {
								setAddressError('Failed to load saved addresses: ' + (err instanceof Error ? err.message : 'Unknown error'));
							})
							.finally(() => setAddressLoading(false));
			} catch (err) {
				console.error('Failed to parse user data:', err);
			}
		}
	}, []);
	
	console.log("Initial state setup complete");

	// Calculate subtotal based on actual cart items
	const subtotal = useMemo(() => {
		// Check if cart.items exists and has items before reducing
		if (cart?.items?.length > 0) {
			return cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
		}
		return 0;
	}, [cart.items]);
	
	const total = subtotal + tip;

	// Function to handle order creation
	const [isCreatingOrder, setIsCreatingOrder] = useState(false);
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const [orderSuccess, setOrderSuccess] = useState(false);
	const [orderError, setOrderError] = useState<string | null>(null);
	
	const validateAddress = async (address: string, postcode: string, area: string) => {
		setIsAddressValid(false);
		setAddressValidationError(null);

		// Check if all fields are filled
		if (!address || !postcode || !area) {
			setAddressValidationError("Please fill in all address fields");
			return;
		}

		// First check if it's in the delivery areas
		const areaValidation = isAddressInDeliveryArea(address, postcode, area);
		if (!areaValidation.isValid) {
			setAddressValidationError(areaValidation.message);
			return;
		}

		try {
			const fullAddress = `${address}, ${postcode} ${area}, Germany`;
			const coords = await geocodeAddress(fullAddress);
			
			const distance = getDistanceFromLatLonInKm(
				RESTAURANT_LAT,
				RESTAURANT_LNG,
				coords.lat,
				coords.lng
			);

			if (distance <= 5) {
				setIsAddressValid(true);
				setAddressValidationError(null);
			} else {
				setIsAddressValid(false);
				setAddressValidationError(`Sorry, this address is ${distance.toFixed(1)}km away from our restaurant. We only deliver within 5km.`);
			}
		} catch (error) {
			setIsAddressValid(false);
			setAddressValidationError(error instanceof Error ? error.message : "Failed to validate address");
		}
	};

	const handleSaveNewAddress = async () => {
		try {
			const token = Cookies.get('token') || localStorage.getItem('token');
			if (!token) {
				setAddressError('Authentication required');
				return;
			}

			if (!street || !postalCode || !city) {
				setAddressError('Please fill in the address fields');
				return;
			}

			// First validate the address
			const fullAddress = `${street}, ${postalCode} ${city}, Germany`;
			setAddressLoading(true);
			
			try {
				const coords = await geocodeAddress(fullAddress);
				const distance = getDistanceFromLatLonInKm(
					RESTAURANT_LAT,
					RESTAURANT_LNG,
					coords.lat,
					coords.lng
				);

				if (distance > 5) {
					const errorMsg = `Sorry, this address is ${distance.toFixed(1)}km away from our restaurant. We only deliver within 5km.`;
					setAddressError(errorMsg);
					setAddressValidationError(errorMsg);
					setIsAddressValid(false);
					setAddressLoading(false);
					return;
				}

				// If distance check passes, set address as valid
				setIsAddressValid(true);
				setAddressValidationError(null);
			} catch (error) {
				const errorMsg = error instanceof Error ? error.message : "Failed to validate address location";
				setAddressError(errorMsg);
				setAddressValidationError(errorMsg);
				setIsAddressValid(false);
				setAddressLoading(false);
				return;
			}
			const payload = {
				label: 'Home', // You can add a label input if needed
				address: street,
				area: city,
				postalCode: postalCode,
				isDefault: savedAddresses.length === 0
			};

			const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000'}/api/address`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${token}`,
				},
				body: JSON.stringify(payload),
			});

			const data = await res.json();
			if (data.statusCode === 200 && data.data) {
				setSavedAddresses(prev => [...prev, { ...data.data }]);
				setSelectedAddressId(data.data.id);
				// setShowAddAddress(false); // Only hide on successful save (removed)
				setStreet('');
				setPostalCode('');
				setCity('');
				setAddressError(null);
				setAddressValidationError(null);
				setIsAddressValid(true);
			} else {
				const errorMsg = data.message || 'Failed to save address';
				setAddressError(errorMsg);
				setAddressValidationError(errorMsg);
				// Form stays open, error is shown
			}
		} catch (err) {
			setAddressError(err instanceof Error ? err.message : 'Failed to save address');
		} finally {
			setAddressLoading(false);
		}
	};

	const handleCreateOrder = async () => {
		// Validate all required fields first
		const errors = [];

		// Check cart
		if (cart.items.length === 0) {
			errors.push("Your cart is empty. Please add items before checking out.");
		}

		// Contact information validation
		if (!firstName) errors.push("Please enter your first name");
		if (!lastName) errors.push("Please enter your last name");
		if (!email) {
			errors.push("Please enter your email address");
		} else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
			errors.push("Please enter a valid email address");
		}
		if (!phone) {
			errors.push("Please enter your phone number");
		} else if (!/^\d{10,15}$/.test(phone.replace(/\D/g, ''))) {
			errors.push("Please enter a valid phone number");
		}

		// Delivery address validation
		if (method === "delivery") {
			if (!street || street.length < 3) errors.push("Please enter a valid street address");
			if (!postalCode || !/^\d{5}$/.test(postalCode)) errors.push("Please enter a valid 5-digit postal code");
			if (!city) errors.push("Please enter your city");
			if (!isAddressValid) {
				errors.push(addressValidationError || "Please enter a valid delivery address in our delivery area");
			}
		}

		// If there are any validation errors, show them and stop
		if (errors.length > 0) {
			const errorMessage = "Please fix the following issues:\n\n" + errors.join("\n");
			alert(errorMessage);
			return;
		}

		// If cart is empty but exists in localStorage, try to load it
		if (cart.items.length === 0) {
			const storedCart = localStorage.getItem(CART_KEY);
			if (storedCart) {
				try {
					const parsedCart = JSON.parse(storedCart);
					if (parsedCart.items && parsedCart.items.length > 0) {
						setCart(parsedCart);
						alert("Cart data loaded from localStorage. Please try placing your order again.");
						return;
					}
				} catch (err) {
					console.error("Failed to parse cart from localStorage:", err);
				}
			}
		}
		
		setIsCreatingOrder(true);
		setOrderError(null);
		
		try {
			// Check if this is a retry attempt (from URL params)
			const urlParams = new URLSearchParams(window.location.search);
			const retryPaymentId = urlParams.get('retryPaymentId');
			
			// Map cart items to order items with proper dish IDs and prices
			const orderItems = await mapCartItemsToOrderItems(cart.items);
			
			// Add price to each order item from cart
			const orderItemsWithPrice = orderItems.map(item => {
				const cartItem = cart.items.find(ci => ci.id === item.dishId);
				return {
					...item,
					price: cartItem?.price || 0
				};
			});
			
			// Calculate total amount including tip
			const subtotalAmount = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
			const totalAmount = subtotalAmount + tip;
			
			// Prepare customer name and phone
			const name = `${firstName} ${lastName}`;
			const phoneNo = `+49${phone}`;
			
			// Prepare delivery details
			const deliveryAddress = method === 'delivery' ? street : 'Pickup at restaurant';
			const area = city || 'Frankfurt';
			
			// Default coordinates for Frankfurt (restaurant location)
			const latitude = 52.5029;
			const longitude = 13.4475;
			
			// Prepare notes
			const notesForRestaurant = notes || `Order by: ${name}, ${email}, ${phoneNo}. Method: ${method}.${method === 'delivery' ? ` Delivery address: ${street}, ${postalCode} ${city}, Germany.` : ''}`;
			
			// Prepare payment data
			const paymentData = {
				orderItems: orderItemsWithPrice,
				totalAmount,
				subtotal: subtotalAmount,
				tip: tip,
				currency: 'EUR',
				name,
				email,
				phoneNo,
				deliveryAddress,
				area,
				postalCode: postalCode || '60329',
				latitude,
				longitude,
				notes: notesForRestaurant,
				couponCode: promo || undefined,
				...(retryPaymentId && { retryPaymentId }),  // Add retry payment ID if retrying
			};
			
			console.log("Initiating payment with data:", paymentData);
			if (retryPaymentId) {
				console.log("This is a retry attempt for payment:", retryPaymentId);
			}
			
			// Get auth token if user is logged in (check both 'token' and 'authToken' for compatibility)
			const token = localStorage.getItem('token') || localStorage.getItem('authToken');
			
			// Initiate payment via SumUp
			const responseData = await initiatePayment(paymentData, token || undefined);
			console.log("Payment initiated successfully:", responseData);
			
			// Check if we're in sandbox mode (testing)
			if (responseData.mode === 'SANDBOX') {
				console.log('Sandbox mode: Payment created successfully');
				
				// Store payment ID for testing
				if (responseData.paymentId) {
					localStorage.setItem('pendingPaymentId', responseData.paymentId);
					
					// Complete the sandbox payment to create the order
					try {
						const completionResult = await simulatePaymentSuccess(responseData.paymentId, token || undefined);
						console.log('Sandbox payment completed, order created:', completionResult);
						
						// Don't clear cart here - let success page do it
						// This allows testing payment retry flow
						
						// Redirect to payment success page with both payment and order IDs
						router.push(`/user/payment-success?paymentId=${responseData.paymentId}&orderId=${completionResult.orderId || ''}`);
						return;
					} catch (completionError) {
						console.error('Error completing sandbox payment:', completionError);
						// Fall back to just showing payment success without order ID
					}
				}
				
				// Don't clear cart here - let success page do it
				// This allows testing payment retry flow
				
				// Redirect to payment success page (works for both guests and logged-in users)
				router.push(`/user/payment-success?paymentId=${responseData.paymentId || ''}`);
				return;
			}
			
			// Production mode - check if we got a checkout URL
			// API returns checkout_url (snake_case) from Stripe
			const checkoutUrl = responseData.checkout_url || responseData.checkoutUrl;
			
			if (checkoutUrl) {
				// Store payment ID for later verification
				if (responseData.paymentId) {
					localStorage.setItem('pendingPaymentId', responseData.paymentId);
				}
				
				// DO NOT clear cart yet - keep it until payment is confirmed
				// The cart will be cleared when user returns to payment-success page
				// or they can retry if payment fails
				
				// Redirect to Stripe payment page
				console.log('Redirecting to Stripe checkout:', checkoutUrl);
				window.location.href = checkoutUrl;
			} else {
				throw new Error('No checkout URL received from server');
			}
		} catch (error: unknown) {
			console.error("Error initiating payment:", error);
			const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
			
			// Check if retry limit exceeded
			if (errorMessage.includes('retry limit exceeded') || errorMessage.includes('Maximum retry')) {
				alert('Maximum payment retry attempts exceeded. Please contact support for assistance.');
				router.push('/user/contact?reason=payment-retry-limit');
				return;
			}
			
			setOrderError(errorMessage);
			alert(`Failed to initiate payment: ${errorMessage}`);
		} finally {
			setIsCreatingOrder(false);
		}
	};

	// Function to retry fetching dish data
	const handleRetry = () => {
		console.log("Retrying dish data fetch...");
		setLoading(true);
		setError(null);
		
		// Use a timeout to give visual feedback that we're retrying
		setTimeout(() => {
			const fetchData = async () => {
				try {
					const data = await fetchDishes();
					
					if (data && data.data) {
						const allDishes = Object.values(data.data || {}).flat();
						const dishMap: Record<string, DishData> = {};
						(allDishes as DishData[]).forEach(d => {
							if (d && (d.id || d.name)) {
								dishMap[d.id || d.name] = d;
							}
						});
						console.log("Using hardcoded data instead of dish data", dishMap);
					} else {
						setError("Could not load updated menu data");
					}
				} catch (error) {
					console.error("Error in retry fetch:", error);
					const errorMessage = error instanceof Error ? error.message : 'Unknown error';
					setError(`Unable to fetch menu data: ${errorMessage}`);
				} finally {
					setLoading(false);
				}
			};
			
			fetchData();
		}, 500);
	};

	// We're now relying on CartContext to handle localStorage
	// State for tracking localStorage cart loading
	const [loadingFromStorage, setLoadingFromStorage] = useState(false);
	const [loadedFromStorage, setLoadedFromStorage] = useState(false);
	
	// Try to load cart from localStorage if the context cart is empty
	useEffect(() => {
		console.log("Cart from context in checkout page:", cart);
		// If the cart is empty, try to load it from localStorage
		if (cart.items.length === 0) {
			console.log("Warning: Cart is empty in checkout page. Loading from localStorage...");
			setLoadingFromStorage(true);
			
			// Check if data is in localStorage with the correct key
			const dalRotti = localStorage.getItem(CART_KEY);
			if (dalRotti) {
				console.log(`Found cart data in localStorage with key '${CART_KEY}':`, dalRotti);
				try {
					const parsedCart = JSON.parse(dalRotti);
					console.log("Parsed cart items:", parsedCart.items?.length || 0);
					
					// If we found items in localStorage, update the cart context
					if (parsedCart.items && parsedCart.items.length > 0) {
						setCart(parsedCart);
						setLoadedFromStorage(true);
						console.log("Loaded cart data from localStorage:", parsedCart);
					}
				} catch (err) {
					console.error("Error parsing cart from localStorage:", err);
				}
			} else {
				console.log(`No cart data found in localStorage with key '${CART_KEY}'`);
			}
			setLoadingFromStorage(false);
		}
	}, [cart, setCart]);
	
	// Fetch latest dish data on mount to match cart items
	useEffect(() => {
		console.log("Fetching dish data from API...");
		const fetchData = async () => {
			try {
				setLoading(true);
				setError(null);
				const data = await fetchDishes();
				
				console.log("API dish data received:", data);
				// data.data is expected to be { [category]: DishData[] }
				if (data && data.data) {
					const allDishes = Object.values(data.data || {}).flat();
					// Map by id or name for lookup
					const dishMap: Record<string, DishData> = {};
					// Cast the flattened array to array of DishData
					(allDishes as DishData[]).forEach(d => {
						if (d && (d.id || d.name)) {
							dishMap[d.id || d.name] = d;
						}
					});
					console.log("Processed dish map:", Object.keys(dishMap).length, "dishes");
					console.log("Using hardcoded data instead of dish data", dishMap);
				} else {
					console.warn("Invalid or empty API response format");
					setError("Could not load updated menu data");
				}
			} catch (error) {
				console.error("Error in dish data fetch effect:", error);
				const errorMessage = error instanceof Error ? error.message : 'Unknown error';
				setError(`Unable to fetch menu data: ${errorMessage}`);
			} finally {
				setLoading(false);
			}
		};
		
		fetchData();
	}, []);

	// Redirect if cart is empty
	// if (cart.items.length === 0) {
	// 	return (
	// 		<div className="min-h-screen bg-gradient-to-br from-[#f7f3ef] to-[#fff8f6] flex items-center justify-center">
	// 			<div className="text-center">
	// 				<h1 className="text-2xl font-bold text-[#7a1313] mb-4">Your cart is empty</h1>
	// 				<Link href="/user" className="inline-block bg-[#7a1313] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#4a2c0a] transition">
	// 					Continue Shopping
	// 				</Link>
	// 			</div>
	// 		</div>
	// 	);
	// }
	
	// Function to retry fetching dish data
	const retryFetch = () => {
		setLoading(true);
		setError(null);
		// This will trigger the useEffect again
		fetchDishes().then(data => {
			console.log("API dish data received (retry):", data);
			if (data && data.data) {
				const allDishes = Object.values(data.data || {}).flat();
				const dishMap: Record<string, DishData> = {};
				(allDishes as DishData[]).forEach(d => {
					dishMap[d.id || d.name] = d;
				});
				console.log("Using hardcoded data instead of dish data", dishMap);
			} else {
				setError("Invalid response format from API");
			}
		}).catch(err => {
			console.error("Error fetching dishes (retry):", err);
			setError(`Failed to load dish data: ${err.message}`);
		}).finally(() => {
			setLoading(false);
		});
	};
	
	// Helper components
	const ImageWithFallback = ({ src, alt, className = "w-12 h-12 rounded" }: { src?: string, alt: string, className?: string }) => {
		const [isLoading, setIsLoading] = useState(true);
		const [hasError, setHasError] = useState(false);
		
		if (!src) {
			return (
				<div className={`${className} bg-gray-200 flex items-center justify-center text-gray-400 text-xs`}>
					No Image
				</div>
			);
		}
		
		return (
			<div className={`relative ${className}`}>
				{isLoading && (
					<div className="absolute inset-0 bg-gray-100 rounded flex items-center justify-center">
						<div className="w-4 h-4 border-2 border-gray-200 border-t-[#7a1313] rounded-full animate-spin"></div>
					</div>
				)}
				<Image 
					src={src} 
					alt={alt} 
					width={48}
					height={48}
					className={`rounded object-cover border ${hasError ? 'hidden' : ''}`}
					style={{ width: '48px', height: '48px' }}
					onLoad={() => setIsLoading(false)}
					onError={(e) => {
						setIsLoading(false);
						setHasError(true);
						// Create fallback UI
						const target = e.target as HTMLImageElement;
						target.style.display = 'none';
						target.parentElement?.classList.add('bg-gray-200', 'flex', 'items-center', 'justify-center');
						const fallback = document.createElement('div');
						fallback.textContent = 'No Image';
						fallback.className = 'text-xs text-gray-400';
						target.parentElement?.appendChild(fallback);
					}}
				/>
				{hasError && (
					<div className="absolute inset-0 bg-gray-200 rounded flex items-center justify-center text-gray-400 text-xs">
						No Image
					</div>
				)}
			</div>
		);
	};
	
	// Show loading state while we're fetching API data
	if (loading) {
		return <div className="min-h-screen bg-gradient-to-br from-[#f7f3ef] to-[#fff8f6] flex items-center justify-center text-xl">Loading checkout details...</div>;
	}
	
	// Show error message if we failed to fetch dish data
	if (error) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-[#f7f3ef] to-[#fff8f6] flex flex-col items-center justify-center">
				<div className="text-center bg-white p-8 rounded-lg shadow-lg">
					<h2 className="text-2xl text-red-600 font-bold mb-4">Error Loading Page</h2>
					<p className="mb-4">{error}</p>
					<div className="flex gap-4">
						<button 
							onClick={() => window.history.back()}
							className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 transition"
						>
							Go Back
						</button>
						<button 
							onClick={retryFetch}
							className="px-4 py-2 bg-[#7a1313] text-white rounded hover:bg-[#4a2c0a] transition"
						>
							Retry
						</button>
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
			<UserHeader />
			<div className="min-h-screen bg-gradient-to-br from-[#f7f3ef] to-[#fff8f6] px-2 md:px-0 py-8">
			<div className="grid grid-cols-1 md:grid-cols-12 gap-8 justify-center items-start max-w-6xl mx-auto">
				{/* Main checkout form */}
				<div className="col-span-1 md:col-span-8">
					<div className="flex justify-between items-center mb-6">
						<button
							className="text-[#7a1313] font-semibold flex items-center gap-2 hover:underline"
							onClick={() => window.history.back()}
						>
							<span className="text-xl">&larr;</span> Return
						</button>
						
						{/* Loading indicator or retry button */}
						{loading && (
							<div className="flex items-center text-sm text-gray-500">
								<svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-[#7a1313]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
									<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
									<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
								</svg>
								Loading menu data...
							</div>
						)}
						
						{error && !loading && (
							<button 
								onClick={handleRetry}
								className="text-sm flex items-center px-3 py-1 border border-transparent font-medium rounded-md text-white bg-[#7a1313] hover:bg-[#4a2c0a] transition"
							>
								<svg className="mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
								</svg>
								Retry
							</button>
						)}
					</div>
					
					{/* Error message */}
					{error && (
						<div className="bg-white p-4 rounded-lg shadow-sm mb-6 border-l-4 border-amber-500">
							<p className="text-sm text-gray-700">
								{error} <br/>
								<span className="text-xs text-gray-500">You can continue with checkout, but some prices or images may not be current.</span>
							</p>
						</div>
					)}
					
					{/* Cart loaded from localStorage notification */}
					{loadedFromStorage && (
						<div className="bg-white p-4 rounded-lg shadow-sm mb-6 border-l-4 border-green-500 animate-fadeIn">
							<p className="text-sm text-gray-700">
								<span className="font-bold text-green-700">Cart data restored!</span> <br/>
								<span className="text-xs text-gray-500">Your cart items have been loaded from your browser's storage.</span>
							</p>
						</div>
					)}
					
					{/* Loading from localStorage indicator */}
					{loadingFromStorage && (
						<div className="bg-white p-4 rounded-lg shadow-sm mb-6 border-l-4 border-blue-300 flex items-center">
							<div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3"></div>
							<p className="text-sm text-gray-700">
								Checking for saved cart data...
							</p>
						</div>
					)}
					<div className="bg-white rounded-2xl shadow-xl p-6 md:p-8 border border-gray-200">
						<div>
							{/* Login Section - Only show if NOT logged in */}
							{!isLoggedIn && (
								<div className="mb-8 pb-6 border-b border-gray-200">
									<div className="flex items-center justify-between mb-4">
										<div className="flex items-center gap-3">
											<div className="w-10 h-10 bg-gradient-to-br from-[#e30232] to-[#7a1313] rounded-full flex items-center justify-center">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
												</svg>
											</div>
											<div>
												<h3 className="font-bold text-gray-900">Member Benefits</h3>
												<p className="text-sm text-gray-600">Login to use saved info & earn points</p>
											</div>
										</div>
									</div>
									<button 
										onClick={() => window.location.href = '/user/signin?returnUrl=/user/checkout'}
										className="w-full bg-gradient-to-r from-[#e30232] to-[#7a1313] text-white font-semibold py-3 px-4 rounded-xl hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 group"
									>
										<svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
										</svg>
										Login to Account
									</button>
									<div className="flex items-center my-4">
										<div className="flex-1 border-t border-gray-300" />
										<span className="mx-4 text-sm text-gray-500 font-medium">
											OR CHECKOUT AS GUEST
										</span>
										<div className="flex-1 border-t border-gray-300" />
									</div>
								</div>
							)}
							
							{/* Welcome message if logged in */}
							{isLoggedIn && user && (
								<div className="mb-8 pb-6 border-b border-gray-200">
									<div className="flex items-center gap-3 p-4 bg-green-50 rounded-xl border border-green-200">
										<div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
											<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
											</svg>
										</div>
										<div>
											<h3 className="font-bold text-gray-900">Welcome back, {user.name?.split(' ')[0] || 'Member'}!</h3>
											<p className="text-sm text-gray-600">You're earning points with this order</p>
										</div>
									</div>
								</div>
							)}

							{/* Method */}
							<div className="mb-6">
								<label className="block font-bold text-gray-900 mb-3 flex items-center gap-2">
									<svg className="w-5 h-5 text-[#e30232]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
									</svg>
									Order Method
								</label>
								<div className="grid grid-cols-2 gap-3">
									<label className={`relative flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all ${
										method === "pickup" 
											? "border-[#e30232] bg-red-50 shadow-md" 
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}>
										<input
											type="radio"
											name="method"
											value="pickup"
											checked={method === "pickup"}
											onChange={() => setMethod("pickup")}
											className="sr-only"
										/>
										<svg className={`w-8 h-8 ${method === "pickup" ? "text-[#e30232]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
										</svg>
										<span className={`font-semibold ${method === "pickup" ? "text-[#e30232]" : "text-gray-700"}`}>Pickup</span>
										{method === "pickup" && (
											<div className="absolute top-2 right-2 w-5 h-5 bg-[#e30232] rounded-full flex items-center justify-center">
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											</div>
										)}
									</label>
									<label className={`relative flex flex-col items-center gap-2 cursor-pointer p-4 rounded-xl border-2 transition-all ${
										method === "delivery" 
											? "border-[#e30232] bg-red-50 shadow-md" 
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}>
										<input
											type="radio"
											name="method"
											value="delivery"
											checked={method === "delivery"}
											onChange={() => setMethod("delivery")}
											className="sr-only"
										/>
										<svg className={`w-8 h-8 ${method === "delivery" ? "text-[#e30232]" : "text-gray-400"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
										</svg>
										<span className={`font-semibold ${method === "delivery" ? "text-[#e30232]" : "text-gray-700"}`}>Delivery</span>
										{method === "delivery" && (
											<div className="absolute top-2 right-2 w-5 h-5 bg-[#e30232] rounded-full flex items-center justify-center">
												<svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
													<path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
												</svg>
											</div>
										)}
									</label>
								</div>
							</div>
														{/* Pickup/Delivery address */}
														{method === "pickup" ? (
															// Pickup section
															<div className="mb-6">
																<div className="p-4 bg-green-50 border border-green-200 rounded-lg">
																	<p className="text-sm text-green-800 flex items-center gap-2">
																		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																			<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
																		</svg>
																		Pickup from our restaurant in Frankfurt
																	</p>
																</div>
															</div>
														) : (
															<div className="mb-6">
																<label className="block font-bold text-gray-900 mb-3 flex items-center gap-2">
																	<svg className="w-5 h-5 text-[#e30232]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
																		<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
																	</svg>
																	Delivery Address
																</label>
																<div className="mb-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
																	<p className="text-sm text-blue-800 flex items-center gap-2">
																		<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
																			<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
																		</svg>
																		We currently deliver only to select areas in Frankfurt and Offenbach
																	</p>
																</div>

																<DeliveryAddressInput 
																	isLoggedIn={isLoggedIn}
																	addressLoading={addressLoading}
																	addressError={addressError}
																	savedAddresses={savedAddresses}
																	selectedAddressId={selectedAddressId}
																	street={street}
																	setStreet={setStreet}
																	postalCode={postalCode}
																	setPostalCode={setPostalCode}
																	city={city}
																	setCity={setCity}
																	isAddressValid={isAddressValid}
																	addressValidationError={addressValidationError}
																	onValidate={() => validateAddress(street, postalCode, city)}
																	onSelectAddress={(addr: { id: string; address: string; postalCode: string; area: string }) => {
																		setSelectedAddressId(addr.id);
																		setStreet(addr.address);
																		setPostalCode(addr.postalCode);
																		setCity(addr.area);
																		validateAddress(addr.address, addr.postalCode, addr.area);
																	}}
																	onAddNewAddress={handleSaveNewAddress}
																/>

                                                    </div>
                                                )}

							{/* Contact info */}
							<div className="mb-6">
								<label className="block font-bold text-gray-900 mb-3 flex items-center gap-2">
									<svg className="w-5 h-5 text-[#e30232]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
									</svg>
									Contact Information
								</label>
								<div className="space-y-3">
									<div className="grid grid-cols-2 gap-3">
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">First name</label>
											<input
												type="text"
												placeholder="John"
												className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] transition-all"
												value={firstName}
												onChange={(e) => setFirstName(e.target.value)}
											/>
										</div>
										<div>
											<label className="block text-sm font-medium text-gray-700 mb-1">Last name</label>
											<input
												type="text"
												placeholder="Doe"
												className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] transition-all"
												value={lastName}
												onChange={(e) => setLastName(e.target.value)}
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
										<div className="relative">
											<div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
												<svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
												</svg>
											</div>
											<input
												type="email"
												placeholder="john.doe@example.com"
												className="border-2 border-gray-300 rounded-lg pl-11 pr-4 py-2.5 w-full focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] transition-all"
												value={email}
												onChange={(e) => setEmail(e.target.value)}
											/>
										</div>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Notes for Restaurant <span className="text-gray-400">(optional)</span></label>
										<textarea
											className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] transition-all resize-none"
											placeholder="Add any special instructions or notes for the restaurant..."
											value={notes}
											onChange={e => setNotes(e.target.value)}
											rows={3}
										/>
									</div>
									<div>
										<label className="block text-sm font-medium text-gray-700 mb-1">Phone number</label>
										<div className="flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-[#e30232] focus-within:border-[#e30232] transition-all">
											<div className="bg-gray-100 px-4 py-2.5 border-r-2 border-gray-300 flex items-center gap-2">
												<span className="text-2xl">🇩🇪</span>
												<span className="font-semibold text-gray-700">+49</span>
											</div>
											<input
												type="tel"
												placeholder="1701234567"
												className="flex-1 px-4 py-2.5 outline-none"
												value={phone}
												onChange={(e) => {
													const val = e.target.value.replace(/[^0-9]/g, '');
													setPhone(val);
												}}
												maxLength={15}
											/>
										</div>
									</div>
								</div>
							</div>
							{/* Save details */}
							<div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-200 rounded-xl p-4">
								<div className="flex items-start gap-3">
									<input
										type="checkbox"
										id="save-details"
										className="mt-1 w-4 h-4 accent-[#e30232] cursor-pointer"
									/>
									<label
										htmlFor="save-details"
										className="text-sm cursor-pointer flex-1"
									>
										<span className="font-semibold text-gray-900">Save Contact and Payment Details</span>
										<span className="block text-gray-600 mt-1">
											Create an account for faster checkout on future orders.
										</span>
									</label>
									<svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
									</svg>
								</div>
							</div>

							{/* Payment */}
							{/* <div className="mb-6">
								<label className="block font-bold text-gray-900 mb-3 flex items-center gap-2">
									<svg className="w-5 h-5 text-[#e30232]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
										<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
									</svg>
									Payment Method
								</label>
								<div className="space-y-3">
									<label className={`relative flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${
										payMethod === "card"
											? "border-[#e30232] bg-red-50 shadow-md"
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}>
										<input
											type="radio"
											name="payMethod"
											value="card"
											checked={payMethod === "card"}
											onChange={() => setPayMethod("card")}
											className="sr-only"
										/>
										<div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
											payMethod === "card" 
												? "bg-gradient-to-br from-[#e30232] to-[#7a1313]" 
												: "bg-gray-100"
										}`}>
											<svg
												className={`w-6 h-6 ${payMethod === "card" ? "text-white" : "text-gray-600"}`}
												fill="none"
												stroke="currentColor"
												viewBox="0 0 24 24"
											>
												<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
											</svg>
										</div>
										<div className="flex-1">
											<span className={`font-semibold ${payMethod === "card" ? "text-[#e30232]" : "text-gray-700"}`}>
												Credit Card
											</span>
											<p className="text-sm text-gray-500 mt-0.5">Pay securely with your card</p>
										</div>
										{payMethod === "card" && (
											<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
												<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</label>

									{payMethod === "card" && (
										<div className="bg-gray-50 rounded-xl p-4 border border-gray-300 space-y-3">
											<div className="grid grid-cols-2 gap-3">
												<div className="col-span-2">
													<label className="block text-sm font-medium text-gray-700 mb-1">Card number</label>
													<input
														type="text"
														placeholder="1234 5678 9012 3456"
														className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] transition-all"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
													<input
														type="text"
														placeholder="MM / YY"
														className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] transition-all"
													/>
												</div>
												<div>
													<label className="block text-sm font-medium text-gray-700 mb-1">CVC</label>
													<input
														type="text"
														placeholder="123"
														className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full focus:ring-2 focus:ring-[#e30232] focus:border-[#e30232] transition-all"
													/>
												</div>
											</div>
											<div>
												<label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
												<input
													type="text"
													className="border-2 border-gray-300 rounded-lg px-4 py-2.5 w-full bg-gray-100 text-gray-600"
													value="Germany"
													readOnly
												/>
											</div>
										</div>
									)}

									<label className={`relative flex items-center gap-4 cursor-pointer p-4 rounded-xl border-2 transition-all ${
										payMethod === "paypal"
											? "border-[#e30232] bg-red-50 shadow-md"
											: "border-gray-300 bg-white hover:border-gray-400"
									}`}>
										<input
											type="radio"
											name="payMethod"
											value="paypal"
											checked={payMethod === "paypal"}
											onChange={() => setPayMethod("paypal")}
											className="sr-only"
										/>
										<div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
											payMethod === "paypal" 
												? "bg-gradient-to-br from-[#e30232] to-[#7a1313]" 
												: "bg-gray-100"
										}`}>
											<svg
												className={`w-6 h-6 ${payMethod === "paypal" ? "text-white" : "text-gray-600"}`}
												fill="currentColor"
												viewBox="0 0 24 24"
											>
												<path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944 3.439c.08-.47.5-.814.98-.814h8.53c2.467 0 4.134.845 4.82 2.444.38.885.446 1.922.195 3.084-.836 3.86-3.446 5.847-7.545 5.847H9.5a.88.88 0 0 0-.87.746l-.65 4.145-.02.11-.877 5.597a.641.641 0 0 1-.633.74zM18.276 5.127c-.836 3.86-3.446 5.847-7.545 5.847H8.307a.88.88 0 0 0-.87.746l-.65 4.145-.02.11-.877 5.597a.641.641 0 0 1-.633.74H2.47a.641.641 0 0 1-.633-.74L4.944 3.439c.08-.47.5-.814.98-.814h8.53c2.467 0 4.134.845 4.82 2.444.002.004.003.008.005.012z"/>
											</svg>
										</div>
										<div className="flex-1">
											<span className={`font-semibold ${payMethod === "paypal" ? "text-[#e30232]" : "text-gray-700"}`}>
												PayPal
											</span>
											<p className="text-sm text-gray-500 mt-0.5">Fast and secure payment</p>
										</div>
										{payMethod === "paypal" && (
											<div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
												<svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</label>
								</div>
							</div> */}

							{/* Invoice */}
							{/* <div className="mb-6 flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-300">
								<input
									type="checkbox"
									id="invoice"
									checked={invoice}
									onChange={(e) => setInvoice(e.target.checked)}
									className="mt-0.5 w-4 h-4 accent-[#e30232] cursor-pointer"
								/>
								<label htmlFor="invoice" className="text-sm cursor-pointer flex-1">
									<span className="font-medium text-gray-900">Request invoice via email</span>
									<span className="block text-gray-600 mt-0.5">We'll send a detailed invoice to your email address</span>
								</label>
								<svg className="w-5 h-5 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
									<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
								</svg>
							</div> */}
						</div>
						<div>
							{method === 'delivery' && !isAddressValid && (
								<div className="bg-red-50 border-2 border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
									<svg className="w-6 h-6 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
										<path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
									</svg>
									<p className="text-red-700 font-medium text-sm">
										{addressValidationError || 'Please enter a valid delivery address in our delivery area'}
									</p>
								</div>
							)}
							<button 
								onClick={handleCreateOrder}
								disabled={isCreatingOrder || (method === 'delivery' && !isAddressValid)}
								className={`w-full ${
									isCreatingOrder || (method === 'delivery' && !isAddressValid) 
										? 'bg-gray-300 cursor-not-allowed' 
										: 'bg-gradient-to-r from-[#e30232] to-[#7a1313] hover:shadow-lg hover:scale-[1.02] active:scale-[0.98]'
								} text-white font-bold py-4 rounded-xl transition-all duration-300 flex items-center justify-center gap-3 text-lg`}
								title={method === 'delivery' && !isAddressValid ? (addressValidationError || 'Please enter a valid delivery address in our delivery area') : ''}
							>
								{isCreatingOrder ? (
									<>
										<svg className="animate-spin h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
											<circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
											<path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
										</svg>
										<span>Processing Payment...</span>
									</>
								) : (
									<>
										<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
											<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
										</svg>
										<span>Pay Now</span>
									</>
								)}
							</button>
						</div>
						<div className="text-xs text-gray-500 mt-4 text-center">
							By placing your order, you agree to our{" "}
							<a href="#" className="underline">
								Terms and Conditions
							</a>{" "}
							and our{" "}
							<a href="#" className="underline">
								Privacy Policy
							</a>
							.
						</div>
					</div>
				</div>
				{/* Order summary */}
				<div className="col-span-1 md:col-span-4">
					<div className="bg-white rounded-2xl shadow-2xl p-0 sticky top-8 border border-gray-100 flex flex-col max-h-[90vh] min-h-[600px]">
						<div className="flex-1 overflow-y-auto p-6 flex flex-col">
							<div className="font-bold text-lg mb-4 text-[#4a2c0a]">
								Order summary
							</div>
							<div className="flex gap-2 mb-4">
								<input
									type="text"
									placeholder="Promo code"
									className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-[#7a1313] bg-gray-50"
									value={promo}
									onChange={(e) => setPromo(e.target.value)}
								/>
								<button className="bg-gray-100 border border-gray-300 rounded-lg px-3 py-2 font-semibold text-[#7a1313] hover:bg-[#f7eaea] transition">
									Apply
								</button>
							</div>
							<div className="mb-4">
								<div className="font-semibold mb-2 text-[#4a2c0a]">Tip</div>
								<div className="flex gap-2 mb-2">
									{[0, 5, 10, 15].map((percent) => (
										<button
											key={percent}
											className={`border rounded-lg px-3 py-2 flex-1 font-semibold transition ${
												tip === (subtotal * percent) / 100
													? "border-[#7a1313] bg-[#f7eaea]"
													: "border-gray-300 bg-white hover:bg-gray-50"
											}`}
											onClick={() => setTip((subtotal * percent) / 100)}
											type="button"
										>
											{`${((subtotal * percent) / 100).toFixed(2)} €`}<br />
											{percent > 0 ? `${percent}%` : "No tip"}
										</button>
									))}
								</div>
								<input
									type="number"
									min="0"
									step="0.01"
									placeholder="Custom tip"
									className="border border-gray-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-[#7a1313] bg-gray-50"
									value={
										tip > 0 &&
										![0, 5, 10, 15].some((p) => tip === (subtotal * p) / 100)
											? tip
											: ""
									}
									onChange={(e) => setTip(Number(e.target.value))}
								/>
							</div>
							<div className="mb-4 flex flex-col gap-1">
								<div className="flex justify-between">
									<span>Subtotal</span>
									<span>€{subtotal.toFixed(2)}</span>
								</div>
								<div className="flex justify-between">
									<span>Tip</span>
									<span>€{tip.toFixed(2)}</span>
								</div>
								<div className="flex justify-between font-bold text-lg">
									<span>Total</span>
									<span>€{total.toFixed(2)}</span>
								</div>
							</div>
							<div className="mb-4 text-xs text-gray-600">
								<a href="#" className="underline">
									Login to pay with points
								</a>
								<div className="mt-1">
									You earn{" "}
									<span className="font-bold text-[#7a1313]">
										{Math.floor(total * 0.3)}
									</span>{" "}
									points with this order
								</div>
							</div>
							{/* Cart items summary (scrollable with rest of section) */}
							<div className="bg-gray-50 rounded-xl shadow-inner p-4 mb-4 border border-gray-100">
								
						
								{/* Display all items from cart */}
								{cart.items.length > 0 ? (
									cart.items.map((item, index) => (
										<div key={`${item.id}-${index}`} className="flex items-center justify-between pb-3">
											<div className="flex items-center gap-3">
												<ImageWithFallback 
													src={item.image} 
													alt={item.name} 
													className="w-10 h-10 rounded-sm object-cover"
												/>
												<div>
													<div className="font-medium">{item.name}</div>
													<div className="text-xs text-gray-500">€{item.price} each</div>
												</div>
											</div>
											<div className="text-gray-700 text-sm font-normal">
												x{item.quantity}
											</div>
										</div>
									))
								) : (
									<div className="text-center py-4 text-gray-500">
										Your cart is empty
									</div>
								)}
							</div>
						</div>
						{orderError && (
							<div className="bg-red-100 border border-red-400 text-red-700 p-2 mb-4 text-sm rounded">
								<strong>Order failed:</strong> {orderError}. Please try again.
							</div>
						)}
						
						{orderSuccess ? (
							<div className="w-full bg-green-600 text-white font-bold py-3 text-center text-lg shrink-0 sticky bottom-0">
								Order Placed Successfully! ✓
							</div>
						) : (
							<button 
								onClick={handleCreateOrder}
								disabled={isCreatingOrder}
								className={`w-full ${isCreatingOrder ? 'bg-gray-500' : 'bg-[#7a1313] hover:bg-[#5a0d0d]'} text-white font-bold py-3 rounded-none text-lg transition shrink-0 sticky bottom-0 flex items-center justify-center`}
							>
								{isCreatingOrder ? (
									<>
										<span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
										Processing...
									</>
								) : 'Pay Now'}
							</button>
						)}
						
					</div>
				</div>
			</div>
		</div>
		</>
	);
}

// Export the component wrapped in the error boundary for maximum resilience
export default function CheckoutWithErrorBoundary() {
  return (
    <ErrorBoundary>
      <CheckoutPage />
    </ErrorBoundary>
  );
}
