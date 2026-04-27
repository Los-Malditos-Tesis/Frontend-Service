import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { createSupplier, updateSupplier } from "../../services/api";
import { supplierSchema } from "../../validations/SupplierSchema";

const SupplierForm = ({ selectedSupplier, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(supplierSchema),
  });

  useEffect(() => {
    if (selectedSupplier) {
      setValue("name", selectedSupplier.name);
      setValue("code", selectedSupplier.code);
      setValue("contactName", selectedSupplier.contactName);
      setValue("phone", selectedSupplier.phone);
      setValue("email", selectedSupplier.email);
      setValue("location", selectedSupplier.location);
    } else {
      reset();
    }
  }, [selectedSupplier, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (selectedSupplier) {
        await updateSupplier(selectedSupplier.id, data);
        toast.success("Proveedor actualizado");
      } else {
        await createSupplier(data);
        toast.success("Proveedor creado");
      }
      onSuccess();
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error en la operación");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <CustomInput labelText="Nombre" {...register("name")} errors={errors.name} />
      <CustomInput labelText="Código" {...register("code")} errors={errors.code} />
      <CustomInput
        labelText="Nombre de contacto"
        {...register("contactName")}
        errors={errors.contactName}
      />
      <CustomInput labelText="Teléfono" {...register("phone")} errors={errors.phone} />
      <CustomInput labelText="Email" {...register("email")} errors={errors.email} />
      <CustomInput labelText="Ubicación" {...register("location")} errors={errors.location} />

      <div className="mt-6">
        <CustomButton type="submit" loading={isSubmitting}>
          {selectedSupplier ? "Actualizar" : "Crear Proveedor"}
        </CustomButton>
      </div>
    </form>
  );
};

export default SupplierForm;
