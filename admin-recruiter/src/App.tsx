import React from 'react';
import MainLayout from './layouts/MainLayout';
import AppRouter from './router';
import { ThemeProvider } from './contexts/ThemeContext';

const App = () => (
  <ThemeProvider>
    <MainLayout>
      <AppRouter />
    </MainLayout>
  </ThemeProvider>
);

export default App;
