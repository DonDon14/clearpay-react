import React, { useState, useEffect } from 'react';
import { createCategory, editCategory } from '../../api/categories';
import '../../styles/AddContributionModal.css';

// Add 'initialData' prop
const AddContributionModal = ({ isOpen, onClose, onSuccess, initialData }) => {
  const [formData, setFormData] = useState({ name: '', amount: '', description: '' });
  const [error, setError] = useState('');

  // When modal opens or data changes, set the form
  useEffect(() => {
    if (isOpen && initialData) {
      setFormData(initialData); // Edit Mode
    } else {
      setFormData({ name: '', amount: '', description: '' }); // Create Mode (Reset)
    }
    setError('');
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (initialData) {
        // UPDATE
        await editCategory(token, initialData.id, formData);
        alert('Fee Updated Successfully!');
      } else {
        // CREATE
        await createCategory(token, formData);
        alert('Fee Created Successfully!');
      }
      
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Error saving fee');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{initialData ? '✏️ Edit Fee' : '💰 Add New Fee'}</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>
        {error && <p style={{color:'red'}}>{error}</p>}
        <form onSubmit={handleSubmit} className="modal-form">
          <label>Fee Name</label>
          <input className="search-input" name="name" value={formData.name} onChange={handleChange} required />
          <label>Amount</label>
          <input className="search-input" type="number" name="amount" value={formData.amount} onChange={handleChange} required />
          <label>Description</label>
          <textarea className="search-input" name="description" value={formData.description || ''} onChange={handleChange} />
          <div className="modal-actions">
            <button type="button" className="btn-close" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-add">{initialData ? 'Update' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContributionModal;
