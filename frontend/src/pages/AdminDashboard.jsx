import { Link, Routes, Route } from "react-router-dom";
import MenuManager from "../components/MenuManager";
import MesasManager from "../components/MesasManager";
import HistorialClientes from "../components/HistorialClientes";
import OpinionesManager from "../components/OpinionesManager";
import ReservasManager from "../components/ReservasManager";
import PedidosManager from "../components/PedidosManager";
import ConsultarPedidosAdmin from "../components/ConsultarPedidosAdmin";

export default function AdminDashboard() {
  return (
    <div className="container">
      <h2>Panel del Administrador</h2>
      <nav style={{ marginBottom: 20 }}>
        <Link to="menu" style={{ marginRight: 10 }}>Gestionar Menú</Link>
        <Link to="mesas" style={{ marginRight: 10 }}>Gestionar Mesas</Link>
        <Link to="historial" style={{ marginRight: 10 }}>Historial de Clientes</Link>
        <Link to="opiniones" style={{ marginRight: 10 }}>Opiniones</Link>
        <Link to="reservas" style={{ marginRight: 10 }}>Reservas</Link>
        <Link to="pedidos" style={{ marginRight: 10 }}>Pedidos</Link>
      </nav>
      <Routes>
        <Route path="menu" element={<MenuManager />} />
        <Route path="mesas" element={<MesasManager />} />
        <Route path="historial" element={<HistorialClientes />} />
        <Route path="opiniones" element={<OpinionesManager />} />
        <Route path="reservas" element={<ReservasManager />} />
        <Route path="pedidos" element={<PedidosManager />} />
        <Route path="*" element={<div>Elige una opción del menú.</div>} />
      </Routes>
    </div>
  );
}