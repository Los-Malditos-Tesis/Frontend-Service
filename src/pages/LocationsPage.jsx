import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { searchLocations } from "../services/location.service";
import LocationsTable from "../containers/Locations/LocationsTable";
import LocationForm from "../containers/Locations/LocationForm";
import CustomDrawer from "../components/generic/CustomDrawer";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import { canManageGeneral } from "../utils/accessControl";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { user } = useAuth();
  const canManage = canManageGeneral(user);

  const handleCloseDrawer = () => {
    setSelectedLocation(null);
    setIsDrawerOpen(false);
  };

  const handleCreateLocation = () => {
    setSelectedLocation(null);
    setIsDrawerOpen(true);
  };

  const handleEditLocation = (location) => {
    setSelectedLocation(location);
    setIsDrawerOpen(true);
  };

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const result = await searchLocations();

      if (result.success) {
        setLocations(result.data || []);
        if (result.fromMock) {
          toast.info("Usando datos locales (offline)");
        }
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
      toast.error(error?.message || "Error al obtener ubicaciones");
      setLocations([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  return (
    <AdminIntroLayout
      title="Gestión de Ubicaciones"
      subtitle="Administra las zonas y estantes del almacén. Registra ubicaciones, asigna cámaras y organiza el inventario."
      eyebrow={<Breadcrumbs />}
      buttonLabel={canManage ? "Crear ubicaciones" : undefined}
      onCreate={canManage ? handleCreateLocation : undefined}
    >
      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title={selectedLocation ? "Editar Ubicación" : "Crear Ubicación"}
      >
        <LocationForm
          selectedLocation={selectedLocation}
          onSuccess={() => {
            fetchLocations();
            handleCloseDrawer();
          }}
        />
      </CustomDrawer>

      <LocationsTable
        locations={locations}
        loading={loading}
        onEdit={handleEditLocation}
        onRefresh={fetchLocations}
        canManage={canManage}
      />
    </AdminIntroLayout>
  );
};

export default LocationsPage;
