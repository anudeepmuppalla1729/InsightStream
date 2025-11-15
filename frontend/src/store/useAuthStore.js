import { create } from "zustand";
import api from "../api/api";
import { jwtDecode } from "jwt-decode";

export const useAuthStore = create((set) => ({
  user: JSON.parse(localStorage.getItem("user")) || null,
  token: localStorage.getItem("token") || null,
  loading: false,

  validateToken: () => {
    const token = localStorage.getItem("token");
    if (!token) return set({ token: null });

    try {
      const decoded = jwtDecode(token);
      const isExpired = decoded.exp * 1000 < Date.now();

      if (isExpired) {
        localStorage.removeItem("token");
        set({ token: null });
      } else {
        set({ token });
      }
    } catch {
      localStorage.removeItem("token");
      set({ token: null });
    }
  },

  signup: async (name, email, password) => {
    set({ loading: true });

    try {
      const res = await api.post("/signup", { name, email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      set({ token, user: { name, email }, loading: false });
      return true;
    } catch (e) {
      set({ loading: false });
      throw e.response?.data || {message: "Signup failed"}
    }
  },

  login: async (email, password) => {
    set({ loading: true });
    try {
      const res = await api.post("/login", { email, password });
      const token = res.data.token;
      localStorage.setItem("token", token);
      set({ token, user: { email }, loading: false });
      return true;
    } catch (e) {
      set({ loading: false });
      throw e.response?.data || { message: "Login failed" };
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    set(({ user: null, token: null }));
  }
}))