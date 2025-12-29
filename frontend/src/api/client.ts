import axios from "axios";

let API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Ensure API_URL ends with /api/v1
if (!API_URL.endsWith("/api/v1") && !API_URL.endsWith("/api/v1/")) {
  API_URL = API_URL.replace(/\/$/, "") + "/api/v1";
}

export const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
