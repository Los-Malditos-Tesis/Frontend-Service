import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().email("Dirección de correo electrónico no válida"),
  password: z.string().trim().min(1, "La contraseña es obligatoria"),
});