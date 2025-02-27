import { Outlet } from "react-router-dom";

function EntrenadorLayout() {
  return (
    <div>
      <header>
        <h1>Panel de Entrenador</h1>
        {/* Aquí puedes agregar Navbar o Sidebar */}
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default EntrenadorLayout;