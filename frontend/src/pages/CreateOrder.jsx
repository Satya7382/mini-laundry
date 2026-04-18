import React, { useState } from 'react';
import axios from 'axios';
import { Plus, Trash2, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const DEFAULT_PRICES = {
  Shirt: 50,
  Pants: 60,
  Saree: 150,
  Jacket: 200,
  Blanket: 250,
  Other: 0
};

const CreateOrder = () => {
  const navigate = useNavigate();
  const [customerName, setCustomerName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [items, setItems] = useState([{ garment: 'Shirt', quantity: 1, price: DEFAULT_PRICES['Shirt'] }]);
  const [estimatedDeliveryDate, setEstimatedDeliveryDate] = useState('');
  const [loading, setLoading] = useState(false);

  const addItem = () => {
    setItems([...items, { garment: 'Shirt', quantity: 1, price: DEFAULT_PRICES['Shirt'] }]);
  };

  const removeItem = (index) => {
    if (items.length > 1) {
      const newItems = [...items];
      newItems.splice(index, 1);
      setItems(newItems);
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    
    if (field === 'garment' && DEFAULT_PRICES[value] !== undefined) {
      newItems[index].price = DEFAULT_PRICES[value];
    }
    setItems(newItems);
  };

  const totalBill = items.reduce((total, item) => total + (item.quantity * item.price), 0);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!customerName || !phoneNumber) {
      return toast.error("Customer Name and Phone Number are required.");
    }
    
    try {
      setLoading(true);
      await axios.post('http://localhost:5001/api/orders', {
        customerName,
        phoneNumber,
        items,
        estimatedDeliveryDate
      });
      toast.success('Order created successfully!');
      navigate('/orders');
    } catch (error) {
      toast.error('Failed to create order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="animate-fade-in">
      <h1>New Order</h1>

      <form onSubmit={handleSubmit} className="glass-panel" style={{ padding: '2rem' }}>
        <h2>Customer Details</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="form-group">
            <label>Customer Name</label>
            <input 
              type="text" 
              className="form-control" 
              placeholder="e.g. John Doe"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input 
              type="tel" 
              className="form-control" 
              placeholder="e.g. +91 9876543210"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="form-group" style={{ marginBottom: '2rem' }}>
          <label>Estimated Delivery Date</label>
          <input 
            type="date" 
            className="form-control" 
            value={estimatedDeliveryDate}
            onChange={(e) => setEstimatedDeliveryDate(e.target.value)}
          />
        </div>

        <div className="flex-between" style={{ marginBottom: '1rem' }}>
          <h2>Garments</h2>
          <button type="button" className="btn btn-outline" onClick={addItem} style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
            <Plus size={16} /> Add Item
          </button>
        </div>

        {items.map((item, index) => (
          <div className="item-row" key={index}>
            <div className="form-group">
              <label>Garment Type</label>
              <select 
                className="form-control"
                value={item.garment}
                onChange={(e) => handleItemChange(index, 'garment', e.target.value)}
              >
                <option value="Shirt">Shirt</option>
                <option value="Pants">Pants</option>
                <option value="Saree">Saree</option>
                <option value="Jacket">Jacket</option>
                <option value="Blanket">Blanket</option>
                <option value="Other">Other</option>
              </select>
            </div>
            
            <div className="form-group">
              <label>Quantity</label>
              <input 
                type="number" 
                min="1"
                className="form-control" 
                value={item.quantity}
                onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
              />
            </div>

            <div className="form-group">
              <label>Price per Item (₹)</label>
              <input 
                type="number" 
                min="0"
                className="form-control" 
                value={item.price}
                onChange={(e) => handleItemChange(index, 'price', Number(e.target.value))}
              />
            </div>

            <div className="form-group" style={{ flex: '0 0 auto', paddingBottom: '0.2rem' }}>
              <button 
                type="button" 
                className="btn btn-danger" 
                onClick={() => removeItem(index)}
                disabled={items.length === 1}
              >
                <Trash2 size={20} />
              </button>
            </div>
          </div>
        ))}

        <div className="bill-summary">
          <div className="bill-total-label">Total Amount:</div>
          <div className="bill-total-price">₹{totalBill}</div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '2rem' }}>
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ padding: '1rem 2.5rem', fontSize: '1.1rem' }}>
            {loading ? 'Creating...' : <><CheckCircle size={20} /> Create Order</>}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateOrder;
