import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) return null;

  if (!isAuthenticated) {
    console.log("Usuario no autenticado, redirigiendo a login...");
    return <Navigate to="/login" replace />;
  }

  if (Array.isArray(allowedRoles) && allowedRoles.length > 0) {
    const userRoles = [];

    if (!user) return <Navigate to="/login" replace />;

    if (Array.isArray(user.roles)) {
      userRoles.push(...user.roles.map((r) => (typeof r === "string" ? r : r.id)));
    } else if (typeof user.role === "string") {
      userRoles.push(user.role);
    } 

    const hasAccess = userRoles.some((r) => allowedRoles.includes(r));

    console.log("Roles del usuario:", userRoles);
    console.log("Roles permitidos para esta ruta:", allowedRoles);
    console.log("¿El usuario tiene acceso?", hasAccess);

    if (!hasAccess) return <Navigate to="/login" replace />;
  }

  return children;
}