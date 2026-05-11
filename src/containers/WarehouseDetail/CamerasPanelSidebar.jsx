import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import VideocamIcon from "@mui/icons-material/Videocam";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";

const CamerasPanelSidebar = ({
  selectedLocation,
  onAddCamera,
  onEditCamera,
  onDeleteCamera,
  onClose,
}) => {
  if (!selectedLocation) {
    return (
      <div className="bg-white border-2 border-gray-200 rounded-2xl p-8  flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center mb-4">
          <VideocamIcon className="text-gray-400" fontSize="large" />
        </div>
        <p className="text-gray-600 font-bold text-base">
          Selecciona una zona para ver sus cámaras
        </p>
        <p className="text-gray-500 text-sm mt-2">Haz clic en una ubicación en el mapa</p>
      </div>
    );
  }

  const cameras = selectedLocation.Cameras || [];
  const hasMonitoring = cameras.length > 0;

  return (
    <div className="bg-white border-2 border-gray-200 rounded-2xl p-6   flex flex-col">
      {/* Header Panel */}
      <div className="mb-5 pb-5 border-b border-gray-200">
        <div className="flex items-start gap-3 mb-3">
          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
            <VideocamIcon fontSize="small" className="text-secondary_color" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-secondary_color truncate">
              {selectedLocation.zone}
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">Zona seleccionada</p>
          </div>
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 text-sm font-bold">
          {hasMonitoring ? (
            <>
              <CheckCircleIcon fontSize="small" className="text-emerald-600" />
              <span className="text-emerald-600">Monitoreada</span>
            </>
          ) : (
            <>
              <HighlightOffIcon fontSize="small" className="text-gray-400" />
              <span className="text-gray-500">Sin vigilancia</span>
            </>
          )}
        </div>
      </div>

      {/* Cameras List */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-2">
        {cameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mb-3">
              <VideocamIcon className="text-gray-400" />
            </div>
            <p className="text-gray-600 font-medium text-sm">Sin cámaras</p>
            <p className="text-gray-500 text-xs mt-1">
              Agrega vigilancia a esta zona
            </p>
          </div>
        ) : (
          cameras.map((camera) => (
            <div
              key={camera.id}
              className="group bg-gray-50 border border-gray-100 rounded-lg p-3 hover:border-gray-300 hover:bg-gray-100 transition"
            >
              {/* Camera Header */}
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="font-bold text-secondary_color text-sm truncate flex-1">
                  {camera.code}
                </p>
                {/* Action Buttons */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                  <button
                    onClick={() => onEditCamera(camera, selectedLocation)}
                    className="p-1 text-gray-600 hover:text-accent_color hover:bg-blue-50 rounded-md transition"
                    title="Editar"
                  >
                    <EditIcon fontSize="small" />
                  </button>
                  <button
                    onClick={() => onDeleteCamera(camera, selectedLocation)}
                    className="p-1 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition"
                    title="Eliminar"
                  >
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
              </div>

              {/* Camera Info */}
              <p className="text-xs text-gray-500 font-mono truncate">
                {camera.id.substring(0, 20)}...
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Camera Button */}
      <button
        onClick={() => onAddCamera(selectedLocation)}
        className="w-full py-2.5 bg-accent_color text-white rounded-lg hover:shadow-md transition font-bold text-sm flex items-center justify-center gap-2"
      >
        <AddIcon fontSize="small" />
        Agregar Cámara
      </button>
    </div>
  );
};

export default CamerasPanelSidebar;
