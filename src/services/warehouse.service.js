import { api } from "./api";
import {
  getWarehousesMock,
  createWarehouseMock,
  updateWarehouseMock,
  deleteWarehouseMock,
} from "../mocks/warehousesMock";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

/**
 * Warehouse Service
 */

const WAREHOUSE_BASE_URL = "/warehouse";

/**
 * Search/Get all warehouses
 */
export const searchWarehouses = async (filters = {}) => {
  try {
    // If filters are provided, use POST /search
    if (Object.keys(filters).length > 0) {
      const response = await api.post(`${WAREHOUSE_BASE_URL}/search`, filters);
      return normalizeResponse(response);
    }

    // Otherwise, try to get all warehouses via search with empty filters
    const response = await api.post(`${WAREHOUSE_BASE_URL}/search`, {});
    return normalizeResponse(response);
  } catch (error) {
    console.warn("Failed to fetch warehouses from API", error.message);

    return buildErrorResponse(error, "No se pudieron cargar las bodegas");
  }
};

/**
 * Get warehouse by ID
 */
export const getWarehouseById = async (id) => {
  try {
    if (!id) {
      throw new Error("ID de bodega requerido");
    }

    const { data } = await api.get(`${WAREHOUSE_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.warn(`Failed to fetch warehouse ${id} from API:`, error.message);
    
    // No mock fallback for single item (data integrity)
    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || "Error al cargar la bodega",
      details: error.message,
    };
  }
};

/**
 * Create warehouse
 */
export const createWarehouse = async (data) => {
  try {
    // Validate required fields
    if (!data.name || !data.address) {
      throw new Error("Nombre y dirección son requeridos");
    }

    // Trim and validate lengths
    const payload = {
      name: String(data.name).trim(),
      address: String(data.address).trim(),
    };

    if (payload.name.length < 3 || payload.name.length > 30) {
      throw new Error("El nombre debe tener entre 3 y 30 caracteres");
    }

    if (payload.address.length < 3 || payload.address.length > 250) {
      throw new Error("La dirección debe tener entre 3 y 250 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.post(`${WAREHOUSE_BASE_URL}/create`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    // Log the error but provide user-friendly message
    console.error("Error creating warehouse:", error);

    // Extract API error message if available
    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al crear la bodega";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Update warehouse
 */
export const updateWarehouse = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID de bodega requerido");
    }

    // Prepare payload with id (API expects it in body)
    const payload = {
      id,
      ...(data.name && { name: String(data.name).trim() }),
      ...(data.address && { address: String(data.address).trim() }),
    };

    // Validate fields if provided
    if (payload.name && (payload.name.length < 3 || payload.name.length > 30)) {
      throw new Error("El nombre debe tener entre 3 y 30 caracteres");
    }

    if (payload.address && (payload.address.length < 3 || payload.address.length > 250)) {
      throw new Error("La dirección debe tener entre 3 y 250 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.put(`${WAREHOUSE_BASE_URL}/update`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating warehouse:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al actualizar la bodega";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Delete warehouse
 */
export const deleteWarehouse = async (id) => {
  try {
    if (!id) {
      throw new Error("ID de bodega requerido");
    }

    const { data } = await api.delete(`${WAREHOUSE_BASE_URL}/delete/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error deleting warehouse:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al eliminar la bodega";

    // Check for specific error cases
    if (error?.response?.status === 409) {
      return {
        data: null,
        success: false,
        error: "No se puede eliminar una bodega con ubicaciones activas",
        code: "CONFLICT",
      };
    }

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Get warehouse inventory (if needed)
 */
// export const getWarehouseInventory = async (warehouseId, locationId) => {
//   try {
//     if (!warehouseId || !locationId) {
//       throw new Error("Warehouse ID y Location ID son requeridos");
//     }

//     const { data } = await api.get(
//       `${WAREHOUSE_BASE_URL}/inventory/${locationId}/in/${warehouseId}`
//     );
//     return { data, success: true };
//   } catch (error) {
//     console.warn("Failed to fetch warehouse inventory:", error.message);

//     return {
//       data: null,
//       success: false,
//       error: "Error al cargar el inventario de la bodega",
//       details: error.message,
//     };
//   }
// };

/**
 * Get warehouse structure
 */
// export const getWarehouseStructure = async (id) => {
//   try {
//     if (!id) {
//       throw new Error("ID de bodega requerido");
//     }

//     const { data } = await api.get(`${WAREHOUSE_BASE_URL}/structure/${id}`);
//     return { data, success: true };
//   } catch (error) {
//     console.warn("Failed to fetch warehouse structure:", error.message);

//     return {
//       data: null,
//       success: false,
//       error: "Error al cargar la estructura de la bodega",
//       details: error.message,
//     };
//   }
// };
