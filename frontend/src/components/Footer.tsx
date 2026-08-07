export const Footer = () => {
  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <a href="/" className="footer-logo">
              <img src="/logo.png" alt="Pehla Visa Logo" className="footer-logo-image" />
            </a>
            <p className="footer-tagline">
              India's most trusted visa agency — 99.2% approval rate, 3-5 day processing. Serving 500,000+ Indian travelers to 150+ countries.
            </p>
            <div className="footer-address">
              <div className="address-item">
                <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
                <span>info@phelavisa.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Services & Links</h4>
            <ul className="footer-list">
              <li><a href="#visas">Visa Services</a></li>
              <li><a href="#tours">International Tour Packages</a></li>
              <li><a href="#apostille">Apostille Services</a></li>
              <li><a href="#attestation">Document Attestation</a></li>
              <li><a href="#faqs">Frequently Asked Questions</a></li>
              <li><a href="#about">About Pehla Visa</a></li>
              <li><a href="#contact">Contact Support</a></li>
            </ul>
          </div>

          {/* Column 3: Popular Visas */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Popular Visas</h4>
            <ul className="footer-list">
              <li><a href="#dubai">Dubai Tourist Visa</a></li>
              <li><a href="#thailand">Thailand eVisa</a></li>
              <li><a href="#singapore">Singapore Tourist Visa</a></li>
              <li><a href="#vietnam">Vietnam E-Visa</a></li>
              <li><a href="#malaysia">Malaysia MDAC</a></li>
              <li><a href="#schengen">Schengen Europe Visa</a></li>
              <li><a href="#us">US B1/B2 Visa</a></li>
              <li><a href="#uk">UK Standard Visitor</a></li>
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Legal & Policies</h4>
            <ul className="footer-list">
              <li><a href="#privacy">Privacy Policy</a></li>
              <li><a href="#terms">Terms of Service</a></li>
              <li><a href="#refund">Refund Policy</a></li>
              <li><a href="#disclaimer">Government Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom Bar */}
        <div className="footer-bottom-bar">
          <p>© {new Date().getFullYear()} Pehla Visa. All rights reserved.</p>
          <div className="social-links">
            <a href="https://facebook.com" aria-label="Facebook" target="_blank" rel="noreferrer">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path></svg>
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2 2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"></path><circle cx="4" cy="4" r="2"></circle></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
