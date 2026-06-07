import { toast } from "sonner";
import { createColumnHelper } from "@tanstack/react-table";
import { Edit, Delete } from "@mui/icons-material";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";

import { deleteProduct } from "../../services/product.service";
import CustomTable from "../../components/generic/CustomTable";
import TableExportButtons from "../../components/generic/TableExportButtons";
import { exportRowsToCsv, exportRowsToExcel } from "../../utils/exportTable";

const columnHelper = createColumnHelper();

const ProductsTable = ({
  products = [],
  loading,
  onEdit,
  onStats,
  onRefresh,
  canManage = true,
}) => {
  const exportRows = products.map((product) => ({
    ID: product.id || "--",
    Nombre: product.name || "--",
    Código: product.code || "--",
    SKU: product.sku || "--",
    Categoría: product.category || "--",
    Proveedor: product.Supplier?.name || "Sin proveedor",
    Inventario: Number(product.total_available_units || 0).toLocaleString("es-SV"),
  }));

  const handleDelete = async (id) => {
    if (!confirm("¿Eliminar producto?")) return;

    try {
      const result = await deleteProduct(id);
      if (result.success) {
        toast.success("Producto eliminado correctamente");
        onRefresh();
      } else {
        toast.error(result.error || "Error al eliminar el producto");
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
    columnHelper.accessor("sku", {
      header: "SKU",
    }),
    columnHelper.accessor("category", {
      header: "Categoría",
    }),
    columnHelper.accessor("Supplier", {
      header: "Proveedor",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `${value?.name}` : "Sin proveedor";
      },
    }),
    columnHelper.accessor("total_available_units", {
      header: "Inventario",
      cell: ({ getValue }) => {
        const value = getValue();
        const numericValue = Number(value || 0);

        return numericValue.toLocaleString("es-SV");
      },
    }),
  ];

  if (canManage || onStats) {
    columns.push(
      columnHelper.display({
        id: "actions",
        header: "Acciones",
        enableColumnFilter: false,
        cell: ({ row }) => {
          const product = row.original;

          return (
            <div className="flex items-center justify-center gap-2">
              {onStats && (
                <button
                  type="button"
                  onClick={() => onStats(product)}
                  title="Ver estadísticas"
                  className="rounded-lg p-2 transition hover:bg-sky-50 active:scale-95"
                >
                  <BarChartOutlinedIcon fontSize="small" className="text-sky-700" />
                </button>
              )}

              {canManage && (
                <>
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
                    <Delete fontSize="small" className="text-red-700" />
                  </button>
                </>
              )}
            </div>
          );
        },
      })
    );
  }

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
      toolbarRight={
        <TableExportButtons
          onExcel={() =>
            exportRowsToExcel({ rows: exportRows, fileName: "productos", sheetName: "Productos" })
          }
          onCsv={() => exportRowsToCsv({ rows: exportRows, fileName: "productos" })}
          disabled={loading || !exportRows.length}
        />
      }
      showColumnFilters={false}
      showPagination={true}
      mobileBreakpoint="85rem"
    />
  );
};

export default ProductsTable;
