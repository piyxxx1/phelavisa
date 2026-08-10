import { HiEnvelope } from 'react-icons/hi2';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

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
                <HiEnvelope size={18} style={{ color: '#22c55e' }} />
                <span>info@phelavisa.com</span>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Services & Links</h4>
            <ul className="footer-list">
              <li><a href="#visas">Visa Services</a></li>
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
              <FaFacebookF size={18} />
            </a>
            <a href="https://instagram.com" aria-label="Instagram" target="_blank" rel="noreferrer">
              <FaInstagram size={18} />
            </a>
            <a href="https://linkedin.com" aria-label="LinkedIn" target="_blank" rel="noreferrer">
              <FaLinkedinIn size={18} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
