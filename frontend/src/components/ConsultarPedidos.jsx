import { useState } from "react";
import { useCliente } from "../pages/ClienteIngreso";

export default function ConsultarPedidos() {
  const { cliente } = useCliente();
  const [fecha, setFecha] = useState("");
  const [pedidos, setPedidos] = useState([]);

  const buscarPedidos = () => {
    const params = [];
    if (fecha) params.push(`fecha=${fecha}`);
    params.push(`cliente_id=${cliente.id}`);
    fetch(`/api/pedidos?${params.join("&")}`)
      .then(r => r.json())
      .then(data => setPedidos(Array.isArray(data) ? data : []));
  };

  return (
    <div>
      <h3>Mis Pedidos</h3>
      <input
        type="date"
        value={fecha}
        onChange={e => setFecha(e.target.value)}
      />
      <button onClick={buscarPedidos}>Buscar</button>
      {pedidos.length === 0 ? (
        <div style={{ marginTop: 16, color: "#888" }}>No se encontraron pedidos.</div>
      ) : (
        <ul>
          {pedidos.map(p => (
            <li key={p.id}>
              Cliente: {p.Cliente
                ? `${p.Cliente.nombre} (ID: ${p.Cliente.id}, ${p.Cliente.correo})`
                : `ID: ${p.cliente_id}`}
              | Fecha: {p.fecha} | <strong>Total: ${p.total}</strong>
              <ul>
                {p.Platos?.map((pl, i) => (
                  <li key={i}>{pl.nombre} x {pl.PedidoPlato?.cantidad}</li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}