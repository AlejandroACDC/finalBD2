import { useState, useEffect } from "react";
import { useCliente } from "../pages/ClienteIngreso";

export default function ReservaForm() {
  const { cliente } = useCliente();
  const [mesas, setMesas] = useState([]);
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    personas: "",
    mesa_id: ""
  });
  const [mesasDisponibles, setMesasDisponibles] = useState([]);
  const [mensaje, setMensaje] = useState("");

  // Cargar mesas al iniciar
  useEffect(() => {
    fetch("/api/mesas").then(r => r.json()).then(setMesas);
  }, []);

  // Buscar mesas disponibles cuando cambian los datos
  useEffect(() => {
    if (form.fecha && form.hora && form.personas) {
      // Filtrar mesas por capacidad
      const mesasFiltradas = mesas.filter(
        m => m.capacidad >= Number(form.personas)
      );
      // Aquí podrías consultar al backend para validar disponibilidad real
      setMesasDisponibles(mesasFiltradas);
    } else {
      setMesasDisponibles([]);
    }
  }, [form.fecha, form.hora, form.personas, mesas]);

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMensaje("");
    fetch("/api/reservas", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, cliente_id: cliente.id })
    })
      .then(async r => {
        if (r.ok) return r.json();
        const err = await r.json();
        throw new Error(err.mensaje || "Error al reservar. Intenta de nuevo.");
      })
      .then(() => {
        setMensaje("¡Reserva realizada con éxito!");
        setForm({ fecha: "", hora: "", personas: "", mesa_id: "" });
      })
      .catch(err => setMensaje(err.message));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Reservar Mesa</h3>
      {/* Elimina el select de cliente */}
      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
      <input type="time" name="hora" value={form.hora} onChange={handleChange} required />
      <input type="number" name="personas" value={form.personas} onChange={handleChange} min={1} placeholder="Personas" required />
      <select name="mesa_id" value={form.mesa_id} onChange={handleChange} required>
        <option value="">Selecciona una mesa</option>
        {mesasDisponibles.map(m => (
          <option key={m.id} value={m.id}>
            Mesa #{m.id} (Capacidad: {m.capacidad}, Ubicación: {m.ubicacion})
          </option>
        ))}
      </select>
      <button type="submit">Reservar</button>
      {mensaje && <div style={{ marginTop: 10 }}>{mensaje}</div>}
    </form>
  );
}