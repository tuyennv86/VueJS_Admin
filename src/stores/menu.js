import { defineStore } from "pinia";
import menuService from "@/services/admin/menu.service";
import { ref } from "vue";
import {
  addMenuToTree,
  removeMenuFromTree,
  updateMenuInTree,
  upsertMenuTree,
} from "@/utils/menuTree";

export const useMenuStore = defineStore("menu", () => {
  const menus = ref([]);
  const usermenus = ref([]);
  const menuOthers = ref([]);
  const menu = ref(null);

  const loading = ref(false);
  const error = ref(null);

  const getMenusByUser = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getMenusByUser();
      usermenus.value = data;
    } catch (error) {
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

  const getMenus = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getMenus();
      menus.value = data;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const getSearch = async (keyword = "") => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getByKeyword(keyword);
      menus.value = data;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const getothers = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getothers(id);
      menuOthers.value = data;
      // return data;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const getById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.getById(id);
      menu.value = data;
      return data;
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
      addMenuToTree(menus.value, data);
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
      updateMenuInTree(menus.value, data);
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const deleteMenu = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.deleteMenu(id);
      removeMenuFromTree(menus.value, id);
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };
  const changIsActive = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.changIsActive(id);
      updateMenuInTree(menus.value, data);
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  return {
    menus,
    menu,
    menuOthers,
    usermenus,
    loading,
    error,
    getMenus,
    getMyMenus,
    getMenusByUser,
    getSearch,
    getById,
    getothers,
    insertMenu,
    updateMenu,
    deleteMenu,
    changIsActive,
  };
});
