import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";
import { useAuthStore } from "@/stores/useAuthStore";

// ─── BASE INSTANCE ─────────────────────────────────────────────────────────
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL ?? "https://quran-api.santrikoding.com/api",
  timeout: 10_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Extend AxiosRequestConfig untuk flag retry
interface RetryableRequest extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

// ─── REQUEST INTERCEPTOR ───────────────────────────────────────────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const authStore = useAuthStore();

    if (authStore.token) {
      config.headers.Authorization = `Bearer ${authStore.token}`;
    }

    config.headers["X-Request-Time"] = new Date().toISOString();

    if (import.meta.env.DEV) {
      console.log(`[API] ${config.method?.toUpperCase()} ${config.url}`);
    }

    return config;
  },
  (error: AxiosError) => Promise.reject(error),
);

// ─── RESPONSE INTERCEPTOR ─────────────────────────────────────────────────
api.interceptors.response.use(
  (response: AxiosResponse) => response,

  async (error: AxiosError) => {
    const authStore = useAuthStore();
    const originalRequest = error.config as RetryableRequest | undefined;

    if (error.response?.status === 401 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        await authStore.refreshToken();
        originalRequest.headers.Authorization = `Bearer ${authStore.token}`;
        return api(originalRequest);
      } catch (refreshError) {
        authStore.logout();
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // Normalize error message dari berbagai format response
    const responseData = error.response?.data as { message?: string; error?: string } | undefined;

    const message = responseData?.message ?? responseData?.error ?? error.message ?? "Terjadi kesalahan";

    return Promise.reject(new Error(message));
  },
);

// ─── PRAYER TIME API (instance kedua, tanpa auth) ─────────────────────────
export const prayerApi: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_PRAYER_API_URL ?? "https://api.aladhan.com/v1",
  timeout: 8_000,
});
