import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { Sun, Moon } from 'lucide-react';
import axios from 'axios';

import AuthForm from './components/AuthForm';
import Dashboard from './components/Dashboard';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppContent: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  const [token, setToken] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('authToken');
    }
    return null;
  });

  const [user, setUser] = useState<{ id: string; email: string; name: string } | null>(() => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    }
    return null;
  });

  const handleLogin = (token: string, userData: { id: string; email: string; name: string }) => {
    setToken(token);
    setUser(userData);
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
  };

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
        <nav className="flex items-center justify-between px-6 py-4 bg-white dark:bg-gray-800 shadow-md">
          <Link to="/" className="text-2xl font-bold text-primary-600 dark:text-primary-400">
            Assessment Management
          </Link>
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleDarkMode}
              aria-label="Toggle Dark Mode"
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
          </div>
        </nav>

        <main className="max-w-5xl mx-auto p-6">
          <Routes>
            <Route
              path="/"
              element={
                token && user ? (
                  <Dashboard token={token} user={user} onLogout={handleLogout} />
                ) : (
                  <Navigate to="/login" replace />
                )
              }
            />
            <Route
              path="/login"
              element={
                token ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthForm mode="login" onLogin={handleLogin} />
                )
              }
            />
            <Route
              path="/signup"
              element={
                token ? (
                  <Navigate to="/" replace />
                ) : (
                  <AuthForm mode="signup" onLogin={handleLogin} />
                )
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

export default App;
