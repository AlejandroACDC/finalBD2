import { Link, Routes, Route } from "react-router-dom";
import RegistrarPedido from "../components/RegistrarPedido";
import PedidosManager from "../components/PedidosManager"; // Cambia aquí

export default function MeseroDashboard() {
  return (
    <div className="container">
      <h2>Panel del Mesero</h2>
      <nav style={{ marginBottom: 20 }}>
        <Link to="registrar" style={{ marginRight: 10 }}>Registrar Pedido</Link>
        <Link to="consultar">Consultar Pedidos</Link>
      </nav>
      <Routes>
        <Route path="registrar" element={<RegistrarPedido />} />
        <Route path="consultar" element={<PedidosManager />} /> {/* Cambia aquí */}
        <Route path="*" element={<div>Elige una opción del menú.</div>} />
      </Routes>
    </div>
  );
}