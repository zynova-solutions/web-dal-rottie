"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FaExclamationTriangle, FaTimes } from "react-icons/fa";
import Image from "next/image";
import Link from "next/link";
import { getRetryStatus } from "@/services/orderApi";

export default function PaymentFailedPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);
  const [canRetry, setCanRetry] = useState(true);
  const [remainingAttempts, setRemainingAttempts] = useState(3);
  const [isLoading, setIsLoading] = useState(true);
  
  const paymentId = searchParams.get('paymentId');
  const reason = searchParams.get('reason');
  const errorMessage = searchParams.get('message');

  // Friendly error messages mapping
  const friendlyMessages: Record<string, string> = {
    'card_declined': 'Your card was declined. Please try a different card or payment method.',
    'insufficient_funds': 'Insufficient funds in your account. Please use a card with sufficient balance.',
    'expired_card': 'Your card has expired. Please use a valid card.',
    'invalid_card': 'Invalid card details. Please check your card information and try again.',
    'user_cancelled': 'Payment was cancelled. You can try again when you\'re ready.',
    'fraud_suspected': 'Transaction flagged for security review. Please contact your bank.',
    'processing_error': 'Payment processing error occurred. Please try again in a few moments.',
    'network_error': 'Network error occurred. Please check your internet connection.',
  };

  const getFriendlyMessage = (declineCode: string | null): string => {
    if (!declineCode) return 'Payment failed. Please try again.';
    return friendlyMessages[declineCode] || 'Payment failed. Please try again.';
  };

  useEffect(() => {
    // Check retry eligibility if we have a payment ID
    if (paymentId) {
      getRetryStatus(paymentId)
        .then(data => {
          setCanRetry(data.canRetry || false);
          setRemainingAttempts(data.remainingAttempts || 0);
        })
        .catch(err => {
          console.error('Error checking retry status:', err);
          // Default to allowing retry if check fails
          setCanRetry(true);
          setRemainingAttempts(3);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    if (!isLoading && canRetry) {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            // Redirect to checkout after countdown
            router.push(`/user/checkout${paymentId ? `?retryPaymentId=${paymentId}` : ''}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [router, isLoading, canRetry, paymentId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center p-4">
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

        {/* Failure Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 text-center">
          <div className="bg-red-100 rounded-full p-6 w-24 h-24 mx-auto mb-6 flex items-center justify-center">
            <FaTimes className="text-6xl text-red-600" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Failed
          </h1>
          
          <p className="text-gray-600 mb-6">
            {getFriendlyMessage(reason)}
          </p>

          {!canRetry && (
            <div className="bg-red-50 border-2 border-red-300 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0 text-xl" />
                <div className="text-left">
                  <p className="text-sm font-bold text-red-800 mb-1">Maximum Retry Limit Reached</p>
                  <p className="text-sm text-red-700">
                    You've exceeded the maximum number of retry attempts (3). 
                    Please contact our support team for assistance or try a different payment method.
                  </p>
                </div>
              </div>
            </div>
          )}

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-2">
                <FaExclamationTriangle className="text-red-600 mt-1 flex-shrink-0" />
                <div className="text-left">
                  <p className="text-sm font-semibold text-red-800 mb-1">Error Details</p>
                  <p className="text-sm text-red-700">{errorMessage}</p>
                </div>
              </div>
            </div>
          )}

          {reason && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Reason</p>
              <p className="text-sm font-medium text-gray-900">{reason}</p>
            </div>
          )}

          {paymentId && (
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-1">Reference ID</p>
              <p className="text-sm font-mono text-gray-900">{paymentId}</p>
            </div>
          )}

          <div className="border-t border-gray-200 pt-6 mb-6">
            <h3 className="font-semibold text-gray-900 mb-3">Common reasons for payment failure:</h3>
            <ul className="text-sm text-gray-600 text-left space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Insufficient funds in your account</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Incorrect card details or expired card</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Payment declined by your bank</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-red-500 mt-0.5">•</span>
                <span>Network or connection issues</span>
              </li>
            </ul>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-blue-800">
              <strong>Don't worry!</strong> Your cart items are still saved. You can try again with a different payment method.
            </p>
          </div>

          <div className="flex flex-col gap-3">
            {canRetry ? (
              <>
                <Link
                  href={paymentId ? `/user/checkout?retryPaymentId=${paymentId}` : '/user/checkout'}
                  className="w-full bg-gradient-to-r from-[#7a1313] to-[#4a2c0a] hover:from-[#a31e1e] hover:to-[#5a3c1a] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
                >
                  Try Again ({countdown}s) - {remainingAttempts} attempt{remainingAttempts !== 1 ? 's' : ''} left
                </Link>
                
                <Link
                  href="/user/menu"
                  className="w-full border-2 border-[#7a1313] text-[#7a1313] hover:bg-[#7a1313] hover:text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Back to Menu
                </Link>

                <Link
                  href="/user/cart"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-100 font-semibold py-3 px-6 rounded-lg transition"
                >
                  View Cart
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/user/contact?reason=payment-retry-limit"
                  className="w-full bg-gradient-to-r from-[#7a1313] to-[#4a2c0a] hover:from-[#a31e1e] hover:to-[#5a3c1a] text-white font-bold py-3 px-6 rounded-lg shadow-lg transition"
                >
                  Contact Support
                </Link>
                
                <Link
                  href="/user/menu"
                  className="w-full border-2 border-[#7a1313] text-[#7a1313] hover:bg-[#7a1313] hover:text-white font-semibold py-3 px-6 rounded-lg transition"
                >
                  Back to Menu
                </Link>
              </>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-6">
            Need help? <Link href="/user/contact" className="text-[#7a1313] hover:underline">Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
