import { api } from "../api/client";

export const login = async (email: string, password: string) => {
  const formData = new URLSearchParams();
  formData.append("username", email);
  formData.append("password", password);

  const res = await api.post("/auth/login", formData);
  localStorage.setItem("token", res.data.access_token);

  return res.data;
};
