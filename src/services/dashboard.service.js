import { api } from "./api";
import { buildErrorResponse } from "../utils/apiHelper";

const DASHBOARD_BASE_URL = "/dashboard";

export const getDashboardStats = async () => {
  try {
    const response = await api.get(DASHBOARD_BASE_URL);

    return {
      data: response?.data?.data || {},
      success: !!response?.data?.success,
      message: response?.data?.message || "",
      code: response?.data?.code ?? 0,
    };
  } catch (error) {
    console.warn("Failed to fetch dashboard stats from API", error.message);

    return {
      ...buildErrorResponse(error, "No se pudieron cargar los indicadores del dashboard", true),
      data: null,
    };
  }
};

export default {
  getDashboardStats,
};
