import { api } from "./api";
import {
  getSuppliersMock,
  createSupplierMock,
  updateSupplierMock,
  deleteSupplierMock,
} from "../mocks/suppliersMock";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

/**
 * Supplier Service
 */

const SUPPLIER_BASE_URL = "/suppliers";

/**
 * Search/Get all suppliers
 */
export const searchSuppliers = async (filters = {}) => {
  try {
    // Build query parameters from filters
    const queryParams = new URLSearchParams();

    if (filters.name) queryParams.append("name", filters.name);
    if (filters.code) queryParams.append("code", filters.code);
    if (filters.phone) queryParams.append("phone", filters.phone);
    if (filters.email) queryParams.append("email", filters.email);
    if (filters.contactName) queryParams.append("contactName", filters.contactName);
    if (filters.location) queryParams.append("location", filters.location);

    const queryString = queryParams.toString();
    const url = queryString ? `${SUPPLIER_BASE_URL}/?${queryString}?page=1&limit=99999` : `${SUPPLIER_BASE_URL}?page=1&limit=99999`;

    const response = await api.get(url);
    return normalizeResponse(response);
  } catch (error) {
    console.warn("Failed to fetch suppliers from API", error.message);

    return buildErrorResponse(error, "No se pudieron cargar los proveedores");
  }
};

/**
 * Get supplier by ID
 */
export const getSupplierById = async (id) => {
  try {
    if (!id) {
      throw new Error("ID del proveedor requerido");
    }

    const { data } = await api.get(`${SUPPLIER_BASE_URL}/?id=${id}`);
    return { data, success: true };
  } catch (error) {
    console.warn(`Failed to fetch supplier ${id} from API:`, error.message);

    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || "Error al cargar el proveedor",
      details: error.message,
    };
  }
};

/**
 * Create supplier
 */
export const createSupplier = async (data) => {
  try {
    // Validate required fields
    if (!data.name || !data.code || !data.contactName || !data.phone || !data.email || !data.location) {
      throw new Error("Todos los campos son requeridos");
    }

    // Trim and validate lengths
    const payload = {
      name: String(data.name).trim(),
      code: String(data.code).trim(),
      contactName: String(data.contactName).trim(),
      phone: String(data.phone).trim(),
      email: String(data.email).trim(),
      location: String(data.location).trim(),
    };

    if (payload.name.length < 3 || payload.name.length > 100) {
      throw new Error("El nombre debe tener entre 3 y 100 caracteres");
    }

    if (payload.code.length < 3 || payload.code.length > 30) {
      throw new Error("El código debe tener entre 3 y 30 caracteres");
    }

    if (payload.contactName.length < 3 || payload.contactName.length > 80) {
      throw new Error("El nombre de contacto debe tener entre 3 y 80 caracteres");
    }

    if (payload.phone.length < 3 || payload.phone.length > 30) {
      throw new Error("El teléfono debe tener entre 3 y 30 caracteres");
    }

    if (payload.location.length < 3 || payload.location.length > 80) {
      throw new Error("La ubicación debe tener entre 3 y 80 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.post(`${SUPPLIER_BASE_URL}`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error creating supplier:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al crear el proveedor";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Update supplier
 */
export const updateSupplier = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID del proveedor requerido");
    }

    // Prepare payload with only provided fields
    const payload = {
      ...(data.name && { name: String(data.name).trim() }),
      ...(data.code && { code: String(data.code).trim() }),
      ...(data.contactName && { contactName: String(data.contactName).trim() }),
      ...(data.phone && { phone: String(data.phone).trim() }),
      ...(data.email && { email: String(data.email).trim() }),
      ...(data.location && { location: String(data.location).trim() }),
    };

    // Validate fields if provided
    if (payload.name && (payload.name.length < 3 || payload.name.length > 100)) {
      throw new Error("El nombre debe tener entre 3 y 100 caracteres");
    }

    if (payload.code && (payload.code.length < 3 || payload.code.length > 30)) {
      throw new Error("El código debe tener entre 3 y 30 caracteres");
    }

    if (payload.contactName && (payload.contactName.length < 3 || payload.contactName.length > 80)) {
      throw new Error("El nombre de contacto debe tener entre 3 y 80 caracteres");
    }

    if (payload.phone && (payload.phone.length < 3 || payload.phone.length > 30)) {
      throw new Error("El teléfono debe tener entre 3 y 30 caracteres");
    }

    if (payload.location && (payload.location.length < 3 || payload.location.length > 80)) {
      throw new Error("La ubicación debe tener entre 3 y 80 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.put(`${SUPPLIER_BASE_URL}/${id}`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating supplier:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al actualizar el proveedor";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Delete supplier
 */
export const deleteSupplier = async (id) => {
  try {
    if (!id) {
      throw new Error("ID del proveedor requerido");
    }

    const { data } = await api.delete(`${SUPPLIER_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error deleting supplier:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al eliminar el proveedor";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};
