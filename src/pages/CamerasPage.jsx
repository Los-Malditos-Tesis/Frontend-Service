import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getCameras } from "../services/api";
import CamerasTable from "../containers/Cameras/CamerasTable";
import CameraForm from "../containers/Cameras/CameraForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";

const CamerasPage = () => {
  const [cameras, setCameras] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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

  const fetchCameras = async () => {
    try {
      setLoading(true);
      const { data } = await getCameras();
      setCameras(data || []);
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
          onSuccess={() => {
            fetchCameras();
            handleCloseDrawer();
          }}
        />
      </CustomDrawer>

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