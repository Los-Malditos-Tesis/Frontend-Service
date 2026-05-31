import { useState } from "react";
import WarehouseMapViewer from "./WarehouseMapViewer";
import CamerasPanelSidebar from "./CamerasPanelSidebar";
import AddIcon from "@mui/icons-material/Add";

const WarehouseMapLayout = ({
  locations,
  onEditLocation,
  onDeleteLocation,
  onAddLocation,
  onAddCameraToLocation,
  onEditCamera,
  onDeleteCamera,
  canManage = true,
  loading,
}) => {
  const [selectedLocationId, setSelectedLocationId] = useState(
    locations && locations.length > 0 ? locations[0].id : null
  );

  const selectedLocation = locations.find((loc) => loc.id === selectedLocationId);

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Mapa</p>
          <h3 className="mt-1 text-2xl font-black text-slate-900">Mapa de ubicaciones</h3>
          <p className="mt-1 text-sm text-slate-600">
            Lista de ubicaciones disponibles en esta bodega. Aquí puedes ver la distribución actual
            y los detalles de cada zona.
          </p>
        </div>

        {canManage ? (
          <button
            onClick={onAddLocation}
            className="bg-accent_color flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold text-white transition hover:shadow-md"
          >
            <AddIcon fontSize="small" />
            Nueva Zona
          </button>
        ) : null}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Columna izquierda - Mapa (ocupa 2/3) */}
        <div className="lg:col-span-2">
          <WarehouseMapViewer
            locations={locations}
            selectedLocationId={selectedLocationId}
            onSelectLocation={(location) => setSelectedLocationId(location.id)}
            onEditLocation={onEditLocation}
            onDeleteLocation={onDeleteLocation}
            onAddLocation={onAddLocation}
            canManage={canManage}
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
            canManage={canManage}
          />
        </div>
      </div>
    </div>
  );
};

export default WarehouseMapLayout;
