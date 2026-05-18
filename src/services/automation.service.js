import { api } from "./api";
import { buildErrorResponse } from "../utils/apiHelper";

const AUTOMATION_BASE_URL = "/automation";

export const runAutomation = async (payload) => {
  try {
    const { data } = await api.post(AUTOMATION_BASE_URL, payload);

    return {
      success: true,
      data: data?.data ?? data,
      message: data?.message || "Consulta realizada correctamente",
    };
  } catch (error) {
    console.warn("Failed to run automation lookup:", error.message);

    return buildErrorResponse(
      error,
      error?.response?.data?.message || "Error al consultar las cámaras",
      true
    );
  }
};