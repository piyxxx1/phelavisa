import { useState, useEffect } from 'react';
import {
  HiHome,
  HiGlobeAmericas,
  HiDocumentCheck,
  HiQuestionMarkCircle,
  HiArrowRightOnRectangle,
  HiBars3,
  HiXMark,
  HiUser,
  HiArrowRightOnRectangle as HiLogout,
} from 'react-icons/hi2';
import type { UserProfile } from '../pages/LoginPage';

interface HeaderProps {
  currentPage: 'home' | 'visas' | 'login';
  user: UserProfile | null;
  onNavigate: (page: 'home' | 'visas' | 'login') => void;
  onLogout: () => void;
}

export const Header = ({ currentPage, user, onNavigate, onLogout }: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

          <button className="nav-tab-btn" onClick={() => alert('Apostille service details coming soon!')}>
            <HiDocumentCheck size={18} />
            <span>Apostille</span>
          </button>

          <button className="nav-tab-btn" onClick={() => {
            onNavigate('home');
            setTimeout(() => {
              document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>
            <HiQuestionMarkCircle size={18} />
            <span>FAQ</span>
          </button>
        </nav>

        {/* Desktop Right Action: Login / User Profile */}
        <div className="navbar-right-actions">
          <div className="desktop-auth-actions">
            {user ? (
              <div className="user-profile-nav-box">
                <span className="user-avatar-circle">{user.name.charAt(0).toUpperCase()}</span>
                <span className="user-greeting-text">Hi {user.name}</span>
                <button className="logout-link-btn" onClick={onLogout} title="Logout">
                  Logout
                </button>
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

          {/* Mobile Hamburger Toggle Button */}
          <button 
            className="mobile-hamburger-btn"
            aria-label="Toggle Navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <HiBars3 size={24} />
          </button>
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

              <button className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <HiDocumentCheck size={20} className="mobile-nav-svg-icon" />
                <span>Apostille & Attestation</span>
              </button>

              <button 
                className="mobile-nav-link" 
                onClick={() => {
                  onNavigate('home');
                  setMobileMenuOpen(false);
                  setTimeout(() => {
                    document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
                  }, 100);
                }}
              >
                <HiQuestionMarkCircle size={20} className="mobile-nav-svg-icon" />
                <span>Frequently Asked Questions</span>
              </button>
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
