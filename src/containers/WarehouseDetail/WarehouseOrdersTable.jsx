import { createColumnHelper } from "@tanstack/react-table";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import CustomTable from "../../components/generic/CustomTable";
import TableExportButtons from "../../components/generic/TableExportButtons";
import { exportRowsToCsv, exportRowsToExcel } from "../../utils/exportTable";

const columnHelper = createColumnHelper();

const ORDER_TYPE_LABELS = {
  SALE: "Venta",
  TRANSFER: "Transferencia",
};

const STATUS_META = {
  PENDING: {
    label: "Pendiente",
    className: "border-amber-200 bg-amber-50 text-amber-700",
    icon: PendingActionsOutlinedIcon,
  },
  DISPATCHED: {
    label: "Despachada",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: LocalShippingOutlinedIcon,
  },
  DELIVERED: {
    label: "Entregada",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircleOutlineOutlinedIcon,
  },
  CANCELLED: {
    label: "Cancelada",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: CancelOutlinedIcon,
  },
};

const formatDate = (value) => {
  if (!value) return "--";

  return new Date(value).toLocaleString("es-SV", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatNumber = (value) => Number(value || 0).toLocaleString("es-SV");

const getStatusMeta = (status) => STATUS_META[status] || STATUS_META.PENDING;

const getDestinationLabel = (order) => {
  if (order.type === "SALE") {
    return order.DestinationStore?.name || "Tienda destino";
  }

  return order.DestinationWarehouse?.name || "Bodega destino";
};

const getOriginLabel = (order) => {
  return order.Origin?.name || "Bodega origen";
};

const buildColumns = (direction) => {
  const isOutgoing = direction === "outgoing";

  return [
    columnHelper.accessor("id", {
      header: "Orden",
      cell: ({ getValue }) => {
        const value = getValue();
        return value ? `${value.slice(0, 8)}` : "--";
      },
    }),
    columnHelper.accessor("type", {
      header: "Tipo",
      cell: ({ getValue }) => ORDER_TYPE_LABELS[getValue()] || getValue() || "--",
    }),
    columnHelper.accessor("product_id", {
      header: "Producto",
      cell: ({ row }) =>
        row.original?.product_name ||
        row.original?.Product?.name ||
        row.original?.product_id ||
        "--",
    }),
    columnHelper.accessor("movement", {
      header: direction === "outgoing" ? "Destino" : "Origen",
      cell: ({ row }) => {
        const order = row.original;
        return isOutgoing ? getDestinationLabel(order) : getOriginLabel(order);
      },
    }),
    columnHelper.accessor("total_quantity", {
      header: "Cantidad",
      cell: ({ getValue }) => formatNumber(getValue()),
    }),
    columnHelper.accessor("total_delivered", {
      header: "Entregadas",
      cell: ({ getValue }) => formatNumber(getValue()),
    }),
    columnHelper.accessor("status", {
      header: "Estado",
      cell: ({ getValue }) => {
        const meta = getStatusMeta(getValue());
        const Icon = meta.icon;

        return (
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${meta.className}`}
          >
            <Icon sx={{ fontSize: 16 }} />
            {meta.label}
          </span>
        );
      },
    }),
    columnHelper.accessor("createdAt", {
      header: "Fecha",
      cell: ({ getValue }) => (
        <span className="inline-flex items-center gap-2 text-sm text-slate-600">
          <AccessTimeOutlinedIcon sx={{ fontSize: 16 }} />
          {formatDate(getValue())}
        </span>
      ),
    }),
  ];
};

const buildExportRows = (orders, direction) => {
  const isOutgoing = direction === "outgoing";

  return orders.map((order) => ({
    ID: order.id ? order.id.slice(0, 8) : "--",
    "ID completo": order.id || "--",
    Tipo: ORDER_TYPE_LABELS[order.type] || order.type || "--",
    Producto: order.product_name || order.Product?.name || order.product_id || "--",
    [isOutgoing ? "Destino" : "Origen"]: isOutgoing ? getDestinationLabel(order) : getOriginLabel(order),
    Cantidad: formatNumber(order.total_quantity),
    Entregadas: formatNumber(order.total_delivered),
    Estado: getStatusMeta(order.status).label,
    Fecha: formatDate(order.createdAt),
  }));
};

const EmptyDirectionState = ({ title, description }) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-600">
    <p className="font-bold text-slate-800">{title}</p>
    <p className="mt-1">{description}</p>
  </div>
);

const DirectionHeader = ({ title, subtitle, icon: Icon }) => (
  <div className="flex items-start justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
    <div>
      <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Trazabilidad</p>
      <h4 className="mt-1 text-lg font-extrabold text-slate-900">{title}</h4>
      <p className="mt-1 text-sm text-slate-600">{subtitle}</p>
    </div>
    <div className="rounded-2xl bg-slate-100 p-3 text-slate-700">
      <Icon />
    </div>
  </div>
);

const WarehouseOrdersTable = ({ warehouseId, warehouseName = "", orders = [], loading }) => {
  const outgoingOrders = orders.filter(
    (order) => String(order.origin_warehouse_id) === String(warehouseId)
  );
  const incomingOrders = orders.filter(
    (order) => String(order.destination_warehouse_id) === String(warehouseId)
  );

  const outgoingExportRows = buildExportRows(outgoingOrders, "outgoing");
  const incomingExportRows = buildExportRows(incomingOrders, "incoming");

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Trazabilidad</p>
        <h3 className="mt-1 text-2xl font-black text-slate-900">Órdenes del warehouse</h3>
        <p className="mt-1 text-sm text-slate-600">
          Movimientos de entrada y salida para {warehouseName || "esta bodega"}.
        </p>
      </div>

      <section className="space-y-4">
        <DirectionHeader
          title="Órdenes de salida"
          subtitle="Órdenes que salen desde este warehouse hacia otra bodega o una tienda."
          icon={WarehouseOutlinedIcon}
        />

        {outgoingOrders.length === 0 && !loading ? (
          <EmptyDirectionState
            title="Sin salidas registradas"
            description="Todavía no existen órdenes de salida para esta bodega."
          />
        ) : (
          <CustomTable
            title=""
            data={outgoingOrders}
            columns={buildColumns("outgoing")}
            loading={loading}
            loadingText="Cargando órdenes de salida..."
            emptyTitle="Sin salidas registradas"
            emptyDescription="Todavía no existen órdenes de salida para esta bodega."
            searchPlaceholder="Buscar órdenes de salida..."
            toolbarRight={
              <TableExportButtons
                onExcel={() =>
                  exportRowsToExcel({
                    rows: outgoingExportRows,
                    fileName: "ordenes-salida",
                    sheetName: "Salidas",
                  })
                }
                onCsv={() =>
                  exportRowsToCsv({ rows: outgoingExportRows, fileName: "ordenes-salida" })
                }
                disabled={loading || !outgoingExportRows.length}
              />
            }
            showColumnFilters={false}
            showPagination={true}
            mobileBreakpoint="xl"
          />
        )}
      </section>

      <div className="h-px bg-black/80" />

      <section className="space-y-4">
        <DirectionHeader
          title="Órdenes de entrada"
          subtitle="Órdenes que llegan a este warehouse desde otras bodegas."
          icon={SwapHorizOutlinedIcon}
        />

        {incomingOrders.length === 0 && !loading ? (
          <EmptyDirectionState
            title="Sin entradas registradas"
            description="Todavía no existen órdenes de entrada para esta bodega."
          />
        ) : (
          <CustomTable
            title=""
            data={incomingOrders}
            columns={buildColumns("incoming")}
            loading={loading}
            loadingText="Cargando órdenes de entrada..."
            emptyTitle="Sin entradas registradas"
            emptyDescription="Todavía no existen órdenes de entrada para esta bodega."
            searchPlaceholder="Buscar órdenes de entrada..."
            toolbarRight={
              <TableExportButtons
                onExcel={() =>
                  exportRowsToExcel({
                    rows: incomingExportRows,
                    fileName: "ordenes-entrada",
                    sheetName: "Entradas",
                  })
                }
                onCsv={() =>
                  exportRowsToCsv({ rows: incomingExportRows, fileName: "ordenes-entrada" })
                }
                disabled={loading || !incomingExportRows.length}
              />
            }
            showColumnFilters={false}
            showPagination={true}
            mobileBreakpoint="xl"
          />
        )}
      </section>
    </div>
  );
};

export default WarehouseOrdersTable;
