import { useState, useEffect } from "react";
import { useCliente } from "../pages/ClienteIngreso";

export default function OpinionForm() {
  const { cliente } = useCliente();
  const [form, setForm] = useState({
    calificacion: 5,
    comentario: "",
    tipoVisita: "",
    fecha: "",
    platos: []
  });
  const [mensaje, setMensaje] = useState("");
  const [platosDisponibles, setPlatosDisponibles] = useState([]);

  useEffect(() => {
    fetch("/api/platos")
      .then(r => r.json())
      .then(setPlatosDisponibles);
  }, []);

  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === "platos") {
      const values = Array.from(selectedOptions, option => option.value);
      setForm(f => ({ ...f, platos: values }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMensaje("");
    fetch("/api/opiniones", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        clienteId: cliente.id // <-- usa el id numérico de PostgreSQL
      })
    })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(() => {
        setMensaje("¡Opinión enviada!");
        setForm({ calificacion: 5, comentario: "", tipoVisita: "", fecha: "", platos: [] });
      })
      .catch(() => setMensaje("Error al enviar opinión."));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Dejar Opinión</h3>
      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
      <select name="tipoVisita" value={form.tipoVisita} onChange={handleChange} required>
        <option value="">Tipo de visita</option>
        <option value="familiar">Familiar</option>
        <option value="negocios">Negocios</option>
        <option value="pareja">Pareja</option>
        <option value="otro">Otro</option>
      </select>
      <input type="number" name="calificacion" min={1} max={5} value={form.calificacion} onChange={handleChange} required />
      <textarea name="comentario" value={form.comentario} onChange={handleChange} placeholder="Comentario" required />
      <label>
        Platos consumidos:
        <select
          name="platos"
          multiple
          value={form.platos}
          onChange={handleChange}
          style={{ height: 100 }}
        >
          {platosDisponibles.map(pl => (
            <option key={pl.id} value={pl.nombre}>{pl.nombre}</option>
          ))}
        </select>
      </label>
      <button type="submit">Enviar</button>
      {mensaje && <div>{mensaje}</div>}
    </form>
  );
}