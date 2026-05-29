import PropTypes from "prop-types";
import { motion } from "framer-motion";
import EmptyState from "../../components/generic/EmptyState";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import CodeOutlinedIcon from "@mui/icons-material/CodeOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";

import boxIcon from "../../assets/images/box_icon.png";
import palletIcon from "../../assets/images/pallet_icon.png";

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
  },
  SAL: {
    label: "Salida",
    className: "border-rose-200 bg-rose-50 text-rose-700",
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

const formatConfidence = (value) => {
  const confidence = Number(value ?? 0);

  if (Number.isNaN(confidence)) return "--";

  if (confidence >= 0 && confidence <= 1) {
    return `${Math.round(confidence * 100)}%`;
  }

  return `${Math.round(confidence)}%`;
};

const ScanCard = ({ scan }) => {
  const status = STATUS_META[scan.status] || STATUS_META.ERR;
  const StatusIcon = status.icon;
  const unitMeta = UNIT_META[scan.detectedType] || {
    label: scan.detectedType || "Sin tipo",
    shortLabel: scan.detectedType || "--",
    image: null,
    className: "border-slate-200 bg-slate-50 text-slate-700",
  };
  const typeMeta = TYPE_META[scan.type] || {
    label: scan.type || "Sin tipo",
    className: "border-slate-200 bg-slate-50 text-slate-700",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative overflow-hidden rounded-md border border-bordercolor bg-white p-5 shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)]"
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

        {/* <div className="text-right">
          <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">Confianza</p>
          <p className="mt-2 text-2xl font-black text-slate-950">
            {formatConfidence(scan.confidense ?? scan.confidence)}
          </p>
        </div> */}
      </div>

      <div className="relative mt-5 grid gap-3">
        <div className="rounded-2xl bg-slate-50/80 p-4">
          <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
            <QrCodeOutlinedIcon fontSize="small" />
            QR
          </div>
          <p className="mt-2 text-sm font-semibold break-all text-slate-800">
            {scan.qrCode || "--"}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
              <CodeOutlinedIcon fontSize="small" />
              Código
            </div>
            <p className="mt-1 text-sm font-bold text-slate-800">{scan.itemCode || "--"}</p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
              <CameraAltOutlinedIcon fontSize="small" />
              Cámara
            </div>
            <p className="mt-1 truncate text-sm font-bold text-slate-800">
              {scan.camera_id ? scan.camera_id.slice(0, 8) : "Sin cámara"}
            </p>
          </div>

          <div className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm sm:col-span-2">
            <div className="flex items-center gap-2 text-xs font-black tracking-[0.18em] text-slate-400 uppercase">
              <AccessTimeOutlinedIcon fontSize="small" />
              Fecha
            </div>
            <p className="mt-1 text-sm font-bold text-slate-800">{formatDate(scan.createdAt)}</p>
          </div>
        </div>

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

const ScanCards = ({ items = [], loading }) => {
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
};

export default ScanCards;
