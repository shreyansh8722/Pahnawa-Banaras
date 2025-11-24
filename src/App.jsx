import React, { createContext, useState, useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { LocationProvider } from './hooks/useLocation';

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {},
});

export default function App() {
  const [theme, setTheme] = useState('light');
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const toggleTheme = () => {
    setTheme('light'); // Force light mode for branding
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <AuthProvider>
        <LocationProvider>
          <div className="min-h-screen bg-white text-brand-dark font-sans">
            <Outlet />
          </div>
        </LocationProvider>
      </AuthProvider>
    </ThemeContext.Provider>
  );
}