import axios from "axios";
import {
  createUserMock,
  deleteUserMock,
  getUsersMock,
  resetPasswordMock,
  updateUserMock,
} from "../mocks/usersMock";

export const api = axios.create({
  baseURL: "http://localhost:3000/api",
});

// interceptor para JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// CRUD mockeado para desarrollo sin backend.
export const getUsers = () => getUsersMock();
export const createUser = (data) => createUserMock(data);
export const updateUser = (id, data) => updateUserMock(id, data);
export const deleteUser = (id) => deleteUserMock(id);
export const resetPassword = (id) => resetPasswordMock(id);