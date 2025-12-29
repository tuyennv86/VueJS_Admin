import { defineStore } from "pinia";
import menuService from "@/services/admin/menu.service";
import { ref } from "vue";

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
      return data;
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

  const deleteMenu = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await menuService.deleteMenu(id);
      menus.value = removeById(menus.value, id);
    } catch (error) {}
  };

  function removeById(list, idToRemove) {
    return list
      .filter((item) => item.id !== idToRemove)
      .map((item) => ({
        ...item,
        children: item.children ? removeById(item.children, idToRemove) : [],
      }));
  }

  return {
    menus,
    menu,
    menuOthers,
    usermenus,
    loading,
    error,
    resetMenu,
    getMenus,
    getMyMenus,
    getMenusByUser,
    getSearch,
    getById,
    getothers,
    insertMenu,
    updateMenu,
    deleteMenu,
  };
});
