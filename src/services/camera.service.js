import { api } from "./api";
import {
  getCamerasMock,
  createCameraMock,
  updateCameraMock,
  deleteCameraMock,
} from "../mocks/camerasMock";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

/**
 * Camera Service
 */

const CAMERA_BASE_URL = "/device";

/**
 * Search/Get all cameras
 */
export const searchCameras = async (filters = {}) => {
  try {
    // If filters are provided, use GET with query params
    if (Object.keys(filters).length > 0) {
      const params = new URLSearchParams(filters).toString();
      const response = await api.get(`${CAMERA_BASE_URL}/search?${params}&page=1&limit=99999`);

      // Normalize if the API returns paginated structure
      if (response?.data?.data && response.data.data.items) {
        return normalizeResponse(response);
      }

      return { data: response.data, success: true };
    }

    // Otherwise, get all cameras
    const response = await api.get(`${CAMERA_BASE_URL}/search?page=1&limit=99999`);

    if (response?.data?.data && response.data.data.items) {
      return normalizeResponse(response);
    }

    return { data: response.data, success: true };
  } catch (error) {
    console.warn("Failed to fetch cameras from API", error.message);

    return buildErrorResponse(error, "No se pudieron cargar las cámaras");
  }
};

/**
 * Get camera by ID
 */
export const getCameraById = async (id) => {
  try {
    if (!id) throw new Error("ID de cámara requerido");

    const { data } = await api.get(`${CAMERA_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.warn(`Failed to fetch camera ${id} from API:`, error.message);

    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || "Error al cargar la cámara",
      details: error.message,
    };
  }
};

/**
 * Create camera
 */
export const createCamera = async (data) => {
  try {
    if (!data.code || !data.location_id) {
      throw new Error("Todos los campos son requeridos");
    }

    const payload = {
      code: String(data.code).trim(),
      location_id: data.location_id,
    };

    if (payload.code.length < 3 || payload.code.length > 50) {
      throw new Error("El código debe tener entre 3 y 50 caracteres");
    }

    // Send to API (register route)
    const { data: responseData } = await api.post(`${CAMERA_BASE_URL}/register`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error creating camera:", error);

    const errorMessage =
      error?.response?.data?.message || error?.message || "Error al crear la cámara";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Update camera
 */
export const updateCamera = async (id, data) => {
  try {
    if (!id) throw new Error("ID de cámara requerido");

    const payload = {
      ...(data.code && { code: String(data.code).trim() }),
      ...(data.location_id && { location_id: data.location_id }),
    };

    if (payload.code && (payload.code.length < 3 || payload.code.length > 50)) {
      throw new Error("El código debe tener entre 3 y 50 caracteres");
    }

    const { data: responseData } = await api.put(`${CAMERA_BASE_URL}/${id}`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating camera:", error);

    const errorMessage =
      error?.response?.data?.message || error?.message || "Error al actualizar la cámara";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Delete camera
 */
export const deleteCamera = async (id) => {
  try {
    if (!id) throw new Error("ID de cámara requerido");

    const { data } = await api.delete(`${CAMERA_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error deleting camera:", error);

    const errorMessage =
      error?.response?.data?.message || error?.message || "Error al eliminar la cámara";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};
