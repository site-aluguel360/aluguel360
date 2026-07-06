import { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from './AuthContext';

export function ProtectedRoute() {
    const { isAuthenticated } = useContext(AuthContext);

    // Se estiver autenticado, libera o acesso. Se não, manda para o login.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
}
