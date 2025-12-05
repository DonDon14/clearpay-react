import React from 'react';
import { Outlet } from 'react-router-dom'; // <--- This is the magic "renderSection" replacement
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const DashboardLayout = ({ role, title }) => {
  return (
    <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
      {/* 1. Left Side: Sidebar */}
      <Sidebar role={role} />

      {/* 2. Right Side: Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <Header title={title} />
        
        {/* 3. The Page Content goes here (The "Outlet") */}
        <div style={{ padding: '20px', overflowY: 'auto', background: '#f4f6f9', flex: 1 }}>
          <Outlet /> 
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;