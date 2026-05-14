import { api } from "./api";
import {
  getProductsMock,
  createProductMock,
  updateProductMock,
  deleteProductMock,
} from "../mocks/productsMock";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

/**
 * Product Service
 */

const PRODUCT_BASE_URL = "/product";

/**
 * Search/Get all products
 */
export const searchProducts = async (filters = {}) => {
  try {
    // If filters are provided, use POST /search
    if (Object.keys(filters).length > 0) {
      const response = await api.post(`${PRODUCT_BASE_URL}/search`, filters);
      return normalizeResponse(response);
    }

    // Otherwise, try to get all products via search with empty filters
    const response = await api.post(`${PRODUCT_BASE_URL}/search`, {});
    return normalizeResponse(response);
  } catch (error) {
    console.warn("Failed to fetch products from API", error.message);

    return buildErrorResponse(error, "No se pudieron cargar los productos");
  }
};

/**
 * Get product by ID
 */
export const getProductById = async (id) => {
  try {
    if (!id) {
      throw new Error("ID del producto requerido");
    }

    const { data } = await api.get(`${PRODUCT_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.warn(`Failed to fetch product ${id} from API:`, error.message);

    return {
      data: null,
      success: false,
      error: error?.response?.data?.message || "Error al cargar el producto",
      details: error.message,
    };
  }
};

/**
 * Create product
 */
export const createProduct = async (data) => {
  try {
    // Validate required fields
    if (!data.name || !data.code || !data.category || !data.sku || !data.supplier_id) {
      throw new Error("Todos los campos son requeridos");
    }

    // Trim and validate lengths
    const payload = {
      name: String(data.name).trim(),
      code: String(data.code).trim(),
      category: String(data.category).trim(),
      sku: String(data.sku).trim(),
      supplier_id: data.supplier_id,
    };

    if (payload.name.length < 3 || payload.name.length > 100) {
      throw new Error("El nombre debe tener entre 3 y 100 caracteres");
    }

    if (payload.code.length < 3 || payload.code.length > 30) {
      throw new Error("El código debe tener entre 3 y 30 caracteres");
    }

    if (payload.category.length < 3 || payload.category.length > 30) {
      throw new Error("La categoría debe tener entre 3 y 30 caracteres");
    }

    if (payload.sku.length < 3 || payload.sku.length > 50) {
      throw new Error("El SKU debe tener entre 3 y 50 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.post(`${PRODUCT_BASE_URL}/create`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error creating product:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al crear el producto";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Update product
 */
export const updateProduct = async (id, data) => {
  try {
    if (!id) {
      throw new Error("ID del producto requerido");
    }

    // Prepare payload with only provided fields
    const payload = {
      // id en el body
      id,
      ...(data.name && { name: String(data.name).trim() }),
      ...(data.code && { code: String(data.code).trim() }),
      ...(data.category && { category: String(data.category).trim() }),
      ...(data.sku && { sku: String(data.sku).trim() }),
      ...(data.supplier_id && { supplier_id: data.supplier_id }),
    };

    // Validate fields if provided
    if (payload.name && (payload.name.length < 3 || payload.name.length > 100)) {
      throw new Error("El nombre debe tener entre 3 y 100 caracteres");
    }

    if (payload.code && (payload.code.length < 3 || payload.code.length > 30)) {
      throw new Error("El código debe tener entre 3 y 30 caracteres");
    }

    if (payload.category && (payload.category.length < 3 || payload.category.length > 30)) {
      throw new Error("La categoría debe tener entre 3 y 30 caracteres");
    }

    if (payload.sku && (payload.sku.length < 3 || payload.sku.length > 50)) {
      throw new Error("El SKU debe tener entre 3 y 50 caracteres");
    }

    // Send to API
    const { data: responseData } = await api.put(`${PRODUCT_BASE_URL}/update`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating product:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al actualizar el producto";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};

/**
 * Delete product
 */
export const deleteProduct = async (id) => {
  try {
    if (!id) {
      throw new Error("ID del producto requerido");
    }

    const { data } = await api.delete(`${PRODUCT_BASE_URL}/delete/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error deleting product:", error);

    const errorMessage =
      error?.response?.data?.message ||
      error?.message ||
      "Error al eliminar el producto";

    return {
      data: null,
      success: false,
      error: errorMessage,
      details: error.message,
    };
  }
};
