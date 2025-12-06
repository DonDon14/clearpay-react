import React, { useEffect, useState } from 'react';
import { getCategories, deleteCategory } from '../../api/categories'; // Import API
import '../../styles/Admin.css';
import AddContributionModal from '../../components/modals/AddContributionModal';
import { MdEdit, MdDelete } from "react-icons/md";

const AdminContributions = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null); // Data to edit

  // 1. FETCH
  const fetchCategories = async () => {
    try {
      const data = await getCategories(); // Using API file
      setCategories(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching categories');
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // 2. DELETE
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this fee?')) return;
    try {
      const token = localStorage.getItem('token');
      await deleteCategory(token, id); // Using API file
      fetchCategories();
    } catch (err) {
      alert('Delete Failed');
    }
  };

  // 3. OPEN MODAL FOR EDIT
  const handleEdit = (cat) => {
    setSelectedCategory(cat); // Pass this data to modal
    setIsModalOpen(true);     // Open it!
  };

  // 4. OPEN MODAL FOR CREATE
  const handleCreate = () => {
    setSelectedCategory(null); // Clear data for new entry
    setIsModalOpen(true);
  };

  return (
    <div className="admin-container">
      <h1>💰 Contributions & Fees</h1>

      <div className="admin-controls">
        <p>Manage the list of fees members can pay for.</p>
        <button onClick={handleCreate} className="btn-add">
          ➕ Add New Contribution
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
                <button onClick={() => handleEdit(cat)} className="action-btn btn-edit">
                  <MdEdit size={18} />
                </button>
                <button onClick={() => handleDelete(cat.id)} className="action-btn btn-delete">
                  <MdDelete size={18} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* MODAL */}
      <AddContributionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchCategories}
        initialData={selectedCategory} // <--- Pass the data here!
      />
    </div>
  );
};

export default AdminContributions;