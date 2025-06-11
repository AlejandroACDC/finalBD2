import { useState, useEffect } from "react";

export default function MesasManager() {
  const [mesas, setMesas] = useState([]);
  const [form, setForm] = useState({ capacidad: "", ubicacion: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("/api/mesas").then(r => r.json()).then(setMesas);
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    if (editId) {
      fetch(`/api/mesas/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
        .then(r => r.json())
        .then(() => {
          setEditId(null);
          setForm({ capacidad: "", ubicacion: "" });
          fetch("/api/mesas").then(r => r.json()).then(setMesas);
        });
    } else {
      fetch("/api/mesas", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      })
        .then(r => r.json())
        .then(nueva => {
          setMesas(m => [...m, nueva]);
          setForm({ capacidad: "", ubicacion: "" });
        });
    }
  };

  const handleEdit = mesa => {
    setEditId(mesa.id);
    setForm({ capacidad: mesa.capacidad, ubicacion: mesa.ubicacion });
  };

  const handleDelete = id => {
    fetch(`/api/mesas/${id}`, { method: "DELETE" })
      .then(() => setMesas(m => m.filter(ms => ms.id !== id)));
  };

  return (
    <div>
      <h3>Gestionar Mesas</h3>
      <form onSubmit={handleSubmit}>
        <input name="capacidad" type="number" value={form.capacidad} onChange={handleChange} placeholder="Capacidad" required />
        <input name="ubicacion" value={form.ubicacion} onChange={handleChange} placeholder="Ubicación" required />
        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ capacidad: "", ubicacion: "" }); }}>Cancelar</button>}
      </form>
      <ul>
        {mesas.map(m => (
          <li key={m.id}>
            Mesa #{m.id} - Capacidad: {m.capacidad} - Ubicación: {m.ubicacion}
            <button onClick={() => handleEdit(m)}>Editar</button>
            <button onClick={() => handleDelete(m.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}