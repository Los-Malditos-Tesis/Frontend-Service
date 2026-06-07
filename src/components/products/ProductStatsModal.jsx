import PropTypes from "prop-types";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import CloseIcon from "@mui/icons-material/Close";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from "recharts";

import { searchScans } from "../../services/scan.service";
import {
  formatDateLabel,
  formatDateTime,
  formatQuantity,
  getLocalDateKey,
  getProductFilterValue,
  normalizeScanType,
  parseGs1Qr,
} from "./scanMovement.utils";

const chartTooltipStyle = {
  borderRadius: 12,
  border: "1px solid #e2e8f0",
  background: "#ffffff",
  boxShadow: "0 12px 30px rgba(15, 23, 42, 0.12)",
};

const StatCard = ({ label, value, description, className }) => (
  <div className={`rounded-2xl border bg-white p-4 shadow-sm ${className || "border-slate-200"}`}>
    <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">{label}</p>

    <p className="mt-2 text-3xl font-black text-slate-950">{value}</p>

    <p className="mt-1 text-sm text-slate-500">{description}</p>
  </div>
);

StatCard.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  description: PropTypes.string.isRequired,
  className: PropTypes.string,
};

const InventoryTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  const row = payload[0]?.payload || {};

  return (
    <div style={chartTooltipStyle} className="min-w-[240px] p-4">
      <p className="text-sm font-bold text-slate-950">{label}</p>

      <div className="mt-3 space-y-2 text-sm">
        <div className="flex justify-between gap-6">
          <span className="text-slate-500">Inventario acumulado</span>
          <span className="font-bold text-slate-950">{formatQuantity(row.inventory)}</span>
        </div>

        <div className="flex justify-between gap-6">
          <span className="text-emerald-600">Entradas del día</span>
          <span className="font-bold text-emerald-700">+{formatQuantity(row.entries)}</span>
        </div>

        <div className="flex justify-between gap-6">
          <span className="text-amber-600">Salidas del día</span>
          <span className="font-bold text-amber-700">-{formatQuantity(row.exits)}</span>
        </div>
      </div>
    </div>
  );
};

InventoryTooltip.propTypes = {
  active: PropTypes.bool,
  payload: PropTypes.array,
  label: PropTypes.string,
};

const ProductStatsModal = ({ open, product, onClose }) => {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(false);

  const productFilterValue = useMemo(() => getProductFilterValue(product), [product]);

  const fetchProductScans = async () => {
    if (!product || !productFilterValue) return;

    try {
      setLoading(true);

      const result = await searchScans({
        // productId: productFilterValue,
        status: "OK",
      });

      if (result.success) {
        const data = Array.isArray(result.data) ? result.data : result.data?.items || [];

        setScans(data);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Error fetching product scans:", error);
      toast.error(error?.message || "Error al cargar estadísticas del producto");
      setScans([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && product) {
      fetchProductScans();
    }

    if (!open) {
      setScans([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, product?.id, product?.code, product?.sku]);

  const { enrichedScans, chartData, movementChartData, summary, productCodeUsed } = useMemo(() => {
    const targetProductCode = String(
      product?.code || product?.sku || productFilterValue || ""
    ).trim();

    const enriched = scans.map((scan) => ({
      ...scan,
      qrInfo: parseGs1Qr(scan.qrCode),
    }));

    const validScans = enriched
      .filter((scan) => {
        const type = normalizeScanType(scan.type);
        const validStatus = String(scan.status || "").toUpperCase() === "OK";
        const qrProductCode = String(scan.qrInfo.productCode || "").trim();
        const validQuantity = Number.isFinite(scan.qrInfo.totalItems) && scan.qrInfo.totalItems > 0;

        return (
          validStatus &&
          validQuantity &&
          (type === "ENT" || type === "SLD") &&
          qrProductCode &&
          String(qrProductCode) === String(targetProductCode)
        );
      })
      .sort(
        (left, right) =>
          new Date(left.createdAt || 0).getTime() - new Date(right.createdAt || 0).getTime()
      );

    console.log("Enriched scans:", enriched);
    console.log("Valid scans for product:", validScans);

    const groupedByDate = new Map();

    validScans.forEach((scan) => {
      const type = normalizeScanType(scan.type);
      const quantity = Number(scan.qrInfo.totalItems || 0);
      const dateKey = getLocalDateKey(scan.createdAt);

      if (!groupedByDate.has(dateKey)) {
        groupedByDate.set(dateKey, {
          dateKey,
          label: formatDateLabel(scan.createdAt),
          entries: 0,
          exits: 0,
          movement: 0,
          inventory: 0,
        });
      }

      const row = groupedByDate.get(dateKey);

      if (type === "ENT") {
        row.entries += quantity;
        row.movement += quantity;
      }

      if (type === "SLD") {
        row.exits += quantity;
        row.movement -= quantity;
      }
    });

    let runningInventory = 0;

    const timeline = [...groupedByDate.values()]
      .sort((left, right) => left.dateKey.localeCompare(right.dateKey))
      .map((row) => {
        runningInventory += row.movement;

        return {
          ...row,
          inventory: runningInventory,
        };
      });

    const totalEntries = validScans.reduce((sum, scan) => {
      const type = normalizeScanType(scan.type);
      return type === "ENT" ? sum + Number(scan.qrInfo.totalItems || 0) : sum;
    }, 0);

    const totalExits = validScans.reduce((sum, scan) => {
      const type = normalizeScanType(scan.type);
      return type === "SLD" ? sum + Number(scan.qrInfo.totalItems || 0) : sum;
    }, 0);

    const invalidQrCount = enriched.filter((scan) => {
      const type = normalizeScanType(scan.type);
      const validStatus = String(scan.status || "").toUpperCase() === "OK";

      return (
        validStatus &&
        (type === "ENT" || type === "SLD") &&
        (!scan.qrInfo.productCode || scan.qrInfo.totalItems === null)
      );
    }).length;

    return {
      enrichedScans: enriched,
      chartData: timeline,
      movementChartData: timeline,
      productCodeUsed: targetProductCode,
      summary: {
        totalEntries,
        totalExits,
        currentInventory: runningInventory,
        totalMovements: validScans.length,
        invalidQrCount,
        firstMovement: validScans[0]?.createdAt || null,
        lastMovement: validScans[validScans.length - 1]?.createdAt || null,
      },
    };
  }, [scans, product, productFilterValue]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="xl"
      PaperProps={{
        sx: {
          borderRadius: 4,
          overflow: "hidden",
        },
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 2,
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 900 }}>
            Estadísticas del producto
          </Typography>

          <Typography variant="body2" color="text.secondary">
            {product?.name || "Producto"} · Código: {productCodeUsed || "--"}
          </Typography>
        </Box>

        <IconButton onClick={onClose} aria-label="Cerrar">
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent sx={{ p: 0 }}>
        <div className="max-h-[82vh] overflow-y-auto bg-slate-50 p-6">
          {loading ? (
            <div className="flex h-[420px] items-center justify-center gap-3">
              <div className="border-accent_color h-12 w-12 animate-spin rounded-full border-t-2" />
              <p className="text-sm font-semibold text-slate-500">Cargando estadísticas...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div>
                <p className="text-xs font-bold tracking-[0.2em] text-slate-400 uppercase">
                  Movimiento histórico
                </p>

                <h3 className="mt-1 text-2xl font-black text-slate-900">
                  Inventario acumulado durante todo el tiempo
                </h3>

                <p className="mt-1 text-sm text-slate-600">
                  La gráfica usa los escaneos válidos del producto. Las entradas suman inventario y
                  las salidas lo reducen.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-4">
                <StatCard
                  label="Inventario actual"
                  value={formatQuantity(summary.currentInventory)}
                  description="Resultado acumulado histórico"
                  className="border-slate-900"
                />

                <StatCard
                  label="Entradas"
                  value={`+${formatQuantity(summary.totalEntries)}`}
                  description="Artículos ingresados en todo el histórico"
                  className="border-emerald-200"
                />

                <StatCard
                  label="Salidas"
                  value={`-${formatQuantity(summary.totalExits)}`}
                  description="Artículos retirados en todo el histórico"
                  className="border-amber-200"
                />

                <StatCard
                  label="Movimientos"
                  value={formatQuantity(summary.totalMovements)}
                  description="Escaneos válidos usados en la gráfica"
                  className="border-sky-200"
                />
              </div>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
                      Tendencia
                    </p>

                    <h4 className="mt-1 text-lg font-black text-slate-900">Inventario acumulado</h4>
                  </div>

                  <p className="text-sm text-slate-500">
                    {summary.firstMovement
                      ? `${formatDateTime(summary.firstMovement)} → ${formatDateTime(
                          summary.lastMovement
                        )}`
                      : "Sin movimientos"}
                  </p>
                </div>

                {summary.invalidQrCount > 0 && (
                  <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                    {summary.invalidQrCount} movimiento(s) no fueron incluidos porque el QR no
                    contiene producto o cantidad válida.
                  </div>
                )}

                {chartData.length === 0 ? (
                  <div className="mt-5 flex h-[360px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-500">
                      No hay movimientos válidos para graficar este producto.
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 h-[420px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={chartData}
                        margin={{ top: 12, right: 22, left: 2, bottom: 0 }}
                      >
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
                          tickFormatter={(value) => formatQuantity(value)}
                        />

                        <Tooltip content={<InventoryTooltip />} />

                        <Legend
                          formatter={(value) => (
                            <span className="text-sm text-slate-700">{value}</span>
                          )}
                        />

                        <Line
                          type="linear"
                          dataKey="inventory"
                          name={`Producto ${productCodeUsed}`}
                          stroke="#4880FF"
                          strokeWidth={3}
                          dot={{
                            r: 4,
                            fill: "#4880FF",
                            stroke: "#ffffff",
                            strokeWidth: 2,
                          }}
                          activeDot={{
                            r: 6,
                            fill: "#4880FF",
                            stroke: "#ffffff",
                            strokeWidth: 2,
                          }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="text-xs font-bold tracking-[0.18em] text-slate-400 uppercase">
                      Entradas vs salidas
                    </p>

                    <h4 className="mt-1 text-lg font-black text-slate-900">Movimiento diario</h4>
                  </div>

                  <p className="text-sm text-slate-500">Agrupado por fecha histórica</p>
                </div>

                {movementChartData.length === 0 ? (
                  <div className="mt-5 flex h-[320px] items-center justify-center rounded-xl border border-dashed border-slate-200 bg-slate-50">
                    <p className="text-sm text-slate-500">No hay datos de movimiento diario.</p>
                  </div>
                ) : (
                  <div className="mt-5 h-[340px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={movementChartData}
                        margin={{ top: 12, right: 22, left: 2, bottom: 0 }}
                      >
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
                          tickFormatter={(value) => formatQuantity(value)}
                        />

                        <Tooltip
                          formatter={(value, name) => [formatQuantity(value), name]}
                          contentStyle={chartTooltipStyle}
                        />

                        <Legend />

                        <Bar
                          dataKey="entries"
                          name="Entradas"
                          fill="#10B981"
                          radius={[8, 8, 0, 0]}
                        />

                        <Bar dataKey="exits" name="Salidas" fill="#F59E0B" radius={[8, 8, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </section>

              <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <h4 className="text-lg font-black text-slate-900">Últimos escaneos recibidos</h4>

                <div className="mt-4 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200 text-left text-xs font-black tracking-[0.16em] text-slate-400 uppercase">
                        <th className="px-3 py-3">Fecha</th>
                        <th className="px-3 py-3">Movimiento</th>
                        <th className="px-3 py-3">Unidad</th>
                        <th className="px-3 py-3">Cantidad</th>
                        <th className="px-3 py-3">QR</th>
                      </tr>
                    </thead>

                    <tbody>
                      {enrichedScans.slice(0, 25).map((scan) => {
                        const type = normalizeScanType(scan.type);
                        const isEntry = type === "ENT";

                        return (
                          <tr key={scan.id} className="border-b border-slate-100 last:border-b-0">
                            <td className="px-3 py-3 text-slate-600">
                              {formatDateTime(scan.createdAt)}
                            </td>

                            <td className="px-3 py-3">
                              <span
                                className={`rounded-full px-3 py-1 text-xs font-bold ${
                                  isEntry
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-amber-50 text-amber-700"
                                }`}
                              >
                                {isEntry ? "Entrada" : "Salida"}
                              </span>
                            </td>

                            <td className="px-3 py-3 text-slate-600">
                              {scan.qrInfo.unitType || scan.detectedType || "--"}
                            </td>

                            <td className="px-3 py-3 font-bold text-slate-900">
                              {scan.qrInfo.totalItems === null
                                ? "--"
                                : formatQuantity(scan.qrInfo.totalItems)}
                            </td>

                            <td className="max-w-[320px] truncate px-3 py-3 text-slate-500">
                              {scan.qrCode || "--"}
                            </td>
                          </tr>
                        );
                      })}

                      {enrichedScans.length === 0 && (
                        <tr>
                          <td colSpan={5} className="px-3 py-10 text-center text-slate-500">
                            No hay escaneos para mostrar.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </section>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

ProductStatsModal.propTypes = {
  open: PropTypes.bool.isRequired,
  product: PropTypes.object,
  onClose: PropTypes.func.isRequired,
};

export default ProductStatsModal;
