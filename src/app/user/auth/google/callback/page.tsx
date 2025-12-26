"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(true);
  const [mounted, setMounted] = useState(false);

  // Ensure component is mounted client-side before accessing window
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Check if we have hash parameters that need to be converted to query params
    const hash = window.location.hash.substring(1);
    
    if (hash && hash.includes('access_token')) {
      // Convert hash parameters to query parameters for better server compatibility
      const newUrl = window.location.pathname + '?' + hash;
      window.history.replaceState(null, '', newUrl);
      // Reload to process with query parameters
      window.location.reload();
      return;
    }
    
    // Parse parameters from query string (converted from hash above)
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    
    // Get parameters from URL - support both hash and query params
    const accessToken = hashParams.get("access_token") ||
                       searchParams.get("accessToken") || 
                       searchParams.get("access_token") || 
                       searchParams.get("token");
    const refreshToken = hashParams.get("refresh_token") ||
                        searchParams.get("refreshToken") || 
                        searchParams.get("refresh_token");
    const providerToken = hashParams.get("provider_token");
    const providerRefreshToken = hashParams.get("provider_refresh_token");
    const expiresAt = hashParams.get("expires_at");
    const tokenType = hashParams.get("token_type");
    
    // Try to get user info from search params or decode from token
    const userName = searchParams.get("name") || searchParams.get("userName");
    const userEmail = searchParams.get("email") || searchParams.get("userEmail");
    const userId = searchParams.get("userId") || 
                  searchParams.get("id") || 
                  searchParams.get("user_id");
    const userPhone = searchParams.get("phoneNo") || 
                     searchParams.get("phone") || 
                     searchParams.get("phoneNumber");
    const userRole = searchParams.get("role") || 'customer';
    const errorParam = hashParams.get("error") || searchParams.get("error");
    const errorMessage = hashParams.get("error_description") || searchParams.get("message");

    // Decode JWT to get user info
    let decodedUser = null;
    if (accessToken) {
      try {
        const base64Url = accessToken.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        decodedUser = JSON.parse(jsonPayload);
      } catch (e) {
        console.error("Could not decode token:", e);
      }
    }

    // Handle error from backend
    if (errorParam || errorMessage) {
      console.error("Authentication error:", errorParam, errorMessage);
      setError(errorMessage || errorParam || "Google authentication failed");
      setProcessing(false);
      setTimeout(() => {
        router.push("/user/signin");
      }, 3000);
      return;
    }

    // Check if we have the necessary token
    if (!accessToken) {
      console.error("No access token received");
      setError("No authentication token received from Google");
      setProcessing(false);
      setTimeout(() => {
        router.push("/user/signin");
      }, 3000);
      return;
    }

    try {
      // Clear any existing auth data first
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      localStorage.removeItem('providerToken');
      localStorage.removeItem('tokenExpiresAt');
      
      // Determine environment for proper cookie configuration
      const isProduction = window.location.protocol === 'https:';
      const isDalRotti = window.location.hostname.includes('dalrotti.com');
      
      const cookieOptions = {
        expires: 7,
        path: '/',
        sameSite: 'lax' as const,
        secure: isProduction,
        ...(isDalRotti && isProduction ? { domain: '.dalrotti.com' } : {})
      };
      
      const refreshCookieOptions = {
        expires: 30,
        path: '/',
        sameSite: 'lax' as const,
        secure: isProduction,
        ...(isDalRotti && isProduction ? { domain: '.dalrotti.com' } : {})
      };
      
      // Save tokens to cookies and localStorage
      Cookies.set('token', accessToken, cookieOptions);
      localStorage.setItem('token', accessToken);
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        Cookies.set('refreshToken', refreshToken, refreshCookieOptions);
      }
      
      // Save additional tokens if available
      if (providerToken) {
        localStorage.setItem('providerToken', providerToken);
      }
      
      if (providerRefreshToken) {
        localStorage.setItem('providerRefreshToken', providerRefreshToken);
      }
      
      if (expiresAt) {
        localStorage.setItem('tokenExpiresAt', expiresAt);
      }
      
      if (tokenType) {
        localStorage.setItem('tokenType', tokenType);
      }
      
      // Save user info from decoded token or params
      const finalUserName = userName || decodedUser?.user_metadata?.full_name || decodedUser?.user_metadata?.name || '';
      const finalUserEmail = userEmail || decodedUser?.email || decodedUser?.user_metadata?.email || '';
      const finalUserId = userId || decodedUser?.sub || '';
      const finalUserPhone = userPhone || decodedUser?.user_metadata?.phone || '';
      const userAvatar = decodedUser?.user_metadata?.avatar_url || decodedUser?.user_metadata?.picture || '';
      
      if (finalUserName || finalUserEmail) {
        const user = {
          id: finalUserId,
          name: finalUserName,
          email: finalUserEmail,
          phoneNo: finalUserPhone,
          role: userRole,
          avatar: userAvatar
        };
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      setProcessing(false);
      
      // Redirect to menu or previous page
      const returnUrl = sessionStorage.getItem('google_auth_return_url') || '/user/menu';
      sessionStorage.removeItem('google_auth_return_url');
      
      setTimeout(() => {
        window.location.href = returnUrl;
      }, 1000);
    } catch (err) {
      console.error("Error saving authentication data:", err);
      setError("Failed to save login credentials. Please try again.");
      setProcessing(false);
      setTimeout(() => {
        router.push("/user/signin");
      }, 3000);
    }
  }, [searchParams, router, mounted]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f6] to-[#f5e6e0]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          <Image
            src="/images/logo.png"
            alt="Dal Rotti Logo"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full shadow-lg border-4 border-white mb-4"
          />
          <h1 className="text-2xl font-bold text-[#7a1313] mb-4">
            {processing ? "Completing Sign In..." : error ? "Sign In Failed" : "Success!"}
          </h1>
          
          {processing && (
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-[#7a1313] border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-gray-600 text-center">
                Please wait while we complete your Google sign in...
              </p>
            </div>
          )}
          
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4 text-center">
              {error}
            </div>
          )}
          
          {!processing && !error && (
            <div className="flex flex-col items-center">
              <div className="bg-green-50 rounded-full p-4 w-16 h-16 mb-4 flex items-center justify-center">
                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-gray-600 text-center text-sm">
                Successfully signed in! Redirecting...
              </p>
            </div>
          )}
          
          {error && (
            <p className="text-gray-500 text-center text-sm mt-2">
              Redirecting to sign in page...
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
