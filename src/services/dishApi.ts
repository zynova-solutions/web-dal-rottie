import { adminPut, adminDelete } from './adminApi';

// Type definitions
export interface DishUpdatePayload {
  name?: string;
  categoryId?: number;
  description?: string;
  isVeg?: boolean;
  spiceLevel?: string;
  allergens?: string;
  prepTime?: string;
  mrp?: number;
  price?: number;
  discount?: number;
  vatPercentage?: number;
  available?: boolean;
  soldOut?: boolean;
  soldOutReason?: string;
  soldOutDate?: string;
  variants?: Array<{ size: string; price: number }>;
  addons?: string[];
}

export interface DishStatusPayload {
  isAvailable?: boolean;
  isSoldOut?: boolean;
}

export interface DishResponse {
  statusCode: number;
  message: string;
  data: {
    id: number;
    name: string;
    categoryId: number;
    description?: string;
    isVeg?: boolean;
    spiceLevel?: string;
    allergens?: string;
    prepTime?: string;
    mrp?: number;
    price?: number;
    discount?: number;
    vatPercentage?: number;
    available?: boolean;
    soldOut?: boolean;
    soldOutReason?: string;
    soldOutDate?: string;
    photoUrl?: string;
    createdAt?: string;
    updatedAt?: string;
  };
}

/**
 * Update an existing dish with optional photo
 * Endpoint: PUT /api/dishes/dishes/:id
 * Content-Type: multipart/form-data
 */
export async function updateDish(id: number | string, formData: FormData): Promise<DishResponse> {
  return adminPut<FormData, DishResponse>(`/api/dishes/dishes/${id}`, formData, undefined, true);
}

/**
 * Delete a dish
 * Endpoint: DELETE /api/dishes/delete/:id
 */
export async function deleteDish(id: number | string): Promise<{ statusCode: number; message: string }> {
  return adminDelete<{ statusCode: number; message: string }>(`/api/dishes/delete/${id}`);
}

/**
 * Quick update dish availability/sold-out status
 * Endpoint: PATCH /api/dishes/status/:id
 */
export async function updateDishStatus(
  id: number | string,
  payload: DishStatusPayload
): Promise<DishResponse> {
  const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
  const token = typeof window !== 'undefined' ? sessionStorage.getItem('dalrotti_admin_token') : null;
  
  const response = await fetch(`${API_BASE_URL}/api/dishes/status/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    },
    body: JSON.stringify(payload),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to update dish status: ${response.status}`);
  }
  
  return response.json();
}
