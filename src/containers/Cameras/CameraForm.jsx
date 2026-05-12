import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import CustomSelect from "../../components/generic/CustomSelect";
import { createCamera, updateCamera } from "../../services/camera.service";
import { searchLocations } from "../../services/location.service";
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
        const result = await searchLocations();
        if (result.success) {
          const options = (result.data || []).map((location) => ({
            value: location.id.toString(),
            label: location.zone,
          }));
          setLocations(options);
          if (result.fromMock) {
            toast.info("Usando datos locales (offline)");
          }
        } else {
          throw new Error(result.error);
        }
      } catch {
        toast.error("Error al cargar ubicaciones");
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (selectedCamera) {
      setValue("code", selectedCamera.code);
      setValue("location_id", selectedCamera.location_id.toString());
    } else {
      reset();
    }
  }, [selectedCamera, setValue, reset]);

  const onSubmit = async (data) => {
    try {
      let result;

      if (selectedCamera) {
        result = await updateCamera(selectedCamera.id, data);
        if (result.success) {
          toast.success("Cámara actualizada correctamente");
        } else {
          throw new Error(result.error);
        }
      } else {
        result = await createCamera(data);
        if (result.success) {
          toast.success("Cámara creada correctamente");
        } else {
          throw new Error(result.error);
        }
      }

      onSuccess(result.data);
      reset();
    } catch (err) {
      const errorMsg = err?.message || "Error en la operación";
      toast.error(errorMsg);
      console.error("Form submission error:", err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full flex flex-col gap-4">
      <CustomInput labelText="Código" {...register("code")} errors={errors.code} />

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