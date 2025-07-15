import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import * as authApi from '../api/auth';
import { socket, registerUser } from '../utils/socket';

type User = {
  verified: boolean;
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePic?: string;
  bio?: string;
  createdAt?: string;
  token?: string;
  isAdmin?: boolean;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem('user');
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  // Connect socket on login/register, disconnect on logout
  useEffect(() => {
    if (user && user.id) {
      if (!socket.connected) socket.connect();
      registerUser(user.id);
    } else {
      if (socket.connected) socket.disconnect();
    }
  }, [user]);

  const login = async (email: string, password: string) => {
    const res = await authApi.login({ email, password });
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);
    // Connect socket and register user
    socket.connect();
    registerUser(res.user.id);
  };

  const register = async (data: { name: string; email: string; password: string; phone?: string }) => {
    const res = await authApi.register(data);
    setUser(res.user);
    setToken(res.token);
    localStorage.setItem('user', JSON.stringify(res.user));
    localStorage.setItem('token', res.token);
    // Connect socket and register user
    socket.connect();
    registerUser(res.user.id);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    // Disconnect socket
    if (socket.connected) socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
} 