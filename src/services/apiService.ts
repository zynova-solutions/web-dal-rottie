// src/services/apiService.ts
import { getToken } from "./adminApi";
import { getCurrentLanguage } from "@/utils/apiUtils";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

/**
 * Fetch special dishes (Our Specialties)
 * Endpoint: GET /api/dishes/special
 */
export async function fetchSpecialDishes() {
  try {
    const lang = getCurrentLanguage();
    const res = await fetch(`${API_BASE_URL}/api/dishes/special?lang=${lang}`);
    if (!res.ok) throw new Error('Failed to fetch special dishes');
    return await res.json();
  } catch (err) {
    console.error('[fetchSpecialDishes] Error:', err);
    return null;
  }
}

/**
 * Fetch order by ID
 * Endpoint: GET /api/orders/get/:id
 */
export async function fetchOrderById(orderId: string) {
  const token = getToken();
  const lang = getCurrentLanguage();
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/get/${orderId}?lang=${lang}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch order by id: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('[fetchOrderById] Error:', err);
    return null;
  }
}

/**
 * Update order status
 * Endpoint: PATCH /api/orders/status/:id
 */
export async function updateOrderStatus(orderId: string, deliveryStatus: string, paymentStatus?: string) {
  const token = getToken();
  const lang = getCurrentLanguage();
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/status/${orderId}?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        deliveryStatus,
        ...(paymentStatus ? { paymentStatus } : {}),
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to update order status: ${res.status}`);
    }
    return await res.json();
  } catch (err) {
    console.error('[updateOrderStatus] Error:', err);
    return null;
  }
}

/**
 * Fetch all orders (Admin only)
 * Endpoint: GET /api/orders/getall
 */
export async function fetchAllOrders(customToken?: string) {
  const token = customToken || getToken();
  const lang = getCurrentLanguage();
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/getall?lang=${lang}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch orders: ${res.status} ${errText}`);
    }
    return res.json();
  } catch (err) {
    throw err;
  }
}

/**
 * Fetch all dishes
 * Endpoint: GET /api/dishes/getall
 */
export async function fetchDishes() {
  const lang = getCurrentLanguage();
  const url = `${API_BASE_URL}/api/dishes/getall?lang=${lang}`;
  console.log('fetchDishes: Fetching from URL:', url);
  try {
    const res = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
      next: { revalidate: 0 }
    });
    
    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`Failed to fetch dishes: ${res.status} ${errorText}`);
    }
    
    const data = await res.json();
    return data;
  } catch (err) {
    console.error('fetchDishes error:', err);
    
    if (err instanceof Error && err.message?.includes('fetch')) {
      throw new Error('Unable to connect to server. Please check your connection.');
    }
    
    throw new Error(err instanceof Error ? err.message : 'Failed to fetch dishes');
  }
}

/**
 * Fetch orders optimized for Kanban view
 * Endpoint: GET /api/orders/getall-kanban
 */
export async function fetchKanbanOrders(customToken?: string) {
  const token = customToken || getToken();
  const lang = getCurrentLanguage();
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/getall-kanban?lang=${lang}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch kanban orders: ${res.status} ${errText}`);
    }
    
    return res.json();
  } catch (err) {
    throw err;
  }
}

/**
 * Update order status for Kanban view
 * Endpoint: PATCH /api/orders/status-kanban
 */
export async function updateOrderStatusKanban(
  orderId: number | string,
  status: string
): Promise<{ statusCode: number; message: string; data: unknown }> {
  const token = getToken();
  const lang = getCurrentLanguage();
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/status-kanban?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ orderId, status }),
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to update order status: ${res.status} ${errText}`);
    }
    
    return res.json();
  } catch (err) {
    if (typeof window !== 'undefined') {
      console.error('[updateOrderStatusKanban] Error:', err);
    }
    throw err;
  }
}

/**
 * Cancel an order
 * Endpoint: PATCH /api/orders/cancel/:id
 */
export async function cancelOrder(orderId: string | number, token?: string) {
  const authToken = token || getToken();
  const lang = getCurrentLanguage();
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/cancel/${orderId}?lang=${lang}`, {
      method: 'PATCH',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to cancel order: ${res.status} ${errText}`);
    }
    
    return res.json();
  } catch (err) {
    throw err;
  }
}

/**
 * Delete an order (Admin only)
 * Endpoint: DELETE /api/orders/delete/:id
 */
export async function deleteOrder(orderId: string | number, token?: string) {
  const authToken = token || getToken();
  const lang = getCurrentLanguage();
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/delete/${orderId}?lang=${lang}`, {
      method: 'DELETE',
      headers: {
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to delete order: ${res.status} ${errText}`);
    }
    
    return res.json();
  } catch (err) {
    throw err;
  }
}

/**
 * Request Wolt delivery for an order
 * Endpoint: POST /api/orders/request-wolt-delivery
 */
export async function requestWoltDelivery(data: {
  orderId: string;
  pickupAddress: string;
  dropoffAddress: string;
  customerPhone: string;
}, token?: string) {
  const authToken = token || getToken();
  const lang = getCurrentLanguage();
  
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/request-wolt-delivery?lang=${lang}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      },
      body: JSON.stringify(data),
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to request Wolt delivery: ${res.status} ${errText}`);
    }
    
    return res.json();
  } catch (err) {
    throw err;
  }
}

/**
 * Get user's orders
 * Endpoint: GET /api/orders/my-orders
 */
export async function getMyOrders(token: string) {
  const lang = getCurrentLanguage();
  try {
    const res = await fetch(`${API_BASE_URL}/api/orders/my-orders?lang=${lang}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`Failed to fetch my orders: ${res.status} ${errText}`);
    }
    
    return res.json();
  } catch (err) {
    throw err;
  }
}
