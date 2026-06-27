import React, { useState } from 'react';
import { Link, useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import { 
  FaHome, 
  FaBook, 
  FaChartBar, 
  FaUser, 
  FaCog, 
  FaSignOutAlt,
  FaPlus,
  FaBell,
  FaSearch,
  FaMoon,
  FaSun,
  FaBars
} from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';

const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', icon: <MdDashboard size={24} />, label: 'Dashboard' },
    { path: '/courses', icon: <FaBook size={22} />, label: 'Courses' },
    { path: '/create-course', icon: <FaPlus size={22} />, label: 'Create Course', role: 'instructor' },
    { path: '/profile', icon: <FaUser size={22} />, label: 'Profile' },
    { path: '/analytics', icon: <FaChartBar size={22} />, label: 'Analytics', role: 'instructor' },
    { path: '/settings', icon: <FaCog size={22} />, label: 'Settings' },
  ];

  return (
    <div style={{ 
      display: 'flex', 
      minHeight: '100vh', 
      background: isDark ? '#0F172A' : '#F1F5F9',
      transition: 'background 0.3s ease'
    }}>
      {/* ============ SIDEBAR ============ */}
      <div style={{
        width: isCollapsed ? '80px' : '280px',
        background: isDark ? 'rgba(30, 41, 59, 0.95)' : 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        boxShadow: isDark 
          ? '2px 0 30px rgba(0,0,0,0.3)' 
          : '2px 0 30px rgba(0,0,0,0.06)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'fixed',
        top: 0,
        left: 0,
        height: '100vh',
        zIndex: 1000,
        overflow: 'hidden',
        borderRight: isDark 
          ? '1px solid rgba(255,255,255,0.05)' 
          : '1px solid rgba(0,0,0,0.04)'
      }}>
        {/* Sidebar Header */}
        <div style={{
          padding: isCollapsed ? '16px' : '24px 20px',
          borderBottom: isDark 
            ? '1px solid rgba(255,255,255,0.06)' 
            : '1px solid #f0f2f5',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          justifyContent: isCollapsed ? 'center' : 'flex-start'
        }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '22px',
            boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
            flexShrink: 0
          }}>
            📚
          </div>
          {!isCollapsed && (
            <span style={{
              fontSize: '22px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              whiteSpace: 'nowrap'
            }}>
              LearnHub
            </span>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            style={{
              marginLeft: 'auto',
              background: isDark 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(0,0,0,0.04)',
              border: 'none',
              borderRadius: '8px',
              padding: '6px 10px',
              cursor: 'pointer',
              color: isDark ? '#94A3B8' : '#64748B',
              fontSize: '14px',
              transition: 'all 0.3s ease'
            }}
          >
            {isCollapsed ? '→' : '←'}
          </button>
        </div>

        {/* User Info */}
        {!isCollapsed && (
          <div style={{
            padding: '20px',
            borderBottom: isDark 
              ? '1px solid rgba(255,255,255,0.06)' 
              : '1px solid #f0f2f5',
            display: 'flex',
            alignItems: 'center',
            gap: '14px'
          }}>
            <div style={{
              width: '50px',
              height: '50px',
              borderRadius: '16px',
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '22px',
              fontWeight: 700,
              boxShadow: '0 4px 15px rgba(79, 70, 229, 0.3)',
              flexShrink: 0
            }}>
              {user?.name?.charAt(0) || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ 
                fontWeight: 700, 
                fontSize: '15px', 
                color: isDark ? '#F1F5F9' : '#1E293B',
                whiteSpace: 'nowrap'
              }}>
                {user?.name || 'User'}
              </div>
              <div style={{ 
                fontSize: '12px', 
                color: '#94A3B8', 
                textTransform: 'capitalize',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <span style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: '#10B981',
                  display: 'inline-block'
                }} />
                {user?.role || 'Student'}
              </div>
            </div>
          </div>
        )}

        {/* Menu Items */}
        <nav style={{
          flex: 1,
          padding: '16px 12px',
          overflowY: 'auto'
        }}>
          {menuItems.map((item) => {
            if (item.role && user?.role !== item.role) return null;
            const isActive = window.location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  padding: isCollapsed ? '12px' : '14px 18px',
                  margin: '4px 0',
                  borderRadius: '12px',
                  textDecoration: 'none',
                  color: isActive 
                    ? (isDark ? '#818CF8' : '#4F46E5') 
                    : (isDark ? '#94A3B8' : '#64748B'),
                  background: isActive 
                    ? (isDark ? 'rgba(79, 70, 229, 0.15)' : '#EEF2FF')
                    : 'transparent',
                  transition: 'all 0.3s ease',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  fontSize: '15px',
                  fontWeight: isActive ? 600 : 500,
                  position: 'relative'
                }}
              >
                {isActive && !isCollapsed && (
                  <span style={{
                    position: 'absolute',
                    left: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '3px',
                    height: '24px',
                    background: 'linear-gradient(180deg, #4F46E5, #7C3AED)',
                    borderRadius: '0 4px 4px 0'
                  }} />
                )}
                <span style={{ minWidth: '24px' }}>{item.icon}</span>
                {!isCollapsed && <span>{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div style={{
          padding: isCollapsed ? '12px' : '16px 20px',
          borderTop: isDark 
            ? '1px solid rgba(255,255,255,0.06)' 
            : '1px solid #f0f2f5'
        }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              padding: isCollapsed ? '12px' : '12px 18px',
              borderRadius: '12px',
              border: 'none',
              background: isDark 
                ? 'rgba(239, 68, 68, 0.15)' 
                : '#FEF2F2',
              color: '#EF4444',
              width: '100%',
              fontSize: '15px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              justifyContent: isCollapsed ? 'center' : 'flex-start'
            }}
          >
            <FaSignOutAlt size={20} />
            {!isCollapsed && <span>Logout</span>}
          </button>
        </div>
      </div>

      {/* ============ MAIN CONTENT ============ */}
      <div style={{
        marginLeft: isCollapsed ? '80px' : '280px',
        flex: 1,
        padding: '32px 40px',
        transition: 'margin-left 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        minHeight: '100vh',
        background: isDark ? '#0F172A' : '#F1F5F9'
      }}>
        {/* Top Bar - Glassmorphism */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '16px 24px',
          marginBottom: '32px',
          borderRadius: '20px',
          background: isDark 
            ? 'rgba(30, 41, 59, 0.7)' 
            : 'rgba(255, 255, 255, 0.7)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          border: isDark 
            ? '1px solid rgba(255,255,255,0.05)' 
            : '1px solid rgba(255,255,255,0.5)',
          boxShadow: '0 4px 30px rgba(0,0,0,0.04)'
        }}>
          <div>
            <h1 style={{
              fontSize: '28px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #4F46E5, #7C3AED)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              margin: 0,
              letterSpacing: '-0.5px'
            }}>
              LearnHub
            </h1>
            <p style={{ 
              color: isDark ? '#94A3B8' : '#94A3B8', 
              margin: 0, 
              fontSize: '14px',
              fontWeight: 400
            }}>
              Welcome back, {user?.name || 'User'}! 👋
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Search */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: isDark 
                ? 'rgba(255,255,255,0.05)' 
                : 'rgba(255,255,255,0.8)',
              borderRadius: '30px',
              padding: '8px 16px',
              gap: '8px',
              border: isDark 
                ? '1px solid rgba(255,255,255,0.05)' 
                : '1px solid rgba(0,0,0,0.04)'
            }}>
              <FaSearch style={{ color: '#94A3B8', fontSize: '14px' }} />
              <input
                type="text"
                placeholder="Search..."
                style={{
                  border: 'none',
                  outline: 'none',
                  padding: '4px 8px',
                  fontSize: '14px',
                  width: '160px',
                  background: 'transparent',
                  color: isDark ? '#F1F5F9' : '#1E293B'
                }}
              />
            </div>

            {/* Dark/Light Toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              style={{
                background: isDark 
                  ? 'rgba(255,255,255,0.05)' 
                  : 'rgba(0,0,0,0.04)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                color: isDark ? '#FCD34D' : '#1E293B',
                fontSize: '18px',
                transition: 'all 0.3s ease'
              }}
            >
              {isDark ? <FaSun /> : <FaMoon />}
            </button>

            {/* Notifications */}
            <button style={{
              background: 'none',
              border: 'none',
              fontSize: '22px',
              cursor: 'pointer',
              position: 'relative',
              color: isDark ? '#F1F5F9' : '#1E293B'
            }}>
              <FaBell />
              <span style={{
                position: 'absolute',
                top: '-4px',
                right: '-4px',
                background: '#EF4444',
                color: 'white',
                borderRadius: '50%',
                width: '18px',
                height: '18px',
                fontSize: '10px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700
              }}>
                3
              </span>
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;