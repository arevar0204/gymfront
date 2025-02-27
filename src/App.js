// /src/App.js
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";

// Layouts
import AdminLayout from "./layouts/AdminLayout";
import SuperAdminLayout from "./layouts/SuperAdminLayout";
import VigilanteLayout from "./layouts/VigilanteLayout";
import ClienteLayout from "./layouts/ClienteLayout";
import EntrenadorLayout from "./layouts/EntrenadorLayout";

// Dashboards
import DashboardAdmin from "./pages/admin/DashboardAdmin";
import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin";
import DashboardVigilante from "./pages/vigilante/DashboardVigilante";
import DashboardCliente from "./pages/cliente/DashboardCliente";
import DashboardEntrenador from "./pages/entrenador/DashboardEntrenador";

// SuperAdmin
import Gimnasios from "./pages/superadmin/Gimnasios";
import Administradores from "./pages/superadmin/Administradores";
import Usuarios from "./pages/superadmin/Usuarios";
import Configuracion from "./pages/superadmin/Configuracion";

import Register from './pages/Register';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas para Administrador */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<DashboardAdmin />} />
          </Route>
        </Route>

        {/* Rutas para SuperAdmin */}
        <Route element={<ProtectedRoute />}>
          <Route path="/superadmin" element={<SuperAdminLayout />}>
            <Route path="dashboard" element={<DashboardSuperAdmin />} />
            <Route path="gimnasios" element={<Gimnasios />} />
            <Route path="administradores" element={<Administradores />} />
            <Route path="usuarios" element={<Usuarios />} />
            <Route path="configuracion" element={<Configuracion />} />
          </Route>
        </Route>

        {/* Rutas para Vigilante */}
        <Route element={<ProtectedRoute />}>
          <Route path="/vigilante" element={<VigilanteLayout />}>
            <Route path="dashboard" element={<DashboardVigilante />} />
          </Route>
        </Route>

        {/* Rutas para Cliente */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cliente" element={<ClienteLayout />}>
            <Route path="dashboard" element={<DashboardCliente />} />
          </Route>
        </Route>

        {/* Rutas para Entrenador */}
        <Route element={<ProtectedRoute />}>
          <Route path="/entrenador" element={<EntrenadorLayout />}>
            <Route path="dashboard" element={<DashboardEntrenador />} />
          </Route>
        </Route>

        {/* Redirige cualquier otra ruta a login */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;