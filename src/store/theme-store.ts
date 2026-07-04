import { create } from 'zustand';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeState {
  mode: ThemeMode;
  resolvedMode: 'light' | 'dark';
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const getInitialMode = (): ThemeMode => {
  const saved = localStorage.getItem('truson_theme_mode') as ThemeMode;
  return saved || 'dark';
};

const getSystemPreference = (): 'light' | 'dark' => {
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches) {
    return 'light';
  }
  return 'dark';
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: getInitialMode(),
  resolvedMode: getInitialMode() === 'system' ? getSystemPreference() : (getInitialMode() as 'light' | 'dark'),
  setMode: (mode: ThemeMode) => {
    localStorage.setItem('truson_theme_mode', mode);
    const resolved = mode === 'system' ? getSystemPreference() : mode;
    document.documentElement.setAttribute('data-bs-theme', resolved);
    set({ mode, resolvedMode: resolved });
  },
  toggleMode: () => {
    const current = get().mode;
    const next: ThemeMode = current === 'dark' ? 'light' : 'dark';
    get().setMode(next);
  },
}));
