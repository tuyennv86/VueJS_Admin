import api from "@/utils/request";

const getMenusByUser = async () => {
  const response = await api.get("/menus/getbyuser");
  return response.data;
};

const getMenus = async () => {
  const response = await api.get("/menus");
  return response.data;
};

const getMyMenus = async () => {
  const response = await api.get("/menus/my");
  return response.data;
};

const getByKeyword = async (keyword) => {
  const response = await api.get("/menus/search", {
    params: { keyword },
  });
  return response.data;
};

const getothers = async (id) => {
  const response = await api.get(`/menus/others/${id}`);
  return response.data;
};
const getById = async (id) => {
  const response = await api.get(`/menus/${id}`);
  return response.data;
};

const insertMenu = async (menu) => {
  const response = await api.post("/menus", menu);
  return response.data;
};

const updateMenu = async (id, menu) => {
  const response = await api.put(`/menus/${id}`, menu);
  return response.data;
};

const deleteMenu = async (id) => {
  const response = await api.delete(`/menus/${id}`);
  return response.data;
};

export default {
  getMenusByUser,
  getMyMenus,
  getMenus,
  getByKeyword,
  getothers,
  getById,
  insertMenu,
  updateMenu,
  deleteMenu,
};
