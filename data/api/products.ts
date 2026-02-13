/**
 * Ürünler API istekleri
 * Local MongoDB tabanlı API'ye istek atar
 */
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';
const PRODUCTS_URL = `${API_BASE}/products`;

export const getProducts = (filters: string = "") => {
  const productsUrl =
    filters.length > 0 ? `${PRODUCTS_URL}${filters}` : PRODUCTS_URL;
  return axios.get(productsUrl);
};

export const getProductById = (id: string) => {
  return axios.get(`${PRODUCTS_URL}/${id}`);
};

export const createProduct = (data: any) => {
  return axios.post(PRODUCTS_URL, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const updateProduct = (id: string, data: any) => {
  return axios.put(`${PRODUCTS_URL}/${id}`, data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const deleteProduct = (id: string) => {
  return axios.delete(`${PRODUCTS_URL}/${id}`);
};
