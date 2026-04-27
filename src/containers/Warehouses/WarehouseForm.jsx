import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { createWarehouse, updateWarehouse } from "../../services/api";
import { warehouseSchema } from "../../validations/WarehouseSchema";

const WarehouseForm = ({ selectedWarehouse, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(warehouseSchema),
  });

  useEffect(() => {
    if (selectedWarehouse) {
      setValue("name", selectedWarehouse.name);
      setValue("address", selectedWarehouse.address);
    } else {
      reset();
    }
  }, [selectedWarehouse, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (selectedWarehouse) {
        await updateWarehouse(selectedWarehouse.id, data);
        toast.success("Bodega actualizada");
      } else {
        await createWarehouse(data);
        toast.success("Bodega creada");
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
        labelText="Nombre de la Bodega"
        placeholder="Ej: Bodega Central"
        {...register("name")}
        errors={errors.name}
      />

      <CustomInput
        labelText="Dirección"
        placeholder="Ej: Av. Principal 123, Zona Norte"
        {...register("address")}
        errors={errors.address}
      />

      <div className="mt-6">
        <CustomButton type="submit" loading={isSubmitting}>
          {selectedWarehouse ? "Actualizar" : "Crear Bodega"}
        </CustomButton>
      </div>
    </form>
  );
};

export default WarehouseForm;
