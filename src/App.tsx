import React, { useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AppProviders } from './providers/AppProviders';
import { AppRoutes } from './routes';
import { useAuthStore } from './store/auth.store';

export const AppContent: React.FC = () => {
  const checkAuth = useAuthStore((s) => s.checkAuth);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
};

export const App: React.FC = () => {
  return (
    <AppProviders>
      <AppContent />
    </AppProviders>
  );
};

export default App;
