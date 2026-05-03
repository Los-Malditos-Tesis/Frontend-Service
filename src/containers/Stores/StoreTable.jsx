import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete } from "@mui/icons-material";
import { deleteStore } from "../../services/store.service";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const StoreTable = ({ stores = [], loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta tienda?")) return;

    try {
      const result = await deleteStore(id);
      if (result.success) {
        toast.success("Tienda eliminada correctamente");
        onRefresh();
      } else {
        toast.error(result.error || "Error al eliminar la tienda");
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
    columnHelper.accessor("address", {
      header: "Dirección",
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const store = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(store)}
              className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
            >
              <Edit fontSize="small" />
            </button>

            <button
              onClick={() => handleDelete(store.id)}
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
      title="Tiendas"
      data={stores}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin tiendas"
      emptyDescription="No hay datos aún."
      searchPlaceholder="Buscar tienda..."
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default StoreTable;