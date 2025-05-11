// src/contexts/ThemeContext.js
import React, { createContext, useState, useMemo } from 'react';
import { createTheme, ThemeProvider as MUIThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

export const ThemeContext = createContext({
  toggleTheme: () => {},
  mode: 'light',
});

export const ThemeProvider = ({ children }) => {
  const [mode, setMode] = useState('light');

  const themeMethods = useMemo(
    () => ({
      toggleTheme: () => {
        setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
      },
      mode,
    }),
    [mode]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          // You can define custom colors for light and dark modes here
          ...(mode === 'light'
            ? {
                // palette values for light mode
                primary: { main: '#1976d2' }, // Example primary color
                background: {
                  default: '#f4f6f8', // Lighter background for light mode
                  paper: '#ffffff',
                },
              }
            : {
                // palette values for dark mode
                primary: { main: '#90caf9' }, // Example primary color for dark
                background: {
                  default: '#121212', // Darker background
                  paper: '#1e1e1e',   // Slightly lighter dark for paper elements
                },
              }),
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={themeMethods}>
      <MUIThemeProvider theme={theme}>
        <CssBaseline /> {/* Ensures background color is applied and provides baseline styles */}
        {children}
      </MUIThemeProvider>
    </ThemeContext.Provider>
  );
};