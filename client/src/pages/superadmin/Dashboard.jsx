import React from 'react';
import { useNavigate } from 'react-router-dom';

function SuperAdminDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#fff0f0' }}>
      <h1>⚡️ SuperAdmin Portal</h1>
      <p>You have full control.</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
export default SuperAdminDashboard;