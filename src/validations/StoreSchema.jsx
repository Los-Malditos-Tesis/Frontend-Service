import { z } from "zod";

export const storeSchema = z.object({
  name: z
    .string()
    .min(3, "Nombre requerido (mínimo 3 caracteres)")
    .max(80, "Máximo 80 caracteres")
    .regex(
      /^[a-zA-Z0-9._\s,\-#áéíóúÁÉÍÓÚñÑ]+$/,
      "Solo alfanuméricos, espacios y caracteres especiales permitidos"
    ),
  code: z
    .string()
    .min(2, "Código requerido (mínimo 2 caracteres)")
    .max(20, "Máximo 20 caracteres")
    .regex(/^[a-zA-Z0-9_-]+$/, "Solo letras, números, guiones y guiones bajos"),
  address: z
    .string()
    .min(3, "Dirección requerida (mínimo 3 caracteres)")
    .max(250, "Máximo 250 caracteres")
    .regex(
      /^[a-zA-Z0-9._\s,\-#áéíóúÁÉÍÓÚñÑ]+$/,
      "Solo alfanuméricos, espacios y caracteres especiales permitidos"
    ),
});