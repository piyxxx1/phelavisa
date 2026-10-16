import { useState, useEffect } from 'react';
import {
  HiHome,
  HiGlobeAmericas,
  HiBriefcase,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiUser,
  HiArrowRightOnRectangle as HiLogout,
  HiTicket,
  HiShoppingBag,
} from 'react-icons/hi2';
import type { UserProfile } from '../pages/LoginPage';

interface HeaderProps {
  currentPage: string;
  user: UserProfile | null;
  onNavigate: (page: string) => void;
  onLogout: () => void;
}

export const Header = ({ currentPage, user, onNavigate, onLogout }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header-outer-wrapper ${isScrolled ? 'scrolled-header' : ''}`}>
      <div className="floating-navbar-island">
        {/* Official Brand Logo */}
        <button 
          onClick={() => onNavigate('home')} 
          className="brand-logo-btn"
          aria-label="Pehla Visa Home"
        >
          <img src="/logo.png" alt="Pehla Visa Logo" className="header-logo-image" />
        </button>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav-menu">
          <button 
            className={`nav-tab-btn ${currentPage === 'home' ? 'active-tab' : ''}`}
            onClick={() => onNavigate('home')}
          >
            <HiHome size={18} />
            <span>Home</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentPage === 'visas' ? 'active-tab' : ''}`}
            onClick={() => onNavigate('visas')}
          >
            <HiGlobeAmericas size={18} />
            <span>Visa Services</span>
            <span className="hot-pill">150+</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentPage === 'dummy-tickets' ? 'active-tab' : ''}`}
            onClick={() => onNavigate('dummy-tickets')}
          >
            <HiTicket size={18} style={{ color: '#2563eb' }} />
            <span>Dummy Tickets</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentPage === 'b2b' ? 'active-tab' : ''}`}
            onClick={() => onNavigate('b2b')}
          >
            <HiBriefcase size={18} />
            <span>B2B Services</span>
          </button>
        </nav>

        {/* Desktop Right Action: Login / User Profile */}
        <div className="navbar-right-actions">
          <div className="desktop-auth-actions">
            {user ? (
              <div
                className="user-profile-nav-box"
                onMouseEnter={() => setUserDropdownOpen(true)}
                onMouseLeave={() => setUserDropdownOpen(false)}
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                style={{ position: 'relative', cursor: 'pointer' }}
              >
                <span className="user-avatar-circle">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-greeting-text">Hi {user.name}</span>

                {userDropdownOpen && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 100,
                      background: '#ffffff',
                      borderRadius: '0.75rem',
                      border: '1px solid #e2e8f0',
                      boxShadow: '0 10px 25px -5px rgba(0,0,0,0.15)',
                      minWidth: '220px',
                      padding: '0.5rem 0',
                      marginTop: '0.5rem',
                      cursor: 'default',
                    }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div style={{ padding: '0.6rem 1rem', borderBottom: '1px solid #f1f5f9' }}>
                      <strong style={{ fontSize: '0.85rem', color: '#0f172a', display: 'block' }}>{user.name}</strong>
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{user.email || user.phone}</span>
                    </div>

                    <button
                      onClick={() => {
                        onNavigate('orders');
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.65rem 1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <HiShoppingBag style={{ color: '#2563eb' }} size={16} />
                      <span>My Orders & History</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setUserDropdownOpen(false);
                      }}
                      style={{
                        width: '100%',
                        textAlign: 'left',
                        padding: '0.65rem 1rem',
                        background: 'none',
                        border: 'none',
                        fontSize: '0.85rem',
                        fontWeight: 700,
                        color: '#334155',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.6rem',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                    >
                      <HiUser style={{ color: '#2563eb' }} size={16} />
                      <span>My Profile Details</span>
                    </button>

                    <div style={{ borderTop: '1px solid #f1f5f9', marginTop: '0.25rem', paddingTop: '0.25rem' }}>
                      <button
                        onClick={() => {
                          onLogout();
                          setUserDropdownOpen(false);
                        }}
                        style={{
                          width: '100%',
                          textAlign: 'left',
                          padding: '0.65rem 1rem',
                          background: 'none',
                          border: 'none',
                          fontSize: '0.85rem',
                          fontWeight: 700,
                          color: '#dc2626',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.6rem',
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fee2e2')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = 'none')}
                      >
                        <HiLogout size={16} />
                        <span>Logout Account</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className={`cta-call-glow-btn ${currentPage === 'login' ? 'active-tab' : ''}`}
                onClick={() => onNavigate('login')}
              >
                <HiArrowRightOnRectangle size={18} />
                <span>Login</span>
              </button>
            )}
          </div>

          {/* Mobile Right Actions Bar: Quick Orders/Profile button & Hamburger Toggle Button */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            {user && (
              <button
                type="button"
                className="mobile-quick-orders-btn"
                onClick={() => onNavigate('orders')}
                title="My Orders & History"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  background: '#eff6ff',
                  border: '1px solid #bfdbfe',
                  color: '#2563eb',
                  padding: '0.4rem 0.65rem',
                  borderRadius: '0.65rem',
                  fontSize: '0.78rem',
                  fontWeight: 800,
                  cursor: 'pointer',
                }}
              >
                <HiShoppingBag size={16} />
                <span>Orders</span>
              </button>
            )}

            <button 
              className="mobile-hamburger-btn"
              aria-label="Toggle Navigation"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <HiBars3 size={24} />
            </button>
          </div>
        </div>
      </div>

      {/* Floating Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-overlay-drawer">
          <div className="mobile-drawer-backdrop" onClick={() => setMobileMenuOpen(false)}></div>
          <div className="mobile-drawer-inner">
            {/* Drawer Header with Compact Close Button */}
            <div className="mobile-drawer-header">
              <div className="drawer-brand-row">
                <img src="/logo.png" alt="Pehla Visa" className="drawer-logo" />
              </div>
              <button
                className="drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close Menu"
              >
                <HiXMark size={20} />
              </button>
            </div>

            {/* Mobile User Profile Header (when logged in) */}
            {user && (
              <div className="mobile-user-card">
                <div className="mobile-user-info">
                  <div className="mobile-user-avatar">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="mobile-user-text">
                    <span className="mobile-user-name">Hi {user.name}</span>
                    <span className="mobile-user-email">{user.email || user.phone}</span>
                  </div>
                </div>
                <button
                  className="mobile-logout-btn"
                  onClick={() => {
                    onLogout();
                    setMobileMenuOpen(false);
                  }}
                >
                  <HiLogout size={14} />
                  <span>Logout</span>
                </button>
              </div>
            )}

            {/* Navigation List */}
            <nav className="mobile-nav-list">
              <button 
                className={`mobile-nav-link ${currentPage === 'home' ? 'active-mobile-link' : ''}`}
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              >
                <HiHome size={20} className="mobile-nav-svg-icon" />
                <span>Home</span>
              </button>

              <button 
                className={`mobile-nav-link ${currentPage === 'visas' ? 'active-mobile-link' : ''}`}
                onClick={() => { onNavigate('visas'); setMobileMenuOpen(false); }}
              >
                <HiGlobeAmericas size={20} className="mobile-nav-svg-icon" />
                <span>Visa Services (150+)</span>
              </button>

              <button 
                className={`mobile-nav-link ${currentPage === 'dummy-tickets' ? 'active-mobile-link' : ''}`}
                onClick={() => { onNavigate('dummy-tickets'); setMobileMenuOpen(false); }}
              >
                <HiTicket size={20} className="mobile-nav-svg-icon" />
                <span>Dummy Tickets & Hotels</span>
              </button>

              <button 
                className={`mobile-nav-link ${currentPage === 'b2b' ? 'active-mobile-link' : ''}`}
                onClick={() => { onNavigate('b2b'); setMobileMenuOpen(false); }}
              >
                <HiBriefcase size={20} className="mobile-nav-svg-icon" />
                <span>B2B Services (Travel Agents)</span>
              </button>

              {/* USER SPECIFIC PROFILE & ORDERS NAVIGATION LINKS IN MOBILE DRAWER */}
              <div style={{ margin: '0.85rem 0', borderTop: '1px solid #e2e8f0', paddingTop: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.725rem', fontWeight: 900, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 0.5rem', display: 'block' }}>
                  My Account & Order Tracking
                </span>

                <button 
                  className={`mobile-nav-link ${currentPage === 'orders' ? 'active-mobile-link' : ''}`}
                  onClick={() => { onNavigate('orders'); setMobileMenuOpen(false); }}
                  style={{ background: currentPage === 'orders' ? '#eff6ff' : '#f8fafc', border: '1px solid #bfdbfe', fontWeight: 800, color: '#1d4ed8' }}
                >
                  <HiShoppingBag size={20} style={{ color: '#2563eb' }} />
                  <span>My Orders & Application History</span>
                </button>

                <button 
                  className={`mobile-nav-link ${currentPage === 'profile' ? 'active-mobile-link' : ''}`}
                  onClick={() => { onNavigate('profile'); setMobileMenuOpen(false); }}
                  style={{ background: currentPage === 'profile' ? '#eff6ff' : '#f8fafc', border: '1px solid #e2e8f0' }}
                >
                  <HiUser size={20} style={{ color: '#475569' }} />
                  <span>My Profile & Account Details</span>
                </button>
              </div>
            </nav>

            {/* Drawer Footer Login CTA (when logged out) */}
            {!user && (
              <div className="mobile-drawer-footer">
                <button 
                  className="mobile-login-cta-btn"
                  onClick={() => { onNavigate('login'); setMobileMenuOpen(false); }}
                >
                  <HiUser size={18} />
                  <span>Login / Register Account</span>
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
