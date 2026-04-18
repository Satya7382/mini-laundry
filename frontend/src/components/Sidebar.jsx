import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, List, Droplets, LogOut } from 'lucide-react';

const Sidebar = ({ onLogout }) => {
  return (
    <div className="sidebar">
      <div className="logo-area">
        <Droplets className="logo-icon" size={32} />
        <span>Laundry</span>
      </div>
      
      <div className="nav-links mt-8">
        <NavLink to="/" end className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>
        
        <NavLink to="/orders" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <List size={20} />
          <span>All Orders</span>
        </NavLink>
        
        <NavLink to="/create-order" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <PlusCircle size={20} />
          <span>New Order</span>
        </NavLink>
        
        <button onClick={onLogout} className="nav-item text-red-500" style={{ background: 'transparent', border: 'none', cursor: 'pointer', textAlign: 'left', width: '100%', marginTop: '1rem', color: '#ef4444' }}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
