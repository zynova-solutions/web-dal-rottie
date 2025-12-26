// src/services/orderApi.ts
import { getCurrentLanguage } from '@/utils/apiUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

interface OrderItem {
  dishId: string;
  quantity: number;
}

export interface InitiatePaymentData {
  orderItems: OrderItem[];
  currency: string;
  deliveryAddress?: string;
  area?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
  name?: string;
  email?: string;
  phoneNo?: string;
  totalAmount?: number;
  paymentType?: string;
  notes?: string;
  couponCode?: string;
  retryPaymentId?: string;  // For retrying failed payments
}

/**
 * Initiates payment via SumUp (creates payment and order will be created on success)
 * @param paymentData Payment data for logged-in or guest user
 * @param token Optional Bearer token for logged-in users
 * @returns Promise containing checkout URL and payment ID
 */
export async function initiatePayment(paymentData: InitiatePaymentData, token?: string) {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/payments/initiate?lang=${lang}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(paymentData),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error initiating payment: ${response.status}`);
  }

  return response.json();
}

/**
 * Check payment status by payment ID
 * @param paymentId Payment ID to check
 * @returns Promise containing payment status
 */
export async function getPaymentStatus(paymentId: string) {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/payments/payment-status/${paymentId}?lang=${lang}`);
  
  if (!response.ok) {
    throw new Error(`Error checking payment status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Check SumUp checkout status (for polling)
 * @param paymentId Payment ID to check
 * @returns Promise containing checkout status
 */
export async function getCheckoutStatus(paymentId: string) {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/payments/checkout-status/${paymentId}?lang=${lang}`);
  
  if (!response.ok) {
    throw new Error(`Error checking checkout status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Complete sandbox payment and create order (for testing only)
 * @param paymentId Payment ID to complete
 * @param token Optional Bearer token for logged-in users
 * @returns Promise containing order details
 */
export async function simulatePaymentSuccess(paymentId: string, token?: string) {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/payments/test/simulate-success?lang=${lang}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ paymentId }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error simulating payment success: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Simulate payment failure (for testing only)
 * @param checkoutId Checkout ID to fail
 * @param paymentId Payment ID to fail
 * @param token Optional Bearer token for logged-in users
 * @returns Promise containing failure details
 */
export async function simulatePaymentFailure(checkoutId?: string, paymentId?: string, token?: string) {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/payments/test/simulate-failure?lang=${lang}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ checkoutId, paymentId }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Error simulating payment failure: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get checkout details from SumUp (for testing)
 * @param checkoutId Checkout ID
 * @returns Promise containing checkout details
 */
export async function getCheckoutDetails(checkoutId: string) {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/payments/checkout/${checkoutId}?lang=${lang}`);
  
  if (!response.ok) {
    throw new Error(`Error fetching checkout details: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Check if a payment can be retried
 * @param paymentId Payment ID to check
 * @returns Promise containing retry eligibility info
 */
export async function getRetryStatus(paymentId: string) {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/payments/retry-status/${paymentId}?lang=${lang}`);
  
  if (!response.ok) {
    throw new Error(`Error checking retry status: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Maps cart items to order items with proper dish IDs
 * @param cartItems Array of cart items with name and quantity
 * @returns Promise containing properly formatted order items with dish IDs
 */
export async function mapCartItemsToOrderItems(cartItems: Array<{id: string; name: string; quantity: number}>) {
  try {
    const lang = getCurrentLanguage();
    // Fetch all dishes to get the mapping of names to IDs
    const response = await fetch(`${API_BASE_URL}/api/dishes/getall?lang=${lang}`);
    if (!response.ok) {
      throw new Error(`Error fetching dishes: ${response.status}`);
    }

    const data = await response.json();
    let allDishes: unknown[] = [];
    if (data && data.data) {
      allDishes = Object.values(data.data).flat();
    }

    // Map cart items to order items by matching name (case-insensitive)
    const orderItems = cartItems.map(item => {
      const foundDish = allDishes.find(dish => {
        if (typeof dish === 'object' && dish !== null && 'name' in dish) {
          const d = dish as { name?: string; dishId?: string; id?: string };
          return d.name && d.name.toLowerCase() === item.name.toLowerCase();
        }
        return false;
      });
      let dishId: string | undefined = undefined;
      if (foundDish && typeof foundDish === 'object' && foundDish !== null) {
        const d = foundDish as { dishId?: string; id?: string };
        dishId = d.dishId || d.id;
      } else {
        dishId = item.id;
      }
      if (typeof dishId === 'string' && dishId.length > 0) {
        return {
          dishId,
          quantity: item.quantity
        };
      }
      return undefined;
    }).filter((item): item is { dishId: string; quantity: number } => !!item);
    return orderItems;
  } catch (error) {
    console.error('Error mapping cart items to order items:', error);
    // Return the original items with their IDs as fallback
    return cartItems.map(item => ({
      dishId: item.id,
      quantity: item.quantity
    }));
  }
}
