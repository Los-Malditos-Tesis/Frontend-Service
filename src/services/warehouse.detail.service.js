import { api } from "./api";
import { buildErrorResponse } from "../utils/apiHelper";

/**
 * Warehouse Detail Service
 */

const WAREHOUSE_BASE_URL = "/warehouse";

/**
 * Get warehouse structure by ID
 */
export const getWarehouseStructure = async (id) => {
  try {
    if (!id) {
      throw new Error("ID de bodega requerido");
    }

    const { data } = await api.get(`${WAREHOUSE_BASE_URL}/structure/${id}`);
    console.log("Warehouse structure fetched:", data);
    return { data: data?.data, success: true };
  } catch (error) {
    console.warn(`Failed to fetch warehouse structure ${id} from API:`, error.message);

    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || "Error al cargar la estructura de la bodega",
      details: error.message,
    };
  }
};

/**
 * Update warehouse details
 */
// export const updateWarehouseDetails = async (id, data) => {
//   try {
//     if (!id) throw new Error("ID de bodega requerido");

//     const payload = {
//       ...(data.name && { name: String(data.name).trim() }),
//       ...(data.address && { address: String(data.address).trim() }),
//     };

//     const { data: responseData } = await api.put(`${WAREHOUSE_BASE_URL}/${id}`, payload);
//     return { data: responseData, success: true };
//   } catch (error) {
//     console.error("Error updating warehouse:", error);

//     const errorMessage =
//       error?.response?.data?.message || error?.message || "Error al actualizar la bodega";

//     return {
//       data: null,
//       success: false,
//       error: errorMessage,
//       details: error.message,
//     };
//   }
// };
