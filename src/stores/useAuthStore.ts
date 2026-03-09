import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { api } from "@/lib/axios";
import type { User, AuthResponse, LoginPayload } from "@/types";

export const useAuthStore = defineStore("auth", () => {
  // ─── STATE ─────────────────────────────────────────────────────
  const token = ref<string | null>(localStorage.getItem("rm_token"));
  const refreshTokenValue = ref<string | null>(localStorage.getItem("rm_refresh_token"));
  const user = ref<User | null>(JSON.parse(localStorage.getItem("rm_user") ?? "null") as User | null);

  // ─── GETTERS ───────────────────────────────────────────────────
  const isLoggedIn = computed<boolean>(() => !!token.value);
  const displayName = computed<string>(() => user.value?.nama ?? user.value?.email ?? "Muslim");

  // ─── ACTIONS ───────────────────────────────────────────────────
  async function login(payload: LoginPayload): Promise<void> {
    const { data } = await api.post<AuthResponse>("/auth/login", payload);

    token.value = data.access_token;
    refreshTokenValue.value = data.refresh_token;
    user.value = data.user;

    localStorage.setItem("rm_token", data.access_token);
    localStorage.setItem("rm_refresh_token", data.refresh_token);
    localStorage.setItem("rm_user", JSON.stringify(data.user));
  }

  async function refreshToken(): Promise<void> {
    const { data } = await api.post<Pick<AuthResponse, "access_token">>("/auth/refresh", { refresh_token: refreshTokenValue.value });
    token.value = data.access_token;
    localStorage.setItem("rm_token", data.access_token);
  }

  function logout(): void {
    token.value = null;
    refreshTokenValue.value = null;
    user.value = null;
    localStorage.removeItem("rm_token");
    localStorage.removeItem("rm_refresh_token");
    localStorage.removeItem("rm_user");
  }

  return {
    token,
    user,
    isLoggedIn,
    displayName,
    login,
    logout,
    refreshToken,
  };
});
