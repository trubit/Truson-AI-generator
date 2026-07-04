import { createTheme } from '@mui/material/styles';

export const muiTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#8b5cf6',
      light: '#a78bfa',
      dark: '#7c3aed',
    },
    secondary: {
      main: '#06b6d4',
      light: '#22d3ee',
      dark: '#0891b2',
    },
    background: {
      default: '#090d16',
      paper: '#111827',
    },
    text: {
      primary: '#f9fafb',
      secondary: '#9ca3af',
    },
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h1: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
    h2: { fontFamily: "'Outfit', sans-serif", fontWeight: 700 },
    h3: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h4: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h5: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
    h6: { fontFamily: "'Outfit', sans-serif", fontWeight: 600 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 10,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(17, 24, 39, 0.7)',
          backdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
      },
    },
  },
});
