import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import StorefrontOutlinedIcon from "@mui/icons-material/StorefrontOutlined";
import SwapHorizOutlinedIcon from "@mui/icons-material/SwapHorizOutlined";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import PendingActionsOutlinedIcon from "@mui/icons-material/PendingActionsOutlined";
import AdminIntroLayout from "../components/generic/AdminIntroLayout";
import Breadcrumbs from "../containers/Dashboard/Breadcrumbs";
import CustomDrawer from "../components/generic/CustomDrawer";
import OrderForm from "../containers/Orders/OrderForm";
import OrdersCards from "../containers/Orders/OrdersCards";
import { searchOrders, updateOrderStatus, deleteOrder } from "../services/order.service";
import { searchWarehouses } from "../services/warehouse.service";
import { searchStores } from "../services/store.service";
import { searchProducts } from "../services/product.service";
import { ORDER_TYPES } from "../utils/conts.jsx";
import WarehouseSelect from "../components/generic/WarehouseSelect";
import { canManageOrders } from "../utils/accessControl";

const typeFilters = [
  { value: "ALL", label: "Todas" },
  { value: ORDER_TYPES.SALE, label: "Ventas" },
  { value: ORDER_TYPES.TRANSFER, label: "Transferencias" },
];

const summaryCards = [
  {
    key: "total",
    label: "Órdenes",
    icon: ReceiptLongOutlinedIcon,
    bgColor: "bg-slate-100",
    color: "text-slate-700",
  },
  {
    key: "pending",
    label: "Pendientes",
    icon: PendingActionsOutlinedIcon,
    bgColor: "bg-amber-100",
    color: "text-amber-700",
    // className: "from-amber-500 to-orange-500",
  },
  {
    key: "shipped",
    label: "Despachadas",
    icon: LocalShippingOutlinedIcon,
    bgColor: "bg-sky-100",
    color: "text-sky-700",
    // className: "from-sky-600 to-indigo-600",
  },
  {
    key: "delivered",
    label: "Entregadas",
    icon: CheckCircleOutlineOutlinedIcon,
    bgColor: "bg-emerald-100",
    color: "text-emerald-700",
    // className: "from-emerald-500 to-teal-600",
  },
  {
    key: "cancelled",
    label: "Canceladas",
    icon: CancelOutlinedIcon,
    bgColor: "bg-rose-100",
    color: "text-rose-700",
    // className: "from-rose-500 to-pink-600",
  },
  {
    key: "sale",
    label: "Ventas",
    icon: StorefrontOutlinedIcon,
    bgColor: "bg-amber-100",
    color: "text-amber-700",
    // className: "from-amber-500 to-rose-500",
  },
  {
    key: "transfer",
    label: "Transferencias",
    icon: SwapHorizOutlinedIcon,
    // className: "from-cyan-500 to-indigo-500",
    bgColor: "bg-cyan-100",
    color: "text-cyan-700",
  },
];

const normalizeStatus = (status) => {
  // if (status === "DISPATCHED") return "SHIPPED";
  return status;
};

const matchesWarehouse = (order, warehouseId) => {
  if (!warehouseId) {
    return true;
  }

  const selectedId = warehouseId.toString();
  const relatedWarehouseIds = [
    order.origin_warehouse_id,
    order.Origin?.id,
    order.origin_warehouse?.id,
    order.destination_warehouse_id,
    order.DestinationWarehouse?.id,
    order.destination_warehouse?.id,
  ]
    .filter(Boolean)
    .map((value) => value.toString());

  return relatedWarehouseIds.includes(selectedId);
};

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [warehouses, setWarehouses] = useState([]);
  const [stores, setStores] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [typeFilter, setTypeFilter] = useState("ALL");
  const [warehouseFilter, setWarehouseFilter] = useState("");
  const { user } = useAuth();
  const canManage = canManageOrders(user);

  const fetchPageData = async () => {
    try {
      setLoading(true);

      const [ordersResult, warehousesResult, storesResult, productsResult] =
        await Promise.allSettled([
          searchOrders(),
          searchWarehouses(),
          searchStores(),
          searchProducts(),
        ]);

      const nextOrders =
        ordersResult.status === "fulfilled" && ordersResult.value.success
          ? ordersResult.value.data || []
          : [];
      const nextWarehouses =
        warehousesResult.status === "fulfilled" && warehousesResult.value.success
          ? warehousesResult.value.data || []
          : [];
      const nextStores =
        storesResult.status === "fulfilled" && storesResult.value.success
          ? storesResult.value.data || []
          : [];
      const nextProducts =
        productsResult.status === "fulfilled" && productsResult.value.success
          ? productsResult.value.data || []
          : [];

      setOrders(nextOrders);
      setWarehouses(nextWarehouses);
      setStores(nextStores);
      setProducts(nextProducts);

      const failedRequests = [ordersResult, warehousesResult, storesResult, productsResult].filter(
        (result) =>
          result.status === "rejected" || (result.status === "fulfilled" && !result.value.success)
      ).length;

      if (failedRequests > 0) {
        toast.error("No se pudieron cargar todos los datos de órdenes");
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast.error(error?.message || "Error al obtener órdenes");
      setOrders([]);
      setWarehouses([]);
      setStores([]);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesType = typeFilter === "ALL" || order.type === typeFilter;
      const matchesSelectedWarehouse = matchesWarehouse(order, warehouseFilter);

      return matchesType && matchesSelectedWarehouse;
    });
  }, [orders, typeFilter, warehouseFilter]);

  const warehouseOptions = useMemo(
    () =>
      warehouses.map((warehouse) => ({
        value: warehouse.id?.toString() || "",
        label: warehouse.name,
      })),
    [warehouses]
  );

  const stats = useMemo(() => {
    const statusCounts = orders.reduce(
      (acc, order) => {
        const normalized = normalizeStatus(order.status);
        acc.total += 1;

        if (normalized === "PENDING") acc.pending += 1;
        // if (normalized === "SHIPPED") acc.shipped += 1;
        if (normalized === "DELIVERED") acc.delivered += 1;
        if (normalized === "CANCELLED") acc.cancelled += 1;

        return acc;
      },
      {
        total: 0,
        pending: 0,
        shipped: 0,
        delivered: 0,
        cancelled: 0,
      }
    );

    const typeCounts = orders.reduce(
      (acc, order) => {
        if (order.type === ORDER_TYPES.SALE) acc.sale += 1;
        if (order.type === ORDER_TYPES.TRANSFER) acc.transfer += 1;
        return acc;
      },
      {
        sale: 0,
        transfer: 0,
      }
    );

    return {
      ...statusCounts,
      ...typeCounts,
    };
  }, [orders]);

  const handleOpenDrawer = () => setIsDrawerOpen(true);
  const handleCloseDrawer = () => setIsDrawerOpen(false);

  const handleUpdateStatus = async (order, status) => {
    try {
      const result = await updateOrderStatus(order.id, status);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Estado de la orden actualizado");
      fetchPageData();
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error?.message || "No se pudo actualizar la orden");
    }
  };

  const handleDeleteOrder = async (order) => {
    if (!window.confirm("¿Deseas eliminar esta orden?")) {
      return;
    }

    try {
      const result = await deleteOrder(order.id);

      if (!result.success) {
        throw new Error(result.error);
      }

      toast.success("Orden eliminada correctamente");
      fetchPageData();
    } catch (error) {
      console.error("Error deleting order:", error);
      toast.error(error?.message || "No se pudo eliminar la orden");
    }
  };

  return (
    <AdminIntroLayout
      title="Gestión de Órdenes"
      subtitle="Crea ventas y transferencias con una vista visual tipo tablero, y controla el ciclo de vida de cada orden desde un solo lugar."
      eyebrow={<Breadcrumbs />}
      buttonLabel={canManage ? "Crear orden" : undefined}
      onCreate={canManage ? handleOpenDrawer : undefined}
      showAddIcon={true}
    >
      <div className="space-y-6">
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {summaryCards.map((card) => {
            const Icon = card.icon;
            return (
              <article
                key={card.key}
                className="border-bordercolor rounded-md border-2 bg-white p-5 transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-500">{card.label}</p>
                    <p className="text-secondary_color mt-2 text-3xl font-extrabold">
                      {loading ? "--" : stats[card.key].toLocaleString("es-SV")}
                    </p>
                  </div>
                  <div className={`rounded-xl p-2.5 ${card.bgColor} `}>
                    <Icon className={card.color} />
                  </div>
                </div>
              </article>
            );
          })}
        </section>

        <section className="PT-8 md:pt-14">
          <div className="lg:justi fy-between flex flex-col gap-4 lg:flex-row lg:items-center">
            <div className="w-full max-w-md">
              <p className="mt-1 text-sm font-semibold text-slate-700">
                Buscar ordenes relacionadas a una bodega específica..
              </p>
              <div className="mt-3">
                <WarehouseSelect
                  labelText=""
                  placeholderLabel="Todas las bodegas"
                  options={warehouseOptions}
                  value={warehouseFilter}
                  onChange={(event) => setWarehouseFilter(event.target.value)}
                  name="warehouse_filter"
                />
              </div>
            </div>

            <div className="mt-8 ml-4 flex flex-wrap gap-2">
              {typeFilters.map((filter) => (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => setTypeFilter(filter.value)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    typeFilter === filter.value
                      ? "bg-slate-900 text-white shadow-md"
                      : "border border-slate-200 bg-slate-50 text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  {filter.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        <OrdersCards
          orders={filteredOrders}
          loading={loading}
          onUpdateStatus={handleUpdateStatus}
          onDelete={handleDeleteOrder}
          canManage={canManage}
        />
      </div>

      <CustomDrawer
        isOpen={isDrawerOpen}
        onClose={handleCloseDrawer}
        title="Crear orden"
        drawerWidth={860}
      >
        <OrderForm
          warehouses={warehouses}
          stores={stores}
          products={products}
          onSuccess={() => {
            handleCloseDrawer();
            fetchPageData();
          }}
        />
      </CustomDrawer>
    </AdminIntroLayout>
  );
};

export default OrdersPage;
