import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import axios from 'axios';

import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import OrdersList from './pages/OrdersList';
import CreateOrder from './pages/CreateOrder';
import Login from './pages/Login';
import { Toaster } from 'react-hot-toast';

// ✅ Set base URL
axios.defaults.baseURL = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : 'http://localhost:5001/api';

// ✅ SET TOKEN IMMEDIATELY ON LOAD (IMPORTANT)
const savedToken = localStorage.getItem('adminToken');
if (savedToken) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${savedToken}`;
}

function App() {
  const [token, setToken] = useState(savedToken);

  useEffect(() => {
    // ✅ Interceptor for handling 401 globally
    const resInterceptor = axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem('adminToken');
          delete axios.defaults.headers.common['Authorization'];
          setToken(null);
        }
        return Promise.reject(error);
      }
    );

    return () => {
      axios.interceptors.response.eject(resInterceptor);
    };
  }, []);

  // ✅ LOGIN HANDLER
  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    setToken(newToken);
  };

  // ✅ LOGOUT HANDLER
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    delete axios.defaults.headers.common['Authorization'];
    setToken(null);
  };

  // 🔐 If not logged in → show login page
  if (!token) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <Toaster position="top-right" />
      </>
    );
  }

  // ✅ Main App
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

        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              background: 'var(--bg-dark)',
              color: 'var(--text-main)',
              border: '1px solid var(--glass-border)'
            }
          }}
        />
      </div>
    </BrowserRouter>
  );
}

export default App;