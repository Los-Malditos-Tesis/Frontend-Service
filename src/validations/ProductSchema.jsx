import { z } from "zod";

export const productSchema = z.object({
  name: z.string().min(3, "Nombre debe tener entre 3 y 100 caracteres").max(100, "Nombre debe tener entre 3 y 100 caracteres"),
  code: z.string().min(3, "Código debe tener entre 3 y 30 caracteres").max(30, "Código debe tener entre 3 y 30 caracteres"),
  sku: z.string().min(3, "SKU debe tener entre 3 y 50 caracteres").max(50, "SKU debe tener entre 3 y 50 caracteres"),
  category: z.string().min(3, "Categoría debe tener entre 3 y 30 caracteres").max(30, "Categoría debe tener entre 3 y 30 caracteres"),
  supplier_id: z.string().min(1, "Selecciona un proveedor"),
});
