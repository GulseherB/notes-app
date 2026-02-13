import { createContext, useContext } from "react";

export interface CartItem {
  product_id: string;
  name: string;
  price: number;
  quantity: number;
  weight: number;
  image_url?: string;
}

export interface CartData {
  _id: string;
  user_id: string;
  items: CartItem[];
  total_amount: number;
}

export type BakeryContextType = {
  cart: CartData | null;
  cartShow: boolean;
  loading: boolean;
  setCartShow: (show: boolean) => void;
  addToCart: (productId: string, quantity: number) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  clearCart: () => Promise<void>;
  refreshCart: () => Promise<void>;
};

const bakeryContextDefaultValues: BakeryContextType = {
  cart: null,
  cartShow: false,
  loading: false,
  setCartShow: () => {},
  addToCart: async () => {},
  updateQuantity: async () => {},
  removeFromCart: async () => {},
  clearCart: async () => {},
  refreshCart: async () => {},
};

export const BakeryContext = createContext<BakeryContextType>(
  bakeryContextDefaultValues
);

export function useBakeryContext() {
  return useContext(BakeryContext);
}
