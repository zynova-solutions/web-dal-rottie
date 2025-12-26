import { adminDelete } from './adminApi';

export interface CategoryDeleteResponse {
  statusCode: number;
  message: string;
}

/**
 * Delete a category
 * Endpoint: DELETE /api/categories/delete/:id
 */
export async function deleteCategory(id: number | string): Promise<CategoryDeleteResponse> {
  return adminDelete<CategoryDeleteResponse>(`/api/categories/delete/${id}`);
}
