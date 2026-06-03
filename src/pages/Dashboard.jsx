import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import PeopleAltOutlinedIcon from "@mui/icons-material/PeopleAltOutlined";
import BusinessIcon from "@mui/icons-material/Business";
import StorageOutlinedIcon from "@mui/icons-material/StorageOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VideocamIcon from "@mui/icons-material/Videocam";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import { getDashboardStats } from "../services/dashboard.service";

const metricCards = [
  {
    key: "products",
    label: "Productos",
    icon: Inventory2OutlinedIcon,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    path: "/products",
  },
  {
    key: "users",
    label: "Usuarios",
    icon: PeopleAltOutlinedIcon,
    color: "text-emerald-600",
    bgColor: "bg-emerald-50",
    path: "/users",
  },
  {
    key: "suppliers",
    label: "Proveedores",
    icon: BusinessIcon,
    color: "text-amber-600",
    bgColor: "bg-amber-50",
    path: "/suppliers",
  },
  {
    key: "warehouses",
    label: "Bodegas",
    icon: StorageOutlinedIcon,
    color: "text-violet-600",
    bgColor: "bg-violet-50",
    path: "/warehouses",
  },
  {
    key: "stores",
    label: "Tiendas",
    icon: StorefrontOutlinedIcon,
    color: "text-sky-600",
    bgColor: "bg-sky-50",
    path: "/stores",
  },
  {
    key: "locations",
    label: "Ubicaciones",
    icon: LocationOnIcon,
    color: "text-rose-600",
    bgColor: "bg-rose-50",
    path: "/locations",
  },
  {
    key: "cameras",
    label: "Cámaras",
    icon: VideocamIcon,
    color: "text-slate-600",
    bgColor: "bg-slate-100",
    path: "/cameras",
  },
];

const formatPercent = (value) => `${Math.max(0, Math.min(100, value)).toFixed(0)}%`;

export default function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [dashboardData, setDashboardData] = useState({
    stats: {
      products: 0,
      users: 0,
      suppliers: 0,
      warehouses: 0,
      stores: 0,
      locations: 0,
      cameras: 0,
    },
    productsByCategory: [],
    usersByRole: [],
    topWarehouses: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const result = await getDashboardStats();

        if (!result.success) {
          throw new Error(result.error || "No se pudieron cargar los indicadores del dashboard");
        }

        const payload = result.data || {};
        const rawStats = payload.stats || payload.stast || {};

        setDashboardData({
          stats: {
            products: Number(rawStats.products || 0),
            users: Number(rawStats.users || 0),
            suppliers: Number(rawStats.suppliers || 0),
            warehouses: Number(rawStats.warehouses || 0),
            stores: Number(rawStats.stores || 0),
            locations: Number(rawStats.locations || 0),
            cameras: Number(rawStats.cameras || 0),
          },
          productsByCategory: Array.isArray(payload.productsByCategory)
            ? payload.productsByCategory
            : [],
          usersByRole: Array.isArray(payload.usersByRole) ? payload.usersByRole : [],
          topWarehouses: Array.isArray(payload.topWarehouses) ? payload.topWarehouses : [],
        });
        setLastUpdated(new Date());
      } catch (error) {
        toast.error(error?.message || "No se pudieron cargar los indicadores del dashboard");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totals = dashboardData.stats;
    const cameraCoverage = totals.locations
      ? (Number(totals.cameras || 0) / Number(totals.locations || 0)) * 100
      : 0;

    const utilization = totals.warehouses
      ? (Number(totals.locations || 0) / (Number(totals.warehouses || 0) * 10)) * 100
      : 0;

    const topCategories = [...dashboardData.productsByCategory]
      .map((item) => [item.category || "Sin categoría", Number(item.count || 0)])
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const topWarehouses = [...dashboardData.topWarehouses]
      .map((item) => ({
        ...item,
        locations_count: Number(item.locations || 0),
      }))
      .sort((a, b) => Number(b.locations_count || 0) - Number(a.locations_count || 0))
      .slice(0, 4);

    const usersByRole = [...dashboardData.usersByRole]
      .map((item) => [item.name || item.id || "Sin rol", Number(item.count || 0)])
      .sort((a, b) => b[1] - a[1]);

    return {
      totals,
      cameraCoverage,
      utilization,
      topCategories,
      topWarehouses,
      usersByRole,
    };
  }, [dashboardData]);

  const quickLinks = [
    { label: "Crear producto", path: "/products" },
    { label: "Registrar cámara", path: "/cameras" },
    { label: "Crear ubicación", path: "/locations" },
    { label: "Nuevo proveedor", path: "/suppliers" },
  ];

  return (
    <AdminIntroLayout
      title="Dashboard de Operaciones"
      subtitle="Monitorea en un solo lugar el estado del inventario, cobertura de cámaras y distribución logística."
      eyebrow={<Breadcrumbs />}
      buttonLabel="Gestionar productos"
      onCreate={() => navigate("/products")}
    >
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metricCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              to={card.path}
              key={card.key}
              className="border-bordercolor rounded-md border-2 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="text-secondary_color mt-2 text-3xl font-extrabold">
                    {loading ? "--" : stats.totals[card.key].toLocaleString("es-CO")}
                  </p>
                </div>
                <div className={`rounded-xl p-2.5 ${card.bgColor}`}>
                  <Icon className={card.color} fontSize="medium" />
                </div>
              </div>
            </Link>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <article className="border-bordercolor rounded-md border-2 bg-white p-6 xl:col-span-2">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-secondary_color text-xl font-bold">Salud Operativa</h3>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <TrendingUpOutlinedIcon fontSize="small" />
              Estable
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <p className="font-semibold text-gray-700">Cobertura de cámaras por ubicación</p>
                <span className="text-secondary_color font-bold">
                  {loading ? "--" : formatPercent(stats.cameraCoverage)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="bg-secondary_color h-full transition-all duration-500"
                  style={{ width: loading ? "0%" : formatPercent(stats.cameraCoverage) }}
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm">
                <p className="font-semibold text-gray-700">Utilización de ubicaciones por bodega</p>
                <span className="text-secondary_color font-bold">
                  {loading ? "--" : formatPercent(stats.utilization)}
                </span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                <div
                  className="bg-accent_color h-full transition-all duration-500"
                  style={{ width: loading ? "0%" : formatPercent(stats.utilization) }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 pt-1 sm:grid-cols-3">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs tracking-wide text-gray-500 uppercase">
                  Entidades registradas
                </p>
                <p className="text-secondary_color mt-2 text-2xl font-extrabold">
                  {loading
                    ? "--"
                    : (
                        stats.totals.products +
                        stats.totals.users +
                        stats.totals.suppliers +
                        stats.totals.warehouses +
                        stats.totals.stores +
                        stats.totals.locations +
                        stats.totals.cameras
                      ).toLocaleString("es-CO")}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs tracking-wide text-gray-500 uppercase">
                  Ubicaciones monitoreadas
                </p>
                <p className="text-secondary_color mt-2 text-2xl font-extrabold">
                  {loading ? "--" : stats.totals.locations}
                </p>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-xs tracking-wide text-gray-500 uppercase">
                  Última actualización
                </p>
                <p className="text-secondary_color mt-2 text-sm font-bold">
                  {lastUpdated
                    ? lastUpdated.toLocaleTimeString("es-CO", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "--:--"}
                </p>
              </div>
            </div>
          </div>
        </article>

        <article className="border-bordercolor rounded-md border-2 bg-white p-6">
          <h3 className="text-secondary_color mb-5 text-xl font-bold">Accesos rápidos</h3>
          <div className="space-y-3">
            {quickLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="block rounded-lg border border-gray-200 px-4 py-3 text-sm font-semibold text-gray-700 transition hover:bg-black hover:text-white"
              >
                {link.label}
              </Link>
            ))}
          </div>
          <p className="mt-4 text-xs text-gray-500">
            Usa estos atajos para mantener el flujo operativo sin salir del panel principal.
          </p>
        </article>
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <article className="border-bordercolor rounded-md border-2 bg-white p-6">
          <h3 className="text-secondary_color mb-5 text-xl font-bold">Productos por categoría</h3>

          {loading ? (
            <p className="text-gray-500">Cargando indicadores...</p>
          ) : stats.topCategories.length === 0 ? (
            <p className="text-gray-500">Aún no hay categorías registradas.</p>
          ) : (
            <div className="space-y-4">
              {stats.topCategories.map(([category, total]) => {
                const width =
                  (total / Math.max(...stats.topCategories.map((item) => item[1]))) * 100;

                return (
                  <div key={category}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-semibold text-gray-700">{category}</span>
                      <span className="text-gray-500">{total}</span>
                    </div>
                    <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="bg-secondary_color h-full"
                        style={{ width: `${width.toFixed(0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="border-bordercolor rounded-md border-2 bg-white p-6">
          <h3 className="text-secondary_color mb-5 text-xl font-bold">
            Bodegas con más ubicaciones
          </h3>

          {loading ? (
            <p className="text-gray-500">Cargando indicadores...</p>
          ) : stats.topWarehouses.length === 0 ? (
            <p className="text-gray-500">Aún no hay bodegas registradas.</p>
          ) : (
            <div className="space-y-3">
              {stats.topWarehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="flex items-center justify-between rounded-lg border border-gray-200 p-4"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{warehouse.name}</p>
                    <p className="text-sm text-gray-500">ID: {warehouse.id}</p>
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1 text-sm font-bold text-gray-700">
                    {warehouse.locations_count || 0} ubic.
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="border-bordercolor rounded-md border-2 bg-white p-6">
        <h3 className="text-secondary_color mb-5 text-xl font-bold">
          Distribución de usuarios por rol
        </h3>

        {loading ? (
          <p className="text-gray-500">Cargando indicadores...</p>
        ) : stats.usersByRole.length === 0 ? (
          <p className="text-gray-500">Sin usuarios registrados.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            {stats.usersByRole.map(([role, total]) => (
              <div key={role} className="rounded-xl border border-gray-100 bg-gray-50 p-4">
                <p className="text-sm text-gray-500">{role}</p>
                <p className="text-secondary_color mt-2 text-3xl font-extrabold">{total}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminIntroLayout>
  );
}
