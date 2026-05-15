import PropTypes from "prop-types";
import { motion } from "framer-motion";
import EmptyState from "../../components/generic/EmptyState";
import QrCodeOutlinedIcon from "@mui/icons-material/QrCodeOutlined";
import CameraAltOutlinedIcon from "@mui/icons-material/CameraAltOutlined";
import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";

const STATUS_META = {
  ERR: {
    label: "Error",
    className: "border-rose-200 bg-rose-50 text-rose-700",
    icon: ErrorOutlineOutlinedIcon
  },
  OK: {
    label: "OK",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
    icon: CheckCircleOutlineOutlinedIcon
  },
};

const ScanCard = ({ scan }) => {
  const status = STATUS_META[scan.status] || STATUS_META.ERR;
  const StatusIcon = status.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold uppercase text-slate-500">Escaneo</p>
          <h3 className="mt-1 font-extrabold text-slate-900 text-sm">{scan.id?.slice(0, 8)}</h3>
        </div>

        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold">
            <StatusIcon fontSize="small" />
            {status.label}
          </div>
        </div>
      </div>

      <div className="mt-3 grid gap-2">
        <div className="text-sm text-slate-700">
          <strong>QR:</strong> <span className="break-all">{scan.qrCode}</span>
        </div>

        <div className="text-sm text-slate-700 flex items-center gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
            <QrCodeOutlinedIcon fontSize="small" /> {scan.detectedType || "--"}
          </span>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-bold text-slate-600">
            <CameraAltOutlinedIcon fontSize="small" /> {scan.camera_id ? "Con cámara" : "Sin cámara"}
          </span>
        </div>

        <div className="text-xs text-slate-500">Creado {new Date(scan.createdAt).toLocaleString()}</div>
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
