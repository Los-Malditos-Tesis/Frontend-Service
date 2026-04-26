import { z } from "zod";

export const LoginSchema = z.object({
    email: z.email("Dirección de correo electrónico no válida"),
    password: z.string().min(6, "La contraseña debe tener al menos 6 caracteres"),
});