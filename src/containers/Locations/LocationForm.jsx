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

const LocationForm = ({ selectedLocation, onSuccess }) => {
  const [warehouses, setWarehouses] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(locationSchema),
  });

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    if (selectedLocation) {
      setValue("zone", selectedLocation.zone);
      setValue("warehouse_id", selectedLocation.warehouse_id.toString());
    } else {
      reset();
    }
  }, [selectedLocation, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      let result;

      if (selectedLocation) {
        result = await updateLocation(selectedLocation.id, data);
        if (result.success) {
          toast.success("Ubicación actualizada correctamente");
        } else {
          throw new Error(result.error);
        }
      } else {
        result = await createLocation(data);
        if (result.success) {
          toast.success("Ubicación creada correctamente");
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
      <CustomSelect
        labelText="Bodega"
        options={warehouses}
        {...register("warehouse_id")}
        errors={errors.warehouse_id}
      />

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
