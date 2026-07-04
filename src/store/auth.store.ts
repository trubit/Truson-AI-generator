import { create } from 'zustand';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: {
    id: 'user_demo_1',
    name: 'Enterprise Architect',
    email: 'architect@truson.ai',
    role: 'admin',
  },
  isAuthenticated: true,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  logout: () => set({ user: null, isAuthenticated: false }),
}));
