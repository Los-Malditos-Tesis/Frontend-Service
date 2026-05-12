import { useEffect, useState } from "react";
import { toast } from "sonner";
import { searchCameras } from "../services/camera.service";
import CamerasTable from "../containers/Cameras/CamerasTable";
import CameraForm from "../containers/Cameras/CameraForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import ApiKeyDialog from "../components/camera/ApiKeyDialog";

const CamerasPage = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [createdApiKey, setCreatedApiKey] = useState("");

  const handleCloseDrawer = () => {
    setSelectedCamera(null);
    setIsDrawerOpen(false);
  };

  const handleCreateCamera = () => {
    setSelectedCamera(null);
    setIsDrawerOpen(true);
  };

  const handleEditCamera = (camera) => {
    setSelectedCamera(camera);
    setIsDrawerOpen(true);
  };

  const handleCloseApiKeyDialog = () => {
    setCreatedApiKey("");
  };

  const handleCopyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(createdApiKey);
      toast.success("API Key copiada al portapapeles");
    } catch {
      toast.error("No se pudo copiar la API Key");
    }
  };

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const result = await searchCameras();

      if (result.success) {
        setCameras(result.data || []);
        if (result.fromMock) {
          toast.info("Usando datos locales (offline)");
        }
      } else {
        throw new Error(result.error);
      }
    } catch {
      toast.error("Error al obtener cámaras");
      setCameras([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCameras();
  }, []);

  return (
    <AdminIntroLayout
      title="Gestión de Cámaras"
      subtitle="Administra los dispositivos de visión y su ubicación dentro del almacén."
      eyebrow={<Breadcrumbs />}
      buttonLabel="Crear cámaras"
      onCreate={handleCreateCamera}
    >
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedCamera ? "Editar Cámara" : "Crear Cámara"}
      >
        <CameraForm
          selectedCamera={selectedCamera}
          onSuccess={(responseData) => {
            const apiKey = responseData?.data?.api_key || responseData?.api_key || "";

            fetchCameras();
            handleCloseDrawer();

            if (!selectedCamera && apiKey) {
              setCreatedApiKey(apiKey);
            }
          }}
        />
      </CustomDrawer>

      <ApiKeyDialog
        open={Boolean(createdApiKey)}
        apiKey={createdApiKey}
        onClose={handleCloseApiKeyDialog}
        onCopy={handleCopyApiKey}
      />

      <CamerasTable
        cameras={cameras}
        loading={loading}
        onEdit={handleEditCamera}
        onRefresh={fetchCameras}
      />
    </AdminIntroLayout>
  );
};

export default CamerasPage;