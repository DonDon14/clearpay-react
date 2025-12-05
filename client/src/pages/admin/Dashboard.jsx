import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [payments, setPayments] = useState([]); // <--- NEW: Store all payments
  const [formData, setFormData] = useState({ name: '', amount: '', description: '' });
  const [message, setMessage] = useState('');

  // 1. Fetch EVERYTHING on load
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { token: token } };

      const catsRes = await axios.get('http://localhost:5000/categories');
      const payRes = await axios.get('http://localhost:5000/payments/all', config); // <--- Admin Route

      setCategories(catsRes.data);
      setPayments(payRes.data);
    } catch (err) {
      console.error('Error fetching data');
    }
  };

  // 2. Handle Approve/Reject
  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/payments/${id}/status`, 
        { status: newStatus }, 
        { headers: { token } }
      );
      alert(`Payment ${newStatus}!`);
      fetchData(); // Refresh the list
    } catch (err) {
      alert('Error updating status');
    }
  };

  // ... (Keep handleCreateCategory and handleLogout same as before) ...
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/categories', formData, { headers: { token } });
      setMessage('Category Added!');
      setFormData({ name: '', amount: '', description: '' });
      fetchData();
    } catch (err) { setMessage('Error adding category'); }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'Arial' }}>
      
      {/* HEADER */}
      <div style={{display:'flex', justifyContent:'space-between', marginBottom:'30px'}}>
        <h1>👑 Admin Dashboard</h1>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '40px' }}>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>PENDING</h3>
          <h1 style={{ color: '#f39c12' }}>{payments.filter(p => p.status === 'pending').length}</h1>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>APPROVED</h3>
          <h1 style={{ color: 'green' }}>{payments.filter(p => p.status === 'approved').length}</h1>
        </div>
        <div style={{ padding: '20px', background: 'white', borderRadius: '8px', boxShadow: '0 2px 5px rgba(0,0,0,0.1)' }}>
          <h3>TOTAL COLLECTED</h3>
          <h1 style={{ color: '#007bff' }}>₱{payments.filter(p => p.status === 'approved').reduce((sum, p) => sum + parseFloat(p.amount), 0)}</h1>
        </div>
      </div>

      <hr />

      {/* SECTION 2: MANAGE FEES (Same as before) */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', marginTop:'30px' }}>
        <div>
          <h3>➕ Create New Fee</h3>
          {message && <p>{message}</p>}
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <input type="text" placeholder="Fee Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{padding:'8px'}} />
            <input type="number" placeholder="Amount" value={formData.amount} onChange={e => setFormData({...formData, amount: e.target.value})} required style={{padding:'8px'}} />
            <input type="text" placeholder="Description" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} style={{padding:'8px'}} />
            <button type="submit" style={{padding:'10px', background:'blue', color:'white', border:'none'}}>Add Fee</button>
          </form>
        </div>
        <div>
          <h3>📋 Active Fees</h3>
          {categories.map(cat => (
            <div key={cat.id} style={{ background: '#f9f9f9', padding: '10px', marginBottom: '5px' }}>
              <strong>{cat.name}</strong> - ${cat.amount}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}

export default AdminDashboard;