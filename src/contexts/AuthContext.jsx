import { createContext, useContext, useEffect, useState } from "react";
import { authApi, getAccessToken, getRememberedUser, rememberUser } from "../lib/api";
import { adaptUser } from "../lib/adapters";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => adaptUser(getRememberedUser()));
  const [isLoading, setIsLoading] = useState(Boolean(getAccessToken()) && !user);

  useEffect(() => {
    if (!getAccessToken()) return;
    if (user) return;
    let active = true;
    (async () => {
      try {
        const currentUser = await authApi.me?.();
        if (active) {
          setUser(adaptUser(currentUser));
          rememberUser(currentUser);
        }
      } catch {
        if (active) setUser(null);
      } finally {
        if (active) setIsLoading(false);
      }
    })();
    return () => { active = false; };
  }, [user]);

  const login = async (email, senha) => {
    const response = await authApi.login(email, senha);
    const nextUser = adaptUser(response.user);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (payload) => {
    const response = await authApi.register(payload);
    const nextUser = adaptUser(response.user);
    setUser(nextUser);
    return nextUser;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // A sessão local deve ser encerrada mesmo se a API estiver indisponível.
    } finally {
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isLoading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
