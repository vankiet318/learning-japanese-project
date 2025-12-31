import axios from "axios";

let API_URL = import.meta.env.VITE_API_URL || "/api/v1";

console.log('Current API_URL:', API_URL);

// If it's a full URL and doesn't contain the version prefix, append it
if (API_URL.startsWith('http') && !API_URL.includes('/api/v1')) {
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
