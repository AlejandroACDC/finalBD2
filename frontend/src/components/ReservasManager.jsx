import { useState, useEffect } from "react";

export default function ReservasManager() {
  const [reservas, setReservas] = useState([]);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    fetch("/api/reservas").then(r => r.json()).then(setReservas);
  }, []);

  const buscarReservas = () => {
    if (!fecha) return;
    fetch(`/api/reservas?fecha=${fecha}`)
      .then(r => r.json())
      .then(setReservas);
  };

  return (
    <div>
      <h3>Reservas por Día</h3>
      <input
        type="date"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
      />
      <button onClick={buscarReservas}>Buscar</button>
      <ul>
        {reservas.map(r => (
          <li key={r.id}>
            Cliente: {r.cliente_id} | Fecha: {r.fecha} | Hora: {r.hora} | Mesa: {r.mesa_id}
          </li>
        ))}
      </ul>
    </div>
  );
}