import { Link, Routes, Route, useNavigate } from "react-router-dom";
import { useCliente } from "../pages/ClienteIngreso";
import { useEffect } from "react";
import ReservaForm from "../components/ReservaForm";
import MisReservas from "../components/MisReservas";
import OpinionForm from "../components/OpinionForm";
import PreferenciasForm from "../components/PreferenciasForm";
import Sugerencias from "../components/Sugerencias";

export default function ClienteDashboard() {
  const { cliente, logout } = useCliente();
  const navigate = useNavigate();

  useEffect(() => {
    if (!cliente) navigate("/login-cliente");
  }, [cliente, navigate]);

  if (!cliente) return null;

  return (
    <div className="container">
      <h2>Panel del Cliente</h2>
      <div style={{ float: "right" }}>
        <button onClick={logout}>Cerrar sesión</button>
      </div>
      <nav style={{ marginBottom: 20 }}>
        <Link to="reservar" style={{ marginRight: 10 }}>Reservar Mesa</Link>
        <Link to="mis-reservas" style={{ marginRight: 10 }}>Mis Reservas</Link>
        <Link to="opinion" style={{ marginRight: 10 }}>Dejar Opinión</Link>
        <Link to="preferencias" style={{ marginRight: 10 }}>Mis Preferencias</Link>
        <Link to="sugerencias">Sugerencias</Link>
      </nav>
      <Routes>
        <Route path="reservar" element={<ReservaForm />} />
        <Route path="mis-reservas" element={<MisReservas />} />
        <Route path="opinion" element={<OpinionForm />} />
        <Route path="preferencias" element={<PreferenciasForm />} />
        <Route path="sugerencias" element={<Sugerencias />} />
        <Route path="*" element={<div>Elige una opción del menú.</div>} />
      </Routes>
    </div>
  );
}