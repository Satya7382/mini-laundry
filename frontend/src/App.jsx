import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OrdersList from './pages/OrdersList';
import CreateOrder from './pages/CreateOrder';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';
import axios from 'axios';

function App() {
  const [token, setToken] = useState(localStorage.getItem('adminToken'));

  useEffect(() => {
    // Inject Token automatically on outgoing requests
    const reqInterceptor = axios.interceptors.request.use(config => {
      const currentToken = localStorage.getItem('adminToken');
      if (currentToken) {
        config.headers.Authorization = `Bearer ${currentToken}`;
      }
      return config;
    });

    // Detect global token invalidation
    const resInterceptor = axios.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          setToken(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.request.eject(reqInterceptor);
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    setToken(newToken);
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken(null);
  };

  if (!token) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  return (
    <BrowserRouter>
      <div className="app-container">
        <Sidebar onLogout={handleLogout} />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/orders" element={<OrdersList />} />
            <Route path="/create-order" element={<CreateOrder />} />
          </Routes>
        </main>
        <Toaster position="top-right" toastOptions={{
          style: {
            background: 'var(--bg-dark)',
            color: 'var(--text-main)',
            border: '1px solid var(--glass-border)'
          }
        }} />
      </div>
    </BrowserRouter>
  );
}

export default App;
