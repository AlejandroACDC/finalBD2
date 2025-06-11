import { useState, useEffect } from "react";
import BuscarClientes from "./BuscarClientes";

export default function HistorialClientes() {
  const [cliente, setCliente] = useState(null);
  const [opiniones, setOpiniones] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [preferencias, setPreferencias] = useState(null);

  const buscarTodo = (c) => {
    setCliente(c);
    fetch(`/api/opiniones?clienteId=${c.id}`).then(r => r.json()).then(setOpiniones);
    fetch(`/api/reservas?cliente_id=${c.id}`).then(r => r.json()).then(setReservas);
    fetch(`/api/pedidos?cliente_id=${c.id}`).then(r => r.json()).then(setPedidos);
    fetch(`/api/preferencias/${c.id}`).then(r => r.json()).then(setPreferencias);
  };

  return (
    <div>
      <h3>Historial de Cliente</h3>
      <BuscarClientes onSelect={buscarTodo} />
      {cliente && (
        <div>
          <h4>Cliente: {cliente.nombre} ({cliente.correo})</h4>
          <h5>Preferencias</h5>
          {preferencias ? (
            <ul>
              <li>Intolerancias: {preferencias.intolerancias?.join(", ") || "N/A"}</li>
              <li>Platos favoritos: {preferencias.platosFavoritos?.join(", ") || "N/A"}</li>
              <li>Estilos: {preferencias.estilos?.join(", ") || "N/A"}</li>
            </ul>
          ) : <div>No hay preferencias registradas.</div>}
          <h5>Opiniones</h5>
          <ul>
            {opiniones.map((o, i) => (
              <li key={i}>
                Fecha: {o.fecha} | Calificación: {o.calificacion} | Tipo: {o.tipoVisita}
                <br />
                Platos: {o.platos?.join(", ")}
                <br />
                {o.comentario}
              </li>
            ))}
          </ul>
          <h5>Reservas</h5>
          <ul>
            {reservas.map(r => (
              <li key={r.id}>
                Fecha: {r.fecha} Hora: {r.hora} Mesa: {r.mesa_id}
              </li>
            ))}
          </ul>
          <h5>Pedidos</h5>
          <ul>
            {pedidos.map(p => (
              <li key={p.id}>
                Fecha: {p.fecha} | <strong>Total: ${p.total}</strong>
                <ul>
                  {p.Platos?.map((pl, i) => (
                    <li key={i}>{pl.nombre} x {pl.PedidoPlato?.cantidad}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}