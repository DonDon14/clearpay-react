import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdDashboard, MdPayment, MdPeople, MdCampaign, MdAnalytics, MdSettings, MdLogout, MdMenu } from "react-icons/md";
import { FaMoneyBillWave } from "react-icons/fa";
import ConfirmationModal from './modals/ConfirmationModal';

const Sidebar = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);


  const handleLogout = () => {
    if(window.confirm('Are you sure you want to logout?')) {
      localStorage.removeItem('token');
      navigate('/login');
    }
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

  const isActive = (path) => location.pathname === path;

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


      <style>{`
        .sidebar {
          width: 240px;
          height: 100vh;
          background: #fff;
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          transition: width 0.3s ease;
          overflow: hidden;
          font-family: 'Inter', sans-serif;
        }
        .sidebar.collapsed {
          width: 72px;
        }

        .brand {
          height: 60px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 16px;
          font-weight: 700;
          font-size: 18px;
          color: #111827;
          border-bottom: 1px solid #f3f4f6;
        }
        .menu-btn {
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 32px;
          height: 32px;
          color: #6b7280;
        }
        .nav {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 12px;
          overflow-y: auto;
        }
        .nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          border-radius: 8px;
          text-decoration: none;
          color: #6b7280;
          font-weight: 500;
          transition: all 0.2s;
        }
        .nav-link:hover {
          background-color: #f3f4f6;
          color: #111827;
        }
        .nav-link.active {
          background-color: #e2e8f0;
          color: #111827;
          font-weight: 600;
        }
        .nav-icon {
          font-size: 20px;
        }
        .footer {
          padding: 16px;
          border-top: 1px solid #f3f4f6;
        }
        .logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px;
          font-size: 14px;
          border: none;
          background: transparent;
          cursor: pointer;
          color: #6b7280;
          border-radius: 8px;
          transition: background 0.2s;
        }
        .logout-btn:hover {
          background: #f07777;
          color: #111827;
        }
      `}</style>
    </div>
  );
};

export default Sidebar;
