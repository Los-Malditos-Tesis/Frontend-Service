import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";

import { Edit, Delete } from "@mui/icons-material";

import { deleteCamera } from "../../services/api";
import CustomTable from "../../components/generic/CustomTable";

const columnHelper = createColumnHelper();

const CamerasTable = ({ cameras = [], loading, onEdit, onRefresh }) => {
  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar cámara?")) return;

    try {
      await deleteCamera(id);
      toast.success("Cámara eliminada");
      onRefresh();
    } catch {
      toast.error("Error al eliminar");
    }
  };

  const columns = [
    columnHelper.accessor("code", {
      header: "Code",
    }),
    columnHelper.accessor("location_name", {
      header: "Location",
    }),
    columnHelper.accessor("api_key", {
      header: "API Key",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `${String(value).slice(0, 4)}••••••` : "-";
      },
    }),
    columnHelper.display({
      id: "actions",
      header: "Actions",
      enableColumnFilter: false,
      cell: ({ row }) => {
        const camera = row.original;

        return (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onEdit(camera)}
              className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
            >
              <Edit fontSize="small" />
            </button>

            <button
              onClick={() => handleDelete(camera.id)}
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
      title="Cámaras"
      data={cameras}
      columns={columns}
      loading={loading}
      loadingText="Cargando..."
      emptyTitle="Sin cámaras"
      emptyDescription="No hay datos aún."
      searchPlaceholder="Buscar cámara..."
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default CamerasTable;