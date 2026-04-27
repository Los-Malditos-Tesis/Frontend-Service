import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nombre requerido"),
  code: z.string().min(2, "Código requerido"),
  sku: z.string().min(2, "SKU requerido"),
  category: z.string().min(1, "Selecciona una categoría"),
  supplier_id: z.string().min(1, "Selecciona un proveedor"),
});
