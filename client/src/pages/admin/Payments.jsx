import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../../styles/Admin.css';
import AddPaymentModal from '../../components/modals/AddPaymentModal';

const AdminPayments = () => {
  // 1. STATE
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending' or 'history'
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 2. FETCH DATA
  const fetchPayments = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/payments/all', {
        headers: { token }
      });
      setPayments(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching payments:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // 3. HANDLE ACTIONS (Approve/Reject)
  const handleStatusUpdate = async (id, newStatus) => {
    if (!window.confirm(`Are you sure you want to ${newStatus} this payment?`)) return;

    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/payments/${id}/status`, 
        { status: newStatus }, 
        { headers: { token } }
      );
      
      // Optimistic Update (Update UI instantly without refetching)
      setPayments(prev => prev.map(p => 
        p.id === id ? { ...p, status: newStatus } : p
      ));
      
    } catch (err) {
      alert('Error updating status');
    }
  };

  // 4. FILTER LOGIC
  const filteredPayments = payments.filter(p => {
    // Tab Filter
    if (activeTab === 'pending' && p.status !== 'pending') return false;
    if (activeTab === 'history' && p.status === 'pending') return false;
    
    // Search Filter
    const searchLower = searchTerm.toLowerCase();
    return (
      p.user_name.toLowerCase().includes(searchLower) ||
      p.reference_code.toLowerCase().includes(searchLower) ||
      p.category_name.toLowerCase().includes(searchLower)
    );
  });

  if (loading) return <div className="admin-container">Loading payments...</div>;

  return (
    <div className="admin-container">
        <h1>💰 Payment Management</h1>

      {/* TOP CONTROLS */}
      <div className="admin-controls">
        {/* TABS */}
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={() => setActiveTab('pending')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              background: activeTab === 'pending' ? '#007bff' : '#eee',
              color: activeTab === 'pending' ? 'white' : '#333',
              fontWeight: 'bold'
            }}
          >
            ⏳ Pending Requests ({payments.filter(p => p.status === 'pending').length})
          </button>
          <button 
            onClick={() => setActiveTab('history')}
            style={{
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
              background: activeTab === 'history' ? '#007bff' : '#eee',
              color: activeTab === 'history' ? 'white' : '#333',
              fontWeight: 'bold'
            }}
          >
            📜 History
          </button>
        </div>

        {/* SEARCH */}
        <input 
          className="search-input"
          type="text" 
          placeholder="Search ref, name, or fee..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button onClick={() => setIsModalOpen(true)} className="btn-add">➕ Record Payment</button>
      </div>

      {/* TABLE */}
      <table className="data-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Member</th>
            <th>Fee Type</th>
            <th>Amount</th>
            <th>Ref Code</th>
            <th>Proof</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredPayments.length === 0 ? (
            <tr><td colSpan="8" style={{textAlign:'center', padding:'20px'}}>No payments found in this tab.</td></tr>
          ) : (
            filteredPayments.map(p => (
              <tr key={p.id}>
                <td>{new Date(p.created_at).toLocaleDateString()}</td>
                <td>
                  <strong>{p.user_name}</strong><br/>
                  <small style={{color:'#888'}}>{p.department}</small>
                </td>
                <td>{p.category_name}</td>
                <td>₱{p.amount}</td>
                <td><code style={{background:'#eee', padding:'2px 5px'}}>{p.reference_code}</code></td>
                <td>
                  <a href={`http://localhost:5000/uploads/${p.proof_file}`} target="_blank" rel="noreferrer" style={{color:'#007bff'}}>
                    View
                  </a>
                </td>
                <td>
                  <span className={`status-badge ${
                    p.status === 'approved' ? 'status-active' : 
                    p.status === 'rejected' ? 'status-inactive' : ''
                  }`} style={{
                    background: p.status === 'pending' ? '#fff3cd' : undefined,
                    color: p.status === 'pending' ? '#856404' : undefined
                  }}>
                    {p.status.toUpperCase()}
                  </span>
                </td>
                <td>
                  {p.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleStatusUpdate(p.id, 'approved')}
                        className="action-btn" 
                        style={{color:'green'}} 
                        title="Approve"
                      >
                        ✅
                      </button>
                      <button 
                        onClick={() => handleStatusUpdate(p.id, 'rejected')}
                        className="action-btn" 
                        style={{color:'red'}} 
                        title="Reject"
                      >
                        ❌
                      </button>
                    </>
                  )}
                  {p.status !== 'pending' && <span style={{color:'#aaa'}}>-</span>}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <AddPaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => fetchPayments()}
      />
    </div>
  );
};

export default AdminPayments;