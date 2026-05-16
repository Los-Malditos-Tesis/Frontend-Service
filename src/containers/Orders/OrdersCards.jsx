import PropTypes from "prop-types";
import { motion } from "framer-motion";
import EmptyState from "../../components/generic/EmptyState";

import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import WarehouseOutlinedIcon from "@mui/icons-material/WarehouseOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import TaskAltOutlinedIcon from "@mui/icons-material/TaskAltOutlined";
import ArrowForwardRoundedIcon from "@mui/icons-material/ArrowForwardRounded";

import boxIcon from "../../assets/images/box_icon.png";
import palletIcon from "../../assets/images/pallet_icon.png";

const STATUS_META = {
  PENDING: {
    label: "Pendiente",
    icon: PendingActionsOutlinedIcon,
    className: "border-amber-200 bg-amber-50 text-amber-700",
  },
  // SHIPPED: {
  //   label: "Despachada",
  //   icon: LocalShippingOutlinedIcon,
  //   className: "border-sky-200 bg-sky-50 text-sky-700",
  // },
  DISPATCHED: {
    label: "Despachada",
    icon: LocalShippingOutlinedIcon,
    className: "border-sky-200 bg-sky-50 text-sky-700",
  },
  DELIVERED: {
    label: "Entregada",
    icon: CheckCircleOutlineOutlinedIcon,
    className: "border-emerald-200 bg-emerald-50 text-emerald-700",
  },
  CANCELLED: {
    label: "Cancelada",
    icon: CancelOutlinedIcon,
    className: "border-rose-200 bg-rose-50 text-rose-700",
  },
};

const TYPE_META = {
  SALE: {
    label: "Venta",
    icon: StorefrontOutlinedIcon,
    gradient: "from-amber-500 to-orange-500",
    text: "text-orange-600",
  },
  TRANSFER: {
    label: "Transferencia",
    icon: SwapHorizOutlinedIcon,
    gradient: "from-sky-600 to-indigo-600",
    text: "text-indigo-600",
  },
};

const UNIT_META = {
  PAL: "Pallet",
  BOX: "Caja",
};

// const normalizeStatus = (status) => (status === "DISPATCHED" ? "SHIPPED" : status);
const normalizeStatus = (status) => (status);

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

const getDestinationLabel = (order) => {
  if (order.type === "SALE") {
    return order.DestinationStore?.name || order.store_name || "Tienda destino";
  }

  return (
    order.DestinationWarehouse?.name ||
    order.destination_warehouse_name ||
    "Bodega destino"
  );
};

const getOriginLabel = (order) => {
  return order.Origin?.name || order.origin_warehouse_name || "Bodega origen";
};

const getProgressPercent = (order) => {
  const total = Number(order.total_quantity || 0);
  const delivered = Number(order.total_delivered || 0);

  if (!total) return 0;

  return Math.min(100, Math.max(0, (delivered / total) * 100));
};

const UnitIllustration = ({ unitType, type }) => {
  const isPallet = unitType === "PAL";
  const isSale = type === "SALE";

  return (
    // <div className="pointer-events-none absolute -right-4 bottom-0 hidden h-36 w-40 opacity-90 sm:block">
    <div className={`pointer-events-none absolute  hidden opacity-90 sm:block ${
      isPallet ? "h-36 w-40 -right-4 -bottom-0" : "h-34 w-34 -right-4 -bottom-2"
    }`}>
      {isPallet ? (
        <img src={palletIcon} alt="Pallet icon" />
      ) : (
        <img src={boxIcon} alt="Box icon" />
      )}
      {/* {isPallet ? (
        <svg viewBox="0 0 220 180" className="h-full w-full">
          <defs>
            <linearGradient id="palletBox" x1="0" x2="1">
              <stop offset="0%" stopColor={isSale ? "#f59e0b" : "#2563eb"} />
              <stop offset="100%" stopColor={isSale ? "#ea580c" : "#4f46e5"} />
            </linearGradient>
          </defs>

          <ellipse cx="112" cy="158" rx="78" ry="13" fill="#0f172a" opacity="0.08" />

          <g transform="translate(42 18) rotate(-6 70 70)">
            <rect x="18" y="72" width="112" height="58" rx="10" fill="url(#palletBox)" opacity="0.16" />
            <rect x="32" y="50" width="112" height="62" rx="10" fill="url(#palletBox)" opacity="0.28" />
            <rect x="48" y="28" width="112" height="66" rx="12" fill="url(#palletBox)" />

            <path d="M48 52h112" stroke="white" strokeWidth="3" opacity="0.35" />
            <path d="M104 28v66" stroke="white" strokeWidth="3" opacity="0.3" />

            <rect x="20" y="128" width="146" height="13" rx="4" fill="#334155" />
            <rect x="28" y="144" width="28" height="12" rx="3" fill="#64748b" />
            <rect x="82" y="144" width="28" height="12" rx="3" fill="#64748b" />
            <rect x="136" y="144" width="28" height="12" rx="3" fill="#64748b" />
          </g>
        </svg>
      ) : (
        <svg viewBox="0 0 220 180" className="h-full w-full">
          <defs>
            <linearGradient id="boxMain" x1="0" x2="1">
              <stop offset="0%" stopColor={isSale ? "#f59e0b" : "#2563eb"} />
              <stop offset="100%" stopColor={isSale ? "#ea580c" : "#4f46e5"} />
            </linearGradient>
          </defs>

          <ellipse cx="115" cy="158" rx="74" ry="13" fill="#0f172a" opacity="0.08" />

          <g transform="translate(40 22) rotate(7 75 70)">
            <path d="M70 10 145 42 76 74 8 39Z" fill="url(#boxMain)" opacity="0.92" />
            <path d="M8 39 76 74v78L8 116Z" fill="url(#boxMain)" opacity="0.72" />
            <path d="M145 42 76 74v78l69-38Z" fill="url(#boxMain)" opacity="0.52" />

            <path d="M70 10 76 74" stroke="white" strokeWidth="3" opacity="0.35" />
            <path d="M38 55 108 22" stroke="white" strokeWidth="3" opacity="0.25" />
            <path d="M76 74v78" stroke="white" strokeWidth="3" opacity="0.28" />

            <rect x="32" y="92" width="34" height="10" rx="3" fill="white" opacity="0.38" />
          </g>
        </svg>
      )} */}
    </div>
  );
};

const ActionButton = ({ variant = "primary", icon: Icon, children, onClick }) => {
  const styles = {
    primary:
      "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-300 hover:bg-sky-100",
    success:
      "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-300 hover:bg-emerald-100",
    danger:
      "border-rose-200 bg-rose-50 text-rose-700 hover:border-rose-300 hover:bg-rose-100",
    ghost:
      "border-slate-200 bg-white text-slate-600 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600",
  };

  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-bold transition active:scale-[0.98] ${styles[variant]}`}
    >
      <Icon fontSize="small" />
      {children}
    </button>
  );
};

const OrderActions = ({ order, onUpdateStatus, onDelete }) => {
  const status = normalizeStatus(order.status);

  return (
    <div className="flex flex-wrap gap-2">
      {status === "PENDING" && (
        <>
          <ActionButton
            icon={LocalShippingOutlinedIcon}
            onClick={() => onUpdateStatus(order, "DISPATCHED")}
          >
            Despachar
          </ActionButton>

          <ActionButton
            variant="danger"
            icon={CancelOutlinedIcon}
            onClick={() => onUpdateStatus(order, "CANCELLED")}
          >
            Cancelar
          </ActionButton>
        </>
      )}

      {status === "DISPATCHED" && (
        <ActionButton
          variant="success"
          icon={TaskAltOutlinedIcon}
          onClick={() => onUpdateStatus(order, "DELIVERED")}
        >
          Marcar entregada
        </ActionButton>
      )}

      {["PENDING", "CANCELLED"].includes(status) && (
        <ActionButton
          variant="ghost"
          icon={DeleteOutlineOutlinedIcon}
          onClick={() => onDelete(order)}
        >
          Eliminar
        </ActionButton>
      )}
    </div>
  );
};

const OrdersCards = ({ orders = [], loading, onUpdateStatus, onDelete }) => {
  if (!loading && (!orders || orders.length === 0)) {
    return (
      <EmptyState
        title="Sin órdenes"
        description="Cuando crees una orden, aparecerá aquí con acceso rápido a sus estados y acciones."
        type="search"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
      {orders.map((order, index) => {
        const typeMeta = TYPE_META[order.type] || TYPE_META.TRANSFER;
        const statusMeta = STATUS_META[order.status] || STATUS_META.PENDING;

        const TypeIcon = typeMeta.icon;
        const StatusIcon = statusMeta.icon;

        const originLabel = getOriginLabel(order);
        const destinationLabel = getDestinationLabel(order);
        const unitLabel = UNIT_META[order.unit_type] || order.unit_type || "--";
        const progress = getProgressPercent(order);

        return (
          <motion.article
            key={order.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.035 }}
            className="group relative overflow-hidden  border-2 border-bordercolor rounded-lg bg-white shadow-[0_12px_35px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_45px_rgba(15,23,42,0.1)]"
          >
            <div className={`h-1.5 bg-gradient-to-r ${typeMeta.gradient}`} />

            <UnitIllustration unitType={order.unit_type} type={order.type} />
            {/* sm:pr-40 */}
            <div className="relative p-5 pr-5 ">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold ${statusMeta.className}`}
                    >
                      <StatusIcon sx={{ fontSize: 16 }} />
                      {statusMeta.label}
                    </span>

                    <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
                      <TypeIcon sx={{ fontSize: 16 }} />
                      {typeMeta.label}
                    </span>
                  </div>

                  <h3 className="mt-3 text-xl font-black text-slate-950">
                    Orden #{order.id?.slice(0, 8) || "ORDEN"}
                  </h3>

                  <p className="mt-1 text-sm font-medium text-slate-500">
                    {unitLabel} · {formatNumber(order.total_quantity)} unidades
                  </p>
                </div>

                <div className="text-right">
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                    Progreso
                  </p>
                  <p className={`text-2xl font-black ${typeMeta.text}`}>
                    {progress.toFixed(0)}%
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl bg-slate-50/80 p-4 sm:flex-row sm:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    <WarehouseOutlinedIcon sx={{ fontSize: 16 }} />
                    Origen
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-slate-800">
                    {originLabel}
                  </p>
                </div>

                <div className="hidden text-slate-300 sm:block">
                  <ArrowForwardRoundedIcon />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-400">
                    {order.type === "SALE" ? (
                      <StorefrontOutlinedIcon sx={{ fontSize: 16 }} />
                    ) : (
                      <WarehouseOutlinedIcon sx={{ fontSize: 16 }} />
                    )}
                    Destino
                  </div>
                  <p className="mt-1 truncate text-sm font-bold text-slate-800">
                    {destinationLabel}
                  </p>
                </div>
              </div>

              <div className="mt-5">
                <div className="mb-2 flex justify-between text-xs font-bold text-slate-500">
                  <span>
                    Entregadas {formatNumber(order.total_delivered)} de{" "}
                    {formatNumber(order.total_quantity)}
                  </span>
                  <span>{progress.toFixed(0)}%</span>
                </div>

                <div className="h-2.5 overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.65 }}
                    className={`h-full rounded-full bg-gradient-to-r ${typeMeta.gradient}`}
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4">
                <div className="text-xs font-semibold text-slate-400">
                  <p>Creada: {formatDate(order.createdAt)}</p>
                  <p>Actualizada: {formatDate(order.updatedAt)}</p>
                </div>

                <OrderActions
                  order={order}
                  onUpdateStatus={onUpdateStatus}
                  onDelete={onDelete}
                />
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};

UnitIllustration.propTypes = {
  unitType: PropTypes.string,
  type: PropTypes.string,
};

ActionButton.propTypes = {
  variant: PropTypes.oneOf(["primary", "success", "danger", "ghost"]),
  icon: PropTypes.elementType.isRequired,
  children: PropTypes.node.isRequired,
  onClick: PropTypes.func.isRequired,
};

OrderActions.propTypes = {
  order: PropTypes.object.isRequired,
  onUpdateStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

OrdersCards.propTypes = {
  orders: PropTypes.array,
  loading: PropTypes.bool,
  onUpdateStatus: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default OrdersCards;