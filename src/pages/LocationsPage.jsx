import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getLocations } from "../services/api";
import LocationsTable from "../containers/Locations/LocationsTable";
import LocationForm from "../containers/Locations/LocationForm";
import CustomButton from "../components/generic/CustomButton";
import CustomDrawer from "../components/generic/CustomDrawer";
import { CustomContainer } from "../components/generic/CustomContainer";
import { SectionIntro } from "../components/generic/SectionIntro";

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
    <CustomContainer>
      <div className="space-y-6">
        <SectionIntro
          title="Mapa Lógico"
          eyebrow="Gestión de Ubicaciones"
          divider
          vertical
        >
          <p>
            Administra las zonas y estantes del almacén. Registra ubicaciones, asigna cámaras y organiza el inventario.
          </p>

          <CustomButton className="max-w-xs" action={handleCreateLocation}>
            Crear ubicación
          </CustomButton>
        </SectionIntro>

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
      </div>
    </CustomContainer>
  );
};

export default LocationsPage;
