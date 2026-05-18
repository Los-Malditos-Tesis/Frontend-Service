import { api } from "./api";
import { buildErrorResponse } from "../utils/apiHelper";

const CONFIG_PARAM_BASE_URL = "/config-params";

export const getConfigParams = async (filters = {}) => {
  try {
    const response = await api.get(CONFIG_PARAM_BASE_URL, {
      params: filters,
    });

    return {
      data: response?.data?.data || [],
      success: true,
      message: response?.data?.message,
    };
  } catch (error) {
    console.warn("Failed to fetch config params from API", error.message);
    return buildErrorResponse(error, "No se pudieron cargar los parámetros de configuración");
  }
};

export const updateConfigParam = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID del parámetro requerido");
    }

    const payload = {
      id,
      ...(data?.key && { key: String(data.key).trim() }),
      ...(data?.value && { value: String(data.value).trim() }),
      ...(data?.warehouse_id && { warehouse_id: String(data.warehouse_id).trim() }),
    };

    const { data: responseData } = await api.put(`${CONFIG_PARAM_BASE_URL}/${id}`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating config param:", error);

    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || error?.message || "Error al actualizar el parámetro",
      details: error.message,
    };
  }
};
