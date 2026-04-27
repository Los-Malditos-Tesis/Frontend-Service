import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
// import CustomInput from "@/components/CustomInput";
// import CustomButton from "@/components/CustomButton";
// import CustomSelect from "@/components/CustomSelect";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createUser, updateUser } from "../../services/api";
import { userSchema } from "../../validations/UserSchema";

const roles = [
  { value: "SUPER_ADMIN", label: "Super Admin" },
  { value: "ADMIN", label: "Admin" },
  { value: "USER", label: "Operativo" },
];

const UserForm = ({ selectedUser, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(userSchema),
  });

  useEffect(() => {
    if (selectedUser) {
      setValue("name", selectedUser.name);
      setValue("email", selectedUser.email);
      setValue("role", selectedUser.role);
    } else {
      reset();
    }
  }, [selectedUser]);

  const onSubmit = async (data) => {
    try {
      if (selectedUser) {
        await updateUser(selectedUser.id, data);
        toast.success("Usuario actualizado");
      } else {
        await createUser(data);
        toast.success("Usuario creado");
      }
      onSuccess();
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error en la operación");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <CustomInput
        labelText="Nombre"
        {...register("name")}
        errors={errors.name}
      />

      <CustomInput
        labelText="Email"
        {...register("email")}
        errors={errors.email}
      />

      <CustomInput
        labelText="Password"
        type="password"
        {...register("password")}
        errors={errors.password}
      />

      <CustomSelect
        labelText="Rol"
        options={roles}
        {...register("role")}
        errors={errors.role}
      />

      <div className="md:col-span-2 mt-30">
        <CustomButton type="submit" loading={isSubmitting}>
          {selectedUser ? "Actualizar" : "Crear Usuario"}
        </CustomButton>
      </div>
    </form>
  );
};

export default UserForm;