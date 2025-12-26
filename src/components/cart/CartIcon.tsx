import React from 'react';
import { useCart } from './CartContext';

const CartIcon: React.FC<{ onClick: () => void }> = ({ onClick }) => {
  const { cart } = useCart();
  const itemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <button onClick={onClick} className="relative">
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24">
        <path d="M6 6h15l-1.5 9h-13z" stroke="#333" strokeWidth="2" fill="#fff" />
        <circle cx="9" cy="21" r="1.5" fill="#333" />
        <circle cx="18" cy="21" r="1.5" fill="#333" />
      </svg>
      {itemCount > 0 && (
        <span className="absolute top-0 right-0 bg-red-500 text-white rounded-full px-2 text-xs">
          {itemCount}
        </span>
      )}
    </button>
  );
};

export default CartIcon;
