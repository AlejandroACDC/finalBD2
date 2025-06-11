import { useState } from "react";
import BuscarClientes from "./BuscarClientes";

export default function ConsultarPedidosAdmin() {
  const [cliente, setCliente] = useState(null);
  const [fecha, setFecha] = useState("");
  const [pedidos, setPedidos] = useState([]);

  const buscarPedidos = () => {
    const params = [];
    if (fecha) params.push(`fecha=${fecha}`);
    // NO agregues cliente_id aquí
    fetch(`/api/pedidos?${params.join("&")}`)
      .then(r => r.json())
      .then(data => setPedidos(Array.isArray(data) ? data : []));
  };

  return (
    <div>
      <BuscarClientes onSelect={setCliente} />
      {cliente && (
        <>
          <h4>Pedidos de {cliente.nombre}</h4>
          <input
            type="date"
            value={fecha}
            onChange={e => setFecha(e.target.value)}
          />
          <button onClick={buscarPedidos}>Buscar</button>
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
        </>
      )}
    </div>
  );
}