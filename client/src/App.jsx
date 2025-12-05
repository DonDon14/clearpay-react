import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import AdminDashboard from './pages/admin/Dashboard';
import MemberDashboard from './pages/member/Dashboard';
import SuperAdminDashboard from './pages/superadmin/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';

// Import the new Layout
import DashboardLayout from './layouts/DashboardLayout';
import AdminAnnouncements from './pages/admin/Announcement';
import AdminMembers from './pages/admin/Members';
import AdminPayments from './pages/admin/Payments';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSettings from './pages/admin/Settings';
import AdminContributions from './pages/admin/Contributions';
import TestCard from './pages/playground/TestCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/unauthorized" element={<div><h1>🚫 Access Denied</h1></div>} />
        <Route path="/tests" element={<TestCard />} />


        {/* === ADMIN ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['admin', 'officer']} />}>
          {/* We wrap the inner route with the Layout */}
          <Route element={<DashboardLayout role="admin" title="Admin Portal" />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/announcements" element={<AdminAnnouncements />} />
            <Route path="/admin/members" element={<AdminMembers />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/analytics" element={<AdminAnalytics />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
            <Route path="/admin/contributions" element={<AdminContributions />} />
            {/* Add more admin pages here later, they will automatically get the sidebar! */}
          </Route>
        </Route>

        {/* === MEMBER ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['member', 'student', 'payer']} />}>
          <Route element={<DashboardLayout role="member" title="Member Portal" />}>
            <Route path="/member/dashboard" element={<MemberDashboard />} />
          </Route>
        </Route>

        {/* === SUPERADMIN ROUTES === */}
        <Route element={<ProtectedRoute allowedRoles={['superadmin']} />}>
           {/* You can make a specific layout for superadmin if you want */}
          <Route path="/superadmin/dashboard" element={<SuperAdminDashboard />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;