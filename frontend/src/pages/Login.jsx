import React, { useState } from 'react';
import axios from 'axios';
import { Droplets } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = ({ onLogin }) => {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!password) return toast.error('Enter a password');

    try {
      setLoading(true);
      const { data } = await axios.post('http://localhost:5001/api/login', { password });
      toast.success('Login Successful');
      onLogin(data.token);
    } catch (error) {
      toast.error(error.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center' }}>
      <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <Droplets size={48} className="logo-icon mx-auto mb-4" style={{ margin: '0 auto 1.5rem', display: 'block', color: 'var(--primary)' }} />
        <h2 style={{ marginBottom: '2rem' }}>Laundry System Login</h2>
        
        <div className="form-group" style={{ textAlign: 'left' }}>
          <label>Admin Password</label>
          <input 
            type="password" 
            className="form-control" 
            placeholder="Hint: admin123"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
};

export default Login;
