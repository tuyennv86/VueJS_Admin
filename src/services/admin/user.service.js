import api from "@/utils/request";

const getAllUserSearch = async (keyword, page, size, sortBy = "id") => {
  const res = await api.get("/users/getallusersearch", {
    params: { keyword, page, size, sortBy },
  });
  return res.data;
};

const getCurrentUser = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

const deleteUser = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

const createUser = async (user, imageFile) => {
  const formData = new FormData();

  formData.append(
    "user",
    new Blob([JSON.stringify(user)], { type: "application/json" })
  );

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await api.post(`/users`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

const updateUser = async (id, user, imageFile) => {
  const formData = new FormData();

  formData.append(
    "user",
    new Blob([JSON.stringify(user)], { type: "application/json" })
  );

  if (imageFile) {
    formData.append("image", imageFile);
  }

  const res = await api.put(`/users/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data;
};

export default {
  getAllUserSearch,
  getCurrentUser,
  deleteUser,
  createUser,
  updateUser,
};
