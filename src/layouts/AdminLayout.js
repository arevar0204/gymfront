// /src/layouts/AdminLayout.js
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div>
      <header>
        <h1>Panel de Administrador</h1>
        {/* Aquí puedes agregar Navbar o Sidebar */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;