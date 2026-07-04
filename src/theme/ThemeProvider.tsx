import React, { useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { useThemeStore } from '../store/theme-store';
import { getMuiTheme } from './mui-theme';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { resolvedMode } = useThemeStore();
  const muiTheme = getMuiTheme(resolvedMode);

  useEffect(() => {
    document.documentElement.setAttribute('data-bs-theme', resolvedMode);
    document.body.className = resolvedMode === 'dark' ? 'bg-dark text-light' : 'bg-light text-dark';
  }, [resolvedMode]);

  return (
    <MuiThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
