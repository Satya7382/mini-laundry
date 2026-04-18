import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersList = () => {
  const [orders, setOrders] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('http://localhost:5001/api/orders', {
        params: { search, status: statusFilter }
      });
      setOrders(data.data ? data.data : Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error('Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5001/api/orders/${id}/status`, { status: newStatus });
      toast.success('Status updated successfully');
      fetchOrders();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'RECEIVED': return 'status-received';
      case 'PROCESSING': return 'status-processing';
      case 'READY': return 'status-ready';
      case 'DELIVERED': return 'status-delivered';
      default: return '';
    }
  };

  return (
    <div className="animate-fade-in">
      <div className="flex-between mb-6">
        <h1>All Orders</h1>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="search-bar">
          <div className="form-group" style={{ flex: 2, marginBottom: 0 }}>
            <div style={{ position: 'relative' }}>
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search by Customer Name, Phone, or Order ID..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            </div>
          </div>
          
          <div className="form-group" style={{ flex: 1, marginBottom: 0 }}>
            <div style={{ position: 'relative' }}>
              <select 
                className="form-control"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              >
                <option value="">All Statuses</option>
                <option value="RECEIVED">Received</option>
                <option value="PROCESSING">Processing</option>
                <option value="READY">Ready</option>
                <option value="DELIVERED">Delivered</option>
              </select>
              <Filter style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
            </div>
          </div>
        </div>

        <div className="table-container">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Amount</th>
                  <th>Delivery</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No orders found</td>
                  </tr>
                ) : (
                  orders.map(order => (
                    <tr key={order._id}>
                      <td style={{ fontWeight: 600 }}>{order.orderId}</td>
                      <td>
                        <div>{order.customerName}</div>
                        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{order.phoneNumber}</div>
                      </td>
                      <td>
                        {order.items.reduce((acc, item) => acc + item.quantity, 0)} items
                      </td>
                      <td style={{ fontWeight: 600, color: 'var(--primary)' }}>
                        ₹{order.totalAmount}
                      </td>
                      <td>
                        {order.estimatedDeliveryDate ? new Date(order.estimatedDeliveryDate).toLocaleDateString() : '-'}
                      </td>
                      <td>
                        <span className={`status-badge ${getStatusBadgeClass(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td>
                         <select 
                           className="form-control"
                           style={{ padding: '0.5rem', fontSize: '0.85rem' }}
                           value={order.status}
                           onChange={(e) => updateStatus(order._id, e.target.value)}
                         >
                           <option value="RECEIVED">Received</option>
                           <option value="PROCESSING">Processing</option>
                           <option value="READY">Ready</option>
                           <option value="DELIVERED">Delivered</option>
                         </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersList;
