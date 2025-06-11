import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCliente } from "../pages/ClienteIngreso";

export default function SignupCliente() {
  const [form, setForm] = useState({ nombre: "", correo: "", telefono: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useCliente();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    fetch("/api/clientes/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)))
      .then(cliente => {
        login(cliente);
        navigate("/cliente");
      })
      .catch(err => setError(err.error || "Error al registrar"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Registro de Cliente</h2>
      <input name="nombre" placeholder="Nombre" value={form.nombre} onChange={handleChange} required />
      <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} required />
      <input name="telefono" placeholder="Teléfono" value={form.telefono} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
      <button type="submit">Registrarse</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        ¿Ya tienes cuenta? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/login-cliente")}>Inicia sesión</span>
      </div>
    </form>
  );
}