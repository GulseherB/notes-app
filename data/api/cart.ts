/**
 * Cart API Helper Functions
 */
import axios from 'axios';

const API_URL = '/api/cart';

// Sepeti getir
export const getCart = async () => {
  return axios.get(API_URL);
};

// Sepete ürün ekle
export const addToCart = async (productId: string, quantity: number) => {
  return axios.post(API_URL, {
    product_id: productId,
    quantity,
  });
};

// Ürün miktarını güncelle
export const updateCartItemQuantity = async (productId: string, quantity: number) => {
  return axios.put(API_URL, {
    product_id: productId,
    quantity,
  });
};

// Sepetten ürün sil
export const removeFromCart = async (productId: string) => {
  return axios.delete(`${API_URL}/${productId}`);
};

// Sepeti temizle
export const clearCart = async () => {
  return axios.delete(API_URL);
};
