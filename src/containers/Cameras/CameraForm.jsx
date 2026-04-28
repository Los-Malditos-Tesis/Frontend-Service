import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createCamera, updateCamera, getLocations } from "../../services/api";
import { cameraSchema } from "../../validations/CameraSchema";

const CameraForm = ({ selectedCamera, onSuccess }) => {
  const [locations, setLocations] = useState([]);
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cameraSchema),
  });

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await getLocations();
        const options = (data || []).map((location) => ({
          value: location.id.toString(),
          label: location.zone,
        }));
        setLocations(options);
      } catch {
        toast.error("Error al cargar ubicaciones");
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      setValue("code", selectedCamera.code);
      setValue("api_key", selectedCamera.api_key);
      setValue("location_id", selectedCamera.location_id.toString());
    } else {
      reset();
    }
  }, [selectedCamera, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      if (selectedCamera) {
        await updateCamera(selectedCamera.id, data);
        toast.success("Cámara actualizada");
      } else {
        await createCamera(data);
        toast.success("Cámara creada");
      }
      onSuccess();
      reset();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error en la operación");
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <CustomInput labelText="Código" {...register("code")} errors={errors.code} />

      <CustomInput labelText="API Key" {...register("api_key")} errors={errors.api_key} />

      <CustomSelect
        labelText="Ubicación"
        options={locations}
        {...register("location_id")}
        errors={errors.location_id}
      />

      <div className="mt-6">
        <CustomButton type="submit" loading={isSubmitting}>
          {selectedCamera ? "Actualizar" : "Crear Cámara"}
        </CustomButton>
      </div>
    </form>
  );
};

export default CameraForm;