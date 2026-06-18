import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CustomTable from "../../components/generic/CustomTable";
import TableExportButtons from "../../components/generic/TableExportButtons";
import { exportRowsToCsv, exportRowsToExcel } from "../../utils/exportTable";

const columnHelper = createColumnHelper();

const GS1_PATTERNS = {
  PALLET: /^\(00\)([^()]+)\(01\)([^()]+)\(37\)([^()]+)\(30\)([^()]+)$/,
  BOX: /^\(01\)([^()]+)\(21\)([^()]+)\(30\)([^()]+)$/,
};

const CHART_COLORS = [
  "#202124",
  "#4880FF",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#EC4899",
  "#F97316",
  "#14B8A6",
];

const DAY_FORMATTER = new Intl.DateTimeFormat("es-SV", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const NUMBER_FORMATTER = new Intl.NumberFormat("es-SV");

const normalizeScanType = (value) => {
  const type = String(value || "").toUpperCase();

  if (type === "ENT") return "ENT";
  if (type === "SLD" || type === "SAL") return "SLD";

  return "OTHER";
};

const parseGs1Qr = (qrCode = "") => {
  const qrValue = String(qrCode).trim();

  if (!qrValue) {
    return {
      unitType: null,
      productCode: null,
      totalItems: null,
      palletCode: null,
      boxCode: null,
      boxesInPallet: null,
      itemsPerBox: null,
    };
  }

  const palletMatch = qrValue.match(GS1_PATTERNS.PALLET);

  if (palletMatch) {
    const [, palletCode, productCode, boxesInPallet, itemsPerBox] = palletMatch;

    return {
      unitType: "PALLET",
      productCode,
      totalItems: Number(boxesInPallet || 0) * Number(itemsPerBox || 0),
      palletCode,
      boxCode: null,
      boxesInPallet: Number(boxesInPallet || 0),
      itemsPerBox: Number(itemsPerBox || 0),
    };
  }

  const boxMatch = qrValue.match(GS1_PATTERNS.BOX);

  if (boxMatch) {
    /*
     * GS1:
     * (01) = código del producto
     * (21) = serial / identificador de la caja
     * (30) = cantidad de artículos
     */
    const [, productCode, boxCode, items] = boxMatch;

    return {
      unitType: "BOX",
      productCode,
      totalItems: Number(items || 0),
      palletCode: null,
      boxCode,
      boxesInPallet: null,
      itemsPerBox: null,
    };
  }

  return {
    unitType: null,
    productCode: null,
    totalItems: null,
    palletCode: null,
    boxCode: null,
    boxesInPallet: null,
    itemsPerBox: null,
  };
};

const startOfDay = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (dateValue) => {
  const date = new Date(dateValue);
  date.setHours(23, 59, 59, 999);
  return date;
};

const getLocalDateKey = (dateValue) => {
  const date = new Date(dateValue);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const DAYS_TO_SHOW = 15;

const buildLast7Days = () => {
  const today = startOfDay(new Date());
  const days = [];

  for (let offset = DAYS_TO_SHOW - 1; offset >= 0; offset -= 1) {
  // for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    days.push(date);
  }

  return days;
};

const formatDateLabel = (date) =>
  DAY_FORMATTER.format(date).replace(/^\w/, (match) => match.toUpperCase());

const formatDateTime = (value) => {
  if (!value) return "--";

  return new Date(value).toLocaleString("es-SV", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatShortId = (value) => (value ? String(value).slice(0, 8) : "--");

const formatQuantity = (value) => NUMBER_FORMATTER.format(Number(value || 0));

const getStatusMeta = (status) => {
  if (String(status).toUpperCase() === "OK") {
    return {
      label: "OK",
      className: "border-emerald-200 bg-emerald-50 text-emerald-700",
      icon: CheckCircleOutlineOutlinedIcon,
    };
  }

  return {
    label: "Error",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: ErrorOutlineOutlinedIcon,
  };
};

const getTypeMeta = (type) => {
  if (type === "ENT") {
    return {
      label: "Entrada",
      className: "border-sky-200 bg-sky-50 text-sky-700",
      icon: ArrowDownwardOutlinedIcon,
    };
  }

  if (type === "SLD") {
    return {
      label: "Salida",
      className: "border-amber-200 bg-amber-50 text-amber-700",
      icon: ArrowUpwardOutlinedIcon,
    };
  }

  return {
    label: "Otro",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    icon: AccessTimeOutlinedIcon,
  };
};

const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
};

const buildColumns = () => [
  columnHelper.accessor("id", {
    header: "Escaneo",
    cell: ({ getValue }) => formatShortId(getValue()),
  }),

  columnHelper.accessor("type", {
    header: "Movimiento",
    cell: ({ getValue }) => {
      const meta = getTypeMeta(normalizeScanType(getValue()));
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

  columnHelper.accessor("qrCode", {
    header: "Producto",
    cell: ({ getValue }) => {
      const qrInfo = parseGs1Qr(getValue());

      return qrInfo.productCode || "--";
    },
  }),

  columnHelper.accessor("detectedType", {
    header: "Unidad",
    cell: ({ getValue }) => getValue() || "--",
  }),

  columnHelper.accessor("qrCode", {
    id: "quantity",
    header: "Cantidad",
    cell: ({ getValue }) => {
      const qrInfo = parseGs1Qr(getValue());

      if (qrInfo.totalItems === null) {
        return "--";
      }

      return (
        <span className="font-bold text-slate-900">
          {formatQuantity(qrInfo.totalItems)} artículos
        </span>
      );
    },
  }),

  columnHelper.accessor("itemCode", {
    header: "Caja",
    cell: ({ getValue }) => getValue() || "--",
  }),

  columnHelper.accessor("Camera", {
    header: "Cámara",
    cell: ({ getValue }) => getValue()?.code || "--",
  }),

  columnHelper.accessor("createdAt", {
    header: "Fecha",
    cell: ({ getValue }) => formatDateTime(getValue()),
  }),

  columnHelper.accessor("errorMessage", {
    header: "Detalle",
    cell: ({ getValue }) => getValue() || "--",
  }),
];

const StatCard = ({ label, value, description, className }) => (
  <div
    className={`rounded-2xl border bg-white p-4 shadow-sm ${
      className || "border-slate-200"
    }`}
  >
    <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
      {label}
    </p>

    <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>

    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);

const ProductInventoryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) {
    return null;
  }

  const values = [...payload].sort(
    (left, right) => Number(right.value || 0) - Number(left.value || 0)
  );

  return (
    <div style={chartTooltipStyle} className="min-w-[245px] p-4">
      <p className="text-sm font-bold text-slate-950">{label}</p>

      <p className="mt-1 text-xs text-slate-500">
        Inventario acumulado por producto
      </p>

      <div className="mt-3 max-h-60 space-y-2 overflow-y-auto">
        {values.map((entry) => (
          <div
            key={entry.dataKey}
            className="flex items-center justify-between gap-5 text-sm"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-3 w-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />

              <span className="text-slate-600">{entry.name}</span>
            </div>

            <span className="font-bold text-slate-950">
              {formatQuantity(entry.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

const WarehouseScansOverview = ({ scans = [], loading }) => {
  const safeScans = useMemo(() => {
    if (Array.isArray(scans)) {
      return scans;
    }

    if (Array.isArray(scans?.items)) {
      return scans.items;
    }

    return [];
  }, [scans]);

  const enrichedScans = useMemo(
    () =>
      safeScans.map((scan) => ({
        ...scan,
        qrInfo: parseGs1Qr(scan.qrCode),
      })),
    [safeScans]
  );

  const exportRows = useMemo(
    () =>
      enrichedScans.map((scan) => ({
        ID: formatShortId(scan.id),
        "ID completo": scan.id || "--",
        Movimiento: getTypeMeta(normalizeScanType(scan.type)).label,
        Estado: getStatusMeta(scan.status).label,
        Producto: scan.qrInfo.productCode || "--",
        Unidad: scan.qrInfo.unitType || scan.detectedType || "--",
        QR: scan.qrCode || "--",
        "Cantidad artículos":
          scan.qrInfo.totalItems === null ? "--" : scan.qrInfo.totalItems,
        Caja: scan.qrInfo.boxCode || scan.itemCode || "--",
        Cámara: scan.Camera?.code || "--",
        Fecha: formatDateTime(scan.createdAt),
        Detalle: scan.errorMessage || "--",
      })),
    [enrichedScans]
  );

  const { chartData, productSeries, summary } = useMemo(() => {
    const last7Days = buildLast7Days();
    const firstVisibleDay = startOfDay(last7Days[0]);
    const lastVisibleDay = endOfDay(last7Days[last7Days.length - 1]);

    const validScans = enrichedScans
      .filter((scan) => {
        const type = normalizeScanType(scan.type);
        const validStatus = String(scan.status || "").toUpperCase() === "OK";
        const validProduct = Boolean(scan.qrInfo.productCode);
        const validQuantity =
          Number.isFinite(scan.qrInfo.totalItems) && scan.qrInfo.totalItems > 0;

        return (
          validStatus &&
          validProduct &&
          validQuantity &&
          (type === "ENT" || type === "SLD")
        );
      })
      .sort(
        (left, right) =>
          new Date(left.createdAt || 0).getTime() -
          new Date(right.createdAt || 0).getTime()
      );

    const productMap = new Map();

    const ensureProduct = (productCode) => {
      if (!productMap.has(productCode)) {
        productMap.set(productCode, {
          productCode,
          dataKey: `product_${productMap.size}`,
          openingInventory: 0,
          totalEntries: 0,
          totalExits: 0,
          movementByDate: new Map(),
        });
      }

      return productMap.get(productCode);
    };

    validScans.forEach((scan) => {
      const productCode = scan.qrInfo.productCode;
      const quantity = scan.qrInfo.totalItems;
      const type = normalizeScanType(scan.type);
      const signedQuantity = type === "ENT" ? quantity : -quantity;
      const scanDate = new Date(scan.createdAt);

      const product = ensureProduct(productCode);

      /*
       * Historial anterior al rango visible:
       * sirve como inventario inicial de ese producto.
       */
      if (scanDate < firstVisibleDay) {
        product.openingInventory += signedQuantity;
        return;
      }

      if (scanDate > lastVisibleDay) {
        return;
      }

      const dateKey = getLocalDateKey(scanDate);

      product.movementByDate.set(
        dateKey,
        (product.movementByDate.get(dateKey) || 0) + signedQuantity
      );

      if (type === "ENT") {
        product.totalEntries += quantity;
      }

      if (type === "SLD") {
        product.totalExits += quantity;
      }
    });

    const products = [...productMap.values()].sort((left, right) =>
      left.productCode.localeCompare(right.productCode, "es", {
        numeric: true,
      })
    );

    const runningInventory = {};

    products.forEach((product) => {
      runningInventory[product.dataKey] = product.openingInventory;
    });

    const timeline = last7Days.map((date) => {
      const dateKey = getLocalDateKey(date);

      const row = {
        label: formatDateLabel(date),
        dateKey,
      };

      products.forEach((product) => {
        const dailyMovement = product.movementByDate.get(dateKey) || 0;

        runningInventory[product.dataKey] += dailyMovement;
        row[product.dataKey] = runningInventory[product.dataKey];
      });

      return row;
    });

    const series = products.map((product, index) => ({
      ...product,
      color: CHART_COLORS[index % CHART_COLORS.length],
      currentInventory:
        timeline[timeline.length - 1]?.[product.dataKey] ||
        product.openingInventory,
    }));

    const totalInventory = series.reduce(
      (sum, product) => sum + product.currentInventory,
      0
    );

    const totalEntries = series.reduce(
      (sum, product) => sum + product.totalEntries,
      0
    );

    const totalExits = series.reduce(
      (sum, product) => sum + product.totalExits,
      0
    );

    const invalidQrCount = enrichedScans.filter((scan) => {
      const type = normalizeScanType(scan.type);
      const validStatus = String(scan.status || "").toUpperCase() === "OK";

      return (
        validStatus &&
        (type === "ENT" || type === "SLD") &&
        (!scan.qrInfo.productCode || scan.qrInfo.totalItems === null)
      );
    }).length;

    return {
      chartData: timeline,
      productSeries: series,
      summary: {
        totalInventory,
        totalEntries,
        totalExits,
        trackedProducts: series.length,
        invalidQrCount,
      },
    };
  }, [enrichedScans]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
          Inventario
        </p>

        <h3 className="mt-1 text-2xl font-black text-slate-900">
          Inventario por producto en la bodega
        </h3>

        <p className="mt-1 text-sm text-slate-600">
          Cada línea representa un producto identificado por el valor GS1
          <strong> (01)</strong>. Las entradas aumentan la línea y las salidas
          la disminuyen según la cantidad indicada en <strong>(30)</strong>.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard
          label="Inventario total"
          value={formatQuantity(summary.totalInventory)}
          description="Artículos acumulados entre todos los productos"
          className="border-slate-900"
        />

        <StatCard
          label="Productos"
          value={formatQuantity(summary.trackedProducts)}
          description="Productos representados en la gráfica"
          className="border-sky-200"
        />

        <StatCard
          label="Entradas"
          value={`+${formatQuantity(summary.totalEntries)}`}
          description={`Artículos ingresados en los últimos ${DAYS_TO_SHOW} días`}
          className="border-emerald-200"
        />

        <StatCard
          label="Salidas"
          value={`-${formatQuantity(summary.totalExits)}`}
          description={`Artículos retirados en los últimos ${DAYS_TO_SHOW} días`}
          className="border-amber-200"
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
              Tendencia
            </p>

            <h4 className="mt-1 text-lg font-black text-slate-900">
              Inventario acumulado por producto
            </h4>
          </div>

          <p className="text-sm text-slate-500">
            Últimos {DAYS_TO_SHOW} días · una línea por producto
          </p>
        </div>

        {summary.invalidQrCount > 0 && (
          <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
            {summary.invalidQrCount} movimiento(s) no fueron incluidos porque el
            QR no contiene producto o cantidad válida.
          </div>
        )}

        {productSeries.length === 0 ? (
          <div className="mt-5 flex h-[360px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
            <p className="text-sm text-slate-500">
              No hay movimientos válidos para graficar.
            </p>
          </div>
        ) : (
          <div className="mt-5 h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 12, right: 22, left: 2, bottom: 0 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e2e8f0"
                  vertical={false}
                />

                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748b"
                  fontSize={12}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  stroke="#64748b"
                  fontSize={12}
                  tickFormatter={(value) => formatQuantity(value)}
                />

                <Tooltip content={<ProductInventoryTooltip />} />

                <Legend
                  formatter={(value) => (
                    <span className="text-sm text-slate-700">{value}</span>
                  )}
                />

                {productSeries.map((product) => (
                  <Line
                    key={product.dataKey}
                    type="linear"
                    dataKey={product.dataKey}
                    name={`Producto ${product.productCode}`}
                    stroke={product.color}
                    strokeWidth={3}
                    dot={{
                      r: 4,
                      fill: product.color,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                    activeDot={{
                      r: 6,
                      fill: product.color,
                      stroke: "#ffffff",
                      strokeWidth: 2,
                    }}
                  />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <CustomTable
        title=""
        data={enrichedScans}
        columns={buildColumns()}
        loading={loading}
        loadingText="Cargando escaneos..."
        emptyTitle="Sin escaneos en esta bodega"
        emptyDescription="Todavía no hay eventos de escaneo asociados a esta bodega."
        searchPlaceholder="Buscar escaneo..."
        toolbarRight={
          <TableExportButtons
            onExcel={() =>
              exportRowsToExcel({
                rows: exportRows,
                fileName: "escaneos-bodega",
                sheetName: "Escaneos",
              })
            }
            onCsv={() =>
              exportRowsToCsv({
                rows: exportRows,
                fileName: "escaneos-bodega",
              })
            }
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

export default WarehouseScansOverview;