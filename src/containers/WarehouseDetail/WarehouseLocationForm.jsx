import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import AddLocationIcon from "@mui/icons-material/AddLocation";
import CustomInput from "../../components/generic/CustomInput";
import CustomSelect from "../../components/generic/CustomSelect";
import CustomButton from "../../components/generic/CustomButton";
import { locationSchema } from "../../validations/LocationSchema";
import { CATEGORIES } from "../../utils/conts";

const LocationForm = ({ selectedLocation, warehouseId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      zone: selectedLocation?.zone || "",
      category: selectedLocation?.category || "",
      warehouse_id: warehouseId,
    },
  });

  const categoryValue = watch("category");

  useEffect(() => {
    if (selectedLocation) {
      reset({
        zone: selectedLocation.zone,
        category: selectedLocation.category || "",
        warehouse_id: warehouseId,
      });
    } else {
      reset({
        zone: "",
        category: "",
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
        category: data.category,
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
    <form onSubmit={handleSubmit(onSubmit)} className="flex w-full flex-col gap-6">
      {/* Header */}
      <div className="mb-4">
        <div className="mb-2 flex items-center gap-3">
          <AddLocationIcon className="text-accent_color text-2xl" />
          <h3 className="text-secondary_color text-xl font-extrabold">
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
        <CustomSelect
          labelText="Categoría"
          placeholderLabel="Selecciona una categoría"
          options={CATEGORIES}
          value={categoryValue}
          {...register("category")}
          errors={errors.category}
        />

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
          className="from-accent_color transform bg-linear-to-r to-blue-500 hover:scale-105 hover:shadow-lg"
          startIcon={<AddLocationIcon />}
        >
          {selectedLocation ? "Guardar Cambios" : "Crear Zona"}
        </CustomButton>
      </div>
    </form>
  );
};

export default LocationForm;
