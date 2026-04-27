import React from "react";
import { toast } from "sonner";
import { deleteSupplier } from "../../services/api";
import CustomButton from "../../components/generic/CustomButton";
import EmptyState from "../../components/generic/EmptyState";

const SuppliersTable = ({ suppliers, loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar proveedor?")) return;

    try {
      await deleteSupplier(id);
      toast.success("Proveedor eliminado");
      onRefresh();
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error al eliminar");
    }
  };

  if (loading) return <p>Cargando proveedores...</p>;

  if (!suppliers.length)
    return (
      <EmptyState
        title="Sin proveedores"
        description="Aún no hay proveedores registrados en el sistema."
        type="search"
      />
    );

  return (
    <div className="overflow-auto border rounded-lg">
      <table className="w-full text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-3">Nombre</th>
            <th>Código</th>
            <th>Contacto</th>
            <th>Teléfono</th>
            <th>Email</th>
            <th>Ubicación</th>
            <th>Productos</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {suppliers.map((supplier) => (
            <tr key={supplier.id} className="border-t align-top">
              <td className="p-3">{supplier.name}</td>
              <td>{supplier.code}</td>
              <td>{supplier.contactName}</td>
              <td>{supplier.phone}</td>
              <td>{supplier.email}</td>
              <td>{supplier.location}</td>
              <td>
                <div className="flex flex-wrap gap-1 max-w-sm py-2">
                  {(supplier.products || []).length ? (
                    supplier.products.map((product) => (
                      <span
                        key={product}
                        className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-semibold text-gray-700"
                      >
                        {product}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-500">Sin productos</span>
                  )}
                </div>
              </td>

              <td className="flex gap-2 justify-center p-2">
                <CustomButton className="w-auto! px-3" action={() => onEdit(supplier)}>
                  Editar
                </CustomButton>

                <CustomButton
                  className="w-auto! px-3 bg-red-500"
                  action={() => handleDelete(supplier.id)}
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

export default SuppliersTable;
