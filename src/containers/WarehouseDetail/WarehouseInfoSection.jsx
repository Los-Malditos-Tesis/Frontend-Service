import { useState } from "react";
import { toast } from "sonner";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import UpdateIcon from "@mui/icons-material/Update";
import CustomInput from "../../components/generic/CustomInput";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

const WarehouseInfoSection = ({ warehouse, onUpdate, loading }) => {
  const navigate = useNavigate();

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
    <div className="relative rounded-xl transition-all duration-300">
      {/* Header with title and edit button */}
      <div className="mb-1 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <button
              type="button"
              onClick={() => navigate("/warehouses")}
              className="text-secondary_color mb-3 flex items-center justify-center rounded-lg bg-gray-100 p-2 transition hover:scale-105 hover:bg-gray-200"
              title="Volver a bodegas"
            >
              <ArrowBackIcon />
            </button>
            {/* <span className="text-5xl animate-bounce">📦</span> */}
            <div>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="border-accent_color text-secondary_color border-b-3 bg-transparent px-2 text-3xl font-extrabold transition focus:outline-none"
                />
              ) : (
                <h2 className="text-secondary_color text-4xl font-extrabold">{warehouse?.name}</h2>
              )}
            </div>
          </div>

          <div className="mt-2 flex items-start gap-2">
            {/* <LocationOnIcon className="text-accent_color mt-1" fontSize="small" /> */}
            {isEditing ? (
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="border-accent_color flex-1 border-b-2 bg-transparent px-2 font-medium text-gray-600 transition focus:outline-none"
                placeholder="Dirección..."
              />
            ) : (
              <p className="leading-relaxed font-medium text-gray-700">{warehouse?.address}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isEditing && (
            <button
              onClick={handleSave}
              disabled={loading}
              className="bg-accent_color transform rounded-lg p-3 text-white transition hover:scale-110 hover:bg-[#202124] disabled:opacity-50"
              title="Guardar"
            >
              <SaveIcon />
            </button>
          )}
          <button
            onClick={isEditing ? handleCancel : handleEdit}
            disabled={loading}
            className={`transform rounded-lg p-3 transition hover:scale-110 ${
              isEditing
                ? "bg-red-50 text-red-600 hover:bg-red-100"
                : "text-accent_color bg-blue-50 hover:bg-blue-100"
            } disabled:opacity-50`}
            title={isEditing ? "Cancelar" : "Editar"}
          >
            {isEditing ? <CancelIcon /> : <EditIcon />}
          </button>
        </div>
      </div>

      {/* Info cards */}
      <div className="flex flex-wrap items-center gap-3">
        {/* <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 px-4 py-2 text-sm font-bold text-secondary_color backdrop-blur transition hover:border-accent_color hover:text-accent_color hover:shadow-sm">
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
        </div> */}

        {isEditing && (
          <div className="border-accent_color/30 bg-accent_color/10 absolute top-[105%] inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold text-gray-600">
            <span>✨</span>
            <span>Los cambios se guardarán con el botón Guardar</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default WarehouseInfoSection;
