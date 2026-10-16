import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  HiChartBar,
  HiGlobeAlt,
  HiPlusCircle,
  HiDocumentText,
  HiBuildingOffice2,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiShieldCheck,
  HiStar,
  HiTicket,
  HiArrowPath,
} from 'react-icons/hi2';

export const AdminLayout = ({ children }) => {
  const { logoutAdmin } = useAdmin();
  const navigate = useNavigate();
  const [isMobileDrawerOpen, setIsMobileDrawerOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard Overview', icon: HiChartBar },
    { path: '/visas', label: 'Visa Listings Manager', icon: HiGlobeAlt },
    { path: '/newvisa', label: 'Create New Visa Listing', icon: HiPlusCircle },
    { path: '/applications', label: 'User Applications & Orders', icon: HiDocumentText },
    { path: '/dummy-tickets', label: 'Dummy Tickets Manager', icon: HiTicket },
    { path: '/b2b', label: 'B2B Partner Portal', icon: HiBuildingOffice2 },
    { path: '/reviews', label: 'Review Management', icon: HiStar },
  ];

  const handleLogout = () => {
    logoutAdmin();
    navigate('/login');
  };

  const handleRefreshData = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <div className="admin-layout-root">
      {/* Top Navbar Header */}
      <header className="admin-header-nav">
        <div className="admin-header-left">
          <button
            className="admin-hamburger-btn"
            onClick={() => setIsMobileDrawerOpen(!isMobileDrawerOpen)}
          >
            {isMobileDrawerOpen ? <HiXMark size={24} /> : <HiBars3 size={24} />}
          </button>

          <div className="admin-brand-logo-container" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Pehla Visa Logo" className="header-logo-img" />
            <span className="header-admin-badge">CRM ADMIN</span>
          </div>
        </div>

        <div className="admin-header-right" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Enhanced Refresh Sync Button */}
          <button
            onClick={handleRefreshData}
            title="Refresh Live Database Data"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '0.5rem',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              color: '#334155',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#f8fafc';
              e.currentTarget.style.borderColor = '#94a3b8';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#ffffff';
              e.currentTarget.style.borderColor = '#cbd5e1';
            }}
          >
            <HiArrowPath
              size={16}
              style={{
                color: '#2563eb',
                transition: 'transform 0.5s ease',
                transform: isRefreshing ? 'rotate(360deg)' : 'none',
              }}
            />
            <span>Refresh</span>
          </button>

          {/* Enhanced Logout Button */}
          <button
            onClick={handleLogout}
            title="Logout Admin Session"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              padding: '0.45rem 0.9rem',
              borderRadius: '0.5rem',
              border: '1px solid #fecaca',
              background: '#fef2f2',
              color: '#dc2626',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#fee2e2';
              e.currentTarget.style.borderColor = '#fca5a5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = '#fef2f2';
              e.currentTarget.style.borderColor = '#fecaca';
            }}
          >
            <HiArrowRightOnRectangle size={18} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Container */}
      <div className="admin-body-container">
        {/* Fixed Left Sidebar */}
        <aside className={`admin-sidebar ${isMobileDrawerOpen ? 'open' : ''}`}>
          <div className="admin-sidebar-top">
            <div className="sidebar-section-title">ADMIN NAVIGATION</div>
            <nav className="admin-nav-list">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    end={item.path === '/'}
                    className={({ isActive }) => `admin-nav-item ${isActive ? 'active' : ''}`}
                    onClick={() => setIsMobileDrawerOpen(false)}
                  >
                    <Icon size={20} className="nav-icon" />
                    <span>{item.label}</span>
                  </NavLink>
                );
              })}
            </nav>
          </div>

          <div className="sidebar-footer-box">
            <HiShieldCheck size={20} className="shield-icon" />
            <div>
              <strong>PehlaVisa CRM V.1</strong>
              <span>Enterprise Control Panel</span>
            </div>
          </div>
        </aside>

        {/* Drawer Overlay for Mobile */}
        {isMobileDrawerOpen && (
          <div
            className="admin-drawer-backdrop"
            onClick={() => setIsMobileDrawerOpen(false)}
          ></div>
        )}

        {/* Main Viewport Content */}
        <main className="admin-main-viewport">{children}</main>
      </div>
    </div>
  );
};
