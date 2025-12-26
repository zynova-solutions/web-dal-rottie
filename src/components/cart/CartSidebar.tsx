import React from 'react';
import { useCart } from './CartContext';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const CartSidebar: React.FC<{ open: boolean; onClose: () => void }> = ({ open, onClose }) => {
  const { cart, updateItem, removeItem, clearCart } = useCart();
  const router = useRouter();

  if (!open) return null;

  return (
  <div className="fixed right-0 top-0 w-full max-w-[370px] h-full bg-gradient-to-br from-[#fff8f6] via-[#f7eaea] to-[#ffe5e5] shadow-2xl z-50 flex flex-col border-l border-[#e7e0d2] md:w-[370px]">
    <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-[#e7e0d2] bg-white/80 backdrop-blur">
      <h2 className="text-xl font-bold text-[#7a1313] tracking-tight">Your Cart</h2>
      <button className="text-xl text-gray-400 hover:text-[#7a1313] font-bold" onClick={onClose} aria-label="Close">&times;</button>
    </div>
  <div className="flex-1 overflow-y-auto px-4 py-3 md:px-6 md:py-4">
        {cart.items.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <svg width="60" height="60" fill="none" viewBox="0 0 24 24" className="mb-2">
              <path d="M6 6h15l-1.5 9h-13z" stroke="#7a1313" strokeWidth="2.5" fill="#fff" />
              <circle cx="9" cy="21" r="2" fill="#7a1313" />
              <circle cx="18" cy="21" r="2" fill="#7a1313" />
            </svg>
            <p className="text-base font-medium">Your cart is empty.</p>
          </div>
        ) : (
          <ul className="space-y-3 md:space-y-4">
            {cart.items.map(item => (
              <li key={item.id} className="flex items-center bg-white rounded-lg shadow p-2 md:p-3 border border-[#e7e0d2] hover:scale-[1.01] transition-transform">
                {item.image && (
                  <Image src={item.image} alt={item.name} width={64} height={64} className="rounded-md object-cover mr-3 md:mr-4 border border-[#7a1313] bg-white w-16 h-16" loading="lazy" priority={false} />
                )}
                <div className="flex-1 min-w-0">
                  <div className="font-bold text-[#4a2c0a] text-sm md:text-base mb-0.5 truncate">{item.name}</div>
                  <div className="text-[#7a1313] font-semibold mb-1">€{item.price.toFixed(2)}</div>
                  <div className="flex items-center gap-1 md:gap-2">
                    <button onClick={() => updateItem(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-base font-bold text-[#7a1313] bg-white hover:bg-[#ffe5e5]">-</button>
                    <span className="px-2 font-bold text-base">{item.quantity}</span>
                    <button onClick={() => updateItem(item.id, item.quantity + 1)} className="w-7 h-7 rounded-full border border-gray-300 flex items-center justify-center text-base font-bold text-[#7a1313] bg-white hover:bg-[#ffe5e5]">+</button>
                  </div>
                </div>
                <button onClick={() => removeItem(item.id)} className="ml-2 text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-md transition text-xs">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {cart.items.length > 0 && (
        <div className="px-4 py-3 md:px-6 md:py-4 border-t border-[#e7e0d2] bg-white/80 backdrop-blur space-y-2">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-base text-[#4a2c0a]">Total:</span>
            <span className="font-extrabold text-lg text-[#7a1313]">
              €{cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
            </span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => {
                onClose();
                router.push('/user/checkout');
              }}
              className="flex-1 bg-[#7a1313] text-white font-bold py-2 rounded-md shadow hover:bg-[#4a2c0a] transition"
            >
              Checkout
            </button>
            <button 
              onClick={() => {
                onClose();
                router.push('/user/cart');
              }}
              className="flex-1 bg-gray-700 text-white font-bold py-2 rounded-md shadow hover:bg-gray-800 transition"
            >
              View Cart
            </button>
          </div>
          <button 
            onClick={clearCart} 
            className="w-full bg-gray-500 text-white font-bold py-1.5 rounded-md shadow hover:bg-gray-600 transition text-sm"
          >
            Clear Cart
          </button>
        </div>
      )}
    </div>
  );
};

export default CartSidebar;
