import { z } from "zod";
import { ORDER_TYPES, ORDER_UNIT_TYPES } from "../utils/conts.jsx";

const orderTypeValues = Object.values(ORDER_TYPES);
const orderUnitValues = Object.values(ORDER_UNIT_TYPES);

export const orderSchema = z
  .object({
    type: z.enum(orderTypeValues, {
      message: "Selecciona un tipo de orden",
    }),
    unit_type: z.enum(orderUnitValues, {
      message: "Selecciona una unidad",
    }),
    origin_warehouse_id: z.string().min(1, "Selecciona una bodega origen"),
    product_id: z.string().min(1, "Selecciona un producto"),
    total_quantity: z
      .union([z.string(), z.number()])
      .refine((value) => value !== "" && value !== null && value !== undefined, {
        message: "La cantidad total es requerida",
      })
      .refine((value) => Number(value) > 0, {
        message: "La cantidad total debe ser mayor que 0",
      }),
    destination_warehouse_id: z.string().optional().default(""),
    store_id: z.string().optional().default(""),
  })
  .superRefine((value, ctx) => {
    if (value.type === ORDER_TYPES.SALE && !value.store_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["store_id"],
        message: "Debes seleccionar una tienda destino",
      });
    }

    if (value.type === ORDER_TYPES.TRANSFER && !value.destination_warehouse_id) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination_warehouse_id"],
        message: "Debes seleccionar una bodega destino",
      });
    }

    if (
      value.type === ORDER_TYPES.TRANSFER &&
      value.destination_warehouse_id &&
      value.origin_warehouse_id &&
      value.destination_warehouse_id === value.origin_warehouse_id
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["destination_warehouse_id"],
        message: "La bodega destino no puede ser la misma que la origen",
      });
    }
  });
