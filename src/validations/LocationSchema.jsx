import { z } from "zod";

export const locationSchema = z.object({
  zone: z
    .string()
    .min(3, "Nombre de zona requerido (mínimo 3 caracteres)")
    .max(30, "Máximo 30 caracteres")
    .regex(
      /^[a-zA-Z0-9._-]+$/,
      "Solo alfanuméricos, puntos, guiones y guiones bajos permitidos"
    ),
  warehouse_id: z.string().optional(),
});
