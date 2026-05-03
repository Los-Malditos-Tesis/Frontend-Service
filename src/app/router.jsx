import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../components/routes/PublicRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import NotFound from "../pages/NotFound";
import UsersPage from "../pages/UsersPage";
import ProductsPage from "../pages/ProductsPage";
import WarehousesPage from "../pages/WarehousesPage";
import StoresPage from "../pages/StoresPage";
import LocationsPage from "../pages/LocationsPage";
import SuppliersPage from "../pages/SuppliersPage";
import CamerasPage from "../pages/CamerasPage";
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
      <PublicRoute>
        <UsersPage />
      </PublicRoute>
    ),
  },

  
  {
    path: "/stores",
    element: (
      <PublicRoute>
        <StoresPage />
      </PublicRoute>
    ),
  },
  {
    path: "/locations",
    element: (
      <PublicRoute>
        <LocationsPage />
      </PublicRoute>
    ),
  },
  {
    path: "/suppliers",
    element: (
      <PublicRoute>
        <SuppliersPage />
      </PublicRoute>
    ),
  },
  {
    path: "/cameras",
    element: (
      <PublicRoute>
        <CamerasPage />
      </PublicRoute>
    ),
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);