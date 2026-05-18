import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import CustomDrawer from "../components/generic/CustomDrawer";
import WarehouseInfoSection from "../containers/WarehouseDetail/WarehouseInfoSection";
import WarehouseMapLayout from "../containers/WarehouseDetail/WarehouseMapLayout";
import WarehouseProductsTable from "../containers/WarehouseDetail/WarehouseProductsTable";
import WarehouseOrdersTable from "../containers/WarehouseDetail/WarehouseOrdersTable";
import WarehouseScmModeCard from "../containers/WarehouseDetail/WarehouseScmModeCard";
import LocationForm from "../containers/WarehouseDetail/WarehouseLocationForm";
import CameraForm from "../containers/WarehouseDetail/WarehouseCameraForm";
import { getWarehouseStructure } from "../services/warehouse.detail.service";
import { searchProducts } from "../services/product.service";
import { searchOrders } from "../services/order.service";
import { getConfigParams } from "../services/configParam.service";
import { createLocation, updateLocation, deleteLocation } from "../services/location.service";
import { createCamera, updateCamera, deleteCamera } from "../services/camera.service";
import { updateWarehouse } from "../services/warehouse.service";

const WarehouseDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [warehouse, setWarehouse] = useState(null);
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [scmParam, setScmParam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(true);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [scmLoading, setScmLoading] = useState(true);

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

  const fetchWarehouseProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      const result = await searchProducts({ warehouse_id: id });

      if (result.success) {
        setProducts(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching warehouse products:", error);
      toast.error(error?.message || "Error al cargar productos del warehouse");
      setProducts([]);
    } finally {
      setProductsLoading(false);
    }
  }, [id]);

  const fetchWarehouseOrders = useCallback(async () => {
    try {
      setOrdersLoading(true);
      const result = await searchOrders({
        origin_warehouse_id: id,
        destination_warehouse_id: id,
      });

      if (result.success) {
        setOrders(result.data || []);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching warehouse orders:", error);
      toast.error(error?.message || "Error al cargar órdenes del warehouse");
      setOrders([]);
    } finally {
      setOrdersLoading(false);
    }
  }, [id]);

  const fetchWarehouseScmMode = useCallback(async () => {
    try {
      setScmLoading(true);
      const result = await getConfigParams({ warehouse_id: id, key: "SCM" });

      if (result.success) {
        const params = Array.isArray(result.data) ? result.data : [];
        const warehouseParam =
          params.find(
            (param) => String(param.warehouse_id) === String(id) && param.key === "SCM"
          ) || null;
        setScmParam(warehouseParam);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching warehouse SCM mode:", error);
      toast.error(error?.message || "Error al cargar el modo de escaneo de la bodega");
      setScmParam(null);
    } finally {
      setScmLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      fetchWarehouseData();
      fetchWarehouseProducts();
      fetchWarehouseOrders();
      fetchWarehouseScmMode();
    }
  }, [id, fetchWarehouseData, fetchWarehouseProducts, fetchWarehouseOrders, fetchWarehouseScmMode]);

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

  const handleRefreshScmMode = () => {
    fetchWarehouseScmMode();
  };

  const handleRefreshAll = async () => {
    try {
      await Promise.all([
        fetchWarehouseData(),
        fetchWarehouseProducts(),
        fetchWarehouseOrders(),
        fetchWarehouseScmMode(),
      ]);
      toast.success("Información de la bodega actualizada");
    } catch (error) {
      console.error("Error refreshing warehouse detail:", error);
      toast.error(error?.message || "Error al refrescar la información");
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
          selectedLocation ? "Ubicación actualizada exitosamente" : "Ubicación creada exitosamente"
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
          selectedCamera ? "Cámara actualizada exitosamente" : "Cámara creada exitosamente"
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
      <AdminIntroLayout title="Cargando detalles de bodega..." eyebrow={<Breadcrumbs />}>
        <div className="flex items-center justify-center gap-3">
          <div className="border-accent_color h-12 w-12 animate-spin rounded-full border-t-2"></div>
          <p className="text-gray-500">Por favor espera...</p>
        </div>
      </AdminIntroLayout>
    );
  }

  if (!warehouse) {
    return (
      <AdminIntroLayout title="Bodega no encontrada" eyebrow={<Breadcrumbs />}>
        <div className="py-12 text-center">
          <p className="mb-4 text-gray-500">No se pudo cargar la bodega solicitada</p>
          <button
            onClick={() => navigate("/warehouses")}
            className="bg-accent_color hover:bg-secondary_color inline-flex items-center gap-2 rounded-lg px-4 py-2 font-bold text-white transition"
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
      // title="Detalle de Bodega"
      // subtitle="Visualiza y gestiona la estructura completa de tu bodega - Mapa de ubicaciones, cámaras y más"
      eyebrow={<Breadcrumbs />}
      // buttonLabel={
      //   <>
      //     <ArrowBackIcon fontSize="small" />
      //     Volver a Bodegas
      //   </>
      // }
      // onCreate={() => navigate("/warehouses")}
      // secondaryButtonLabel="Refrescar"
      // onSecondaryCreate={handleRefreshAll}
      // secondaryStartIcon={<RefreshRoundedIcon />}
      // secondaryButtonClassName="!max-w-[10.5rem]"
      // showAddIcon={false}
      className="!mb-0 pt-6 pb-0"
    >
      <div className="animate-fadeIn">
        <WarehouseInfoSection
          warehouse={warehouse}
          onUpdate={handleUpdateWarehouse}
          loading={loading}
        />
      </div>
      <div className="space-y-18">
        {/* Warehouse Info Section */}

        {/* SCM Mode Card */}
        <div className="animate-fadeIn" style={{ animationDelay: "0.05s" }}>
          <WarehouseScmModeCard
            warehouseId={id}
            warehouseName={warehouse?.name}
            param={scmParam}
            loading={scmLoading}
            onUpdated={handleRefreshScmMode}
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

        <div className="animate-fadeIn" style={{ animationDelay: "0.35s" }}>
          <WarehouseProductsTable products={products} loading={productsLoading} />
        </div>

        <div className="animate-fadeIn" style={{ animationDelay: "0.5s" }}>
          <WarehouseOrdersTable
            warehouseId={id}
            warehouseName={warehouse?.name}
            orders={orders}
            loading={ordersLoading}
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
