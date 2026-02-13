/**
 * Görsel Dosyalar API istekleri
 * Artık görseller doğrudan ürün ve kategorilerde URL olarak saklanıyor
 * Bu dosya gelecekteki görsel yükleme özellikleri için placeholder olarak tutulmuştur
 */
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

// Placeholder fonksiyonlar - ileride görsel yükleme özelliği eklenebilir
export const getStorageFiles = (filters: string = "") => {
  // Artık görseller ürün ve kategori objelerinin içinde
  return Promise.resolve({ data: [] });
};

export const uploadImage = (formData: FormData) => {
  // Gelecekte görsel yükleme API'si buraya eklenebilir
  return axios.post(`${API_BASE}/upload`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};


export const deleteImage = async (id: number) => {
  return axios.delete(`${API_BASE}/files/${id}`);
};
