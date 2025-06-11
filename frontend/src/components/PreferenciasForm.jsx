import { useState, useEffect } from "react";
import { useCliente } from "../pages/ClienteIngreso";

export default function PreferenciasForm() {
  const { cliente } = useCliente();
  const [form, setForm] = useState({
    intolerancias: "",
    platosFavoritos: [],
    estilos: ""
  });
  const [mensaje, setMensaje] = useState("");
  const [platosDisponibles, setPlatosDisponibles] = useState([]);

  useEffect(() => {
    fetch("/api/platos")
      .then(r => r.json())
      .then(setPlatosDisponibles);
  }, []);

  const handleChange = e => {
    const { name, value, selectedOptions } = e.target;
    if (name === "platosFavoritos") {
      const values = Array.from(selectedOptions, option => option.value);
      setForm(f => ({ ...f, platosFavoritos: values }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = e => {
    e.preventDefault();
    setMensaje("");
    fetch("/api/preferencias", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        clienteId: cliente.id, // <-- usa el id numérico de PostgreSQL
        intolerancias: form.intolerancias.split(",").map(i => i.trim()),
        platosFavoritos: form.platosFavoritos,
        estilos: form.estilos.split(",").map(e => e.trim())
      })
    })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(() => {
        setMensaje("¡Preferencias guardadas!");
        setForm({ intolerancias: "", platosFavoritos: [], estilos: "" });
      })
      .catch(() => setMensaje("Error al guardar preferencias."));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Mis Preferencias</h3>
      <input name="intolerancias" value={form.intolerancias} onChange={handleChange} placeholder="Intolerancias (separadas por coma)" />
      <label>
        Platos favoritos:
        <select
          name="platosFavoritos"
          multiple
          value={form.platosFavoritos}
          onChange={handleChange}
          style={{ height: 100 }}
        >
          {platosDisponibles.map(pl => (
            <option key={pl.id} value={pl.nombre}>{pl.nombre}</option>
          ))}
        </select>
      </label>
      <input name="estilos" value={form.estilos} onChange={handleChange} placeholder="Estilos preferidos (vegetariano, sin gluten, etc.)" />
      <button type="submit">Guardar</button>
      {mensaje && <div>{mensaje}</div>}
    </form>
  );
}