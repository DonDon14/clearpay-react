import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Admin.css';
import AddContributionModal from '../../components/modals/AddContributionModal';

const AdminContributions = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // State for Form (We can keep it simple here or use a Modal later)
  const [formData, setFormData] = useState({ name: '', amount: '', description: '' });
  const [isEditing, setIsEditing] = useState(null); // ID of item being edited

  // 1. FETCH
  const fetchCategories = async () => {
    try {
      const res = await axios.get('http://localhost:5000/categories');
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. SUBMIT (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const config = { headers: { token } };

      if (isEditing) {
        // UPDATE Logic
        await axios.put(`http://localhost:5000/categories/${isEditing}`, formData, config);
        alert('Fee Updated!');
      } else {
        // CREATE Logic
        await axios.post('http://localhost:5000/categories', formData, config);
        alert('Fee Created!');
      }

      setFormData({ name: '', amount: '', description: '' });
      setIsEditing(null);
      fetchCategories();

    } catch (err) {
      alert('Error saving fee');
    }
  };

  // 3. DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure?')) return;
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:5000/categories/${id}`, { headers: { token } });
      fetchCategories();
    } catch (err) {
      alert(err.response?.data?.message || 'Delete Failed');
    }
  };

  // 4. LOAD EDIT DATA
  const handleEdit = (cat) => {
    setFormData({ name: cat.name, amount: cat.amount, description: cat.description });
    setIsEditing(cat.id);
  };

  return (
    <div className="admin-container">
      <h1>💰 Contributions & Fees</h1>

      <div className="admin-controls">
        <p>Manage the list of fees members can fee for.</p>
        <button onClick={() => setIsModalOpen(true)} className="btn-add">➕ Add New Contribution
        </button>
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Fee Name</th>
            <th>Amount</th>
            <th>Description</th>
            <th>Created</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td><strong>{cat.name}</strong></td>
              <td style={{color:'green', fontWeight:'bold'}}>₱{cat.amount}</td>
              <td>{cat.description || '-'}</td>
              <td>{new Date(cat.created_at).toLocaleDateString()}</td>
              <td>
                <button onClick={() => handleEdit(cat)} className="action-btn btn-edit">✏️</button>
                <button onClick={() => handleDelete(cat.id)} className="action-btn btn-delete">🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
          <AddContributionModal
            isOpen={isModalOpen}
            onClose={() => { setIsModalOpen(false); setIsEditing(null); setFormData({ name: '', amount: '', description: '' }); }}
            onSuccess={() => { fetchCategories(); }}
          />
    </div>
  );
};

export default AdminContributions;