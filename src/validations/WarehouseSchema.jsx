import { z } from "zod";

export const warehouseSchema = z.object({
  name: z
    .string()
    .min(3, "Nombre requerido (mínimo 3 caracteres)")
    .max(30, "Máximo 30 caracteres")
    .regex(
      /^[a-zA-Z0-9._\s,\-#áéíóúÁÉÍÓÚñÑ]+$/,
      "Solo alfanuméricos, espacios y caracteres especiales permitidos"
    ),
  address: z
    .string()
    .min(3, "Dirección requerida (mínimo 3 caracteres)")
    .max(250, "Máximo 250 caracteres")
    .regex(
      /^[a-zA-Z0-9._\s,\-#áéíóúÁÉÍÓÚñÑ]+$/,
      "Solo alfanuméricos, espacios y caracteres especiales permitidos"
    ),
});
