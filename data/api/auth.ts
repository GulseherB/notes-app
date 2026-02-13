/**
 * Auth API istekleri
 * Artık local Next.js API'sine istek atıyoruz
 */
import { SignUpFormFields } from "@/components/auth/helpers";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';

type LoginCredentials =  {
    email: string
    password: string
}

export const login = async (formData: LoginCredentials) => {
  return axios.post(`${API_BASE}/auth/login`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export const signUp = async (formData: SignUpFormFields) => {
  return axios.post(`${API_BASE}/auth/register`, formData, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};