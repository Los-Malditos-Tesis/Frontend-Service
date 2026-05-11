import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { locationSchema } from "../../validations/LocationSchema";

const LocationForm = ({ selectedLocation, warehouseId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      zone: selectedLocation?.zone || "",
      warehouse_id: warehouseId,
    },
  });

  useEffect(() => {
    if (selectedLocation) {
      reset({
        zone: selectedLocation.zone,
        warehouse_id: warehouseId,
      });
    } else {
      reset({
        zone: "",
        warehouse_id: warehouseId,
      });
    }
  }, [selectedLocation, warehouseId, reset]);

  const onSubmit = async (data) => {
    try {
      if (!data.zone.trim()) {
        toast.error("La zona es requerida");
        return;
      }

      const formData = {
        zone: data.zone,
        warehouse_id: warehouseId,
      };

      await onSuccess(formData);
      reset();
    } catch (err) {
      const errorMsg = err?.message || "Error en la operación";
      toast.error(errorMsg);
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-6">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-3 mb-2">
          <AddLocationIcon className="text-accent_color text-2xl" />
          <h3 className="text-xl font-extrabold text-secondary_color">
            {selectedLocation ? "Editar Zona" : "Nueva Zona"}
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          {selectedLocation
            ? "Modifica el nombre de esta zona de almacenamiento"
            : "Crea una nueva zona para organizar tu bodega"}
        </p>
      </div>

      {/* Form Input */}
      <div className="space-y-3">
        <CustomInput
          labelText="Nombre de la Zona"
          placeholder="Ej: RECEPCION-01, ELECTRONICA, BODEGA A"
          {...register("zone")}
          errors={errors.zone}
        />

        {/* <p className="text-xs text-gray-500 flex items-start gap-2">
          <span>💡</span>
          <span>
            Usa nombres descriptivos y alfanuméricos (máx. 30 caracteres) para identificar
            fácilmente cada zona
          </span>
        </p> */}
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <CustomButton
          type="submit"
          loading={isSubmitting}
          className="bg-gradient-to-r from-accent_color to-blue-500 hover:shadow-lg hover:scale-105 transform"
          startIcon={<AddLocationIcon />}
        >
          {selectedLocation ? "Guardar Cambios" : "Crear Zona"}
        </CustomButton>
      </div>
    </form>
  );
};

export default LocationForm;
