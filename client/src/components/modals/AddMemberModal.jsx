import React, { useState } from 'react';
import { createMember } from '../../api/members'
import '../../styles/Admin.css';

const AddMemberModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', phone: '', department: '', batch: ''
  });
  const [error, setError] = useState('');

  if (!isOpen) return null; // Don't render if closed

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(token, formData);
      
      // Success!
      alert('Member Added Successfully!');
      setFormData({ name: '', username: '', email: '', phone: '', department: '', batch: '' }); // Reset
      onSuccess(); // Tell parent to refresh table
      onClose();   // Close modal
      
    } catch (err) {
      const msg = err.response?.data?.message || 'Error adding member';
      setError(msg);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>👤 Add New Member</h3>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        {error && <p style={{color:'red', fontSize:'14px', marginBottom:'10px'}}>{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <input className="search-input" style={{width:'90%'}} name="name" placeholder="Full Name" onChange={handleChange} required />
          <input className="search-input" style={{width:'90%'}} name="username" placeholder="Student ID / Username" onChange={handleChange} required />
          <input className="search-input" style={{width:'90%'}} name="email" type="email" placeholder="Email Address" onChange={handleChange} required />
          <input className="search-input" style={{width:'90%'}} name="phone" placeholder="Phone Number" onChange={handleChange} />
          
          <div style={{display:'flex', gap:'10px'}}>
            <select className="search-input" style={{flex:1, cursor:"pointer" }} name="department" onChange={handleChange} required>
                <option value="">Department</option>
                <option value="BSIT">BSIT</option>
                <option value="BSCS">BSCS</option>
                <option value="Educ">Educ</option>
            </select>
            <select className="search-input" style={{flex:1, cursor:"pointer" }} name="batch" onChange={handleChange} required>
                <option value="">Year/Batch</option>
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year</option>
            </select>
          </div>

          <div className="modal-actions">
            <button type="button" onClick={onClose} style={{padding:'10px', background:'#ccc', border:'none', borderRadius:'5px', cursor:'pointer'}}>Cancel</button>
            <button type="submit" className="btn-add">Save Member</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMemberModal;