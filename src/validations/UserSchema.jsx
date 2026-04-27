import { z } from "zod";

export const userSchema = z.object({
  name: z.string().min(3, "Nombre requerido"),
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  role: z.string().min(1, "Selecciona un rol"),
});