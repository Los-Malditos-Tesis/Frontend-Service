import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { createWarehouse, updateWarehouse } from "../../services/warehouse.service";
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
      let result;

      if (selectedWarehouse) {
        result = await updateWarehouse(selectedWarehouse.id, data);
        if (result.success) {
          toast.success("Bodega actualizada correctamente");
        } else {
          throw new Error(result.error);
        }
      } else {
        result = await createWarehouse(data);
        if (result.success) {
          toast.success("Bodega creada correctamente");
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
