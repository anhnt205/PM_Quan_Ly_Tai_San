import axios from "axios";
import { store } from "../redux/store";
import { logout } from "../redux/userSlice";
import { ROUTES } from "../utils/routes";

const API_URL = import.meta.env.VITE_KONG_API;

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config: any) => {
    const state = store.getState();
    const token = state.user?.user?.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  },
);

api.interceptors.response.use(
  (response: any) => response,
  (error: any) => {
    return Promise.reject(error);
  },
);

export default api;
