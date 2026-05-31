import { api } from "./api";
import {
  getStoresMock,
  createStoreMock,
  updateStoreMock,
  deleteStoreMock,
} from "../mocks/storesMock";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

/**
 * Store Service
 */

const STORE_BASE_URL = "/store";

/**
 * Search/Get all stores
 */
export const searchStores = async (filters = {}) => {
  try {
    const payload = {
      ...filters,
      limit: 99999,
    };

    // If filters are provided, use POST /search
    if (Object.keys(filters).length > 0) {
      const response = await api.post(`${STORE_BASE_URL}/search`, payload);
      return normalizeResponse(response);
    }

    // Otherwise, try to get all stores via search with empty filters
    const response = await api.post(`${STORE_BASE_URL}/search`, payload);
    return normalizeResponse(response);
  } catch (error) {
    console.warn("Failed to fetch stores from API", error.message);

    return buildErrorResponse(error, "No se pudieron cargar las tiendas");
  }
};

/**
 * Get store by code
 */
export const getStoreByCode = async (code) => {
  try {
    if (!code) {
      throw new Error("Código de tienda requerido");
    }

    const { data } = await api.get(`${STORE_BASE_URL}/find-by-code/${code}`);
    return { data, success: true };
  } catch (error) {
    console.warn(`Failed to fetch store ${code} from API:`, error.message);

    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || "Error al cargar la tienda",
      details: error.message,
    };
  }
};

/**
 * Create store
 */
export const createStore = async (data) => {
  try {
    // Validate required fields
    if (!data.name || !data.code || !data.address) {
      throw new Error("Nombre, código y dirección son requeridos");
    }

    // Trim and validate lengths
    const payload = {
      name: String(data.name).trim(),
      code: String(data.code).trim(),
      address: String(data.address).trim(),
    };

    if (payload.name.length < 3 || payload.name.length > 100) {
      throw new Error("El nombre debe tener entre 3 y 100 caracteres");
    }

    if (payload.code.length < 3 || payload.code.length > 30) {
      throw new Error("El código debe tener entre 3 y 30 caracteres");
    }

    if (payload.address.length < 3 || payload.address.length > 100) {
      throw new Error("La dirección debe tener entre 3 y 100 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.post(`${STORE_BASE_URL}/create`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error creating store:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al crear la tienda";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Update store
 */
export const updateStore = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID de tienda requerido");
    }

    // Prepare payload with id (API expects it in body)
    const payload = {
      id,
      ...(data.name && { name: String(data.name).trim() }),
      ...(data.code && { code: String(data.code).trim() }),
      ...(data.address && { address: String(data.address).trim() }),
    };

    // Validate fields if provided
    if (payload.name && (payload.name.length < 3 || payload.name.length > 100)) {
      throw new Error("El nombre debe tener entre 3 y 100 caracteres");
    }

    if (payload.code && (payload.code.length < 3 || payload.code.length > 30)) {
      throw new Error("El código debe tener entre 3 y 30 caracteres");
    }

    if (payload.address && (payload.address.length < 3 || payload.address.length > 100)) {
      throw new Error("La dirección debe tener entre 3 y 100 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.put(`${STORE_BASE_URL}/update`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating store:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al actualizar la tienda";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Delete store
 */
export const deleteStore = async (id) => {
  try {
    if (!id) {
      throw new Error("ID de tienda requerido");
    }

    const { data } = await api.delete(`${STORE_BASE_URL}/delete/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error deleting store:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al eliminar la tienda";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};
