import api from "@/utils/request";

const getAllPermission = async () => {
  const response = await api.get("/permission");
  return response.data;
};

const getSearchPermission = async (keyword, page, size) => {
  const response = await api.get("/permission/search", {
    params: { keyword, page, size },
  });
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/permission/${id}`);
  return response.data;
};

const deletePermission = async (id) => {
  const response = await api.delete(`/permission/${id}`);
  return response.data;
};

const savePermission = async (permiss) => {
  const response = await api.post("/permission", permiss);
  return response.data;
};
const updatePermission = async (id, permiss) => {
  const response = await api.put(`/permission/${id}`, permiss);
  return response.data;
};

export default {
  getAllPermission,
  getSearchPermission,
  getById,
  deletePermission,
  savePermission,
  updatePermission,
};
