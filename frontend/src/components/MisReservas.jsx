import { useState } from "react";
import { useCliente } from "../pages/ClienteIngreso";

export default function MisReservas() {
  const { cliente } = useCliente();
  const [reservas, setReservas] = useState([]);
  const [mensaje, setMensaje] = useState("");

  const buscarReservas = () => {
    fetch(`/api/reservas?cliente_id=${cliente.id}`)
      .then(r => r.json())
      .then(setReservas);
  };

  const cancelarReserva = id => {
    fetch(`/api/reservas/${id}`, { method: "DELETE" })
      .then(r => r.ok ? setMensaje("Reserva cancelada") : setMensaje("Error al cancelar"))
      .then(buscarReservas);
  };

  return (
    <div>
      <h3>Mis Reservas</h3>
      <button onClick={buscarReservas}>Buscar</button>
      {mensaje && <div>{mensaje}</div>}
      <ul>
        {reservas.map(r => (
          <li key={r.id}>
            Fecha: {r.fecha} Hora: {r.hora} Mesa: {r.mesa_id}
            <button onClick={() => cancelarReserva(r.id)} style={{ marginLeft: 10 }}>Cancelar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}