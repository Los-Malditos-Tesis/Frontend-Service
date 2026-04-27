import React from "react";
import { toast } from "sonner";
import { deleteLocation } from "../../services/api";
import CustomButton from "../../components/generic/CustomButton";
import EmptyState from "../../components/generic/EmptyState";

const LocationsTable = ({ locations, loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar ubicación?")) return;

    try {
      await deleteLocation(id);
      toast.success("Ubicación eliminada");
      onRefresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al eliminar");
    }
  };

  if (loading) return <p>Cargando ubicaciones...</p>;

  if (!locations.length)
    return (
      <EmptyState
        title="Sin ubicaciones"
        description="Aún no hay zonas registradas en el sistema."
        type="search"
      />
    );

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Zona</th>
            <th>Bodega</th>
            <th className="text-center">Pallets</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {locations.map((loc) => (
            <tr key={loc.id} className="border-t">
              <td className="p-3 font-mono font-bold">{loc.zone}</td>
              <td>{loc.warehouse_name}</td>
              <td className="text-center">{loc.pallets_count}</td>

              <td className="flex gap-2 justify-center p-2">
                <CustomButton
                  className="!w-auto px-3"
                  action={() => onEdit(loc)}
                >
                  Editar
                </CustomButton>

                <CustomButton
                  className="!w-auto px-3 bg-red-500"
                  action={() => handleDelete(loc.id)}
                >
                  Eliminar
                </CustomButton>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default LocationsTable;
