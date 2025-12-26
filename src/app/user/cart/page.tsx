"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '../../../components/cart/CartContext';
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import UserHeader from '@/components/layout/UserHeader';

export default function CartPage() {
  const { cart, updateItem, removeItem } = useCart();

  const subtotal = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 25 ? 0 : 2.99;
  const total = subtotal + deliveryFee;

  const handleQuantityChange = (id: string, currentQuantity: number, change: number) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateItem(id, newQuantity);
    }
  };

  const handleRemove = (id: string) => {
    if (confirm('Remove this item from cart?')) {
      removeItem(id);
    }
  };

  if (cart.items.length === 0) {
    return (
      <>
        <UserHeader />
        <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10 px-4 py-16 flex items-center justify-center">
          <div className="text-center max-w-md">
            <FaShoppingCart className="text-6xl text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-8">Looks like you haven't added any items to your cart yet.</p>
            <Link href="/user/menu">
              <button className="btn btn-primary px-6 sm:px-8 py-3 text-base sm:text-lg">
                Browse Menu
              </button>
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <UserHeader />
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-primary/10">
        {/* Page Header */}
        <div className="bg-white shadow-md border-b border-gray-200">
          <div className="container mx-auto px-4 py-4 sm:py-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <h1 className="text-2xl sm:text-3xl font-bold text-primary">Your Cart</h1>
              <Link href="/user/menu" className="text-sm text-gray-600 hover:text-primary transition self-start sm:self-auto">
                ← Continue Shopping
              </Link>
            </div>
          </div>
        </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.items.map((item) => (
              <div key={item.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition p-4 md:p-6 border border-gray-200">
                <div className="flex gap-4">
                  {/* Item Image */}
                  <div className="flex-shrink-0">
                    <Image 
                      src={item.image || '/images/logo.png'} 
                      alt={item.name} 
                      width={100} 
                      height={100} 
                      className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200" 
                    />
                  </div>

                  {/* Item Details */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900">{item.name}</h3>
                      <p className="text-primary font-semibold text-lg mt-1">€{item.price.toFixed(2)}</p>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, -1)}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition"
                        aria-label="Decrease quantity"
                      >
                        <FaMinus className="text-sm" />
                      </button>
                      
                      <span className="font-bold text-lg w-8 text-center">{item.quantity}</span>
                      
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity, 1)}
                        className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center hover:border-primary hover:bg-primary hover:text-white transition"
                        aria-label="Increase quantity"
                      >
                        <FaPlus className="text-sm" />
                      </button>
                    </div>
                  </div>

                  {/* Item Total & Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="font-bold text-xl text-gray-900">
                      €{(item.price * item.quantity).toFixed(2)}
                    </p>
                    
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="text-red-500 hover:text-red-700 transition flex items-center gap-1 text-sm"
                      aria-label="Remove item"
                    >
                      <FaTrash /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 sticky top-8">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-3">Order Summary</h2>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal ({cart.items.length} items)</span>
                  <span className="font-semibold">€{subtotal.toFixed(2)}</span>
                </div>
                
                <div className="flex justify-between text-gray-700">
                  <span>Delivery Fee</span>
                  <span className="font-semibold">
                    {deliveryFee === 0 ? (
                      <span className="text-green-600">FREE</span>
                    ) : (
                      `€${deliveryFee.toFixed(2)}`
                    )}
                  </span>
                </div>

                {subtotal < 25 && subtotal > 0 && (
                  <div className="text-xs text-amber-600 bg-amber-50 p-2 rounded">
                    Add €{(25 - subtotal).toFixed(2)} more for free delivery!
                  </div>
                )}
                
                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span className="text-primary">€{total.toFixed(2)}</span>
                </div>
              </div>

              <Link href="/user/checkout">
                <button className="w-full btn btn-primary py-4 text-lg shadow-lg">
                  Proceed to Checkout
                </button>
              </Link>

              <Link href="/user/menu">
                <button className="w-full mt-3 border-2 border-gray-300 text-gray-700 hover:border-primary hover:bg-primary hover:text-white transition py-3 rounded-lg font-semibold">
                  Add More Items
                </button>
              </Link>

              {/* Trust Badges */}
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>Secure Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>30-45 min delivery</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
