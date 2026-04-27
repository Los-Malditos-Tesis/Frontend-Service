import React from "react";
import { toast } from "sonner";
import { deleteWarehouse } from "../../services/api";
import CustomButton from "../../components/generic/CustomButton";
import EmptyState from "../../components/generic/EmptyState";

const WarehousesTable = ({ warehouses, loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar bodega?")) return;

    try {
      await deleteWarehouse(id);
      toast.success("Bodega eliminada");
      onRefresh();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  if (loading) return <p>Cargando bodegas...</p>;

  if (!warehouses.length)
    return (
      <EmptyState
        title="Sin bodegas"
        description="Aún no hay bodegas registradas en el sistema."
        type="search"
      />
    );

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Nombre</th>
            <th>Dirección</th>
            <th className="text-center">Zonas</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {warehouses.map((w) => (
            <tr key={w.id} className="border-t">
              <td className="p-3">{w.name}</td>
              <td>{w.address}</td>
              <td className="text-center">{w.locations_count}</td>

              <td className="flex gap-2 justify-center p-2">
                <CustomButton
                  className="!w-auto px-3"
                  action={() => onEdit(w)}
                >
                  Editar
                </CustomButton>

                <CustomButton
                  className="!w-auto px-3 bg-red-500"
                  action={() => handleDelete(w.id)}
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

export default WarehousesTable;
