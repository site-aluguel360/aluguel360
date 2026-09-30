import { useContext } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import usuariosData from '../mock/usuarios.json';

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  const { isAuthenticated, login: loginContext, logout: logoutContext } = context;

  // Aqui consumimos o mock caso esteja autenticado
  const usuario = isAuthenticated ? usuariosData : null;

  const login = (credentials) => {
    // Simulando verificação de credenciais
    loginContext();
  };

  const logout = () => {
    logoutContext();
  };

  return {
    isAuthenticated,
    usuario,
    login,
    logout
  };
};
