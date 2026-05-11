import { z } from "zod";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d]{8,30}$/;

export const registerSchema = z
  .object({
    name: z.string().min(3, "Nombre requerido").max(30, "Máximo 30 caracteres"),
    email: z.string().email("Email inválido"),
    password: z.string().min(8, "Mínimo 8 caracteres").max(30, "Máximo 30 caracteres").regex(passwordRegex, "La contraseña debe tener mayúscula, minúscula y número"),
    confirmPassword: z.string().min(8, "Confirma la contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export default registerSchema;
