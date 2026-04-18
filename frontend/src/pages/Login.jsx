import React, { useState } from 'react';
import axios from 'axios';
import { Droplets } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !password) {
      return toast.error('Enter username and password');
    }

    try {
      setLoading(true);

      const url = isLogin
        ? '/auth/login'
        : '/auth/signup';

      const { data } = await axios.post(url, {
        username,
        password
      });

      // ✅ Save token immediately
      localStorage.setItem('adminToken', data.token);

      // ✅ Set axios header immediately
      axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;

      toast.success(isLogin ? 'Login successful' : 'Account created');

      // ✅ update app state
      onLogin(data.token);

    } catch (error) {
      toast.error(error.response?.data?.error || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form
        onSubmit={handleSubmit}
        className="glass-panel"
        style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}
      >
        <Droplets
          size={48}
          style={{ marginBottom: '1.5rem', color: 'var(--primary)' }}
        />

        <h2 style={{ marginBottom: '2rem' }}>
          {isLogin ? 'Laundry Login' : 'Create Account'}
        </h2>

        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Username</label>
          <input
            type="text"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="johndoe"
          />
        </div>

        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary"
          style={{ width: '100%', marginTop: '1rem' }}
          disabled={loading}
        >
          {loading
            ? 'Authenticating...'
            : isLogin
            ? 'Sign In'
            : 'Sign Up'}
        </button>

        <p style={{ marginTop: '1.5rem', fontSize: '0.9rem' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600 }}
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;