import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import AuthService from "@/services/auth/auth.service";
import { resetAllStores } from "../plugins/pinia-reset";

export const useAuthStore = defineStore("auth", () => {
  const user = ref(JSON.parse(localStorage.getItem("user")) || null);
  const token = ref(localStorage.getItem("token") || null);
  const refreshToken = ref(localStorage.getItem("refreshToken") || null);

  const isAuthenticated = computed(() => !!token.value);
  const router = useRouter();

  // Login
  const login = async (credentials) => {
    const response = await AuthService.login(credentials);
    user.value = response.user;
    token.value = response.token;
    refreshToken.value = response.refreshToken;

    localStorage.setItem("user", JSON.stringify(user.value));
    localStorage.setItem("token", token.value);
    localStorage.setItem("refreshToken", refreshToken.value);

    await router.push("/admin/dashboard");
  };

  // Logout
  const logout = async () => {
    try {
      await AuthService.logout();
      resetAllStores();
    } catch (e) {
      console.warn("Logout failed:", e.message);
    }

    user.value = null;
    token.value = null;
    refreshToken.value = null;

    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    await router.push("/auth/login");
  };

  const roles = computed(() => user.value?.roles || []);
  const permissions = computed(() => user.value?.permissions || []);

  const hasRole = (roleName) =>
    roles.value.map((r) => r.toLowerCase()).includes(roleName.toLowerCase());

  const hasPermission = (permName) =>
    permissions.value
      .map((p) => p.toLowerCase())
      .includes(permName.toLowerCase());

  return {
    user,
    token,
    refreshToken,
    isAuthenticated,
    login,
    logout,
    roles,
    permissions,
    hasRole,
    hasPermission,
  };
});
