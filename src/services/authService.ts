const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';

export interface AuthResponse {
  statusCode: number;
  message: string;
  data?: {
    user?: {
      id: string;
      name: string;
      email: string;
      phoneNo?: string;
      role?: string;
    };
    session?: {
      accessToken: string;
      refreshToken: string;
      expires_at: number;
      tokenType: string;
    };
    accessToken?: string; // Sometimes token is directly in data
    refreshToken?: string;
  };
}

/**
 * Login with identifier (email or phone) and password
 */
export async function login(identifier: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ identifier, password }),
  });
  
  const data = await res.json();
  
  if (!res.ok || data.statusCode !== 200) {
    throw new Error(data.message || 'Failed to login');
  }
  
  return data;
}

/**
 * Register new user (signup)
 */
export async function signup(data: {
  name: string;
  email: string;
  password: string;
  phoneNo?: string;
  role?: string;
}): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      ...data,
      role: data.role || 'customer' // Default to customer role
    }),
  });
  
  const responseData = await res.json();
  
  if (!res.ok || responseData.statusCode !== 200) {
    throw new Error(responseData.message || 'Failed to register');
  }
  
  return responseData;
}

/**
 * Refresh access token using refresh token
 */
export async function refreshToken(refreshToken: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  });
  
  const data = await res.json();
  
  if (!res.ok || data.statusCode !== 200) {
    throw new Error(data.message || 'Failed to refresh token');
  }
  
  return data;
}

/**
 * Request password reset email
 */
export async function forgotPassword(email: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Failed to send password reset email');
  }
  
  return data;
}

/**
 * Reset password using token from email
 */
export async function resetPassword(token: string, password: string): Promise<{ message: string }> {
  const res = await fetch(`${API_BASE_URL}/api/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ token, password }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Failed to reset password');
  }
  
  return data;
}

/**
 * Get Google OAuth URL from backend
 * The backend returns a JSON response with the Google OAuth URL
 */
export async function getGoogleOAuthUrl(redirectTo: string): Promise<{ url: string }> {
  const encodedRedirect = encodeURIComponent(redirectTo);
  const res = await fetch(`${API_BASE_URL}/api/auth/google?redirectTo=${encodedRedirect}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Failed to get Google OAuth URL');
  }
  
  // Handle different response formats
  if (data.statusCode === 200 && data.data?.url) {
    return { url: data.data.url };
  } else if (data.url) {
    return { url: data.url };
  } else if (data.data?.authUrl) {
    return { url: data.data.authUrl };
  }
  
  throw new Error('Invalid response format from server');
}

/**
 * Handle Google OAuth callback
 */
export async function handleGoogleCallback(code: string): Promise<AuthResponse> {
  const res = await fetch(`${API_BASE_URL}/api/auth/google/callback`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ code }),
  });
  
  const data = await res.json();
  
  if (!res.ok) {
    throw new Error(data.message || 'Failed to complete Google login');
  }
  
  return data;
}

/**
 * Logout user (server-side and client-side cleanup)
 */
export async function logout(token?: string) {
  try {
    // Call backend logout endpoint if token is provided
    if (token) {
      await fetch(`${API_BASE_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
    }
  } catch (error) {
    console.error('Logout error:', error);
  } finally {
    // Always clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('dalrotti_admin_token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }
  }
}
