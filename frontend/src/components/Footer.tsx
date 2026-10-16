import { HiEnvelope, HiMapPin, HiBuildingOffice2 } from 'react-icons/hi2';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import { FaFacebookF, FaInstagram, FaLinkedinIn } from 'react-icons/fa6';

export const Footer = () => {
  const [popularVisas, setPopularVisas] = useState<any[]>([]);

  useEffect(() => {
    async function fetchPopular() {
      try {
        const res = await fetch(`${API_BASE_URL}/visas`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            const popular = data.filter(v => v.popular).slice(0, 8);
            setPopularVisas(popular);
          }
        }
      } catch (e) {
        console.warn('Footer popular visas fetch error:', e);
      }
    }
    fetchPopular();
  }, []);

  return (
    <footer className="main-footer">
      <div className="footer-container">
        <div className="footer-top-grid">
          {/* Brand Column */}
          <div className="footer-brand-col">
            <a href="/" className="footer-logo">
              <img src="/logo.png" alt="Pehla Visa Logo" className="footer-logo-image" />
            </a>
            <div className="footer-address" style={{ marginTop: '1.25rem' }}>
              <a 
                href="mailto:contact@phelavisa.com" 
                className="address-item" 
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#64748b', textDecoration: 'none', fontWeight: 500, fontSize: '1rem' }}
              >
                <HiEnvelope size={20} style={{ color: '#22c55e' }} />
                <span>contact@phelavisa.com</span>
              </a>
            </div>
          </div>

          {/* Column 2: Services */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Services</h4>
            <ul className="footer-list">
              <li><a href="/visas">Tourist Visa</a></li>
              <li><a href="/visas">Business Visa</a></li>
              <li><a href="/dummy-tickets">Dummy Bookings</a></li>
              <li><a href="#insurance">Insurance Bookings</a></li>
              <li><a href="#attestation">Document Attestation Service</a></li>
            </ul>
          </div>

          {/* Column 3: Popular Visas */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Popular Visas</h4>
            <ul className="footer-list">
              {popularVisas.map((visa: any) => (
                <li key={visa.id || visa._id}>
                  <a href={`/visa/${visa.id || visa._id}`}>{visa.country} {visa.title}</a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Legal */}
          <div className="footer-links-col">
            <h4 className="footer-heading">Legal & Policies</h4>
            <ul className="footer-list">
              <li><a href="/privacy">Privacy Policy</a></li>
              <li><a href="/terms">Terms of Service</a></li>
              <li><a href="/refund">Refund Policy</a></li>
              <li><a href="/disclaimer">Government Disclaimer</a></li>
            </ul>
          </div>
        </div>

        {/* Office Locations Section */}
        <div className="footer-offices-section">
          <h4 className="footer-offices-heading">
            <HiBuildingOffice2 size={20} style={{ color: '#60a5fa' }} />
            <span>Our Nationwide Office Locations</span>
          </h4>

          <div className="footer-offices-grid">
            {/* Registered Office */}
            <div className="office-card registered">
              <div className="office-header">
                <HiMapPin className="office-pin-icon red" size={18} />
                <strong className="office-title">Registered Office — New Delhi</strong>
              </div>
              <p className="office-address-text">
                50, 51 Second Floor, Regal Building, Connaught Place, New Delhi – 110001
              </p>
            </div>

            {/* Noida Branch */}
            <div className="office-card">
              <div className="office-header">
                <HiMapPin className="office-pin-icon blue" size={18} />
                <strong className="office-title">Branch Office — Noida</strong>
              </div>
              <p className="office-address-text">
                Ist Floor, B-1A/06, Sector 51, Noida (U.P) <br />
                <span className="landmark-text">Landmark: Above CSB Bank, Sector 51 - 201301</span>
              </p>
            </div>

            {/* Kochi Branch */}
            <div className="office-card">
              <div className="office-header">
                <HiMapPin className="office-pin-icon green" size={18} />
                <strong className="office-title">Branch Office — Kochi</strong>
              </div>
              <p className="office-address-text">
                2nd Floor, Rameesha Building, Opposite Nirmala Shishu Bhavan, SRM Road, Kaloor, Ernakulam North, Kerala – 682018
              </p>
            </div>

            {/* Bengaluru Branch */}
            <div className="office-card">
              <div className="office-header">
                <HiMapPin className="office-pin-icon yellow" size={18} />
                <strong className="office-title">Branch Office — Bengaluru</strong>
              </div>
              <p className="office-address-text">
                759, 3rd Floor, 8th Main Road, JP Nagar Phase 3, Bengaluru, Karnataka – 560078
              </p>
            </div>
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
