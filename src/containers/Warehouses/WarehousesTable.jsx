import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete } from "@mui/icons-material";
import { deleteWarehouse } from "../../services/warehouse.service";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const WarehousesTable = ({ warehouses = [], loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta bodega?")) return;

    try {
      const result = await deleteWarehouse(id);
      if (result.success) {
        toast.success("Bodega eliminada correctamente");
        onRefresh();
      } else {
        toast.error(result.error || "Error al eliminar la bodega");
      }
    } catch (err) {
      const errorMsg = err?.message || "Error al eliminar";
      toast.error(errorMsg);
      console.error("Delete error:", err);
    }
  };

  const columns = [
    columnHelper.accessor("name", {
      header: "Name",
    }),
    columnHelper.accessor("address", {
      header: "Address",
    }),
    // columnHelper.accessor("locations_count", {
    //   header: "Locations",
    //   cell: ({ getValue }) => getValue() ?? 0,
    // }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const warehouse = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(warehouse)}
              className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
            >
              <Edit fontSize="small" />
            </button>

            <button
              onClick={() => handleDelete(warehouse.id)}
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
      title="Bodegas"
      data={warehouses}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin bodegas"
      emptyDescription="No hay datos aún."
      searchPlaceholder="Buscar bodega..."
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default WarehousesTable;
