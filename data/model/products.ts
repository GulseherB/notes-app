import { StorageFile } from "./storage-file";

export type Product = {
  id?: number | string; // Eski API uyumluluğu için
  _id?: string; // MongoDB ObjectId
  name: string;
  descriptions: string;
  quantity: number;
  weight: number;
  price: number;
  sku: string;
  category_id: number | string;
  created_at?: string;
  updated_at?: string;
  storage_files: StorageFile[];
  is_active?: boolean;
};
