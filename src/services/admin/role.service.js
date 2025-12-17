import api from "@/utils/request";

const getAllRole = async () => {
  const response = await api.get("/roles");
  return response.data;
};

const getSearchRole = async (keyword, page, size) => {
  const response = await api.get("/roles/search", {
    params: { keyword, page, size },
  });
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/roles/${id}`);
  return response.data;
};

const deleteRole = async (id) => {
  const response = await api.delete(`/roles/${id}`);
  return response.data;
};

const createRole = async (role) => {
  const response = await api.post("/roles", role);
  return response.data;
};
const updateRole = async (id, role) => {
  const response = await api.put(`/roles/${id}`, role);
  return response.data;
};
export default {
  getAllRole,
  getById,
  deleteRole,
  getSearchRole,
  updateRole,
  createRole,
};
