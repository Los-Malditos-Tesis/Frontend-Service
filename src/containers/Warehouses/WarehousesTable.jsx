import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete, Visibility } from "@mui/icons-material";
import { deleteWarehouse } from "../../services/warehouse.service";
import CustomTable from "../../components/generic/CustomTable";
import TableExportButtons from "../../components/generic/TableExportButtons";
import { exportRowsToCsv, exportRowsToExcel } from "../../utils/exportTable";

const columnHelper = createColumnHelper();

const WarehousesTable = ({ warehouses = [], loading, onEdit, onRefresh, canManage = true }) => {
  const navigate = useNavigate();

  const exportRows = warehouses.map((warehouse) => ({
    ID: warehouse.id || "--",
    Nombre: warehouse.name || "--",
    Dirección: warehouse.address || "--",
  }));

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
      header: "Nombre",
    }),
    columnHelper.accessor("address", {
      header: "Dirección",
    }),
  ];

  if (canManage) {
    columns.push(
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const warehouse = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => navigate(`/warehouses/${warehouse.id}`)}
                className="rounded-lg p-2 transition hover:bg-blue-50 active:scale-95"
                title="Ver detalles y estructura"
              >
                <Visibility fontSize="small" className="text-blue-600" />
              </button>

              <button
                onClick={() => onEdit(warehouse)}
                className="rounded-lg p-2 transition hover:bg-gray-100 active:scale-95"
                title="Editar información"
              >
                <Edit fontSize="small" />
              </button>

              <button
                onClick={() => handleDelete(warehouse.id)}
                className="rounded-lg p-2 transition hover:bg-red-50 active:scale-95"
                title="Eliminar"
              >
                <Delete fontSize="small" className="text-red-700" />
              </button>
            </div>
          );
        },
      })
    );
  } else {
    columns.push(
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const warehouse = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              <button
                onClick={() => navigate(`/warehouses/${warehouse.id}`)}
                className="rounded-lg p-2 transition hover:bg-blue-50 active:scale-95"
                title="Ver detalles y estructura"
              >
                <Visibility fontSize="small" className="text-blue-600" />
              </button>
            </div>
          );
        },
      })
    );
  }

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
      toolbarRight={
        <TableExportButtons
          onExcel={() =>
            exportRowsToExcel({ rows: exportRows, fileName: "bodegas", sheetName: "Bodegas" })
          }
          onCsv={() => exportRowsToCsv({ rows: exportRows, fileName: "bodegas" })}
          disabled={loading || !exportRows.length}
        />
      }
      showColumnFilters={false}
      showPagination={true}
    />
  );
};

export default WarehousesTable;
