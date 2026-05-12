import { api } from "./api";
import { buildErrorResponse } from "../utils/apiHelper";

const USER_BASE_URL = "/user";

export const searchUsers = async (filters = {}) => {
  try {
    const { data } = await api.get(`${USER_BASE_URL}/search`, filters);
    return { data: data?.data, success: true };
  } catch (error) {
    console.warn("Failed to fetch users from API", error.message);
    return buildErrorResponse(error, "No se pudieron cargar los usuarios");
  }
};

export const getUserById = async (id) => {
  try {
    if (!id) throw new Error("ID de usuario requerido");
    const { data } = await api.get(`${USER_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.warn(`Failed to fetch user ${id}:`, error.message);
    return { data: null, success: false, error: error?.message || "Error al cargar usuario" };
  }
};

export const updateUserService = async (payload) => {
  try {
    if (!payload?.id) throw new Error("ID de usuario requerido");
    const { data } = await api.put(`${USER_BASE_URL}/update`, payload);
    return { data, success: true };
  } catch (error) {
    console.error("Error updating user:", error.message);
    return { data: null, success: false, error: error?.response?.data?.message || error.message };
  }
};

export const blockUserService = async (id) => {
  try {
    if (!id) throw new Error("ID de usuario requerido");
    const { data } = await api.put(`${USER_BASE_URL}/block/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error blocking user:", error.message);
    return { data: null, success: false, error: error?.response?.data?.message || error.message };
  }

};

export const toggleUserStatus = async (id) => {
  try {
    if (!id) throw new Error("ID de usuario requerido");
    const { data } = await api.patch(`${USER_BASE_URL}/status/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error toggling user status:", error.message);
    return { data: null, success: false, error: error?.response?.data?.message || error.message };
  }
};
