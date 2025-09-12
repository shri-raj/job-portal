import { useAuthStore } from "../store";

export const useAuth = () => {
  const { token, setToken } = useAuthStore();
  const isAuthenticated = !!token;

  const login = (newToken: string) => {
    setToken(newToken);
  };

  const logout = () => {
    setToken(null);
  };

  return { isAuthenticated, login, logout };
};
