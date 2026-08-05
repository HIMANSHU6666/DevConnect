import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [] });
  const [loading, setLoading] = useState(false);

  const fetchCart = async () => {
    if (!user) {
      setCart({ items: [] });
      return;
    }
    try {
      setLoading(true);
      const res = await api.get('/cart');
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Cart fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [user]);

  const addToCart = async (productId, quantity = 1) => {
    if (!user) return false;
    try {
      const res = await api.post('/cart/add', { productId, quantity });
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      const res = await api.patch('/cart/update', { productId, action });
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const removeFromCart = async (productId) => {
    try {
      const res = await api.delete('/cart/remove', { data: { productId } });
      if (res.data.success && res.data.cart) {
        setCart(res.data.cart);
        return { success: true, message: res.data.message };
      }
    } catch (err) {
      return { success: false, message: err.response?.data?.message || err.message };
    }
  };

  const clearCart = async () => {
    try {
      const res = await api.delete('/cart/clear');
      if (res.data.success) {
        setCart({ items: [] });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const cartItemCount = cart.items ? cart.items.reduce((sum, item) => sum + (item.quantity || 0), 0) : 0;

  return (
    <CartContext.Provider value={{
      cart,
      cartItemCount,
      loading,
      fetchCart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
