import React, { useState } from 'react';
import axios from 'axios';
import '../../styles/Admin.css'; // Reuse existing styles

const AddContributionModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', amount: '', description: '' });
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/categories', formData, {
        headers: { token }
      });
      
      alert('Fee Category Added!');
      setFormData({ name: '', amount: '', description: '' }); // Reset form
      onSuccess(); // Refresh the list on parent page
      onClose();   // Close modal
    } catch (err) {
      setError('Error adding fee category');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>💰 Add New Contribution</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <p style={{color:'red'}}>{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <label>Fee Name</label>
          <input 
            className="search-input" style={{width:'95%'}} 
            name="name" 
            placeholder="e.g. Christmas Party" 
            onChange={handleChange} 
            required 
          />

          <label>Amount</label>
          <input 
            className="search-input" style={{width:'95%'}} 
            type="number" 
            name="amount" 
            placeholder="0.00" 
            onChange={handleChange} 
            required 
          />

          <label>Description</label>
          <textarea 
            className="search-input" style={{width:'95%', height:'80px', fontFamily:'Arial'}} 
            name="description" 
            placeholder="Optional details..." 
            onChange={handleChange} 
          />

          <div className="modal-actions">
            <button type="button" onClick={onClose} style={{padding:'10px', background:'#ccc', border:'none', borderRadius:'5px', cursor:'pointer'}}>Cancel</button>
            <button type="submit" className="btn-add">Save Fee</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal;