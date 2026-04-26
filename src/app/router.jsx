import { createBrowserRouter } from "react-router-dom";
import PublicRoute from "../components/routes/PublicRoute";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashobard";
import ProtectedRoute from "../components/routes/ProtectedRoute";
import NotFound from "../pages/NotFound";

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
    path: "*",
    element: <NotFound />,
  },
]);