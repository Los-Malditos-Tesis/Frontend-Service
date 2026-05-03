import { z } from "zod";

export const storeSchema = z.object({
  name: z
    .string()
    .min(3, "Nombre requerido (mínimo 3 caracteres)")
    .max(100, "Máximo 100 caracteres")
    .regex(
      /^[a-zA-Z0-9._\-\s]+$/,
      "Solo alfanuméricos, puntos, guiones y espacios permitidos"
    ),
  code: z
    .string()
    .min(3, "Código requerido (mínimo 3 caracteres)")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Solo alfanuméricos, puntos y guiones"),
  address: z
    .string()
    .min(3, "Dirección requerida (mínimo 3 caracteres)")
    .max(100, "Máximo 100 caracteres")
    .regex(
      /^[a-zA-Z0-9.,#_\-\s]+$/,
      "Solo alfanuméricos, comas, puntos, almohadillas, guiones y espacios"
    ),
});