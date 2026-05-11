import { useState } from "react";
import WarehouseMapViewer from "./WarehouseMapViewer";
import CamerasPanelSidebar from "./CamerasPanelSidebar";

const WarehouseMapLayout = ({
  locations,
  onEditLocation,
  onDeleteLocation,
  onAddLocation,
  onAddCameraToLocation,
  onEditCamera,
  onDeleteCamera,
  loading,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState(
    locations && locations.length > 0 ? locations[0].id : null
  );

  const selectedLocation = locations.find((loc) => loc.id === selectedLocationId);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-screen">
      {/* Columna izquierda - Mapa (ocupa 2/3) */}
      <div className="lg:col-span-2">
        <WarehouseMapViewer
          locations={locations}
          selectedLocationId={selectedLocationId}
          onSelectLocation={(location) => setSelectedLocationId(location.id)}
          onEditLocation={onEditLocation}
          onDeleteLocation={onDeleteLocation}
          onAddLocation={onAddLocation}
          loading={loading}
        />
      </div>

      {/* Columna derecha - Panel de Cámaras (ocupa 1/3) */}
      <div className="lg:col-span-1">
        <CamerasPanelSidebar
          selectedLocation={selectedLocation}
          onAddCamera={onAddCameraToLocation}
          onEditCamera={onEditCamera}
          onDeleteCamera={onDeleteCamera}
        />
      </div>
    </div>
  );
};

export default WarehouseMapLayout;
