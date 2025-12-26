"use client";

import React, { useState } from "react";
import { FaCheckCircle, FaGift, FaStar, FaTags, FaEnvelope, FaLock, FaUser, FaPhone } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { login, signup } from "@/services/authService";

export default function SignInPage() {
  const router = useRouter();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNo: ""
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError("");
  };

  const handleGoogleSignIn = () => {
    setGoogleLoading(true);
    setError("");
    
    try {
      // Save return URL to session storage
      const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
      if (returnUrl) {
        sessionStorage.setItem('google_auth_return_url', returnUrl);
      }
      
      // Build the callback URL - where the backend should redirect after Google auth
      const baseUrl = window.location.origin;
      const callbackUrl = `${baseUrl}/user/auth/google/callback`;
      const encodedCallback = encodeURIComponent(callbackUrl);
      
      // Directly redirect to backend Google OAuth endpoint
      // The backend will redirect to Google's OAuth consent screen
      const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || 'http://localhost:4000';
      const googleAuthUrl = `${API_BASE_URL}/api/auth/google?redirectTo=${encodedCallback}`;
      
      console.log("Redirecting to Google OAuth via backend:", googleAuthUrl);
      window.location.href = googleAuthUrl;
    } catch (err) {
      console.error("Google login error:", err);
      setError(err instanceof Error ? err.message : "Failed to initiate Google login");
      setGoogleLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      setError("Please enter email/phone and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Use email as identifier (backend accepts email or phone)
      const response = await login(formData.email, formData.password);
      
      if (response.statusCode === 200 && response.data) {
        // Extract token from either session.accessToken or direct accessToken
        const accessToken = response.data.session?.accessToken || response.data.accessToken;
        
        if (!accessToken) {
          setError("Login successful but no token received. Please try again.");
          return;
        }
        
        // Save tokens to cookies and localStorage
        Cookies.set('token', accessToken, { expires: 7 });
        localStorage.setItem('token', accessToken);
        
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        
        setSuccess(true);
        
        // Redirect to cart or previous page after 1.5 seconds
        setTimeout(() => {
          const returnUrl = new URLSearchParams(window.location.search).get('returnUrl');
          router.push(returnUrl || '/user/menu');
        }, 1500);
      } else {
        setError(response.message || "Login failed");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err instanceof Error ? err.message : "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.password) {
      setError("Please fill in all required fields");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        phoneNo: formData.phoneNo || undefined,
        role: 'customer'
      });
      
      if (response.statusCode === 200) {
        // Show success message about email confirmation
        alert(response.message || 'Signup successful! Please check your email to confirm your account before logging in.');
        
        // Switch to login mode so user can login after confirming email
        setMode('login');
        setFormData({
          name: "",
          email: formData.email, // Keep email filled for convenience
          password: "",
          phoneNo: ""
        });
        setError("");
      } else {
        setError(response.message || "Signup failed");
      }
    } catch (err) {
      console.error("Signup error:", err);
      setError(err instanceof Error ? err.message : "Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#fff8f6] to-[#f5e6e0]">
      <div className="w-full max-w-md mx-4">
        {/* Logo */}
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Dal Rotti Logo"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full shadow-lg border-4 border-white mb-4"
          />
          <h1 className="text-3xl font-extrabold text-[#7a1313]">Dal Rotti</h1>
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-gray-100">
          {success ? (
            /* Success State */
            <div className="text-center py-8">
              <div className="bg-green-50 rounded-full p-6 w-24 h-24 mx-auto mb-4 flex items-center justify-center">
                <FaCheckCircle className="text-5xl text-green-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
              <p className="text-gray-600">Redirecting you...</p>
            </div>
          ) : (
            <>
              {/* Tabs */}
              <div className="flex mb-8 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => {
                    setMode('login');
                    setError("");
                  }}
                  className={`flex-1 py-3 rounded-md font-semibold transition ${
                    mode === 'login'
                      ? 'bg-white text-[#7a1313] shadow-md'
                      : 'text-gray-600 hover:text-[#7a1313]'
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    setMode('signup');
                    setError("");
                  }}
                  className={`flex-1 py-3 rounded-md font-semibold transition ${
                    mode === 'signup'
                      ? 'bg-white text-[#7a1313] shadow-md'
                      : 'text-gray-600 hover:text-[#7a1313]'
                  }`}
                >
                  Sign Up
                </button>
              </div>

              {/* Login Form */}
              {mode === 'login' && (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email or Phone Number
                    </label>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313] focus:border-transparent"
                      placeholder="your@email.com or +49123456789"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaLock className="inline mr-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313] focus:border-transparent"
                      placeholder="••••••••"
                      required
                    />
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#7a1313] to-[#4a2c0a] hover:from-[#a31e1e] hover:to-[#5a3c1a] text-white font-bold py-3 rounded-lg shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Signing in...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* Google Sign-In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg shadow-md border border-gray-300 transition disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {googleLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        Connecting to Google...
                      </>
                    ) : (
                      <>
                        <FcGoogle className="text-2xl" />
                        Sign in with Google
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Signup Form */}
              {mode === 'signup' && (
                <form onSubmit={handleSignup} className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaUser className="inline mr-2" />
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313] focus:border-transparent"
                      placeholder="John Doe"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaEnvelope className="inline mr-2" />
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313] focus:border-transparent"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaPhone className="inline mr-2" />
                      Phone (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phoneNo"
                      value={formData.phoneNo}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313] focus:border-transparent"
                      placeholder="+49 123 456 7890"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      <FaLock className="inline mr-2" />
                      Password
                    </label>
                    <input
                      type="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7a1313] focus:border-transparent"
                      placeholder="••••••••"
                      required
                      minLength={6}
                    />
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters</p>
                  </div>

                  {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gradient-to-r from-[#7a1313] to-[#4a2c0a] hover:from-[#a31e1e] hover:to-[#5a3c1a] text-white font-bold py-3 rounded-lg shadow-lg transition disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Creating account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </button>

                  {/* Divider */}
                  <div className="relative flex items-center my-4">
                    <div className="flex-grow border-t border-gray-300"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm">or</span>
                    <div className="flex-grow border-t border-gray-300"></div>
                  </div>

                  {/* Google Sign-In Button */}
                  <button
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={googleLoading || loading}
                    className="w-full bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 rounded-lg shadow-md border border-gray-300 transition disabled:opacity-50 flex items-center justify-center gap-3"
                  >
                    {googleLoading ? (
                      <>
                        <span className="w-5 h-5 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                        Connecting to Google...
                      </>
                    ) : (
                      <>
                        <FcGoogle className="text-2xl" />
                        Sign up with Google
                      </>
                    )}
                  </button>
                </form>
              )}

              {/* Rewards Benefits */}
              <div className="mt-8 pt-6 border-t border-gray-200">
                <h3 className="font-bold text-gray-900 mb-4 text-center">Rewards Benefits</h3>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <FaStar className="text-2xl text-[#d4af37] mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Earn points with every order</p>
                  </div>
                  <div>
                    <FaTags className="text-2xl text-[#7a1313] mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Get exclusive deals</p>
                  </div>
                  <div>
                    <FaGift className="text-2xl text-[#7a1313] mx-auto mb-2" />
                    <p className="text-xs text-gray-600">Redeem points for discounts</p>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/user/menu')}
            className="text-sm text-gray-600 hover:text-[#7a1313] font-medium"
          >
            ← Back to Menu
          </button>
        </div>
      </div>
    </div>
  );
}
