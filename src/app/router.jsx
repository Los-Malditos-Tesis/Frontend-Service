import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../components/routes/PublicRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashobard";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import NotFound from "../pages/NotFound";
import UsersPage from "../pages/UsersPage";
import ProductsPage from "../pages/ProductsPage";
import WarehousesPage from "../pages/WarehousesPage";
import LocationsPage from "../pages/LocationsPage";
import SuppliersPage from "../pages/SuppliersPage";
import CamerasPage from "../pages/CamerasPage";

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
      <ProtectedRoute>
        <Dashboard />
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
    path: "/products",
    element: (
      <PublicRoute>
        <ProductsPage />
      </PublicRoute>
    ),
  },
  {
    path: "/warehouses",
    element: (
      <PublicRoute>
        <WarehousesPage />
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