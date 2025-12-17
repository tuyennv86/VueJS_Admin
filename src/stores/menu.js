import { defineStore } from "pinia";
import menuService from "@/services/admin/menu.service";
import { ref } from "vue";

export const useMenuStore = defineStore("menu", () => {
  const menus = ref([]);
  const usermenus = ref([]);
  const loading = ref(false);
  const error = ref(null);

  const getMenusByUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getMenusByUser();
      usermenus.value = data;
    } catch (error) {
      // console.error("Lỗi tải menu:", error.message);
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const getMyMenus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getMyMenus();
      usermenus.value = data;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };
  const resetMenu = () => {
    menus.value = [];
    usermenus.value = [];
    loading.value = false;
    error.value = null;
  };

  const getMenus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getMenus();
      menus.value = data;
    } catch (error) {
      // console.error("Lỗi tải menu:", error.message);
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const getSearch = async (keyword = "") => {
    console.log("getSearch keyword =", keyword);
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getByKeyword(keyword);
      console.log("API data =", data);
      menus.value = data;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };
  const insertMenu = async (menu) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.insertMenu(menu);
      menus.value.push(data);
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const updateMenu = async (id, menu) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.updateMenu(id, menu);
      menus.value = menus.value.filter((m) => m.id !== id);
      menus.value.unshift(data);
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    menus,
    usermenus,
    loading,
    error,
    resetMenu,
    getMenus,
    getMyMenus,
    getMenusByUser,
    getSearch,
    insertMenu,
    updateMenu,
  };
});
