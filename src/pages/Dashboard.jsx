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
import {
  getCameras,
  getProducts,
  getUsers,
} from "../services/api";
import { searchWarehouses } from "../services/warehouse.service";
import { searchStores } from "../services/store.service";
import { searchSuppliers } from "../services/supplier.service";
import { searchLocations } from "../services/location.service";

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
    users: [],
    products: [],
    suppliers: [],
    warehouses: [],
    stores: [],
    locations: [],
    cameras: [],
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      const requests = await Promise.allSettled([
        getUsers(),
        getProducts(),
        searchSuppliers(),
        searchWarehouses(),
        searchStores(),
        searchLocations(),
        getCameras(),
      ]);

      const [
        usersResult,
        productsResult,
        suppliersResult,
        warehousesResult,
        storesResult,
        locationsResult,
        camerasResult,
      ] = requests;

      const nextState = {
        users: usersResult.status === "fulfilled" ? usersResult.value.data || [] : [],
        products:
          productsResult.status === "fulfilled" ? productsResult.value.data || [] : [],
        suppliers:
          suppliersResult.status === "fulfilled" ? suppliersResult.value.data || [] : [],
        warehouses:
          warehousesResult.status === "fulfilled" && warehousesResult.value.data
            ? warehousesResult.value.data || []
            : [],
        stores: storesResult.status === "fulfilled" ? storesResult.value.data || [] : [],
        locations:
          locationsResult.status === "fulfilled" ? locationsResult.value.data || [] : [],
        cameras: camerasResult.status === "fulfilled" ? camerasResult.value.data || [] : [],
      };

      const failedRequests = requests.filter((result) => result.status === "rejected").length;
      if (failedRequests > 0) {
        toast.error("No se pudieron cargar todos los indicadores del dashboard");
      }

      setDashboardData(nextState);
      setLastUpdated(new Date());
      setLoading(false);
    };

    fetchDashboardData();
  }, []);

  const stats = useMemo(() => {
    const totalPallets = dashboardData.locations.reduce(
      (acc, location) => acc + Number(location.pallets_count || 0),
      0
    );

    const assignedLocationIds = new Set(
      dashboardData.cameras.map((camera) => Number(camera.location_id))
    );

    const cameraCoverage = dashboardData.locations.length
      ? (assignedLocationIds.size / dashboardData.locations.length) * 100
      : 0;

    const capacityEstimate = dashboardData.locations.length * 12;
    const occupancy = capacityEstimate ? (totalPallets / capacityEstimate) * 100 : 0;

    const productsByCategory = dashboardData.products.reduce((acc, product) => {
      const category = product.category || "Sin categoría";
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {});

    const usersByRole = dashboardData.users.reduce((acc, user) => {
      const role = user.role || "Sin rol";
      acc[role] = (acc[role] || 0) + 1;
      return acc;
    }, {});

    const topCategories = Object.entries(productsByCategory)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 4);

    const topWarehouses = [...dashboardData.warehouses]
      .sort((a, b) => Number(b.locations_count || 0) - Number(a.locations_count || 0))
      .slice(0, 4);

    return {
      totals: {
        products: dashboardData.products.length,
        users: dashboardData.users.length,
        suppliers: dashboardData.suppliers.length,
        warehouses: dashboardData.warehouses.length,
        stores: dashboardData.stores.length,
        locations: dashboardData.locations.length,
        cameras: dashboardData.cameras.length,
      },
      totalPallets,
      cameraCoverage,
      occupancy,
      topCategories,
      topWarehouses,
      usersByRole: Object.entries(usersByRole).sort((a, b) => b[1] - a[1]),
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
              className="bg-white border-2 border-bordercolor rounded-md p-5 transition hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">{card.label}</p>
                  <p className="mt-2 text-3xl font-extrabold text-secondary_color">
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
        <article className="bg-white border-2 border-bordercolor rounded-md p-6 xl:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-xl font-bold text-secondary_color">Salud Operativa</h3>
            <div className="flex items-center gap-1 text-sm font-semibold text-emerald-600">
              <TrendingUpOutlinedIcon fontSize="small" />
              Estable
            </div>
          </div>

          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <p className="font-semibold text-gray-700">Cobertura de cámaras por ubicación</p>
                <span className="font-bold text-secondary_color">
                  {loading ? "--" : formatPercent(stats.cameraCoverage)}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-[#202124] transition-all duration-500"
                  style={{ width: loading ? "0%" : formatPercent(stats.cameraCoverage) }}
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between text-sm mb-2">
                <p className="font-semibold text-gray-700">Ocupación estimada de pallets</p>
                <span className="font-bold text-secondary_color">
                  {loading ? "--" : formatPercent(stats.occupancy)}
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                <div
                  className="h-full bg-accent_color transition-all duration-500"
                  style={{ width: loading ? "0%" : formatPercent(stats.occupancy) }}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-500">Pallets registrados</p>
                <p className="mt-2 text-2xl font-extrabold text-secondary_color">
                  {loading ? "--" : stats.totalPallets}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-500">Ubicaciones monitoreadas</p>
                <p className="mt-2 text-2xl font-extrabold text-secondary_color">
                  {loading ? "--" : stats.totals.locations}
                </p>
              </div>
              <div className="rounded-xl bg-gray-50 p-4 border border-gray-100">
                <p className="text-xs uppercase tracking-wide text-gray-500">Última actualización</p>
                <p className="mt-2 text-sm font-bold text-secondary_color">
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

        <article className="bg-white border-2 border-bordercolor rounded-md p-6">
          <h3 className="text-xl font-bold text-secondary_color mb-5">Accesos rápidos</h3>
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
        <article className="bg-white border-2 border-bordercolor rounded-md p-6">
          <h3 className="text-xl font-bold text-secondary_color mb-5">Productos por categoría</h3>

          {loading ? (
            <p className="text-gray-500">Cargando indicadores...</p>
          ) : stats.topCategories.length === 0 ? (
            <p className="text-gray-500">Aún no hay categorías registradas.</p>
          ) : (
            <div className="space-y-4">
              {stats.topCategories.map(([category, total]) => {
                const width = (total / Math.max(...stats.topCategories.map((item) => item[1]))) * 100;

                return (
                  <div key={category}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold text-gray-700">{category}</span>
                      <span className="text-gray-500">{total}</span>
                    </div>
                    <div className="h-2.5 rounded-full bg-gray-100 overflow-hidden">
                      <div
                        className="h-full bg-[#202124]"
                        style={{ width: `${width.toFixed(0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </article>

        <article className="bg-white border-2 border-bordercolor rounded-md p-6">
          <h3 className="text-xl font-bold text-secondary_color mb-5">Bodegas con más ubicaciones</h3>

          {loading ? (
            <p className="text-gray-500">Cargando indicadores...</p>
          ) : stats.topWarehouses.length === 0 ? (
            <p className="text-gray-500">Aún no hay bodegas registradas.</p>
          ) : (
            <div className="space-y-3">
              {stats.topWarehouses.map((warehouse) => (
                <div
                  key={warehouse.id}
                  className="rounded-lg border border-gray-200 p-4 flex items-center justify-between"
                >
                  <div>
                    <p className="font-semibold text-gray-800">{warehouse.name}</p>
                    <p className="text-sm text-gray-500">{warehouse.address}</p>
                  </div>
                  <span className="text-sm font-bold bg-gray-100 px-3 py-1 rounded-full text-gray-700">
                    {warehouse.locations_count || 0} ubic.
                  </span>
                </div>
              ))}
            </div>
          )}
        </article>
      </section>

      <section className="bg-white border-2 border-bordercolor rounded-md p-6">
        <h3 className="text-xl font-bold text-secondary_color mb-5">Distribución de usuarios por rol</h3>

        {loading ? (
          <p className="text-gray-500">Cargando indicadores...</p>
        ) : stats.usersByRole.length === 0 ? (
          <p className="text-gray-500">Sin usuarios registrados.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {stats.usersByRole.map(([role, total]) => (
              <div key={role} className="rounded-xl bg-gray-50 border border-gray-100 p-4">
                <p className="text-sm text-gray-500">{role}</p>
                <p className="text-3xl font-extrabold text-secondary_color mt-2">{total}</p>
              </div>
            ))}
          </div>
        )}
      </section>
    </AdminIntroLayout>
  );
}