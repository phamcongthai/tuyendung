import React from 'react';
import AppRouter from './router';
import { ThemeProvider } from './contexts/ThemeContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AuthProvider } from './contexts/AuthContext';

const App = () => (
  <ThemeProvider>
    <SettingsProvider>
      <AuthProvider>
        <AppRouter />
      </AuthProvider>
    </SettingsProvider>
  </ThemeProvider>
);

export default App;
