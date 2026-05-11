import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import CustomDrawer from "../components/generic/CustomDrawer";
import WarehouseInfoSection from "../containers/WarehouseDetail/WarehouseInfoSection";
import WarehouseMapLayout from "../containers/WarehouseDetail/WarehouseMapLayout";
import LocationForm from "../containers/WarehouseDetail/WarehouseLocationForm";
import CameraForm from "../containers/WarehouseDetail/WarehouseCameraForm";
import {
  getWarehouseStructure,
} from "../services/warehouse.detail.service";
import {
  createLocation,
  updateLocation,
  deleteLocation,
} from "../services/location.service";
import {
  createCamera,
  updateCamera,
  deleteCamera,
} from "../services/camera.service";
import { updateWarehouse } from "../services/warehouse.service";

const WarehouseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState(null);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer states
  const [isLocationFormOpen, setIsLocationFormOpen] = useState(false);
  const [isCameraFormOpen, setIsCameraFormOpen] = useState(false);

  // Edit states
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedCamera, setSelectedCamera] = useState(null);
  const [cameraLocationId, setCameraLocationId] = useState(null);

  // Fetch warehouse structure
  const fetchWarehouseData = useCallback(async () => {
    try {
      setLoading(true);
      const result = await getWarehouseStructure(id);

      if (result.success) {
        setWarehouse(result.data);
        setLocations(result.data?.Locations || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching warehouse:", error);
      toast.error(error?.message || "Error al cargar la bodega");
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWarehouseData();
    }
  }, [id, fetchWarehouseData]);

  // Warehouse handlers
  const handleUpdateWarehouse = async (data) => {
    try {
      console.log("Updating warehouse with data:", data);
      const result = await updateWarehouse(id, data);
      console.log("Warehouse update result:", result);

      if (result.success) {
        setWarehouse((prev) => ({ ...prev, ...data }));
        toast.success("Bodega actualizada exitosamente");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error updating warehouse:", error);
      toast.error(error?.message || "Error al actualizar la bodega");
    }
  };

  // Location handlers
  const handleAddLocation = () => {
    setSelectedLocation(null);
    setIsLocationFormOpen(true);
  };

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setIsLocationFormOpen(true);
  };

  const handleDeleteLocation = async (location) => {
    if (!window.confirm(`¿Eliminar la ubicación "${location.zone}"?`)) {
      return;
    }

    try {
      const result = await deleteLocation(location.id);

      if (result.success) {
        setLocations((prev) => prev.filter((l) => l.id !== location.id));
        toast.success("Ubicación eliminada exitosamente");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting location:", error);
      toast.error(error?.message || "Error al eliminar la ubicación");
    }
  };

  const handleSaveLocation = async (formData) => {
    try {
      const payload = {
        ...formData,
        warehouse_id: id,
      };

      let result;
      if (selectedLocation) {
        result = await updateLocation(selectedLocation.id, payload);
      } else {
        result = await createLocation(payload);
      }

      if (result.success) {
        toast.success(
          selectedLocation
            ? "Ubicación actualizada exitosamente"
            : "Ubicación creada exitosamente"
        );
        setIsLocationFormOpen(false);
        fetchWarehouseData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving location:", error);
      toast.error(error?.message || "Error al guardar la ubicación");
    }
  };

  // Camera handlers
  const handleAddCamera = (location) => {
    setSelectedCamera(null);
    setCameraLocationId(location.id);
    setIsCameraFormOpen(true);
  };

  const handleEditCamera = (camera, location) => {
    setSelectedCamera(camera);
    setCameraLocationId(location.id);
    setIsCameraFormOpen(true);
  };

  const handleDeleteCamera = async (camera, location) => {
    if (!window.confirm(`¿Eliminar la cámara "${camera.code}"?`)) {
      return;
    }

    try {
      const result = await deleteCamera(camera.id);

      if (result.success) {
        setLocations((prev) =>
          prev.map((loc) =>
            loc.id === location.id
              ? {
                ...loc,
                Cameras: loc.Cameras.filter((c) => c.id !== camera.id),
              }
              : loc
          )
        );
        toast.success("Cámara eliminada exitosamente");
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error deleting camera:", error);
      toast.error(error?.message || "Error al eliminar la cámara");
    }
  };

  const handleSaveCamera = async (formData) => {
    try {
      const payload = {
        ...formData,
        location_id: cameraLocationId,
      };

      let result;
      if (selectedCamera) {
        result = await updateCamera(selectedCamera.id, payload);
      } else {
        result = await createCamera(payload);
      }

      if (result.success) {
        toast.success(
          selectedCamera
            ? "Cámara actualizada exitosamente"
            : "Cámara creada exitosamente"
        );
        setIsCameraFormOpen(false);
        fetchWarehouseData();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error saving camera:", error);
      toast.error(error?.message || "Error al guardar la cámara");
    }
  };

  if (loading && !warehouse) {
    return (
      <AdminIntroLayout
        title="Cargando detalles de bodega..."
        eyebrow={<Breadcrumbs />}
      >
        <div className="flex justify-center items-center gap-3">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-accent_color"></div>
          <p className="text-gray-500">Por favor espera...</p>
        </div>
      </AdminIntroLayout>
    );
  }

  if (!warehouse) {
    return (
      <AdminIntroLayout title="Bodega no encontrada" eyebrow={<Breadcrumbs />}>
        <div className="text-center py-12">
          <p className="text-gray-500 mb-4">No se pudo cargar la bodega solicitada</p>
          <button
            onClick={() => navigate("/warehouses")}
            className="px-4 py-2 bg-accent_color text-white rounded-lg hover:bg-secondary_color transition font-bold inline-flex items-center gap-2"
          >
            <ArrowBackIcon fontSize="small" />
            Volver a bodegas
          </button>
        </div>
      </AdminIntroLayout>
    );
  }

  return (
    <AdminIntroLayout
      title="Detalle de Bodega"
      // title={warehouse.name}
      subtitle="Visualiza y gestiona la estructura completa de tu bodega - Mapa de ubicaciones, cámaras y más"
      eyebrow={<Breadcrumbs />}
      buttonLabel={
        <>
          <ArrowBackIcon fontSize="small" />
          Volver a Bodegas
        </>
      }
      onCreate={() => navigate("/warehouses")}
      showAddIcon={false}
    >
      <div className="space-y-8">
        {/* Warehouse Info Section */}
        <div className="animate-fadeIn">
          <WarehouseInfoSection
            warehouse={warehouse}
            onUpdate={handleUpdateWarehouse}
            loading={loading}
          />
        </div>

        {/* Warehouse Map Layout Section */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.2s" }}>
          <WarehouseMapLayout
            locations={locations}
            onEditLocation={handleEditLocation}
            onDeleteLocation={handleDeleteLocation}
            onAddLocation={handleAddLocation}
            onAddCameraToLocation={handleAddCamera}
            onEditCamera={handleEditCamera}
            onDeleteCamera={handleDeleteCamera}
            loading={loading}
          />
        </div>
      </div>

      {/* Location Form Drawer */}
      <CustomDrawer
        isOpen={isLocationFormOpen}
        onClose={() => setIsLocationFormOpen(false)}
        title={selectedLocation ? "Editar Ubicación" : "Crear Ubicación"}
      >
        <LocationForm
          selectedLocation={selectedLocation}
          warehouseId={id}
          onSuccess={handleSaveLocation}
        />
      </CustomDrawer>

      {/* Camera Form Drawer */}
      <CustomDrawer
        isOpen={isCameraFormOpen}
        onClose={() => setIsCameraFormOpen(false)}
        title={selectedCamera ? "Editar Cámara" : "Crear Cámara"}
      >
        <CameraForm
          selectedCamera={selectedCamera}
          locationId={cameraLocationId}
          onSuccess={handleSaveCamera}
        />
      </CustomDrawer>
    </AdminIntroLayout>
  );
};

export default WarehouseDetailPage;
