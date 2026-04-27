import React from "react";
import { toast } from "sonner";
import { deleteProduct } from "../../services/api";
import CustomButton from "../../components/generic/CustomButton";
import EmptyState from "../../components/generic/EmptyState";

const ProductsTable = ({ products, loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      await deleteProduct(id);
      toast.success("Producto eliminado");
      onRefresh();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  if (loading) return <p>Cargando productos...</p>;

  if (!products.length)
    return (
      <EmptyState
        title="Sin productos"
        description="Aún no hay productos registrados en el catálogo."
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
            <th>SKU</th>
            <th>Categoría</th>
            <th>Proveedor</th>
            <th className="text-center">Acciones</th>
          </tr>
        </thead>

        <tbody>
          {products.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.name}</td>
              <td>{p.code}</td>
              <td>{p.sku}</td>
              <td>{p.category}</td>
              <td>{p.supplier_name}</td>

              <td className="flex gap-2 justify-center p-2">
                <CustomButton
                  className="!w-auto px-3"
                  action={() => onEdit(p)}
                >
                  Editar
                </CustomButton>

                <CustomButton
                  className="!w-auto px-3 bg-red-500"
                  action={() => handleDelete(p.id)}
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

export default ProductsTable;
