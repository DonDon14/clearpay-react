import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdPayment, MdPeople, MdCampaign, MdAnalytics, MdSettings, MdLogout, MdMenu } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import ConfirmationModal from './modals/ConfirmationModal';
import '../styles/Sidebar.css';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const handleLogout = () => {
      localStorage.removeItem('token');
      navigate('/login');
  };

  const navItems = {
    admin: [
      { label: "Dashboard", icon: MdDashboard, path: "/admin/dashboard" },
      { label: "Announcements", icon: MdCampaign, path: "/admin/announcements" },
      { label: "Members", icon: MdPeople, path: "/admin/members" },
      { label: "Payments", icon: FaMoneyBillWave, path: "/admin/payments" },
      { label: "Contributions", icon: MdPayment, path: "/admin/contributions" },
      { label: "Analytics", icon: MdAnalytics, path: "/admin/analytics" },
      { label: "Settings", icon: MdSettings, path: "/admin/settings" },
    ],
    officer: [
      { label: "Dashboard", icon: MdDashboard, path: "/admin/dashboard" },
      { label: "Announcements", icon: MdCampaign, path: "/admin/announcements" },
      { label: "Members", icon: MdPeople, path: "/admin/members" },
    ],
    member: [
      { label: "Home", icon: MdDashboard, path: "/member/dashboard" },
      { label: "History", icon: FaMoneyBillWave, path: "/member/history" },
    ]
  };

  const links = navItems[role] || [];

  const isActive = (path) => location.pathname.startsWith(path);

  return (
    <div className={`sidebar ${collapsed ? 'collapsed' : ''}`}>
      <div className="brand">
        <span className="menu-btn" onClick={() => setCollapsed(!collapsed)}>
          <MdMenu size={22} />
        </span>
        {!collapsed && <span className="brand-name">CLEARPAY</span>}
      </div>

      <nav className="nav">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`nav-link ${isActive(item.path) ? 'active' : ''}`}
            >
              <Icon className="nav-icon" />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="footer">
        <button onClick={() => setShowLogoutModal(true)} className="logout-btn">
          <MdLogout className="nav-icon" />
          {!collapsed && "Logout"}
        </button>
      </div>
      <ConfirmationModal
        isOpen={showLogoutModal}
        title="Logout"
        message="Are you sure you want to logout?"
        onConfirm={handleLogout}
        onCancel={() => setShowLogoutModal(false)}
      />
    </div>
  );
};

export default Sidebar;
