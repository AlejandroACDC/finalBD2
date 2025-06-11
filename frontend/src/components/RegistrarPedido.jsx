import { useState, useEffect } from "react";
import BuscarClientes from "./BuscarClientes";

export default function RegistrarPedido() {
  const [cliente, setCliente] = useState(null);
  const [form, setForm] = useState({ fecha: "", platos: [], cantidades: {} });
  const [mensaje, setMensaje] = useState("");
  const [platosDisponibles, setPlatosDisponibles] = useState([]);

  useEffect(() => {
    fetch("/api/platos").then(r => r.json()).then(setPlatosDisponibles);
  }, []);

  const handleChange = e => {
    const { name, value, type, selectedOptions } = e.target;
    if (name === "platos") {
      const values = Array.from(selectedOptions, option => option.value);
      setForm(f => ({ ...f, platos: values }));
    } else if (name.startsWith("cantidad-")) {
      const plato = name.replace("cantidad-", "");
      setForm(f => ({
        ...f,
        cantidades: { ...f.cantidades, [plato]: value }
      }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  // Calcular el total en el frontend
  const total = form.platos.reduce((sum, id) => {
    const plato = platosDisponibles.find(p => p.id === Number(id));
    const cantidad = Number(form.cantidades[id] || 1);
    return sum + (plato ? plato.precio * cantidad : 0);
  }, 0);

  const handleSubmit = e => {
    e.preventDefault();
    setMensaje("");
    const platosPedido = form.platos.map(id => ({
      plato_id: Number(id),
      cantidad: Number(form.cantidades[id] || 1)
    }));
    fetch("/api/pedidos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        cliente_id: cliente.id,
        fecha: form.fecha,
        platos: platosPedido
      })
    })
      .then(r => r.ok ? r.json() : Promise.reject(r))
      .then(() => {
        setMensaje("¡Pedido registrado!");
        setForm({ fecha: "", platos: [], cantidades: {} });
        setCliente(null);
      })
      .catch(() => setMensaje("Error al registrar pedido."));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Registrar Pedido</h3>
      <BuscarClientes onSelect={setCliente} />
      {cliente && (
        <div style={{ marginBottom: 10 }}>
          <strong>Cliente seleccionado:</strong> {cliente.nombre} ({cliente.correo})
        </div>
      )}
      <input type="date" name="fecha" value={form.fecha} onChange={handleChange} required />
      <label>
        Platos:
        <select
          name="platos"
          multiple
          value={form.platos}
          onChange={handleChange}
          style={{ height: 100 }}
        >
          {platosDisponibles.map(pl => (
            <option key={pl.id} value={pl.id}>{pl.nombre}</option>
          ))}
        </select>
      </label>
      {form.platos.map(id => {
        const plato = platosDisponibles.find(p => p.id === Number(id));
        return (
          <div key={id}>
            <label>
              Cantidad de {plato?.nombre || id}:
              <input
                type="number"
                name={`cantidad-${id}`}
                min={1}
                value={form.cantidades[id] || 1}
                onChange={handleChange}
                style={{ width: 60, marginLeft: 8 }}
              />
            </label>
          </div>
        );
      })}
      <div style={{ margin: "1em 0", fontWeight: "bold" }}>
        Total: ${total}
      </div>
      <button type="submit" disabled={!cliente}>Registrar</button>
      {mensaje && <div>{mensaje}</div>}
    </form>
  );
}