import { defineStore } from "pinia";
import { ref } from "vue";
import roleService from "@/services/admin/role.service";

export const useRoleStore = defineStore("role", () => {
  const loading = ref(false);
  const error = ref(null);
  const roles = ref([]);
  const role = ref(null);
  const totalPages = ref(0);
  const totalItems = ref(0);

  const getAllRole = async () => {
    loading.value = true;
    error.value = null;
    try {
      roles.value = await roleService.getAllRole();
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const getSearch = async (keyword = "", page = 1, size = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await roleService.getSearchRole(keyword, page, size);
      roles.value = data.list || [];
      totalItems.value = data.totalItems;
      totalPages.value = data.total;
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
      const data = await roleService.getById(id);
      role.value = data;
      return data;
    } catch (error) {
      error.value = error.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const deleteRole = async (id) => {
    try {
      await roleService.deleteRole(id);
      roles.value = roles.value.filter((r) => r.id !== id);
    } catch (error) {
      error.value = err.message;
      throw err;
    }
  };
  const createRole = async (role) => {
    try {
      const newRole = roleService.createRole(role);
      roles.value.push(newRole);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };
  const updateRole = async (id, role) => {
    try {
      const newRole = roleService.updateRole(id, role);
      roles.value = roles.value.filter((r) => r.id !== id);
      roles.value.unshift(newRole);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };
  return {
    error,
    loading,
    totalItems,
    totalPages,
    role,
    roles,
    getById,
    getSearch,
    getAllRole,
    deleteRole,
    createRole,
    updateRole,
  };
});
