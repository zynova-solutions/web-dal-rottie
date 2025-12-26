import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import {
  addOrUpdateCart,
  getCart,
  clearCart as clearCartApi,
  removeCartItem,
} from '../../services/cartService';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

export type CartState = {
  items: CartItem[];
};

// Define a type for backend cart items
export type BackendCartItem = {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
};

const defaultContextValue = {
  cart: { items: [] },
  addItem: () => {},
  updateItem: () => {},
  removeItem: () => {},
  clearCart: () => {},
  setCart: () => {}, // Added setCart to the default context value
};

const CartContext = createContext<{
  cart: CartState;
  addItem: (item: CartItem) => void;
  updateItem: (id: string, quantity: number) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  setCart: React.Dispatch<React.SetStateAction<CartState>>; // Added setCart to the context type
}>(defaultContextValue);

// Export this so other components can use the same key
export const CART_KEY = 'dal_rotti_cart';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Try to initialize from localStorage immediately to prevent flicker
  const getInitialCart = (): CartState => {
    if (typeof window !== 'undefined') {
      try {
        // Check for a logged-in user
        const token = Cookies.get('token') || localStorage.getItem('token');
        if (!token) {
          // For guest users, load from localStorage
          const stored = localStorage.getItem(CART_KEY);
          if (stored) {
            try {
              const parsedCart = JSON.parse(stored);
              // Validate the data structure
              if (parsedCart && parsedCart.items) {
                return parsedCart;
              }
            } catch {
              // Silent error
            }
          }
        }
      } catch {
        // Silent error
      }
    }
    return { items: [] };
  };

  // Initialize cart from localStorage if available
  const [cart, setCart] = useState<CartState>(getInitialCart());
  const [token, setToken] = useState<string | null>(null);

  // Initialize cart on mount - only run once
  useEffect(() => {
    // Check for token (from cookies or localStorage)
    const t = Cookies.get('token') || localStorage.getItem('token');
    setToken(t || null);
    
    if (t) {
      // Logged in: fetch cart from backend
      getCart(t)
        .then(data => {
          // Map backend cart to CartState
          const items = (data.items || []).map((item: BackendCartItem) => ({
            id: item.dishId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            image: item.image,
          }));
          setCart({ items });
        })
        .catch(() => {
          setCart({ items: [] });
        });
    } else {
      // Guest: load cart from localStorage
      try {
        const stored = localStorage.getItem(CART_KEY);
        if (stored) {
          try {
            const parsedCart = JSON.parse(stored);
            // Only set the cart if there are actually items
            if (parsedCart && parsedCart.items && parsedCart.items.length > 0) {
              setCart(parsedCart);
            } else {
              setCart({ items: [] });
            }
          } catch {
            setCart({ items: [] });
          }
        } else {
          setCart({ items: [] });
        }
      } catch {
        setCart({ items: [] });
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes (for guest users)
  useEffect(() => {
    if (!token) {
      // Only save to localStorage if there are actually items in the cart
      if (cart.items.length > 0) {
        try {
          localStorage.setItem(CART_KEY, JSON.stringify(cart));
        } catch {
          // Silent error
        }
      } else {
        try {
          localStorage.removeItem(CART_KEY);
        } catch {
          // Silent error
        }
      }
    }
  }, [cart, token]);

  const addItem = async (item: CartItem) => {
    if (token) {
      try {
        // Optimistically update UI first
        setCart(prev => {
          const existing = prev.items.find(i => i.id === item.id);
          if (existing) {
            return {
              items: prev.items.map(i =>
                i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...prev.items, item] };
        });

        // Then sync with backend
        await addOrUpdateCart(item.id, item.quantity, token);
        
        // Refresh cart from backend to ensure consistency
        const data = await getCart(token);
        const items = (data.items || []).map((i: BackendCartItem) => ({
          id: i.dishId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        }));
        setCart({ items });
      } catch (error) {
        console.error('Failed to add item to cart:', error);
        // On error, try to refresh from backend to stay in sync
        try {
          const data = await getCart(token);
          const items = (data.items || []).map((i: BackendCartItem) => ({
            id: i.dishId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          }));
          setCart({ items });
        } catch (refreshError) {
          // If even refresh fails, keep the optimistic update
          console.error('Failed to refresh cart:', refreshError);
        }
      }
    } else {
      setCart(prev => {
        const existing = prev.items.find(i => i.id === item.id);
        if (existing) {
          return {
            items: prev.items.map(i =>
              i.id === item.id ? { ...i, quantity: i.quantity + item.quantity } : i
            ),
          };
        }
        return { items: [...prev.items, item] };
      });
    }
  };

  const updateItem = async (id: string, quantity: number) => {
    if (token) {
      try {
        // Optimistically update UI
        setCart(prev => ({
          items: prev.items.map(i => (i.id === id ? { ...i, quantity } : i)),
        }));

        // Sync with backend
        await addOrUpdateCart(id, quantity, token);
        
        // Refresh from backend
        const data = await getCart(token);
        const items = (data.items || []).map((i: BackendCartItem) => ({
          id: i.dishId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        }));
        setCart({ items });
      } catch (error) {
        console.error('Failed to update cart item:', error);
        // Try to refresh from backend
        try {
          const data = await getCart(token);
          const items = (data.items || []).map((i: BackendCartItem) => ({
            id: i.dishId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          }));
          setCart({ items });
        } catch (refreshError) {
          console.error('Failed to refresh cart:', refreshError);
        }
      }
    } else {
      setCart(prev => ({
        items: prev.items.map(i => (i.id === id ? { ...i, quantity } : i)),
      }));
    }
  };

  const removeItem = async (id: string) => {
    if (token) {
      try {
        // Optimistically update UI
        setCart(prev => ({ items: prev.items.filter(i => i.id !== id) }));

        // Sync with backend
        await removeCartItem(id, token);
        
        // Refresh from backend
        const data = await getCart(token);
        const items = (data.items || []).map((i: BackendCartItem) => ({
          id: i.dishId,
          name: i.name,
          price: i.price,
          quantity: i.quantity,
          image: i.image,
        }));
        setCart({ items });
      } catch (error) {
        console.error('Failed to remove cart item:', error);
        // Try to refresh from backend
        try {
          const data = await getCart(token);
          const items = (data.items || []).map((i: BackendCartItem) => ({
            id: i.dishId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          }));
          setCart({ items });
        } catch (refreshError) {
          console.error('Failed to refresh cart:', refreshError);
        }
      }
    } else {
      setCart(prev => ({ items: prev.items.filter(i => i.id !== id) }));
    }
  };

  const clearCart = async () => {
    if (token) {
      try {
        // Optimistically clear UI
        setCart({ items: [] });
        
        // Sync with backend
        await clearCartApi(token);
      } catch (error) {
        console.error('Failed to clear cart:', error);
        // Try to refresh from backend to stay in sync
        try {
          const data = await getCart(token);
          const items = (data.items || []).map((i: BackendCartItem) => ({
            id: i.dishId,
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          }));
          setCart({ items });
        } catch (refreshError) {
          console.error('Failed to refresh cart:', refreshError);
        }
      }
    } else {
      setCart({ items: [] });
    }
  };

  // Only render children when cart is initialized to prevent flash of empty cart
  return (
    <CartContext.Provider
      value={{ cart, addItem, updateItem, removeItem, clearCart, setCart }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  console.log('useCart called, context:', !!context);
  if (context === defaultContextValue) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
