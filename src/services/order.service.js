import { api } from "./api";
import { buildErrorResponse, normalizeResponse } from "../utils/apiHelper";

const ORDER_BASE_URL = "/order";

const buildOrderPayload = (data) => {
  const payload = {
    type: String(data?.type || "").trim(),
    unit_type: String(data?.unit_type || "").trim(),
    origin_warehouse_id: String(data?.origin_warehouse_id || "").trim(),
    product_id: String(data?.product_id || "").trim(),
    total_quantity:
      data?.total_quantity === "" || data?.total_quantity === null || data?.total_quantity === undefined
        ? ""
        : Number(data.total_quantity),
  };

  if (payload.type === "SALE" && data?.store_id) {
    payload.store_id = String(data.store_id).trim();
  }

  if (payload.type === "TRANSFER" && data?.destination_warehouse_id) {
    payload.destination_warehouse_id = String(data.destination_warehouse_id).trim();
  }

  return payload;
};

export const searchOrders = async () => {
  try {
    const response = await api.get(ORDER_BASE_URL);
    return normalizeResponse(response);
  } catch (error) {
    console.warn("Failed to fetch orders from API", error.message);
    return buildErrorResponse(error, "No se pudieron cargar las ordenes");
  }
};

export const createOrder = async (data) => {
  try {
    if (!data?.type || !data?.unit_type || !data?.origin_warehouse_id || !data?.product_id) {
      throw new Error("Tipo, unidad, bodega origen y producto son obligatorios");
    }

    const payload = buildOrderPayload(data);
    if (!payload.total_quantity || Number.isNaN(payload.total_quantity) || payload.total_quantity <= 0) {
      throw new Error("La cantidad total debe ser mayor que cero");
    }

    if (payload.type === "SALE" && !payload.store_id) {
      throw new Error("La orden de venta requiere una tienda destino");
    }

    if (payload.type === "TRANSFER" && !payload.destination_warehouse_id) {
      throw new Error("La transferencia requiere una bodega destino");
    }

    const { data: responseData } = await api.post(`${ORDER_BASE_URL}/`, payload);
    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error creating order:", error);

    return {
      data: null,
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Error al crear la orden",
      details: error.message,
    };
  }
};

export const updateOrderStatus = async (id, status) => {
  try {
    if (!id) {
      throw new Error("ID de orden requerido");
    }

    if (!status) {
      throw new Error("Estado requerido");
    }

    const { data: responseData } = await api.patch(`${ORDER_BASE_URL}/${id}`, {
      status,
    });

    return { data: responseData, success: true };
  } catch (error) {
    console.error("Error updating order status:", error);

    return {
      data: null,
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Error al actualizar la orden",
      details: error.message,
    };
  }
};

export const deleteOrder = async (id) => {
  try {
    if (!id) {
      throw new Error("ID de orden requerido");
    }

    const { data } = await api.delete(`${ORDER_BASE_URL}/${id}`);
    return { data, success: true };
  } catch (error) {
    console.error("Error deleting order:", error);

    return {
      data: null,
      success: false,
      error:
        error?.response?.data?.message ||
        error?.message ||
        "Error al eliminar la orden",
      details: error.message,
    };
  }
};
