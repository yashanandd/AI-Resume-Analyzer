import { create } from 'zustand';
import { User } from '../services/authService';

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setToken: (token: string | null) => void;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: localStorage.getItem('nexus_token'),
  user: null,
  isAuthenticated: !!localStorage.getItem('nexus_token'),
  
  setToken: (token) => {
    if (token) {
      localStorage.setItem('nexus_token', token);
    } else {
      localStorage.removeItem('nexus_token');
    }
    set({ token, isAuthenticated: !!token });
  },
  
  setUser: (user) => set({ user }),
  
  logout: () => {
    localStorage.removeItem('nexus_token');
    set({ token: null, user: null, isAuthenticated: false });
  },
}));
