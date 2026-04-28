import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete } from "@mui/icons-material";

import { deleteProduct } from "../../services/api";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const ProductsTable = ({ products = [], loading, onEdit, onRefresh }) => {
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

  const columns = [
    columnHelper.accessor("name", {
      header: "Nombre",
    }),
    columnHelper.accessor("code", {
      header: "Código",
    }),
    columnHelper.accessor("sku", {
      header: "SKU",
    }),
    columnHelper.accessor("category", {
      header: "Categoría",
    }),
    columnHelper.accessor("supplier_name", {
      header: "Proveedor",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(product)}
              className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
            >
              <Edit fontSize="small" />
            </button>

            <button
              onClick={() => handleDelete(product.id)}
              className="rounded-lg p-2 transition hover:bg-red-50 active:scale-95"
            >
              <Delete fontSize="small" />
            </button>
          </div>
        );
      },
    }),
  ];

  return (
    <CustomTable
      title="Productos"
      data={products}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin productos"
      emptyDescription="No hay datos aún."
      searchPlaceholder="Buscar producto..."
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default ProductsTable;
