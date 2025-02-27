import { Outlet } from "react-router-dom";

function ClienteLayout() {
  return (
    <div>
      <header>
        <h1>Panel de Cliente</h1>
        {/* Aquí puedes agregar Navbar o Sidebar */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default ClienteLayout;