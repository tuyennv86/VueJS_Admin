import userService from "@/services/admin/user.service";
import { defineStore } from "pinia";
import { ref } from "vue";

export const useUserStore = defineStore("user", () => {
  const users = ref([]);
  const totalPages = ref(0);
  const totalItems = ref(0);
  const loading = ref(false);
  const error = ref(null);

  // const user = ref(null);

  const getAllUserSearch = async (
    keyword,
    page = 1,
    size = 10,
    sortBy = "id"
  ) => {
    loading.value = true;
    error.value = null;
    try {
      const data = await userService.getAllUserSearch(
        keyword,
        page,
        size,
        sortBy
      );
      users.value = data.list || [];
      totalPages.value =
        data.list?.length > 0 && data.total > 0 ? data.total : 0;
      totalItems.value = data.totalItems;
    } catch (error) {
      error.value = error.message;
    } finally {
      loading.value = false;
    }
  };
  // const getCurrentUser = async () => {
  //   try {
  //     const data = await userService.getCurrentUser();
  //     user.value = data;
  //   } catch (error) {
  //     error.value = error.message;
  //   }
  // };
  const deleteUser = async (id) => {
    try {
      await userService.deleteUser(id);
      users.value = users.value.filter((u) => u.id !== id);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const updateUser = async (id, user, imageFile) => {
    try {
      const newUser = await userService.updateUser(id, user, imageFile);
      users.value = users.value.filter((u) => u.id !== id);
      users.value.unshift(newUser);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  const createUser = async (user, imageFile) => {
    try {
      const newUser = await userService.createUser(user, imageFile);
      users.value.push(newUser);
    } catch (err) {
      error.value = err.message;
      throw err;
    }
  };

  return {
    // user,
    users,
    loading,
    error,
    totalPages,
    totalItems,
    getAllUserSearch,
    // getCurrentUser,
    deleteUser,
    createUser,
    updateUser,
  };
});
