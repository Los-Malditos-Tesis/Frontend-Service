import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { getUserRoleIds } from "../../utils/accessControl";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    console.log("Usuario no autenticado, redirigiendo a login...");
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    if (!user) return <Navigate to="/login" replace />;

    const userRoles = getUserRoleIds(user);

    const hasAccess = userRoles.some((r) => allowedRoles.includes(r));

    // console.log("Roles del usuario:", userRoles);
    // console.log("Roles permitidos para esta ruta:", allowedRoles);
    // console.log("¿El usuario tiene acceso?", hasAccess);

    if (!hasAccess) return <Navigate to="/login" replace />;
  }

  return children;
}
