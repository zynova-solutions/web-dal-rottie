// src/services/userApi.ts
import { getCurrentLanguage } from '@/utils/apiUtils';

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

export interface User {
  id: string;
  email: string;
  name: string;
  phoneNo?: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface UserResponse {
  success: boolean;
  message: string;
  data: User;
}

export interface UpdateUserData {
  name?: string;
  phoneNo?: string;
}

/**
 * Get current user profile (uses token to identify user)
 * Endpoint: GET /api/users/me (if available) or extracts from token
 */
export async function getCurrentUserProfile(token: string): Promise<UserResponse> {
  const lang = getCurrentLanguage();
  // For now, we'll need to decode the token or call a /me endpoint
  // This is a placeholder - adjust based on your actual backend
  const response = await fetch(`${API_BASE_URL}/api/auth/me?lang=${lang}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to fetch profile: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Get user by ID
 * Endpoint: GET /api/users/get/:id
 */
export async function getUserById(id: string, token: string): Promise<UserResponse> {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/users/get/${id}?lang=${lang}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to fetch user: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Update user profile
 * Endpoint: PUT /api/users/update
 */
export async function updateUser(data: UpdateUserData, token: string): Promise<UserResponse> {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/users/update?lang=${lang}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to update user: ${response.status}`);
  }
  
  return response.json();
}

/**
 * Delete user account
 * Endpoint: DELETE /api/users/delete
 */
export async function deleteUser(token: string): Promise<{ success: boolean; message: string }> {
  const lang = getCurrentLanguage();
  const response = await fetch(`${API_BASE_URL}/api/users/delete?lang=${lang}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });
  
  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || `Failed to delete user: ${response.status}`);
  }
  
  return response.json();
}
