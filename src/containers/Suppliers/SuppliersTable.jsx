import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete, Inventory2Outlined } from "@mui/icons-material";
import { deleteSupplier } from "../../services/supplier.service";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const SuppliersTable = ({ suppliers = [], loading, onEdit, onRefresh, canManage = true }) => {
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
      id: "Products",
      header: "Productos",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const supplier = row.original;
        const products = supplier.products || supplier.Products || [];
        const productCount = products.length;

        return (
          <div className="py-2">
            {productCount > 0 ? (
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm">
                <Inventory2Outlined fontSize="small" className="text-emerald-600" />
                <span>{productCount} prod.</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full border border-gray-200 bg-gray-50 px-3 py-1.5 text-xs font-medium text-gray-500">
                <Inventory2Outlined fontSize="small" className="text-gray-400" />
                <span>Sin prod.</span>
              </div>
            )}
          </div>
        );
      },
    }),
  ];

  if (canManage) {
    columns.push(
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
      })
    );
  }

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
      mobileBreakpoint="90rem"
    />
  );
};

export default SuppliersTable;
