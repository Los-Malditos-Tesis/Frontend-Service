import { api } from "./api";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

const SCAN_BASE_URL = "/scan";

/**
 * Search/Get scan events
 */
export const searchScans = async (filters = {}) => {
  try {
    if (Object.keys(filters).length > 0) {
      const response = await api.post(`${SCAN_BASE_URL}/search`, filters);
      return normalizeResponse(response);
    }

    const response = await api.post(`${SCAN_BASE_URL}/search`, {});
    return normalizeResponse(response);
  } catch (error) {
    console.warn("Failed to fetch scan events from API", error.message);
    return buildErrorResponse(error, "No se pudieron cargar los eventos de escaneo");
  }
};

export default {
  searchScans,
};
