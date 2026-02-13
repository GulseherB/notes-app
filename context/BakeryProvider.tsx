import React, { ReactNode, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BakeryContext, CartData } from "./BakeryContext";
import * as cartApi from "@/data/api/cart";

type BakeryProviderProps = {
  children: ReactNode;
};

const BakeryProvider: React.FC<BakeryProviderProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const [cart, setCart] = useState<CartData | null>(null);
  const [showCart, setShowCart] = useState(false);
  const [loading, setLoading] = useState(false);

  // Kullanıcı giriş yaptığında sepeti yükle
  useEffect(() => {
    if (status === 'authenticated' && session) {
      refreshCart();
    } else if (status === 'unauthenticated') {
      setCart(null);
    }
  }, [status, session]);

  // Sepeti yenile
  const refreshCart = async () => {
    if (!session) return;
    
    try {
      setLoading(true);
      const response = await cartApi.getCart();
      setCart(response.data.data);
    } catch (error) {
      console.error('Sepet yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  // Sepete ürün ekle
  const addToCart = async (productId: string, quantity: number = 1) => {
    if (!session) {
      alert('Lütfen önce giriş yapın');
      return;
    }

    try {
      setLoading(true);
      const response = await cartApi.addToCart(productId, quantity);
      setCart(response.data.data);
      setShowCart(true);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ürün eklenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Ürün miktarını güncelle
  const updateQuantity = async (productId: string, quantity: number) => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await cartApi.updateCartItemQuantity(productId, quantity);
      setCart(response.data.data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Miktar güncellenemedi');
    } finally {
      setLoading(false);
    }
  };

  // Sepetten ürün sil
  const removeFromCart = async (productId: string) => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await cartApi.removeFromCart(productId);
      setCart(response.data.data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Ürün silinemedi');
    } finally {
      setLoading(false);
    }
  };

  // Sepeti temizle
  const clearCart = async () => {
    if (!session) return;

    try {
      setLoading(true);
      const response = await cartApi.clearCart();
      setCart(response.data.data);
    } catch (error: any) {
      alert(error.response?.data?.message || 'Sepet temizlenemedi');
    } finally {
      setLoading(false);
    }
  };

  const setCartShow = (show: boolean) => {
    setShowCart(show);
  };

  const value = {
    cart,
    cartShow: showCart,
    loading,
    setCartShow,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    refreshCart,
  };

  return (
    <BakeryContext.Provider value={value}>{children}</BakeryContext.Provider>
  );
};

export default BakeryProvider;
