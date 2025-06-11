import './styles/App.css';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import ClienteDashboard from "./pages/ClienteDashboard";
import MeseroDashboard from "./pages/MeseroDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import LoginCliente from "./components/Login";
import SignupCliente from "./components/Signup";
import { ClienteProvider } from "./pages/ClienteIngreso";

function App() {
  return (
    <ClienteProvider>
      <BrowserRouter>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login-cliente" element={<LoginCliente />} />
            <Route path="/signup-cliente" element={<SignupCliente />} />
            <Route path="/cliente/*" element={<ClienteDashboard />} />
            <Route path="/mesero/*" element={<MeseroDashboard />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
          </Routes>
        </div>
      </BrowserRouter>
    </ClienteProvider>
  );
}

export default App;