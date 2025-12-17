import axios from "axios";
import authHeader from "@/services/auth/auth-header";
import authService from "@/services/auth/auth.service";
import { useAuthStore } from "@/stores/auth";

const API_URL = import.meta.env.VITE_API_URL + "api/v1/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ================================
// 🔹 Biến dùng để xử lý refresh token
// ================================
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token);
  });
  failedQueue = [];
};

// ================================
// 🔹 Interceptor Request — gắn token
// ================================
api.interceptors.request.use((config) => {
  const headers = authHeader();
  if (headers.Authorization) {
    config.headers = { ...config.headers, ...headers };
  }
  return config;
});

// ================================
// 🔹 Interceptor Response — xử lý lỗi, auto refresh token
// ================================
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Nếu server phản hồi 401 (token hết hạn)
    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !originalRequest._retry
    ) {
      const authStore = useAuthStore();

      if (isRefreshing) {
        // Nếu đang refresh → chờ token mới
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        // Không có refreshToken → logout
        authStore.logout();
        window.location.href = "/auth/login";
        return Promise.reject(error);
      }

      try {
        // ✅ Gọi API refresh token
        const data = await authService.refreshToken(refreshToken);

        // Lưu lại token mới
        localStorage.setItem("token", data.token);
        localStorage.setItem("refreshToken", data.refreshToken);

        // Cập nhật headers mặc định
        api.defaults.headers.Authorization = `Bearer ${data.token}`;
        processQueue(null, data.token);

        // ✅ Thử lại request gốc
        originalRequest.headers.Authorization = `Bearer ${data.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh thất bại → logout luôn
        processQueue(refreshError, null);
        authStore.logout();
        window.location.href = "/auth/login";
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // ===============================
    // 🔹 Các lỗi khác
    // ===============================
    if (!error.response) {
      console.error("🚨 Không nhận được phản hồi từ server:", error.message);
    } else if (error.response.status >= 500) {
      console.error("🔥 Lỗi server:", error.response.data);
    }

    return Promise.reject(error);
  }
);

// // Thêm token header nếu có
// api.interceptors.request.use((config) => {
//   const headers = authHeader();
//   if (headers.Authorization) {
//     config.headers = { ...config.headers, ...headers };
//   }
//   return config;
// });

// // ✅ Chặn lỗi response an toàn
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response) {
//       // Nếu token hết hạn hoặc 401 → logout
//       if (error.response.status === 401) {
//         const authStore = useAuthStore();
//         authStore.logout();
//         window.location.href = "/auth/login";
//       }
//     } else {
//       // Không có phản hồi từ server
//       console.error("🚨 Không nhận được phản hồi từ server:", error.message);
//     }
//     return Promise.reject(error);
//   }
// );

export default api;
