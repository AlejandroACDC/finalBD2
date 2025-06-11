import { useState, useEffect } from "react";

export default function MenuManager() {
  const [platos, setPlatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [form, setForm] = useState({ nombre: "", categoria: "", precio: "", disponible: true, alergenos: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => {
    fetch("/api/platos").then(r => r.json()).then(setPlatos);
  }, []);

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm(f => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = e => {
    e.preventDefault();
    // Convertir alergenos a array
    const alergenosArray = form.alergenos
      ? form.alergenos.split(",").map(a => a.trim()).filter(a => a)
      : [];
    const data = { ...form, alergenos: alergenosArray };
    if (editId) {
      fetch(`/api/platos/${editId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(r => r.json())
        .then(() => {
          setEditId(null);
          setForm({ nombre: "", categoria: "", precio: "", disponible: true, alergenos: "" });
          fetch("/api/platos").then(r => r.json()).then(setPlatos);
        });
    } else {
      fetch("/api/platos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(r => r.json())
        .then(nuevo => {
          setPlatos(p => [...p, nuevo]);
          setForm({ nombre: "", categoria: "", precio: "", disponible: true, alergenos: "" });
        });
    }
  };

  const handleEdit = plato => {
    setEditId(plato.id);
    setForm({
      nombre: plato.nombre,
      categoria: plato.categoria,
      precio: plato.precio,
      disponible: plato.disponible,
      alergenos: plato.alergenos ? plato.alergenos.join(", ") : ""
    });
  };

  const handleDelete = id => {
    fetch(`/api/platos/${id}`, { method: "DELETE" })
      .then(() => setPlatos(p => p.filter(pl => pl.id !== id)));
  };

  const platosFiltrados = platos.filter(pl =>
    pl.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
    pl.categoria.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h3>Gestionar Menú</h3>
      <form onSubmit={handleSubmit}>
        <input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre" required />
        <input name="categoria" value={form.categoria} onChange={handleChange} placeholder="Categoría" required />
        <input name="precio" type="number" value={form.precio} onChange={handleChange} placeholder="Precio" required />
        <label>
          Disponible
          <input name="disponible" type="checkbox" checked={form.disponible} onChange={handleChange} />
        </label>
        <input
          name="alergenos"
          value={form.alergenos}
          onChange={handleChange}
          placeholder="Alérgenos (separados por coma, ej: gluten, lactosa)"
        />
        <button type="submit">{editId ? "Actualizar" : "Agregar"}</button>
        {editId && <button type="button" onClick={() => { setEditId(null); setForm({ nombre: "", categoria: "", precio: "", disponible: true, alergenos: "" }); }}>Cancelar</button>}
      </form>
      <input placeholder="Buscar plato..." value={busqueda} onChange={e => setBusqueda(e.target.value)} />
      <ul>
        {platosFiltrados.map(pl => (
          <li key={pl.id}>
            {pl.nombre} - {pl.categoria} - ${pl.precio} - {pl.disponible ? "Disponible" : "No disponible"}
            {pl.alergenos && pl.alergenos.length > 0 && (
              <span> | Alérgenos: {pl.alergenos.join(", ")}</span>
            )}
            <button onClick={() => handleEdit(pl)}>Editar</button>
            <button onClick={() => handleDelete(pl.id)}>Eliminar</button>
          </li>
        ))}
      </ul>
    </div>
  );
}