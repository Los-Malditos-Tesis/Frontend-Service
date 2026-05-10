import { api } from "./api";
import {
  getLocationsMock,
  createLocationMock,
  updateLocationMock,
  deleteLocationMock,
} from "../mocks/locationsMock";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

/**
 * Location Service
 */

const LOCATION_BASE_URL = "/location";

/**
 * Search/Get all locations
 */
export const searchLocations = async (filters = {}) => {
  try {
    // If filters are provided, use POST /search
    if (Object.keys(filters).length > 0) {
      const response = await api.post(`${LOCATION_BASE_URL}/search`, filters);
      return normalizeResponse(response);
    }

    // Otherwise, try to get all locations via search with empty filters
    const response = await api.post(`${LOCATION_BASE_URL}/search`, {});
    return normalizeResponse(response);
  } catch (error) {
    console.warn("Failed to fetch locations from API", error.message);

    return buildErrorResponse(error, "No se pudieron cargar las ubicaciones");
  }
};

/**
 * Get location by ID
 */
export const getLocationById = async (id) => {
  try {
    if (!id) {
      throw new Error("ID de ubicación requerido");
    }

    const response = await api.post(`${LOCATION_BASE_URL}/search`, { id });
    return normalizeResponse(response);
  } catch (error) {
    console.warn(`Failed to fetch location ${id} from API:`, error.message);

    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || "Error al cargar la ubicación",
      details: error.message,
    };
  }
};

/**
 * Create location
 */
export const createLocation = async (data) => {
  try {
    // Validate required fields
    if (!data.zone) {
      throw new Error("La zona es requerida");
    }

    // Trim and validate lengths
    const payload = {
      zone: String(data.zone).trim().toUpperCase(),
      ...(data.warehouse_id && { warehouse_id: data.warehouse_id }),
    };

    if (payload.zone.length < 3 || payload.zone.length > 30) {
      throw new Error("La zona debe tener entre 3 y 30 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.post(`${LOCATION_BASE_URL}/create`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error creating location:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al crear la ubicación";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Update location
 */
export const updateLocation = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID de ubicación requerido");
    }

    // Prepare payload with only provided fields
    const payload = {
      ...(data.zone && { zone: String(data.zone).trim().toUpperCase() }),
      ...(data.warehouse_id && { warehouse_id: data.warehouse_id }),
    };

    // Validate fields if provided
    if (payload.zone && (payload.zone.length < 3 || payload.zone.length > 30)) {
      throw new Error("La zona debe tener entre 3 y 30 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.put(`${LOCATION_BASE_URL}/${id}`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating location:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al actualizar la ubicación";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Delete location
 */
export const deleteLocation = async (id) => {
  try {
    if (!id) {
      throw new Error("ID de ubicación requerido");
    }

    const { data } = await api.delete(`${LOCATION_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error deleting location:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al eliminar la ubicación";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};
