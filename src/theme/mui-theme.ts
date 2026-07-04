import { createTheme } from '@mui/material/styles';
import { colors } from './colors';
import { typography } from './typography';

export const getMuiTheme = (mode: 'light' | 'dark') => {
  const isDark = mode === 'dark';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: colors.purple[500],
        light: colors.purple[400],
        dark: colors.purple[700],
      },
      secondary: {
        main: colors.cyan[500],
        light: colors.cyan[400],
        dark: colors.cyan[600],
      },
      background: {
        default: isDark ? colors.dark.bgPrimary : colors.light.bgPrimary,
        paper: isDark ? colors.dark.bgSecondary : colors.light.bgSecondary,
      },
      text: {
        primary: isDark ? colors.dark.textPrimary : colors.light.textPrimary,
        secondary: isDark ? colors.dark.textSecondary : colors.light.textSecondary,
      },
    },
    typography: {
      fontFamily: typography.fontFamily.body,
      h1: { fontFamily: typography.fontFamily.heading, fontWeight: typography.fontWeight.bold },
      h2: { fontFamily: typography.fontFamily.heading, fontWeight: typography.fontWeight.bold },
      h3: { fontFamily: typography.fontFamily.heading, fontWeight: typography.fontWeight.semibold },
      h4: { fontFamily: typography.fontFamily.heading, fontWeight: typography.fontWeight.semibold },
      h5: { fontFamily: typography.fontFamily.heading, fontWeight: typography.fontWeight.semibold },
      h6: { fontFamily: typography.fontFamily.heading, fontWeight: typography.fontWeight.semibold },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: typography.fontWeight.semibold,
            borderRadius: 10,
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: isDark ? colors.dark.bgCard : colors.light.bgCard,
            backdropFilter: 'blur(16px)',
            border: `1px solid ${isDark ? colors.dark.border : colors.light.border}`,
          },
        },
      },
    },
  });
};
