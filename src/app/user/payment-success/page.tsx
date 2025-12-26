"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { CART_KEY } from "@/components/cart/CartContext";

export default function PaymentSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(5);
  const { setCart } = useCart();
  
  const paymentId = searchParams.get('paymentId');
  const orderId = searchParams.get('orderId');

  useEffect(() => {
    // Clear cart on payment success
    setCart({ items: [] });
    localStorage.removeItem(CART_KEY);
    
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to menu after countdown
          router.push('/user/menu');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, setCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo.png"
            alt="Dal Rotti Logo"
            width={80}
            height={80}
            className="w-20 h-20 rounded-full shadow-lg border-4 border-white"
          />
        </div>

        {/* Success Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-green-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FaCheckCircle className="text-6xl text-green-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          
          <p className="text-gray-600 mb-6">
            Your order has been placed successfully. We'll start preparing it right away!
          </p>

          {paymentId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Payment ID</p>
              <p className="text-sm font-mono text-gray-900">{paymentId}</p>
            </div>
          )}

          {orderId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-sm font-mono text-gray-900">{orderId}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mb-6">
            <p className="text-gray-700 mb-4">
              You will receive an email confirmation shortly with your order details.
            </p>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 text-sm">
              <FaSpinner className="animate-spin" />
              <span>Redirecting to menu in {countdown} seconds...</span>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href="/user/menu"
              className="w-full bg-gradient-to-r from-[#7a1313] to-[#4a2c0a] hover:from-[#a31e1e] hover:to-[#5a3c1a] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
            >
              Continue Shopping
            </Link>
            
            <Link
              href="/user/signin?returnUrl=/user/orders"
              className="w-full border-2 border-[#7a1313] text-[#7a1313] hover:bg-[#7a1313] hover:text-white font-semibold py-3 px-6 rounded-lg transition"
            >
              View Order Status (Sign In)
            </Link>
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Need help? <Link href="/user/contact" className="text-[#7a1313] hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
