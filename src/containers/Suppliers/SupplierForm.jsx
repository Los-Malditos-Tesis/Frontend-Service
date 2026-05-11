import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { createSupplier, updateSupplier } from "../../services/supplier.service";
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
      let result;

      if (selectedSupplier) {
        result = await updateSupplier(selectedSupplier.id, data);
        if (result.success) {
          toast.success("Proveedor actualizado correctamente");
        } else {
          throw new Error(result.error);
        }
      } else {
        result = await createSupplier(data);
        if (result.success) {
          toast.success("Proveedor creado correctamente");
        } else {
          throw new Error(result.error);
        }
      }

      onSuccess();
      reset();
    } catch (err) {
      const errorMsg = err?.message || "Error en la operación";
      toast.error(errorMsg);
      console.error("Form submission error:", err);
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
