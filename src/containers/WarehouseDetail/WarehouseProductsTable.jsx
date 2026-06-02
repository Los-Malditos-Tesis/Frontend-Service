import { createColumnHelper } from "@tanstack/react-table";
import CustomTable from "../../components/generic/CustomTable";
import TableExportButtons from "../../components/generic/TableExportButtons";
import { exportRowsToCsv, exportRowsToExcel } from "../../utils/exportTable";

const columnHelper = createColumnHelper();

const WarehouseProductsTable = ({ products = [], loading }) => {
  const exportRows = products.map((product) => ({
    ID: product.id || "--",
    Nombre: product.name || "--",
    Código: product.code || "--",
    SKU: product.sku || "--",
    Categoría: product.category || "--",
    Proveedor: product.Supplier?.name || "Sin proveedor",
    Inventario: Number(product.total_available_units || 0).toLocaleString("es-SV"),
    Pallets: Number(product.total_pallets || 0).toLocaleString("es-SV"),
    Cajas: Number(product.total_boxes || 0).toLocaleString("es-SV"),
  }));

  const columns = [
    columnHelper.accessor("name", {
      header: "Producto",
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
    columnHelper.accessor("total_pallets", {
      header: "Pallets",
      cell: ({ getValue }) => {
        const value = getValue();
        const numericValue = Number(value || 0);

        return numericValue.toLocaleString("es-SV");
      },
    }),
    columnHelper.accessor("total_boxes", {
      header: "Cajas",
      cell: ({ getValue }) => {
        const value = getValue();
        const numericValue = Number(value || 0);

        return numericValue.toLocaleString("es-SV");
      },
    }),
  ];

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Inventario</p>
        <h3 className="mt-1 text-2xl font-black text-slate-900">Productos en bodega</h3>
        <p className="mt-1 text-sm text-slate-600">
          Lista de productos disponibles en esta bodega. Aquí puedes ver el inventario actual y los
          detalles de cada producto.
        </p>
      </div>
      <CustomTable
        title=""
        data={products}
        columns={columns}
        loading={loading}
        loadingText="Cargando inventario..."
        emptyTitle="Sin productos en esta bodega"
        emptyDescription="No hay productos asociados a este warehouse todavía."
        searchPlaceholder="Buscar producto del warehouse..."
        toolbarRight={
          <TableExportButtons
            onExcel={() =>
              exportRowsToExcel({
                rows: exportRows,
                fileName: "productos-en-bodega",
                sheetName: "Productos",
              })
            }
            onCsv={() => exportRowsToCsv({ rows: exportRows, fileName: "productos-en-bodega" })}
            disabled={loading || !exportRows.length}
          />
        }
        showColumnFilters={false}
        showPagination={true}
        mobileBreakpoint="xl"
      />
    </div>
  );
};

export default WarehouseProductsTable;
