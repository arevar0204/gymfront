// /src/components/ProtectedRoute.js
import { Navigate, Outlet } from "react-router-dom";

function ProtectedRoute() {
  const token = localStorage.getItem("token");

  // Si existe token, renderiza las rutas hijas con <Outlet />
  // Si no, redirige a /login
  return token ? <Outlet /> : <Navigate to="/login" />;
}

export default ProtectedRoute;