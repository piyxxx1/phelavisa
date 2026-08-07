import { useState, useEffect } from 'react';

interface HeaderProps {
  currentPage: 'home' | 'visas';
  onNavigate: (page: 'home' | 'visas') => void;
}

export const Header = ({ currentPage, onNavigate }: HeaderProps) => {
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
            <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 001 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            <span>Home</span>
          </button>

          <button 
            className={`nav-tab-btn ${currentPage === 'visas' ? 'active-tab' : ''}`}
            onClick={() => onNavigate('visas')}
          >
            <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7a2 2 0 00-2-2h-2c-.5 0-1-.5-1-1V2.5M12 21a9 9 0 100-18 9 9 0 000 18z"></path>
            </svg>
            <span>Visa Services</span>
            <span className="hot-pill">150+</span>
          </button>

          <button className="nav-tab-btn" onClick={() => alert('Tour packages page coming soon!')}>
            <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <span>Tour Packages</span>
          </button>

          <button className="nav-tab-btn" onClick={() => alert('Apostille service details coming soon!')}>
            <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>Apostille</span>
          </button>

          <button className="nav-tab-btn" onClick={() => {
            onNavigate('home');
            setTimeout(() => {
              document.getElementById('faqs')?.scrollIntoView({ behavior: 'smooth' });
            }, 100);
          }}>
            <svg width="17" height="17" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span>FAQ</span>
          </button>
        </nav>

        {/* Right Action: Apply Now Button */}
        <div className="navbar-right-actions">
          <button 
            className="cta-call-glow-btn"
            onClick={() => onNavigate('visas')}
          >
            <span>Apply For Visa</span>
            <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </button>

          {/* Mobile Hamburger Toggle */}
          <button 
            className="mobile-hamburger-btn"
            aria-label="Toggle Navigation"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Floating Mobile Drawer (Clean SVG Icons, No Emojis) */}
      {mobileMenuOpen && (
        <div className="mobile-overlay-drawer">
          <div className="mobile-drawer-inner">
            <nav className="mobile-nav-list">
              <button 
                className={`mobile-nav-link ${currentPage === 'home' ? 'active-mobile-link' : ''}`}
                onClick={() => { onNavigate('home'); setMobileMenuOpen(false); }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mobile-nav-svg-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 001 1v4a1 1 0 001 1m-6 0h6"></path>
                </svg>
                <span>Home</span>
              </button>

              <button 
                className={`mobile-nav-link ${currentPage === 'visas' ? 'active-mobile-link' : ''}`}
                onClick={() => { onNavigate('visas'); setMobileMenuOpen(false); }}
              >
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mobile-nav-svg-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h1.5a2.5 2.5 0 002.5-2.5V7a2 2 0 00-2-2h-2c-.5 0-1-.5-1-1V2.5M12 21a9 9 0 100-18 9 9 0 000 18z"></path>
                </svg>
                <span>Visa Services (150+ Countries)</span>
              </button>

              <button className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mobile-nav-svg-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
                </svg>
                <span>Tour Packages</span>
              </button>

              <button className="mobile-nav-link" onClick={() => setMobileMenuOpen(false)}>
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mobile-nav-svg-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
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
                <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" className="mobile-nav-svg-icon">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <span>Frequently Asked Questions</span>
              </button>
            </nav>

            <div className="mobile-drawer-footer">
              <button 
                className="mobile-call-cta"
                onClick={() => { onNavigate('visas'); setMobileMenuOpen(false); }}
              >
                <span>Apply For Visa Online</span>
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
