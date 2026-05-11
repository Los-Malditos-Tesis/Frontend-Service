import { z } from "zod";

export const cameraSchema = z.object({
  code: z
    .string()
    .min(3, "Código requerido")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Formato de código inválido"),
  api_key: z.string().optional(),
  location_id: z.string().min(1, "Selecciona una ubicación"),
});