import { useMemo } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
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

const DAY_FORMATTER = new Intl.DateTimeFormat("es-SV", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const normalizeScanType = (value) => {
  const type = String(value || "").toUpperCase();

  if (type === "ENT") return "ENT";
  if (type === "SLD" || type === "SAL") return "SLD";

  return "OTHER";
};

const buildLast7Days = () => {
  const today = new Date();
  const days = [];

  for (let offset = 6; offset >= 0; offset -= 1) {
    const date = new Date(today);
    date.setDate(today.getDate() - offset);
    date.setHours(0, 0, 0, 0);

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
  columnHelper.accessor("detectedType", {
    header: "Tipo detectado",
    cell: ({ getValue }) => getValue() || "--",
  }),
  columnHelper.accessor("itemCode", {
    header: "Código",
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
  <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className || "border-slate-200"}`}>
    <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">{label}</p>
    <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>
    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);

const WarehouseScansOverview = ({ scans = [], loading }) => {
  const exportRows = useMemo(
    () =>
      scans.map((scan) => ({
        ID: formatShortId(scan.id),
        "ID completo": scan.id || "--",
        Movimiento: getTypeMeta(normalizeScanType(scan.type)).label,
        Estado: getStatusMeta(scan.status).label,
        "Tipo detectado": scan.detectedType || "--",
        Código: scan.itemCode || "--",
        Cámara: scan.Camera?.code || "--",
        Fecha: formatDateTime(scan.createdAt),
        Detalle: scan.errorMessage || "--",
      })),
    [scans]
  );

  const { chartData, summary } = useMemo(() => {
    const last7Days = buildLast7Days();
    const countsByDay = new Map(
      last7Days.map((date) => [
        date.toISOString().slice(0, 10),
        { ent: 0, ext: 0, label: formatDateLabel(date) },
      ])
    );

    const sortedScans = [...scans].sort(
      (left, right) => new Date(right.createdAt || 0) - new Date(left.createdAt || 0)
    );

    let entries = 0;
    let exits = 0;

    sortedScans.forEach((scan) => {
      const type = normalizeScanType(scan.type);

      if (type === "ENT") entries += 1;
      if (type === "SLD") exits += 1;

      const dateKey = new Date(scan.createdAt || 0).toISOString().slice(0, 10);
      if (!countsByDay.has(dateKey)) return;

      const bucket = countsByDay.get(dateKey);
      if (type === "ENT") bucket.ent += 1;
      if (type === "SLD") bucket.ext += 1;
    });

    return {
      chartData: [...countsByDay.values()],
      summary: {
        total: sortedScans.length,
        entries,
        exits,
      },
    };
  }, [scans]);

  return (
    <div className="space-y-6">
      <div>
        <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">Escaneos</p>
        <h3 className="mt-1 text-2xl font-black text-slate-900">Entradas y salidas de la bodega</h3>
        <p className="mt-1 text-sm text-slate-600">
          Resumen de los últimos 7 días para los escaneos asociados a esta bodega.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatCard
          label="Escaneos totales"
          value={summary.total}
          description="Eventos encontrados en el rango mostrado"
          className="border-slate-200"
        />
        <StatCard
          label="Entradas"
          value={summary.entries}
          description="Escaneos con tipo entrada"
          className="border-sky-200"
        />
        <StatCard
          label="Salidas"
          value={summary.exits}
          description="Escaneos con tipo salida"
          className="border-amber-200"
        />
      </div>

      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
              Tendencia
            </p>
            <h4 className="mt-1 text-lg font-black text-slate-900">Escaneos por día</h4>
          </div>
          <p className="text-sm text-slate-500">
            Comparación de entradas y salidas de los últimos 7 días
          </p>
        </div>

        <div className="mt-5 h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
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
              />
              <Tooltip contentStyle={chartTooltipStyle} />
              <Legend />
              <Bar dataKey="ent" name="Entradas" fill="#202124" radius={[8, 8, 0, 0]} />
              <Bar dataKey="ext" name="Salidas" fill="#4880FF" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <CustomTable
        title=""
        data={scans}
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
            onCsv={() => exportRowsToCsv({ rows: exportRows, fileName: "escaneos-bodega" })}
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
