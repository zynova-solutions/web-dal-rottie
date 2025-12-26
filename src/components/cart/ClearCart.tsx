import { useEffect } from 'react';
import { CART_KEY } from './CartContext';

// Component to clear cart on mount
export default function ClearCart() {
  useEffect(() => {
    console.log('ClearCart component mounted - clearing localStorage cart');
    try {
      localStorage.removeItem(CART_KEY);
      console.log(`Cleared ${CART_KEY} from localStorage`);
    } catch (e) {
      console.error('Error clearing localStorage:', e);
    }
  }, []);

  return null; // This component doesn't render anything
}