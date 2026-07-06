import { create } from 'zustand';
import { IUser } from '@shared';
import { setAccessToken } from '../api/client';
import { authApi } from '../features/auth/api/auth.api';

interface AuthState {
  user: IUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: IUser | null, accessToken?: string) => void;
  setLoading: (loading: boolean) => void;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user, accessToken) => {
    if (accessToken) setAccessToken(accessToken);
    set({ user, isAuthenticated: Boolean(user), isLoading: false });
  },

  setLoading: (isLoading) => set({ isLoading }),

  logout: async () => {
    try {
      await authApi.logout();
    } catch (_) {}
    setAccessToken(null);
    set({ user: null, isAuthenticated: false, isLoading: false });
  },

  checkAuth: async () => {
    set({ isLoading: true });
    try {
      const res = await authApi.refreshToken();
      if (res.user && res.accessToken) {
        get().setUser(res.user, res.accessToken);
        return;
      }
    } catch (_) {}
    set({ user: null, isAuthenticated: false, isLoading: false });
  },
}));
