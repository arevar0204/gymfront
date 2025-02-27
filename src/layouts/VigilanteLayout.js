import { Outlet } from "react-router-dom";

function VigilateLayout() {
  return (
    <div>
      <header>
        <h1>Panel de Vigilante</h1>
        {/* Aquí puedes agregar Navbar o Sidebar */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default VigilateLayout;