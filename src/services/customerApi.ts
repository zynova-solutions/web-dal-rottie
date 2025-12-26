import { adminGet } from './adminApi';

export async function getAllCustomers() {
  // This will use the admin token/session automatically
  return adminGet('/api/users/all');
}
