import permissionService from "@/services/admin/permission.service";
import { defineStore } from "pinia";
import { ref } from "vue";

export const usePermissionStore = defineStore("permission", () => {
  const permissions = ref([]);
  const permission = ref(null);
  const totalPages = ref(0);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);

  const getById = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      const res = permissionService.getById(id);
      permission.value = res;
      return res;
    } catch (err) {
      error.value = err.message;
      return null;
    } finally {
      loading.value = false;
    }
  };

  const getAllPermission = async () => {
    loading.value = true;
    error.value = null;
    try {
      const data = await permissionService.getAllPermission();
      permissions.value = data;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const searchPermission = async (keyword, page = 1, size = 10) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await permissionService.getSearchPermission(
        keyword,
        page,
        size
      );
      permissions.value = data.list || [];
      totalItems.value = data.totalItems;
      totalPages.value =
        data.list?.length > 0 && data.total > 0 ? data.total : 0;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };

  const deletePermission = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      await permissionService.deletePermission(id);
      permissions.value = permissions.value.filter((p) => p.id !== id);
    } catch (err) {
      error.value = err.message;
    } finally {
      loading.value = false;
    }
  };
  const savePermission = async (permiss) => {
    loading.value = true;
    error.value = null;
    try {
      const newPermiss = permissionService.savePermission(permiss);
      permissions.value.push(newPermiss);
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };
  const updatePermission = async (id, permiss) => {
    loading.value = true;
    error.value = null;
    try {
      const newPermiss = permissionService.updatePermission(id, permiss);
      permissions.value = permissions.value.filter((p) => p.id !== id);
      permissions.value.unshift(newPermiss);
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };
  return {
    permissions,
    permission,
    loading,
    error,
    totalItems,
    totalPages,

    getAllPermission,
    searchPermission,
    getById,
    deletePermission,
    savePermission,
    updatePermission,
  };
});
