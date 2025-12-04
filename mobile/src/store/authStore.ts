import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      login: async (email: string, password: string) => {
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, user } = response.data;
        set({ token: accessToken, user, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },
      register: async (name: string, email: string, password: string) => {
        await api.post('/auth/register', { name, email, password });
        const response = await api.post('/auth/login', { email, password });
        const { accessToken, user } = response.data;
        set({ token: accessToken, user, isAuthenticated: true });
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
      },
      logout: () => {
        set({ user: null, token: null, isAuthenticated: false });
        delete api.defaults.headers.common['Authorization'];
      },
      setUser: (user: User) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);


