import { useMemo, useState } from "react";
import { toast } from "sonner";

import NorthEastRoundedIcon from "@mui/icons-material/NorthEastRounded";
import SouthWestRoundedIcon from "@mui/icons-material/SouthWestRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ErrorOutlineRoundedIcon from "@mui/icons-material/ErrorOutlineRounded";

import { updateConfigParam } from "../../services/configParam.service";

const MODES = {
  ENT: {
    label: "Entrada",
    description: "Los productos que pasen por el muelle se registrarán como entrada.",
    icon: SouthWestRoundedIcon,
    badgeClass: "bg-emerald-50 text-emerald-700 border-emerald-200",
    iconClass: "bg-emerald-100 text-emerald-700",
    selectedClass: "border-emerald-500 bg-emerald-50 text-emerald-800",
  },
  EXT: {
    label: "Salida",
    description: "Los productos que pasen por el muelle se registrarán como salida.",
    icon: NorthEastRoundedIcon,
    badgeClass: "bg-amber-50 text-amber-700 border-amber-200",
    iconClass: "bg-amber-100 text-amber-700",
    selectedClass: "border-amber-500 bg-amber-50 text-amber-800",
  },
};

const DEFAULT_MODE = "ENT";

const getMode = (value) => MODES[value] || MODES[DEFAULT_MODE];

const ModeButton = ({ mode, selected, disabled, onClick }) => {
  const meta = MODES[mode];
  const Icon = meta.icon;

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onClick(mode)}
      className={[
        "inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition",
        "disabled:cursor-not-allowed disabled:opacity-60",
        selected
          ? meta.selectedClass
          : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50",
      ].join(" ")}
    >
      <Icon sx={{ fontSize: 18 }} />
      {meta.label}
    </button>
  );
};

const WarehouseScmModeCard = ({ warehouseId, param, loading, onUpdated, canManage = true }) => {
  const currentMode = param?.value || DEFAULT_MODE;

  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [draftMode, setDraftMode] = useState(currentMode);

  const mode = useMemo(() => getMode(currentMode), [currentMode]);
  const ModeIcon = mode.icon;

  const handleEdit = () => {
    setDraftMode(currentMode);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setDraftMode(currentMode);
    setIsEditing(false);
  };

  const handleSave = async () => {
    if (!param?.id) {
      toast.error("No se encontró el modo de escaneo de esta bodega");
      return;
    }

    try {
      setSaving(true);

      const result = await updateConfigParam(param.id, {
        value: draftMode,
        warehouse_id: warehouseId,
        key: "SCM",
      });

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Modo actualizado correctamente");
      setIsEditing(false);
      onUpdated?.();
    } catch (error) {
      console.error("Error updating SCM mode:", error);
      toast.error(error?.message || "Error al actualizar el modo");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="h-5 w-44 animate-pulse rounded bg-slate-200" />
          </div>

          <div className="h-10 w-28 animate-pulse rounded-xl bg-slate-100" />
        </div>
      </section>
    );
  }

  if (!param) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-500">
            <ErrorOutlineRoundedIcon sx={{ fontSize: 20 }} />
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
              Modo de escaneo
            </p>
            <p className="mt-1 text-sm font-bold text-slate-800">No configurado</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-start gap-3">
          <div
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
              mode.iconClass,
            ].join(" ")}
          >
            <ModeIcon sx={{ fontSize: 22 }} />
          </div>

          <div>
            <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
              Modo de escaneo
            </p>

            <div className="mt-1 flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-black text-slate-900">Flujo de productos</h3>

              <span
                className={[
                  "inline-flex rounded-full border px-3 py-1 text-xs font-bold",
                  mode.badgeClass,
                ].join(" ")}
              >
                {mode.label}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">{mode.description}</p>
          </div>
        </div>

        {!isEditing && canManage ? (
          <button
            type="button"
            onClick={handleEdit}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <EditRoundedIcon fontSize="small" />
            Cambiar
          </button>
        ) : isEditing && canManage ? (
          <div className="flex flex-wrap items-center gap-2">
            <ModeButton
              mode="ENT"
              selected={draftMode === "ENT"}
              disabled={saving}
              onClick={setDraftMode}
            />

            <ModeButton
              mode="EXT"
              selected={draftMode === "EXT"}
              disabled={saving}
              onClick={setDraftMode}
            />

            <button
              type="button"
              onClick={handleSave}
              disabled={saving || draftMode === currentMode}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <SaveRoundedIcon fontSize="small" />
              {saving ? "Guardando..." : "Guardar"}
            </button>

            <button
              type="button"
              onClick={handleCancel}
              disabled={saving}
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <CancelRoundedIcon fontSize="small" />
              Cancelar
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
};

export default WarehouseScmModeCard;
