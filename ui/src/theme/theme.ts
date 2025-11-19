import { createTheme } from '@mui/material/styles';

// Create a Material-UI theme
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3', // Blue - matches cooling color
    },
    secondary: {
      main: '#ff6b6b', // Red - matches heating color
    },
    background: {
      default: '#f8f9fa',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#666666',
    },
    grey: {
      100: '#f8f9fa',
      200: '#e0e0e0',
      300: '#c0c0c0',
      400: '#9e9e9e',
      500: '#757575',
    },
  },
  typography: {
    fontFamily: 'system-ui, -apple-system, sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 'bold',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.4,
    },
  },
  shape: {
    borderRadius: 20, // Matches the thermostat panel border radius
  },
  shadows: [
    'none',
    '0 4px 12px rgba(0, 0, 0, 0.15)', // Matches thermostat panel shadow
    '0 2px 8px rgba(0, 0, 0, 0.1)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
    '0 4px 16px rgba(0, 0, 0, 0.2)',
  ],
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Disable uppercase transformation
          borderRadius: 12,
          padding: '8px 16px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
      },
    },
  },
});

export default theme;
