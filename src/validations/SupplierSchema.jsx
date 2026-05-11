import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .min(3, "Nombre requerido")
    .max(100, "Máximo 100 caracteres")
    .regex(/^[a-zA-Z0-9 ._-]+$/, "Formato de nombre inválido"),
  code: z
    .string()
    .min(3, "Código requerido")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[a-zA-Z0-9._-]+$/, "Formato de código inválido"),
  contactName: z
    .string()
    .min(3, "Nombre de contacto requerido")
    .max(80, "Máximo 80 caracteres")
    .regex(/^[a-zA-Z0-9 ._-]+$/, "Formato de contacto inválido"),
  phone: z
    .string()
    .min(3, "Teléfono requerido")
    .max(30, "Máximo 30 caracteres")
    .regex(/^[0-9+() \-]+$/, "Formato de teléfono inválido"),
  email: z
    .string()
    .email("Email inválido")
    .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Email inválido"),
  location: z
    .string()
    .min(3, "Ubicación requerida")
    .max(80, "Máximo 80 caracteres")
    .regex(/^[a-zA-Z0-9 ._-]+$/, "Formato de ubicación inválido"),
});
