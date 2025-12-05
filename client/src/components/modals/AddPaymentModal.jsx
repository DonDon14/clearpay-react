import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../../styles/Admin.css';

const AddPaymentModal = ({ isOpen, onClose, onSuccess }) => {
  const [members, setMembers] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Form State
  const [formData, setFormData] = useState({ user_id: '', category_id: '', amount: '', reference_code: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Data when Modal Opens
  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem('token');
          const config = { headers: { token } };
          
          // We need both lists to populate the dropdowns
          const usersRes = await axios.get('http://localhost:5000/members', config);
          const catsRes = await axios.get('http://localhost:5000/categories');
          
          setMembers(usersRes.data);
          setCategories(catsRes.data);
        } catch (err) {
          console.error(err);
        }
      };
      fetchData();
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    
    // Auto-fill amount if category changes
    if (e.target.name === 'category_id') {
      const cat = categories.find(c => c.id == e.target.value);
      if (cat) setFormData(prev => ({ ...prev, category_id: e.target.value, amount: cat.amount }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const submitData = new FormData();
      
      submitData.append('user_id', formData.user_id);
      submitData.append('category_id', formData.category_id);
      submitData.append('amount', formData.amount);
      submitData.append('reference_code', formData.reference_code || 'MANUAL-ENTRY');
      if (file) submitData.append('proof', file);

      await axios.post('http://localhost:5000/payments/create', submitData, {
        headers: { token, 'Content-Type': 'multipart/form-data' }
      });

      alert('Payment Recorded!');
      setFormData({ user_id: '', category_id: '', amount: '', reference_code: '' });
      setFile(null);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Error recording payment');
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>💸 Record Manual Payment</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          {/* 1. SELECT MEMBER */}
          <label>Member</label>
          <select className="search-input" style={{width:'100%'}} name="user_id" value={formData.user_id} onChange={handleChange} required>
            <option value="">-- Select Member --</option>
            {members.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.username})</option>
            ))}
          </select>

          {/* 2. SELECT FEE */}
          <label>Payment For</label>
          <select className="search-input" style={{width:'100%'}} name="category_id" value={formData.category_id} onChange={handleChange} required>
            <option value="">-- Select Fee --</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name} - ₱{c.amount}</option>
            ))}
          </select>

          <div style={{display:'flex', gap:'10px'}}>
            <div style={{flex:1}}>
                <label>Amount</label>
                <input className="search-input" style={{width:'100%'}} type="number" name="amount" value={formData.amount} onChange={handleChange} required />
            </div>
            <div style={{flex:1}}>
                <label>Ref Code (Optional)</label>
                <input className="search-input" style={{width:'100%'}} name="reference_code" placeholder="e.g. CASH" value={formData.reference_code} onChange={handleChange} />
            </div>
          </div>

          <label>Proof (Optional)</label>
          <input type="file" onChange={e => setFile(e.target.files[0])} />

          <div className="modal-actions">
            <button type="button" onClick={onClose} style={{padding:'10px', background:'#ccc', border:'none', borderRadius:'5px'}}>Cancel</button>
            <button type="submit" className="btn-add" disabled={loading}>{loading ? 'Saving...' : 'Record Payment'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPaymentModal;