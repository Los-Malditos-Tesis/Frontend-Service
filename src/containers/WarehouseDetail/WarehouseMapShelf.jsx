import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import StorageIcon from "@mui/icons-material/Storage";

const WarehouseMapShelf = ({
  location,
  isSelected,
  onClick,
  onEdit,
  onDelete,
  cameraCount,
}) => {
  return (
    <div
      onClick={onClick}
      className={`
        relative group cursor-pointer transition-all duration-300
        ${isSelected ? "ring-2 ring-accent_color" : ""}
      `}
    >
      {/* Tarjeta minimalista */}
      <div
        className={`
          bg-white border-2 transition-all duration-300
          rounded-xl p-6 min-h-40 flex flex-col justify-between
          ${isSelected ? "border-accent_color shadow-lg" : "border-gray-200 hover:border-gray-300 hover:shadow-md"}
        `}
      >
        {/* Contenido */}
        <div className="flex-1">
          {/* Header con icono */}
          <div className="flex items-start gap-3 mb-4">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center shrink-0">
              <StorageIcon fontSize="small" className="text-secondary_color" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-bold text-secondary_color truncate">
                {location.zone}
              </h3>
              <p className="text-xs text-gray-500 mt-1">Ubicación</p>
            </div>
          </div>

          {/* Contador de cámaras */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-lg text-sm">
            <span className="text-base">📹</span>
            <span className="font-semibold text-gray-700">
              {cameraCount} {cameraCount === 1 ? "cámara" : "cámaras"}
            </span>
          </div>
        </div>

        {/* Estado de vigilancia */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <span className={`text-xs font-bold uppercase tracking-wide ${cameraCount > 0 ? "text-emerald-600" : "text-gray-400"
            }`}>
            {cameraCount > 0 ? "✓ Monitoreada" : "○ Sin vigilancia"}
          </span>
        </div>
      </div>

      {/* Botones de acción - aparecen al hover */}
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 flex gap-1.5 bg-white rounded-lg p-1.5 shadow-md">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onEdit(location);
          }}
          className="p-1.5 text-gray-600 hover:text-accent_color hover:bg-blue-50 rounded-md transition"
          title="Editar zona"
        >
          <EditIcon fontSize="small" />
        </button>
        <div className="w-px bg-gray-200"></div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete(location);
          }}
          className="p-1.5 text-gray-600 hover:text-red-500 hover:bg-red-50 rounded-md transition"
          title="Eliminar zona"
        >
          <DeleteIcon fontSize="small" className="text-red-700" />
        </button>
      </div>
    </div>
  );
};

export default WarehouseMapShelf;
