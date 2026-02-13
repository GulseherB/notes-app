/**
 * Kullanıcılar API istekleri
 * Local MongoDB tabanlı API'ye istek atar
 */
import { EditUserFormFields } from "@/components/auth/helpers";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3000/api';
const USER_URL = `${API_BASE}/users`;

export const getUsers = (accessToken?: string) => {
  return axios.get(`${USER_URL}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const getUser = (id: string, accessToken: string) => {
  return axios.get(`${USER_URL}/${id}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
};

export const updateUser = (id: string, userPayload: EditUserFormFields, accessToken: string) => {
  return axios.put(`${USER_URL}/${id}`, userPayload, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });
};
