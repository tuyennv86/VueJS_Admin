// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";
import LayoutLoader from "@/layouts/LayoutLoader.vue";

const routes = [
  {
    path: "/",
    component: LayoutLoader,
    children: [
      // 🔹 Auth pages
      {
        path: "/auth/login",
        name: "Login",
        component: () => import("@/views/Auth/Login.vue"),
        meta: { layout: "auth", title: "Đăng nhập" },
      },
      {
        path: "/auth/forgot",
        name: "Forgot",
        component: () => import("@/views/Auth/forgot.vue"),
        meta: { layout: "auth", title: "Lấy lại mật khẩu" },
      },
      {
        path: "/auth/register",
        name: "Register",
        component: () => import("@/views/Auth/Register.vue"),
        meta: { layout: "auth", title: "Đăng ký tài khoản" },
      },

      // Admin
      {
        path: "/admin/dashboard",
        name: "Dashboard",
        component: () => import("@/views/Admin/Dashboard.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          title: "Trang tổng hợp báo cáo",
        },
      },
      {
        path: "/admin/403",
        name: "Forbidden",
        component: () => import("@/views/Admin/403.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          title: "403 bạn không có quyền truy cập",
        },
      },
      {
        path: "/admin/settings",
        name: "settings",
        component: () => import("@/views/Admin/Settings.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          role: "admin",
          title: "Cấu hình quản trị",
        },
      },
      {
        path: "/admin/settings",
        name: "roles",
        component: () => import("@/views/Admin/Settings.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          role: "admin",
          title: "Cấu hình phân quyền",
        },
      },
      {
        path: "/admin/roles",
        name: "roles",
        component: () => import("@/views/Admin/Roles.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          role: "admin",
          title: "Cấu hình phân quyền",
        },
      },
      {
        path: "/admin/permissions",
        name: "permisstions",
        component: () => import("@/views/Admin/Permission.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          role: "admin",
          title: "Cấu hình permisstions",
        },
      },
      {
        path: "/admin/users",
        name: "Users",
        component: () => import("@/views/Admin/Users.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          permission: "view_users",
          title: "Quản trị user",
        },
      },
      {
        path: "/admin/menus",
        name: "menus",
        component: () => import("@/views/Admin/Menu.vue"),
        meta: {
          layout: "admin",
          requiresAuth: true,
          role: "admin",
          title: "Quản trị menus",
        },
      },
      // home page
      {
        path: "",
        name: "Home",
        component: () => import("@/views/Home/Home.vue"),
        meta: { layout: "home", title: "Trang chủ bán hàng hay gì đó" },
      },
      {
        path: "about",
        name: "About",
        component: () => import("@/views/Home/About.vue"),
        meta: { layout: "home", title: "Giới thiệu về trang web" },
      },
      // 🔹 redirect mặc định
      {
        path: "/auth",
        redirect: { name: "Login" },
      },
      {
        path: "/admin",
        redirect: { name: "Dashboard" },
      },
      {
        path: "/:pathMatch(.*)*",
        redirect: "/auth/login",
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.afterEach((to) => {
  const defaultTitle = "My App"; // tiêu đề mặc định
  document.title = to.meta.title ? `${to.meta.title}` : defaultTitle;
});

// ✅ Middleware kiểm tra quyền truy cập
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();

  // Nếu đã đăng nhập mà vẫn vào login → chuyển hướng về dashboard
  if (to.name === "Login" && authStore.isAuthenticated) {
    return next({ name: "Dashboard" });
  }

  // Yêu cầu đăng nhập
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    return next({ name: "Login" });
  }

  // Kiểm tra role
  if (to.meta.role && !authStore.hasRole(to.meta.role)) {
    return next({ name: "Forbidden" });
  }

  // Kiểm tra permission
  if (to.meta.permission && !authStore.hasPermission(to.meta.permission)) {
    return next({ name: "Forbidden" });
  }

  next();
});

export default router;
