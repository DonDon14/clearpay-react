import React, { useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const Header = ({ title }) => {
  const [user, setUser] = useState({ name: 'User', role: 'Member' });
  const [currentDate, setCurrentDate] = useState('');
  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    // 1. Get User Data
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUser({
          name: decoded.user.name || 'Admin User',
          role: decoded.user.role || 'Admin'
        });
      } catch (err) { console.error('Token error'); }
    }

    // 2. Set Date
    const dateOptions = { weekday: 'long', month: 'short', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', dateOptions));
  }, []);

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  // Generate consistent user-based color
  function stringToColor(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return `hsl(${hash % 360}, 70%, 50%)`;
  }

  return (
    <div style={styles.header}>
      {/* Left: Title & Date */}
      <div>
        <h2 style={styles.title}>{title}</h2>
        <time style={styles.date}>{currentDate}</time>
      </div>
      
      {/* Right: User Profile */}
      <div 
        style={{
          ...styles.profileContainer,
          ...(isHover ? styles.profileContainerHover : {})
        }}
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
      >
        <div style={{ textAlign: 'right' }}>
          <span style={styles.userName}>{user.name}</span>
          <span style={styles.userRole}>{user.role}</span>
        </div>
        <div style={{
          ...styles.avatar,
          background: stringToColor(user.name)
        }}>
          {initial}
        </div>
      </div>
    </div>
  );
};

// === INLINE STYLES ===
const styles = {
  header: {
    height: '70px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '0 30px',
    borderBottom: '1px solid #e2e8f0',
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    flexShrink: 0,
    minWidth: '600px',
  },
  title: {
    margin: 0,
    fontSize: '18px',
    color: '#1e293b',
    fontWeight: '700',
  },
  date: {
    fontSize: '12px',
    color: '#64748b',
    marginTop: '2px',
    fontWeight: '500',
  },
  profileContainer: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    padding: '5px 10px',
    borderRadius: '50px',
    cursor: 'pointer',
    border: '1px solid transparent',
    transition: '0.2s ease',
  },
  profileContainerHover: {
    background: '#f1f5f9',
    border: '1px solid #cbd5e1'
  },
  userName: {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: '#334155',
    maxWidth: '120px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis'
  },
  userRole: {
    display: 'block',
    fontSize: '11px',
    color: '#94a3b8',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginTop: '2px',
  },
  avatar: {
    height: '40px',
    width: '40px',
    color: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '700',
    fontSize: '16px',
    boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
  }
};

export default Header;
