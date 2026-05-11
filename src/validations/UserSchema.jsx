import { z } from "zod";

export const userSchema = z.object({
  id: z.string().uuid("Id inválido"),
  name: z.string().min(3, "Nombre requerido").max(100, "Máximo 100 caracteres"),
  email: z.string().email("Email inválido"),
  status: z.boolean(),
});