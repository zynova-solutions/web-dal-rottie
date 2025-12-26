import { getCurrentLanguage } from '@/utils/apiUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

export async function getCart(token: string) {
  const lang = getCurrentLanguage();
  const res = await fetch(`${API_BASE_URL}/api/cart/get?lang=${lang}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to fetch cart');
  return res.json();
}

export async function clearCart(token: string) {
  const lang = getCurrentLanguage();
  const res = await fetch(`${API_BASE_URL}/api/cart/clear?lang=${lang}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to clear cart');
  return res.json();
}

export async function removeCartItem(dishId: string, token: string) {
  const lang = getCurrentLanguage();
  const res = await fetch(`${API_BASE_URL}/api/cart/remove/${dishId}?lang=${lang}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  if (!res.ok) throw new Error('Failed to remove item from cart');
  return res.json();
}

export async function addOrUpdateCart(dishId: string, quantity: number, token: string) {
  const lang = getCurrentLanguage();
  const res = await fetch(`${API_BASE_URL}/api/cart/addorupdate?lang=${lang}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ dishId, quantity }),
  });
  if (!res.ok) throw new Error('Failed to add/update cart');
  return res.json();
}
