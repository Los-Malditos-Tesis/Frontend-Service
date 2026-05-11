import { useState } from "react";
import { toast } from "sonner";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import CustomInput from "../../components/generic/CustomInput";

const WarehouseInfoSection = ({ warehouse, onUpdate, loading }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: warehouse?.name || "",
    address: warehouse?.address || "",
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setFormData({
      name: warehouse?.name || "",
      address: warehouse?.address || "",
    });
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!formData.name.trim()) {
      toast.error("El nombre de la bodega es requerido");
      return;
    }

    await onUpdate(formData);
    setIsEditing(false);
  };

  const formatDate = (date) => {
    if (!date) return "--";
    return new Date(date).toLocaleString("es-SV", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mb-20 relative overflow-hidden bg-gradient-to-br from-blue-50/30 via-white to-indigo-/30 border-2 border-bordercolor rounded-xl  transition-all duration-300 p-8">
    
      {/* Header with title and edit button */}
      <div className="flex items-start justify-between mb-1">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            {/* <span className="text-5xl animate-bounce">📦</span> */}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-b-3 border-accent_color bg-transparent text-3xl font-extrabold text-secondary_color focus:outline-none px-2 transition"
                />
              ) : (
                <h2 className="text-4xl font-extrabold text-secondary_color">
                  {warehouse?.name}
                </h2>
              )}
            </div>
          </div>

          <div className="flex items-start gap-2 mt-2">
            {/* <LocationOnIcon className="text-accent_color mt-1" fontSize="small" /> */}
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border-b-2 border-accent_color bg-transparent text-gray-600 focus:outline-none px-2 flex-1 transition font-medium"
                placeholder="Dirección..."
              />
            ) : (
              <p className="text-gray-700 font-medium leading-relaxed">
                {warehouse?.address}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="p-3 bg-accent_color hover:bg-[#202124] text-white rounded-lg transition transform hover:scale-110 disabled:opacity-50"
              title="Guardar"
            >
              <SaveIcon />
            </button>
          )}
          <button
            onClick={isEditing ? handleCancel : handleEdit}
            disabled={loading}
            className={`p-3 rounded-lg transition transform hover:scale-110 ${isEditing
              ? "bg-red-50 text-red-600 hover:bg-red-100"
              : "bg-blue-50 text-accent_color hover:bg-blue-100"
              } disabled:opacity-50`}
            title={isEditing ? "Cancelar" : "Editar"}
          >
            {isEditing ? <CancelIcon /> : <EditIcon />}
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-secondary_color backdrop-blur transition hover:border-accent_color hover:text-accent_color hover:shadow-sm">
          <CalendarTodayIcon fontSize="small" className="text-accent_color" />
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Creada
          </span>
          <span>{formatDate(warehouse?.createdAt)}</span>
        </div>

        <div className="inline-flex items-center gap-2 rounded-full border border-purple-200 bg-white/80 px-4 py-2 text-sm font-bold text-secondary_color backdrop-blur transition hover:border-purple-400 hover:text-purple-600 hover:shadow-sm">
          <UpdateIcon fontSize="small" className="text-purple-600" />
          <span className="text-xs uppercase tracking-widest text-gray-500">
            Actualizada
          </span>
          <span>{formatDate(warehouse?.updatedAt)}</span>
        </div>

        {isEditing && (
          <div className="inline-flex items-center gap-2 rounded-full border border-accent_color/30 bg-accent_color/10 px-4 py-2 text-sm font-semibold text-gray-600">
            <span>✨</span>
            <span>Los cambios se guardarán con el botón Guardar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseInfoSection;
