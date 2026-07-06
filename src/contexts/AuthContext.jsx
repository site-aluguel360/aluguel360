import { createContext, useState, useContext } from 'react';

export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  // Estado global para controlar se o usuário está logado
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = () => setIsAuthenticated(true);
  const logout = () => setIsAuthenticated(false);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
