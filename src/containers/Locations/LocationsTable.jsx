import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete } from "@mui/icons-material";
import { deleteLocation } from "../../services/location.service";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const LocationsTable = ({ locations = [], loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta ubicación?")) return;

    try {
      const result = await deleteLocation(id);
      if (result.success) {
        toast.success("Ubicación eliminada correctamente");
        onRefresh();
      } else {
        toast.error(result.error || "Error al eliminar la ubicación");
      }
    } catch (err) {
      const errorMsg = err?.message || "Error al eliminar";
      toast.error(errorMsg);
      console.error("Delete error:", err);
    }
  };

  const columns = [
    columnHelper.accessor("zone", {
      header: "Zone",
    }),
    columnHelper.accessor("category", {
      header: "Categoría",
      cell: ({ getValue }) => getValue() || "Sin categoría",
    }),
    columnHelper.accessor("Warehouse", {
      header: "Warehouse",
       cell: ({ getValue }) => {
        const value = getValue();
        return value ? `${value?.name}` : "Sin almacén";
      },
    }),
    // columnHelper.accessor("pallets_count", {
    //   header: "Pallets",
    //   cell: ({ getValue }) => getValue() ?? 0,
    // }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const loc = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(loc)}
              className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
            >
              <Edit fontSize="small" />
            </button>

            <button
              onClick={() => handleDelete(loc.id)}
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
      title="Ubicaciones"
      data={locations}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin ubicaciones"
      emptyDescription="Aún no hay zonas registradas en el sistema."
      searchPlaceholder="Buscar ubicación..."
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default LocationsTable;
