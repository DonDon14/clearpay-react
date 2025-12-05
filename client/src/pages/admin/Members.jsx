import React, { useState, useEffect } from 'react';
import AddMemberModal from '../../components/modals/AddMemberModal.jsx';
import UserCard from '../../components/UserCard.jsx';
import { getMembers } from '../../api/members.js';

const AdminMembers = () => {
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState(null);

  const fetchMembers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const data = await getMembers(token);
      setMembers(data);
      setFilteredMembers(data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch members.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      const filtered = members.filter(member =>
        member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        member.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredMembers(filtered);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, members]);

  if (loading) return <div className="admin-container">Loading members...</div>;
  if (error) return <div className="admin-container">{error}</div>;

  return (
    <div className="admin-container">
      <h1>👥 Member Management</h1>

      {/* TOP BAR */}
      <div className="admin-controls">
        <input 
          className="search-input"
          type="text" 
          placeholder="Search members..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button className="btn-add" onClick={() => setIsAddModalOpen(true)}>
          + Add New Member
        </button>
      </div>

      <div className="member-cards" style={{
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: '16px', 
        marginTop: '20px',
        width: '100%',
      }}>
        {filteredMembers.map(member => (
          <UserCard
            key={member.id}
            name={member.name}
            id={member.id}
            email={member.email}
            role={member.role}
            batch={member.batch}
            profile_picture={member.profile_picture}
          />
        ))}
      </div>

      <AddMemberModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={fetchMembers}
      />  

      <style>{`
        .search-input {
          padding: 10px;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
          width: 400px;
          margin-right: 10px;
        }

        .search-input:focus {
          outline: none;
          border-color: #007bff;
        }
      `}</style>
    </div>
  );
};

export default AdminMembers;
