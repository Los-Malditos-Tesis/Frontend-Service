import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createLocation, updateLocation } from "../../services/location.service";
import { searchWarehouses } from "../../services/warehouse.service";
import { locationSchema } from "../../validations/LocationSchema";
import { CATEGORIES } from "../../utils/conts";

const LocationForm = ({ selectedLocation, warehouseId, onSuccess }) => {
  const [warehouses, setWarehouses] = useState([]);
  const shouldShowWarehouseSelect = !warehouseId;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(locationSchema),
    defaultValues: {
      zone: "",
      category: "",
      warehouse_id: warehouseId || "",
    },
  });

  const categoryValue = watch("category");
  const warehouseValue = watch("warehouse_id");

  useEffect(() => {
    if (!shouldShowWarehouseSelect) {
      return;
    }

    const fetchWarehouses = async () => {
      try {
        const result = await searchWarehouses();
        if (result.success) {
          const options = result.data.map((warehouse) => ({
            value: warehouse.id.toString(),
            label: warehouse.name,
          }));
          setWarehouses(options);
        } else {
          toast.error("Error al cargar bodegas");
        }
      } catch (error) {
        console.error("Error fetching warehouses:", error);
        toast.error("Error al cargar bodegas");
      }
    };

    fetchWarehouses();
  }, [shouldShowWarehouseSelect]);

  useEffect(() => {
    if (selectedLocation) {
      reset({
        zone: selectedLocation.zone ?? "",
        category: selectedLocation.category ?? "",
        warehouse_id:
          warehouseId ||
          selectedLocation.warehouse_id?.toString() ||
          selectedLocation.Warehouse?.id?.toString() ||
          "",
      });
    } else {
      reset({
        zone: "",
        category: "",
        warehouse_id: warehouseId || "",
      });
    }
  }, [selectedLocation, warehouseId, reset]);

  const onSubmit = async (data) => {
    try {
      const resolvedWarehouseId = warehouseId || data.warehouse_id;

      if (!data.zone.trim()) {
        toast.error("La zona es requerida");
        return;
      }

      const payload = {
        zone: data.zone,
        category: data.category,
        warehouse_id: resolvedWarehouseId,
      };

      let result;

      if (selectedLocation) {
        result = await updateLocation(selectedLocation.id, payload);
      } else {
        result = await createLocation(payload);
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success(selectedLocation ? "Ubicación actualizada correctamente" : "Ubicación creada correctamente");
      await onSuccess(result.data);
      reset();
    } catch (err) {
      const errorMsg = err?.message || "Error en la operación";
      toast.error(errorMsg);
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <CustomSelect
        labelText="Categoría"
        placeholderLabel="Debes seleccionar una categoría"
        options={CATEGORIES}
        value={categoryValue}
        {...register("category")}
        errors={errors.category}
      />

      {shouldShowWarehouseSelect && (
        <CustomSelect
          labelText="Bodega"
          placeholderLabel="Debes seleccionar una bodega"
          options={warehouses}
          value={warehouseValue}
          {...register("warehouse_id")}
          errors={errors.warehouse_id}
        />
      )}

      <CustomInput
        labelText="Zona"
        placeholder="Ej: RECEPCION-01"
        {...register("zone")}
        errors={errors.zone}
      />

      <div className="mt-6">
        <CustomButton type="submit" loading={isSubmitting}>
          {selectedLocation ? "Actualizar" : "Crear Ubicación"}
        </CustomButton>
      </div>
    </form>
  );
};

export default LocationForm;
