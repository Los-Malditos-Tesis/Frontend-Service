import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { createStore, updateStore } from "../../services/api";
import { storeSchema } from "../../validations/StoreSchema";

const StoreForm = ({ selectedStore, onSuccess }) => {
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(storeSchema),
  });

  useEffect(() => {
    if (selectedStore) {
      setValue("name", selectedStore.name);
      setValue("code", selectedStore.code);
      setValue("address", selectedStore.address);
    } else {
      reset();
    }
  }, [selectedStore, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (selectedStore) {
        await updateStore(selectedStore.id, data);
        toast.success("Tienda actualizada");
      } else {
        await createStore(data);
        toast.success("Tienda creada");
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
        labelText="Nombre comercial"
        placeholder="Ej: Tienda Central"
        {...register("name")}
        errors={errors.name}
      />

      <CustomInput
        labelText="Código interno"
        placeholder="Ej: ST-001"
        {...register("code")}
        errors={errors.code}
      />

      <CustomInput
        labelText="Dirección"
        placeholder="Ej: Av. Principal 123, Zona Norte"
        {...register("address")}
        errors={errors.address}
      />

      <div className="mt-6">
        <CustomButton type="submit" loading={isSubmitting}>
          {selectedStore ? "Actualizar" : "Crear Tienda"}
        </CustomButton>
      </div>
    </form>
  );
};

export default StoreForm;