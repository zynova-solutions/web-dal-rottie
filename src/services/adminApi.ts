import { getCurrentLanguage } from '@/utils/apiUtils';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

export function getToken() {
  if (typeof window !== 'undefined') {
    return sessionStorage.getItem('dalrotti_admin_token');
  }
  return null;
}

async function request<RequestType, ResponseType>(
  method: string,
  path: string,
  data?: RequestType,
  customToken?: string,
  isFormData?: boolean
): Promise<ResponseType> {
  const token = customToken || getToken();
  const lang = getCurrentLanguage();
  
  // Add language parameter to URL
  const separator = path.includes('?') ? '&' : '?';
  const urlWithLang = `${API_URL}${path}${separator}lang=${lang}`;
  
  const headers: Record<string, string> = {};
  if (!isFormData) headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  const opts: RequestInit = {
    method,
    headers,
  };
  if (data) opts.body = isFormData ? (data as unknown as FormData) : JSON.stringify(data);
  const res = await fetch(urlWithLang, opts);
  const resData = await res.json();
  if (!res.ok) throw new Error(resData?.error?.message || 'API error');
  return resData;
}

// Updated `adminGet` to infer response type
export function adminGet<ResponseType>(path: string, customToken?: string): Promise<{ data: ResponseType }> {
  return request<undefined, { data: ResponseType }>('GET', path, undefined, customToken);
}

// Updated `adminPost` to include both type arguments
export function adminPost<RequestType, ResponseType>(
  path: string,
  data?: RequestType,
  customToken?: string,
  isFormData?: boolean
): Promise<ResponseType> {
  return request<RequestType, ResponseType>('POST', path, data, customToken, isFormData);
}

// Updated `adminPut` to include both type arguments and support FormData
export function adminPut<RequestType, ResponseType>(
  path: string,
  data?: RequestType,
  customToken?: string,
  isFormData?: boolean
): Promise<ResponseType> {
  return request<RequestType, ResponseType>('PUT', path, data, customToken, isFormData);
}

// Updated `adminDelete` to include both type arguments
export function adminDelete<ResponseType>(path: string, customToken?: string): Promise<ResponseType> {
  return request<undefined, ResponseType>('DELETE', path, undefined, customToken);
}

// Updated `AdminLoginResponse` to match the actual response structure
interface AdminLoginResponse {
  message: string;
  data: {
    user: {
      id: string;
      email: string;
      name: string;
      phoneNo: string;
      role: string;
    };
    session: {
      accessToken: string;
      refreshToken: string;
      expires_at: number;
      tokenType: string;
    };
  };
}

interface AdminLoginRequest {
  identifier: string;
  password: string;
}

// Simplified the generic type for `adminPost` in `adminLogin`
export async function adminLogin(identifier: string, password: string): Promise<AdminLoginResponse['data']> {
  const response = await adminPost<AdminLoginRequest, AdminLoginResponse>(
    '/api/auth/login',
    { identifier, password } as AdminLoginRequest
  );
  if (response.message !== 'Login successful') {
    throw new Error('Invalid email or password');
  }
  return response.data;
}

// Add more admin API methods here as needed
