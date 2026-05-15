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
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <Dashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: "/warehouses",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <WarehousesPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/warehouses/:id",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <WarehouseDetailPage />
      </ProtectedRoute>
    ),
  },




  {
    path: "/products",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <ProductsPage />
      </ProtectedRoute>
    ),
  },


  {
    path: "/users",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <UsersPage />
      </ProtectedRoute>
    ),
  },



  {
    path: "/stores",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN]}>
        <StoresPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/locations",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <LocationsPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/suppliers",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <SuppliersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/scans",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <ScansPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/orders",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <OrdersPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/cameras",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <CamerasPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "/api-test",
    element: (
      <ProtectedRoute allowedRoles={[ROLES.SUPERADMIN, ROLES.ADMIN, ROLES.USER]}>
        <ApiTestPage />
      </ProtectedRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);