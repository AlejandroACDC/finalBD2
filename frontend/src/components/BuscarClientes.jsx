import { useState, useEffect } from "react";

export default function BuscarClientes({ onSelect }) {
  const [busqueda, setBusqueda] = useState("");
  const [clientes, setClientes] = useState([]);

  useEffect(() => {
    fetch("/api/clientes")
      .then((r) => r.json())
      .then(setClientes);
  }, []);

  // Solo filtra si hay texto en el input de búsqueda
  const clientesFiltrados =
    busqueda.trim().length > 0
      ? clientes.filter(
          (c) =>
            c.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.correo.toLowerCase().includes(busqueda.toLowerCase()) ||
            c.telefono.includes(busqueda)
        )
      : [];

  return (
    <div>
      <h3>Buscar Cliente</h3>
      <input
        placeholder="Buscar por nombre, correo o teléfono"
        value={busqueda}
        onChange={(e) => setBusqueda(e.target.value)}
      />
      <ul>
        {clientesFiltrados.map((c) => (
          <li key={c.id}>
            <button onClick={() => onSelect(c)}>
              {c.nombre} - {c.correo} - {c.telefono}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}