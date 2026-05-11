import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";

import EmailIcon from "@mui/icons-material/Email";
import LockIcon from "@mui/icons-material/Lock";

import { loginSchema } from "../../validations/LoginSchema";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    setSubmitting(true);

    try {
      await login(data);
      navigate("/dashboard", { replace: true });
    } catch {
      // El toast ya lo maneja el contexto de auth.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex gap-8 flex-col">
      {/* <h2 className="text-5xl mb-8 text-center">
        Logi
        <span className="text-5xl text-accent_color font-bold ">Vision</span>
      </h2> */}

      <h1 className="text-4xl font-extrabold text-center">
        Iniciar Sesión
      </h1>

      <p className="text-lg z-10 text-center">
        Ingresa tus credenciales para acceder a tu cuenta
      </p>

      {/* EMAIL */}
      <CustomInput
      labelText="Correo Electrónico"
        name="email"
        placeholder="ejemplo@correo.com"
        icon={<EmailIcon />}
        errors={errors.email}
        innerRef={register("email")}
      />

      {/* PASSWORD */}
      <CustomInput
        labelText="Contraseña"
        name="password"
        type="password"
        placeholder="********"
        icon={<LockIcon />}
        errors={errors.password}
        innerRef={register("password")}
      />

      {/* BUTTON */}
      <CustomButton
        className="mt-6"
        type="submit"
        loading={isSubmitting || submitting}
      >
        Iniciar Sesión
      </CustomButton>
    </form>
  );
};

export default LoginForm;