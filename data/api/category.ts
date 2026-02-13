/**
 * Kategoriler API istekleri
 * Local MongoDB tabanlı API'ye istek atar
 */
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';
const CATEGORIES_URL = `${API_BASE}/categories`;

export const getCategories = (filters: string = "") => {
  const categoriesUrl = filters.length > 0 ? `${CATEGORIES_URL}${filters}` : CATEGORIES_URL;
  return axios.get(categoriesUrl);
};

export const getCategoryById = (id: string) => {
  return axios.get(`${CATEGORIES_URL}/${id}`);
};

export const createCategory = (data: any, token: string) => {
  return axios.post(CATEGORIES_URL, data, {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
};