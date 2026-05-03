import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete } from "@mui/icons-material";
import { deleteSupplier } from "../../services/supplier.service";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const SuppliersTable = ({ suppliers = [], loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este proveedor?")) return;

    try {
      const result = await deleteSupplier(id);
      if (result.success) {
        toast.success("Proveedor eliminado correctamente");
        onRefresh();
      } else {
        toast.error(result.error || "Error al eliminar el proveedor");
      }
    } catch (err) {
      const errorMsg = err?.message || "Error al eliminar";
      toast.error(errorMsg);
      console.error("Delete error:", err);
    }
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Nombre",
    }),
    columnHelper.accessor("code", {
      header: "Código",
    }),
    columnHelper.accessor("contactName", {
      header: "Contacto",
    }),
    columnHelper.accessor("phone", {
      header: "Teléfono",
    }),
    columnHelper.accessor("email", {
      header: "Email",
    }),
    columnHelper.accessor("location", {
      header: "Ubicación",
    }),
    columnHelper.display({
      id: "products",
      header: "Productos",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const supplier = row.original;

        return (
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
        );
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const supplier = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(supplier)}
              className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
            >
              <Edit fontSize="small" />
            </button>

            <button
              onClick={() => handleDelete(supplier.id)}
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
      title="Proveedores"
      data={suppliers}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin proveedores"
      emptyDescription="No hay datos aún."
      searchPlaceholder="Buscar proveedor..."
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default SuppliersTable;
