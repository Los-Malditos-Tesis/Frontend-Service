import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import VideocamIcon from "@mui/icons-material/Videocam";
import CustomInput from "../../components/generic/CustomInput";
import CustomButton from "../../components/generic/CustomButton";
import { cameraSchema } from "../../validations/CameraSchema";

const CameraForm = ({ selectedCamera, locationId, onSuccess }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(cameraSchema),
    defaultValues: {
      code: selectedCamera?.code || "",
      api_key: selectedCamera?.api_key || "",
      location_id: locationId,
    },
  });

  useEffect(() => {
    if (selectedCamera) {
      reset({
        code: selectedCamera.code,
        api_key: selectedCamera.api_key || "",
        location_id: locationId,
      });
    } else {
      reset({
        code: "",
        api_key: "",
        location_id: locationId,
      });
    }
  }, [selectedCamera, locationId, reset]);

  const onSubmit = async (data) => {
    try {
      if (!data.code.trim()) {
        toast.error("El código de cámara es requerido");
        return;
      }

      const formData = {
        code: data.code,
        api_key: data.api_key || "",
        location_id: locationId,
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
          <VideocamIcon className="text-accent_color text-2xl" />
          <h3 className="text-xl font-extrabold text-secondary_color">
            {selectedCamera ? "Editar Cámara" : "Nueva Cámara"}
          </h3>
        </div>
        <p className="text-sm text-gray-600">
          {selectedCamera
            ? "Modifica los datos de esta cámara de vigilancia"
            : "Registra una nueva cámara para esta zona"}
        </p>
      </div>

      {/* Form Inputs */}
      <div className="space-y-4 flex flex-col gap-4">
        <CustomInput
          labelText="Código de Cámara"
          placeholder="Ej: CAM001, C-ZA-001, VIDEOCAM-A1"
          {...register("code")}
          errors={errors.code}
        />

        <CustomInput
          labelText="API Key"
          placeholder="Clave de integración con la API"
          {...register("api_key")}
          errors={errors.api_key}
        />
      </div>

      {/* Submit Button */}
      <div className="mt-4">
        <CustomButton
          type="submit"
          loading={isSubmitting}
          className="bg-gradient-to-r from-accent_color to-blue-500 hover:shadow-lg hover:scale-105 transform"
          startIcon={<VideocamIcon />}
        >
          {selectedCamera ? "Guardar Cámara" : "Registrar Cámara"}
        </CustomButton>
      </div>
    </form>
  );
};

export default CameraForm;
