import { createContext, useContext, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('soletrack_user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('soletrack_token'));

  const login = async (payload) => {
    const cleanPayload = {
      ...payload,
      email: payload.email?.trim(),
      pin: payload.pin?.trim()
    };
    const { data } = await api.post('/auth/login', cleanPayload);
    localStorage.setItem('soletrack_token', data.token);
    localStorage.setItem('soletrack_user', JSON.stringify(data.user));
    setToken(data.token);
    setUser(data.user);
    return data.user;
  };

  const logout = () => {
    localStorage.removeItem('soletrack_token');
    localStorage.removeItem('soletrack_user');
    setToken(null);
    setUser(null);
  };

  const value = useMemo(() => ({ user, token, login, logout, isAdmin: user?.role === 'Admin' }), [user, token]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
