import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCliente } from "../pages/ClienteIngreso";

export default function LoginCliente() {
  const [form, setForm] = useState({ correo: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useCliente();

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = e => {
    e.preventDefault();
    setError("");
    fetch("/api/clientes/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form)
    })
      .then(r => r.ok ? r.json() : r.json().then(e => Promise.reject(e)))
      .then(data => {
        login(data.cliente);
        navigate("/cliente");
      })
      .catch(err => setError(err.error || "Error al iniciar sesión"));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Iniciar Sesión</h2>
      <input name="correo" placeholder="Correo" value={form.correo} onChange={handleChange} required />
      <input name="password" type="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
      <button type="submit">Entrar</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <div>
        ¿No tienes cuenta? <span style={{ color: "blue", cursor: "pointer" }} onClick={() => navigate("/signup-cliente")}>Regístrate</span>
      </div>
    </form>
  );
}