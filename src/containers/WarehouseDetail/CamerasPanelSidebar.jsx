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
  canManage = true,
  onClose,
}) => {
  if (!selectedLocation) {
    return (
      <div className="flex h-full flex-col items-center justify-center rounded-2xl border-2 border-gray-200 bg-white p-8 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100">
          <VideocamIcon className="text-gray-400" fontSize="large" />
        </div>
        <p className="text-base font-bold text-gray-600">
          Selecciona una zona para ver sus cámaras
        </p>
        <p className="mt-2 text-sm text-gray-500">Haz clic en una ubicación en el mapa</p>
      </div>
    );
  }

  const cameras = selectedLocation.Cameras || [];
  const hasMonitoring = cameras.length > 0;

  return (
    <div className="flex flex-col rounded-2xl border-2 h-full border-gray-200 bg-white p-6">
      {/* Header Panel */}
      <div className="mb-5 border-b border-gray-200 pb-5">
        <div className="mb-3 flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gray-100">
            <VideocamIcon fontSize="small" className="text-secondary_color" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-secondary_color truncate font-bold">{selectedLocation.zone}</h3>
            <p className="mt-0.5 text-xs text-gray-500">Zona seleccionada</p>
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
      <div className="mb-4 flex-1 space-y-2 overflow-y-auto">
        {cameras.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-lg bg-gray-100">
              <VideocamIcon className="text-gray-400" />
            </div>
            <p className="text-sm font-medium text-gray-600">Sin cámaras</p>
            <p className="mt-1 text-xs text-gray-500">Agrega vigilancia a esta zona</p>
          </div>
        ) : (
          cameras.map((camera) => (
            <div
              key={camera.id}
              className="group rounded-lg border border-gray-100 bg-gray-50 p-3 transition hover:border-gray-300 hover:bg-gray-100"
            >
              {/* Camera Header */}
              <div className="mb-2 flex items-center justify-between gap-2">
                <p className="text-secondary_color flex-1 truncate text-sm font-bold">
                  {camera.code}
                </p>
                {/* Action Buttons */}
                {canManage ? (
                  <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                    <button
                      onClick={() => onEditCamera(camera, selectedLocation)}
                      className="hover:text-accent_color rounded-md p-1 text-gray-600 transition hover:bg-blue-50"
                      title="Editar"
                    >
                      <EditIcon fontSize="small" />
                    </button>
                    <button
                      onClick={() => onDeleteCamera(camera, selectedLocation)}
                      className="rounded-md p-1 text-gray-600 transition hover:bg-red-50 hover:text-red-500"
                      title="Eliminar"
                    >
                      <DeleteIcon fontSize="small" className="text-red-700" />
                    </button>
                  </div>
                ) : null}
              </div>

              {/* Camera Info */}
              <p className="truncate font-mono text-xs text-gray-500">
                {camera.id.substring(0, 20)}...
              </p>
            </div>
          ))
        )}
      </div>

      {/* Add Camera Button */}
      {canManage ? (
        <button
          onClick={() => onAddCamera(selectedLocation)}
          className="bg-accent_color flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold text-white transition hover:shadow-md"
        >
          <AddIcon fontSize="small" />
          Agregar Cámara
        </button>
      ) : null}
    </div>
  );
};

export default CamerasPanelSidebar;
