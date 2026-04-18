import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Package, IndianRupee, Clock, CheckCircle, Truck, Inbox } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const { data } = await axios.get('/orders/dashboard');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="animate-fade-in"><p>Loading dashboard...</p></div>;

  return (
    <div className="animate-fade-in">
      <h1>Dashboard Overview</h1>
      
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <span className="stat-label">Total Revenue</span>
          <span className="stat-value text-primary">₹{stats?.totalRevenue || 0}</span>
          <IndianRupee className="stat-icon" />
        </div>
        
        <div className="glass-panel stat-card">
          <span className="stat-label">Total Orders</span>
          <span className="stat-value">{stats?.totalOrders || 0}</span>
          <Package className="stat-icon" />
        </div>
      </div>

      <h2>Orders by Status</h2>
      <div className="dashboard-grid">
        <div className="glass-panel stat-card">
          <span className="stat-label text-blue-400">Received</span>
          <span className="stat-value">{stats?.statusCounts?.RECEIVED || 0}</span>
          <Inbox className="stat-icon" />
        </div>
        
        <div className="glass-panel stat-card">
          <span className="stat-label text-yellow-400">Processing</span>
          <span className="stat-value">{stats?.statusCounts?.PROCESSING || 0}</span>
          <Clock className="stat-icon" />
        </div>
        
        <div className="glass-panel stat-card">
          <span className="stat-label text-green-400">Ready</span>
          <span className="stat-value">{stats?.statusCounts?.READY || 0}</span>
          <CheckCircle className="stat-icon" />
        </div>
        <div className="glass-panel stat-card">
          <span className="stat-label text-purple-400">Delivered</span>
          <span className="stat-value">{stats?.statusCounts?.DELIVERED || 0}</span>
          <Truck className="stat-icon" />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
