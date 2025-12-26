"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Cookies from "js-cookie";
import Image from "next/image";

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    console.log("OAuth Callback - Processing...");
    
    // Parse hash fragment parameters (Supabase returns tokens in hash)
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
    const expiresIn = hashParams.get("expires_in");
    
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
        console.log("Decoded user from token:", decodedUser);
      } catch (e) {
        console.warn("Could not decode token:", e);
      }
    }

    console.log("URL Parameters:", {
      hasToken: !!accessToken,
      hasRefreshToken: !!refreshToken,
      providerToken: !!providerToken,
      providerRefreshToken: !!providerRefreshToken,
      expiresIn,
      userName: userName || decodedUser?.user_metadata?.full_name,
      userEmail: userEmail || decodedUser?.email,
      userId: userId || decodedUser?.sub,
      userPhone,
      error: errorParam,
      message: errorMessage
    });

    // Handle error from backend
    if (errorParam || errorMessage) {
      console.error("Authentication error:", errorParam, errorMessage);
      setError(errorMessage || errorParam || "Authentication failed");
      setProcessing(false);
      setTimeout(() => {
        router.push("/user/signin");
      }, 3000);
      return;
    }

    // Check if we have the necessary token
    if (!accessToken) {
      console.error("No access token received");
      setError("No authentication token received");
      setProcessing(false);
      setTimeout(() => {
        router.push("/user/signin");
      }, 3000);
      return;
    }

    try {
      console.log("Saving authentication data...");
      
      // Clear any existing auth data first
      try {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        localStorage.removeItem('providerToken');
        localStorage.removeItem('tokenExpiresAt');
      } catch (e) {
        console.warn("Could not clear old data:", e);
      }
      
      // Save tokens to cookies and localStorage
      Cookies.set('token', accessToken, { expires: 7, path: '/', sameSite: 'lax' });
      localStorage.setItem('token', accessToken);
      
      // Verify token was saved
      const savedToken = localStorage.getItem('token');
      if (!savedToken || savedToken !== accessToken) {
        throw new Error("Failed to save token to localStorage");
      }
      console.log("✓ Token saved and verified in cookies and localStorage");
      
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
        Cookies.set('refreshToken', refreshToken, { expires: 30, path: '/', sameSite: 'lax' });
        const savedRefresh = localStorage.getItem('refreshToken');
        if (!savedRefresh) {
          console.warn("Failed to save refresh token");
        } else {
          console.log("✓ Refresh token saved");
        }
      }
      
      // Save additional Supabase tokens if available
      if (providerToken) {
        localStorage.setItem('providerToken', providerToken);
        console.log("✓ Provider token saved");
      }
      
      if (providerRefreshToken) {
        localStorage.setItem('providerRefreshToken', providerRefreshToken);
        console.log("✓ Provider refresh token saved");
      }
      
      if (expiresAt) {
        localStorage.setItem('tokenExpiresAt', expiresAt);
        console.log("✓ Token expiry saved:", new Date(parseInt(expiresAt) * 1000).toLocaleString());
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
        const userStr = JSON.stringify(user);
        localStorage.setItem('user', userStr);
        
        // Verify user was saved
        const savedUser = localStorage.getItem('user');
        if (!savedUser) {
          console.warn("Failed to save user data");
        } else {
          console.log("✓ User data saved and verified:", user);
        }
      }
      
      // Final verification
      const finalToken = localStorage.getItem('token');
      const finalUser = localStorage.getItem('user');
      console.log("Final verification - Token exists:", !!finalToken, "User exists:", !!finalUser);
      
      setProcessing(false);
      
      // Redirect to menu or previous page
      const returnUrl = sessionStorage.getItem('google_auth_return_url') || '/user/menu';
      sessionStorage.removeItem('google_auth_return_url');
      
      console.log("✓ Authentication complete! Redirecting to:", returnUrl);
      
      setTimeout(() => {
        router.push(returnUrl);
        // Force a page reload to ensure all components pick up the new auth state
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
  }, [searchParams, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f6] to-[#f5e6e0]">
      <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100 max-w-md w-full mx-4">
        <div className="flex flex-col items-center">
          {/* Logo */}
          <div className="mb-6">
            <Image
              src="/images/logo.png"
              alt="Dal Rotti Logo"
              width={120}
              height={120}
              className="object-contain"
              priority
            />
          </div>

          {processing ? (
            <>
              {/* Loading Animation */}
              <div className="relative w-24 h-24 mb-6">
                <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-t-[#C41E3A] rounded-full animate-spin"></div>
              </div>
              
              {/* Processing Text */}
              <h1 className="text-2xl font-bold text-gray-800 mb-2">
                Completing Login
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Please wait while we set up your account...
              </p>
              
              {/* Progress Steps */}
              <div className="w-full space-y-3">
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 rounded-full bg-[#C41E3A] flex items-center justify-center text-white mr-3">
                    ✓
                  </div>
                  <span className="text-gray-700">Authenticating with Google</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 rounded-full bg-[#C41E3A] animate-pulse flex items-center justify-center text-white mr-3">
                    ⋯
                  </div>
                  <span className="text-gray-700">Saving credentials</span>
                </div>
                <div className="flex items-center text-sm">
                  <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center mr-3">
                    
                  </div>
                  <span className="text-gray-400">Redirecting to menu</span>
                </div>
              </div>
            </>
          ) : error ? (
            <>
              {/* Error Icon */}
              <div className="w-24 h-24 mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              
              {/* Error Message */}
              <h1 className="text-2xl font-bold text-red-600 mb-2">
                Login Failed
              </h1>
              <p className="text-gray-600 text-center mb-6">
                {error}
              </p>
              <p className="text-sm text-gray-500 text-center">
                Redirecting to login page...
              </p>
            </>
          ) : (
            <>
              {/* Success Icon */}
              <div className="w-24 h-24 mb-6 rounded-full bg-green-100 flex items-center justify-center">
                <svg
                  className="w-12 h-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              
              {/* Success Message */}
              <h1 className="text-2xl font-bold text-green-600 mb-2">
                Login Successful!
              </h1>
              <p className="text-gray-600 text-center mb-6">
                Welcome! Redirecting you to the menu...
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
