import { useState, useEffect } from "react";

export default function OpinionesManager() {
  const [opiniones, setOpiniones] = useState([]);
  const [filtros, setFiltros] = useState({ tipoVisita: "", calificacion: "", plato: "" });

  const buscarOpiniones = () => {
    const params = [];
    if (filtros.tipoVisita) params.push(`tipoVisita=${filtros.tipoVisita}`);
    if (filtros.calificacion) params.push(`calificacion=${filtros.calificacion}`);
    if (filtros.plato) params.push(`plato=${filtros.plato}`);
    fetch(`/api/opiniones?${params.join("&")}`)
      .then(r => r.json())
      .then(setOpiniones);
  };

  useEffect(() => {
    buscarOpiniones();
    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h3>Opiniones</h3>
      <select value={filtros.tipoVisita} onChange={e => setFiltros(f => ({ ...f, tipoVisita: e.target.value }))}>
        <option value="">Tipo de visita</option>
        <option value="familiar">Familiar</option>
        <option value="negocios">Negocios</option>
        <option value="pareja">Pareja</option>
        <option value="otro">Otro</option>
      </select>
      <select value={filtros.calificacion} onChange={e => setFiltros(f => ({ ...f, calificacion: e.target.value }))}>
        <option value="">Calificación</option>
        {[1,2,3,4,5].map(n => <option key={n} value={n}>{n} estrellas</option>)}
      </select>
      <input placeholder="Plato mencionado" value={filtros.plato} onChange={e => setFiltros(f => ({ ...f, plato: e.target.value }))} />
      <button onClick={buscarOpiniones}>Filtrar</button>
      <ul>
        {opiniones.map((o, i) => (
          <li key={i}>
            Cliente: {o.cliente_id} | Fecha: {o.fecha} | Calificación: {o.calificacion} | Tipo: {o.tipoVisita}
            <br />
            Platos: {o.platos?.join(", ")}
            <br />
            {o.comentario}
          </li>
        ))}
      </ul>
    </div>
  );
}