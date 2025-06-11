import React, { useState, useEffect } from "react";

export default function PedidosManager() {
  const [pedidos, setPedidos] = useState([]);
  const [fecha, setFecha] = useState("");

  useEffect(() => {
    let url = "/api/pedidos";
    if (fecha) {
      url += `?fecha=${fecha}`;
    }
    fetch(url)
      .then((r) => r.json())
      .then((data) => setPedidos(Array.isArray(data) ? data : []));
  }, [fecha]);

  return (
    <div>
      <h3>Pedidos</h3>
      <label>
        Filtrar por fecha:{" "}
        <input
          type="date"
          value={fecha}
          onChange={(e) => setFecha(e.target.value)}
        />
      </label>
      <ul>
        {pedidos.map((p) => (
          <li key={p.id}>
            Pedido #{p.id} - Cliente: {p.cliente_id} - Fecha: {p.fecha} - Total: ${p.total}
          </li>
        ))}
      </ul>
    </div>
  );
}