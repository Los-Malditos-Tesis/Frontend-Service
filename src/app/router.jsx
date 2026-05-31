import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../components/routes/PublicRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import NotFound from "../pages/NotFound";
import UsersPage from "../pages/UsersPage";
import ProductsPage from "../pages/ProductsPage";
import WarehousesPage from "../pages/WarehousesPage";
import WarehouseDetailPage from "../pages/WarehouseDetailPage";
import StoresPage from "../pages/StoresPage";
import LocationsPage from "../pages/LocationsPage";
import SuppliersPage from "../pages/SuppliersPage";
import CamerasPage from "../pages/CamerasPage";
import OrdersPage from "../pages/OrdersPage";
import ScansPage from "../pages/ScansPage";
import ApiTestPage from "../pages/ApiTestPage";
import { ROLES } from "../utils/conts";

const APP_ROLES = [ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.VIEWER, ROLES.VIEWER_ORDER, ROLES.USER];

export const router = createBrowserRouter([
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/warehouses",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <WarehousesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/warehouses/:id",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <WarehouseDetailPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/products",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <ProductsPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN]}>
        <UsersPage />
      </ProtectedRoute>
    ),
  },

  {
    path: "/stores",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <StoresPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/locations",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <LocationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/suppliers",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <SuppliersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/scans",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <ScansPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cameras",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <CamerasPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/api-test",
    element: (
      <ProtectedRoute allowedRoles={APP_ROLES}>
        <ApiTestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
