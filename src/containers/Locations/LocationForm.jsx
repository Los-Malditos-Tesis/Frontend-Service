import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createLocation, updateLocation, getWarehouses } from "../../services/api";
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
        const { data } = await getWarehouses();
        const options = data.map((warehouse) => ({
          value: warehouse.id.toString(),
          label: warehouse.name,
        }));
        setWarehouses(options);
      } catch {
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
      if (selectedLocation) {
        await updateLocation(selectedLocation.id, data);
        toast.success("Ubicación actualizada");
      } else {
        await createLocation(data);
        toast.success("Ubicación creada");
      }
      onSuccess();
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error en la operación");
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
