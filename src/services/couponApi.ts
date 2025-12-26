import { adminPost, adminPut, adminDelete, adminGet } from '@/services/adminApi';

// Type definitions
interface CreateCouponResponse {
  data: {
    id: string;
  };
}

interface DeleteCouponResponse {
  statusCode: number;
  message: string;
}

interface Coupon {
  id: string;
  code: string;
  type: string;
  value: number;
  maxDiscount: number;
  minCartValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  perUserLimit: number;
  newUserOnly: boolean;
  isActive?: boolean;
}

interface CouponsListResponse {
  data: Coupon[];
}

interface CouponResponse {
  data: Coupon;
}

interface ApplyCouponResponse {
  success: boolean;
  discount: number;
  message?: string;
}

/**
 * Get all coupons (Admin only)
 * Endpoint: GET /api/coupons/getall
 */
export async function getAllCoupons(): Promise<CouponsListResponse> {
  return adminGet<Coupon[]>('/api/coupons/getall');
}

/**
 * Get coupon by ID (Admin only)
 * Endpoint: GET /api/coupons/get/:id
 */
export async function getCouponById(id: string): Promise<CouponResponse> {
  return adminGet<Coupon>(`/api/coupons/get/${id}`);
}

/**
 * Get active coupons list (Admin only)
 * Endpoint: GET /api/coupons/active/list
 */
export async function getActiveCoupons(): Promise<CouponsListResponse> {
  return adminGet<Coupon[]>('/api/coupons/active/list');
}

/**
 * Apply coupon code
 * Endpoint: POST /api/coupons/apply
 */
export async function applyCoupon(code: string, totalAmount: number, token?: string): Promise<ApplyCouponResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
  const lang = 'en'; // Default language for coupon application
  
  const response = await fetch(`${API_BASE_URL}/api/coupons/apply?lang=${lang}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ code, totalAmount }),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || 'Failed to apply coupon');
  }
  
  return response.json();
}

export async function createCoupon(data: {
  code: string;
  type: string;
  value: number;
  maxDiscount: number;
  minCartValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  perUserLimit: number;
  newUserOnly: boolean;
}): Promise<CreateCouponResponse> {
  return adminPost<typeof data, CreateCouponResponse>('/api/coupons/create', data);
}

export async function updateCoupon(id: string, data: {
  code: string;
  type: string;
  value: number;
  maxDiscount: number;
  minCartValue: number;
  startDate: string;
  endDate: string;
  usageLimit: number;
  perUserLimit: number;
  newUserOnly: boolean;
}) {
  return adminPut(`/api/coupons/update/${id}`, data);
}

/**
 * Delete a coupon
 * Endpoint: DELETE /api/coupons/delete/:id
 */
export async function deleteCoupon(id: number | string): Promise<DeleteCouponResponse> {
  return adminDelete<DeleteCouponResponse>(`/api/coupons/delete/${id}`);
}

