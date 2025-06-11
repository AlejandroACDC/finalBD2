import { useState } from "react";
import { useCliente } from "../pages/ClienteIngreso";

export default function Sugerencias() {
  const { cliente } = useCliente();
  const [sugerencias, setSugerencias] = useState([]);

  const obtenerSugerencias = () => {
    fetch(`/api/preferencias/${cliente.id}/sugerencias`)
      .then(r => r.json())
      .then(setSugerencias);
  };

  return (
    <div>
      <h3>Sugerencias Personalizadas</h3>
      <button onClick={obtenerSugerencias}>Ver sugerencias</button>
      <ul>
        {Array.isArray(sugerencias) && sugerencias.length > 0 ? (
          sugerencias.map((s, i) =>
            typeof s === "string"
              ? <li key={i}>{s}</li>
              : <li key={s.id}>{s.nombre} - {s.categoria} - ${s.precio}</li>
          )
        ) : (
          <p>No hay sugerencias disponibles.</p>
        )}
      </ul>
    </div>
  );
}