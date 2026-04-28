import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getLocations } from "../services/api";
import LocationsTable from "../containers/Locations/LocationsTable";
import LocationForm from "../containers/Locations/LocationForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";

const LocationsPage = () => {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

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
      const { data } = await getLocations();
      setLocations(data || []);
    } catch {
      toast.error("Error al obtener ubicaciones");
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
      buttonLabel="Crear ubicaciones"
      onCreate={handleCreateLocation}
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
      />
    </AdminIntroLayout>
  );
};

export default LocationsPage;
