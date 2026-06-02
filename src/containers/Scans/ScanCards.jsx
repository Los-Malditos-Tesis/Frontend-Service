import PropTypes from "prop-types";
import { motion } from "framer-motion";
import { createColumnHelper } from "@tanstack/react-table";
import EmptyState from "../../components/generic/EmptyState";
import CustomTable from "../../components/generic/CustomTable";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import ArrowDownwardOutlinedIcon from "@mui/icons-material/ArrowDownwardOutlined";
import ArrowUpwardOutlinedIcon from "@mui/icons-material/ArrowUpwardOutlined";

import boxIcon from "../../assets/images/box_icon.png";
import palletIcon from "../../assets/images/pallet_icon.png";

const columnHelper = createColumnHelper();

const STATUS_META = {
  ERR: {
    label: "Error",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: ErrorOutlineOutlinedIcon,
  },
  OK: {
    label: "OK",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircleOutlineOutlinedIcon,
  },
};

const UNIT_META = {
  PAL: {
    label: "Pallet",
    shortLabel: "PAL",
    image: palletIcon,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  BOX: {
    label: "Caja",
    shortLabel: "BOX",
    image: boxIcon,
    className: "border-violet-200 bg-violet-50 text-violet-700",
  },
};

const TYPE_META = {
  ENT: {
    label: "Entrada",
    className: "border-sky-200 bg-sky-50 text-sky-700",
    icon: ArrowDownwardOutlinedIcon,
  },
  SLD: {
    label: "Salida",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: ArrowUpwardOutlinedIcon,
  },
};

const GS1_PATTERNS = {
  PALLET: /^\(00\)([^()]+)\(01\)([^()]+)\(37\)([^()]+)\(30\)([^()]+)$/,
  BOX: /^\(01\)([^()]+)\(21\)([^()]+)\(30\)([^()]+)$/,
};

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
      fields: [],
      totalItems: null,
      boxesInPallet: null,
      itemsPerBox: null,
      rawType: null,
    };
  }

  const palletMatch = qrValue.match(GS1_PATTERNS.PALLET);
  if (palletMatch) {
    const [, palletCode, productCode, boxesInPallet, itemsPerBox] = palletMatch;

    return {
      unitType: "PAL",
      rawType: "PALLET",
      fields: [
        { label: "Código producto", value: productCode },
        { label: "Cajas en pallet", value: boxesInPallet },
        { label: "Productos por caja", value: itemsPerBox },
      ],
      totalItems: Number(boxesInPallet || 0) * Number(itemsPerBox || 0),
      boxesInPallet,
      itemsPerBox,
      palletCode,
      boxCode: null,
      parentPalletCode: null,
    };
  }

  const boxMatch = qrValue.match(GS1_PATTERNS.BOX);
  if (boxMatch) {
    const [, boxCode, palletCode, items] = boxMatch;

    return {
      unitType: "BOX",
      rawType: "BOX",
      fields: [
        { label: "Código caja", value: boxCode },
        { label: "Pallet padre", value: palletCode },
        { label: "Artículos", value: items },
      ],
      totalItems: Number(items || 0),
      boxesInPallet: null,
      itemsPerBox: null,
      palletCode,
      boxCode,
      parentPalletCode: palletCode,
    };
  }

  return {
    unitType: null,
    rawType: null,
    fields: [],
    totalItems: null,
    boxesInPallet: null,
    itemsPerBox: null,
    palletCode: null,
    boxCode: null,
    parentPalletCode: null,
  };
};

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

const formatDate = (value) => formatDateTime(value);

const formatShortId = (value) => (value ? String(value).slice(0, 8) : "--");

const getStatusMeta = (status) => {
  if (String(status).toUpperCase() === "OK") {
    return STATUS_META.OK;
  }

  return STATUS_META.ERR;
};

const getTypeMeta = (type) => {
  const normalizedType = normalizeScanType(type);

  if (normalizedType === "ENT") {
    return TYPE_META.ENT;
  }

  if (normalizedType === "SLD") {
    return TYPE_META.SLD;
  }

  return {
    label: "Otro",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    icon: AccessTimeOutlinedIcon,
  };
};

const buildTableColumns = () => [
  columnHelper.accessor("id", {
    header: "Escaneo",
    cell: ({ getValue }) => formatShortId(getValue()),
  }),
  columnHelper.accessor("type", {
    header: "Movimiento",
    cell: ({ getValue }) => {
      const meta = getTypeMeta(getValue());
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
    header: "Tipo",
    cell: ({ getValue }) => getValue() || "--",
  }),
  columnHelper.accessor((row) => row.Camera?.code, {
    id: "camera",
    header: "Cámara",
    cell: ({ getValue }) => getValue() || "--",
  }),
//   columnHelper.accessor((row) => row.Product?.name, {
//     id: "product",
//     header: "Producto",
//     cell: ({ getValue }) => getValue() || "--",
//   }),
//   columnHelper.accessor((row) => row.Warehouse?.name, {
//     id: "warehouse",
//     header: "Bodega",
//     cell: ({ getValue }) => getValue() || "--",
//   }),
//   columnHelper.accessor((row) => row.Order?.type, {
//     id: "order",
//     header: "Orden",
//     cell: ({ getValue }) => getValue() || "--",
//   }),
  columnHelper.accessor("createdAt", {
    header: "Fecha",
    cell: ({ getValue }) => formatDateTime(getValue()),
  }),
  columnHelper.accessor("errorMessage", {
    header: "Detalle",
    cell: ({ getValue }) => getValue() || "--",
  }),
];

const ScanTable = ({ items, loading }) => (
  <CustomTable
    title=""
    data={items}
    columns={buildTableColumns()}
    loading={loading}
    loadingText="Cargando escaneos..."
    emptyTitle="Sin eventos de escaneo"
    emptyDescription="No se han detectado eventos recientemente."
    searchPlaceholder="Buscar escaneo..."
    showColumnFilters={false}
    showPagination={true}
    mobileBreakpoint="xl"
  />
);

const ScanCard = ({ scan }) => {
  const status = STATUS_META[scan.status] || STATUS_META.ERR;
  const StatusIcon = status.icon;
  const parsedQr = parseGs1Qr(scan.qrCode);
  const unitMeta = UNIT_META[scan.detectedType] || {
    label:
      parsedQr.unitType === "PAL"
        ? "Pallet"
        : parsedQr.unitType === "BOX"
          ? "Caja"
          : scan.detectedType || "Sin tipo",
    shortLabel: parsedQr.unitType || scan.detectedType || "--",
    image: null,
    className: "border-slate-200 bg-slate-50 text-slate-700",
  };
  const typeMeta = TYPE_META[scan.type] || {
    label: scan.type || "Sin tipo",
    className: "border-slate-200 bg-slate-50 text-slate-700",
    icon: AccessTimeOutlinedIcon,
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group border-bordercolor relative overflow-hidden rounded-md border bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)]"
    >
      <div className="absolute top-4 right-4 hidden h-24 w-24 opacity-90 sm:block">
        {unitMeta.image ? (
          <img src={unitMeta.image} alt={unitMeta.label} className="h-full w-full object-contain" />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 bg-slate-50 text-slate-400">
            <HelpOutlineOutlinedIcon />
          </div>
        )}
      </div>

      <div className="relative flex items-start justify-between gap-4 pr-24 sm:pr-28">
        <div>
          <p className="text-xs font-black tracking-[0.18em] text-slate-400 uppercase">Escaneo</p>
          <h3 className="mt-2 text-lg font-black text-slate-950">
            {scan.id?.slice(0, 8) || "SCAN"}
          </h3>

          <div className="mt-3 flex flex-wrap gap-2">
            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${status.className}`}
            >
              <StatusIcon fontSize="small" />
              {status.label}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${unitMeta.className}`}
            >
              {unitMeta.image ? (
                <img src={unitMeta.image} alt={unitMeta.label} className="h-4 w-4 object-contain" />
              ) : (
                <HelpOutlineOutlinedIcon fontSize="small" />
              )}
              {unitMeta.label}
            </span>

            <span
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${typeMeta.className}`}
            >
              <Inventory2OutlinedIcon fontSize="small" />
              {typeMeta.label}
            </span>
          </div>
        </div>
      </div>

      <div className="relative mt-5 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
              <CameraAltOutlinedIcon fontSize="small" />
              Cámara
            </div>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {scan.Camera?.code ? scan.Camera.code : "Sin cámara"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
              <Inventory2OutlinedIcon fontSize="small" />
              Producto
            </div>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {scan.Product?.name || "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
              <Inventory2OutlinedIcon fontSize="small" />
              Bodega
            </div>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {scan.Warehouse?.name || "--"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
              <Inventory2OutlinedIcon fontSize="small" />
              Orden
            </div>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {scan.Order?.type || "--"}
            </p>
          </div>
        </div>

        {parsedQr.fields.length > 0 ? (
          <div className="rounded-2xl border border-slate-100 bg-slate-50/80 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-black tracking-[0.12em] text-slate-400 uppercase">
                <Inventory2OutlinedIcon fontSize="small" />
                Información
              </div>
              {parsedQr.totalItems ? (
                <div className="text-xs text-slate-500">
                  Total productos:{" "}
                  <span className="font-bold text-slate-800">{parsedQr.totalItems}</span>
                </div>
              ) : null}
            </div>

            <div className="mt-3 flex flex-wrap items-center gap-2">
              {parsedQr.fields.map((field) => (
                <div
                  key={field.label}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 shadow-sm"
                >
                  <span className="text-[10px] text-slate-400 uppercase">{field.label}</span>
                  <span className="text-sm font-bold break-all text-slate-900">
                    {field.value || "--"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {scan.errorMessage ? (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-rose-800">
            <p className="text-xs font-black tracking-[0.18em] text-rose-500 uppercase">
              Mensaje de error
            </p>
            <p className="mt-1 text-sm font-semibold">{scan.errorMessage}</p>
          </div>
        ) : (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-emerald-800">
            <p className="text-xs font-black tracking-[0.18em] text-emerald-500 uppercase">
              Resultado
            </p>
            <p className="mt-1 text-sm font-semibold">Evento procesado correctamente</p>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-2 text-xs font-semibold text-slate-400">
          <span>Actualizado {formatDate(scan.updatedAt)}</span>
          <span>ID {scan.id?.slice(0, 8) || "--"}</span>
        </div>
      </div>
    </motion.article>
  );
};

const ScanCards = ({ items = [], loading, layoutMode = "vertical" }) => {
  if (layoutMode === "horizontal") {
    return <ScanTable items={items} loading={loading} />;
  }

  if (!loading && (!items || items.length === 0)) {
    return (
      <EmptyState
        title="Sin eventos de escaneo"
        description="No se han detectado eventos recientemente."
        type="search"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((scan) => (
        <ScanCard key={scan.id} scan={scan} />
      ))}
    </div>
  );
};

ScanCards.propTypes = {
  items: PropTypes.array,
  loading: PropTypes.bool,
  layoutMode: PropTypes.oneOf(["vertical", "horizontal"]),
};

export default ScanCards;
