import { useNavigate } from "react-router-dom";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Bienvenido a Restaurante MyC</h1>
      <p>¿Quién eres?</p>
      <div style={{ display: "flex", gap: 20, justifyContent: "center" }}>
        <button onClick={() => navigate("/login-cliente")}>Cliente</button>
        <button onClick={() => navigate("/mesero")}>Mesero</button>
        <button onClick={() => navigate("/admin")}>Administrador</button>
      </div>
    </div>
  );
}