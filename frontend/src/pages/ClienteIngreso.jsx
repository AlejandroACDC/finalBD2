import { createContext, useContext, useState } from "react";

const ClienteContext = createContext();

export function useCliente() {
  return useContext(ClienteContext);
}

export function ClienteProvider({ children }) {
  const [cliente, setCliente] = useState(() => {
    const c = localStorage.getItem("cliente");
    return c ? JSON.parse(c) : null;
  });

  const login = (data) => {
    setCliente(data);
    localStorage.setItem("cliente", JSON.stringify(data));
  };

  const logout = () => {
    setCliente(null);
    localStorage.removeItem("cliente");
  };

  return (
    <ClienteContext.Provider value={{ cliente, login, logout }}>
      {children}
    </ClienteContext.Provider>
  );
}