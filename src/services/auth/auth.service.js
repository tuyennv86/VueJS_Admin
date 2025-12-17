import api from "@/utils/request";

const login = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data;
};

const register = async (userData) => {
  const response = await api.post("/auth/register", userData);
  return response.data;
};

const logout = async () => {
  const response = await api.post("/auth/logout");
  return response.data;
};

const refreshToken = async (refreshToken) => {
  const res = await api.post("/auth/refresh-token", { refreshToken });
  return res.data;
};

export default {
  login,
  register,
  logout,
  refreshToken,
};
