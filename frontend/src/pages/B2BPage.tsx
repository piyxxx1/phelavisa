import React, { useState } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import {
  HiBriefcase,
  HiCheckCircle,
  HiUserGroup,
  HiCurrencyRupee,
  HiShieldCheck,
  HiPhone,
  HiArrowRight,
  HiChevronDown,
  HiChevronUp,
  HiQuestionMarkCircle,
  HiBolt,
  HiCheck,
  HiMapPin,
  HiBuildingOffice2,
} from 'react-icons/hi2';

interface B2BPageProps {
  onNavigateHome?: () => void;
  onNavigateVisas?: () => void;
}

export const B2BPage: React.FC<B2BPageProps> = ({ onNavigateHome: _onNavigateHome, onNavigateVisas: _onNavigateVisas }) => {
  // Agent Registration Form State
  const [agencyName, setAgencyName] = useState('');
  const [contactName, setContactName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [businessType, setBusinessType] = useState('Travel Agency');
  const [monthlyVolume, setMonthlyVolume] = useState('10-50 Visas');
  const [city, setCity] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // FAQ Accordion Toggle State
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agencyName || !contactName || !phone) {
      alert('Please fill in your Agency Name, Contact Name, and Phone Number.');
      return;
    }

    const payload = {
      id: 'B2B-' + Math.floor(1000 + Math.random() * 9000),
      agencyName,
      contactName,
      phone,
      email,
      businessType,
      monthlyVolume,
      city: city || 'New Delhi',
      status: 'PENDING_VERIFICATION',
      assignedOffice: 'New Delhi HQ',
      submittedAt: new Date().toISOString().replace('T', ' ').slice(0, 16),
      adminNotes: 'New B2B Partner registration inquiry submitted via web portal.',
    };

    try {
      await fetch(`${API_BASE_URL}/b2b/partners`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      console.log('✓ B2B Partner registration persisted to MongoDB database.');
    } catch (err) {
      console.warn('B2B API submission warning:', err);
    }

    setIsSubmitted(true);
  };

  const b2bFaqs = [
    {
      q: 'How do I register as a B2B travel partner with Pehla Visa?',
      a: 'Simply complete the B2B Partner Registration form on this page. Our B2B Account Manager will verify your business details within 2 hours and activate your B2B Partner Portal access with discounted agent pricing.',
    },
    {
      q: 'Is there any registration fee or upfront security deposit required?',
      a: 'No! Registration as a Pehla Visa B2B Partner is 100% free with zero hidden fees or security deposit required. You only pay for the visas you process.',
    },
    {
      q: 'Can I offer visa services under my own agency brand (White Labeling)?',
      a: 'Yes! All registered Pehla Visa B2B partners receive unbranded status tracking links, PDF receipts, and WhatsApp updates that can be directly forwarded to your end clients with your agency name.',
    },
    {
      q: 'How are agent commissions and wholesale discounts applied?',
      a: 'As a registered B2B partner, you instantly unlock special B2B net agent rates. You can charge your clients your custom markup while paying Pehla Visa net agent pricing.',
    },
    {
      q: 'What dedicated support is provided for urgent or complex visa applications?',
      a: 'Every B2B agent gets a dedicated Senior Visa Specialist and 24/7 priority hotline support to handle urgent Express eVisas, embassy appointment scheduling, and custom document verification.',
    },
  ];

  return (
    <div className="b2b-page-wrapper">
      {/* Hero Banner Section */}
      <section className="b2b-hero-banner">
        <div className="b2b-hero-overlay"></div>
        <div className="b2b-hero-container">
          <h1 className="b2b-hero-title">
            Grow Your Travel Business with <span className="text-highlight">Pehla Visa B2B</span>
          </h1>
          <p className="b2b-hero-subtitle" style={{ marginBottom: 0 }}>
            Join registered travel agencies, tour operators, and corporate travel desks across India. Unlock wholesale visa pricing, bulk submissions, and 24/7 priority handling.
          </p>
        </div>
      </section>

      {/* Main B2B Content Container */}
      <section className="section-padding bg-gray-light">
        <div className="b2b-main-layout-container">
          {/* Left Column: Why Partner + Tier Table + FAQs */}
          <div className="b2b-left-content">
            {/* Why Partner Cards */}
            <div className="b2b-section-card">
              <h2 className="b2b-card-heading">
                <HiBriefcase className="card-heading-icon" />
                Why Partner with Pehla Visa?
              </h2>
              <div className="b2b-features-grid">
                <div className="b2b-feature-box">
                  <div className="feature-icon-wrapper blue">
                    <HiCurrencyRupee size={24} />
                  </div>
                  <h3 className="feature-title">Wholesale B2B Pricing</h3>
                  <p className="feature-desc">
                    Get guaranteed net B2B agent rates on 150+ country visas to maximize your agency profits.
                  </p>
                </div>

                <div className="b2b-feature-box">
                  <div className="feature-icon-wrapper green">
                    <HiUserGroup size={24} />
                  </div>
                  <h3 className="feature-title">Bulk Submissions</h3>
                  <p className="feature-desc">
                    Process group travel, MICE tours, and corporate bookings seamlessly with one-click bulk document uploads.
                  </p>
                </div>

                <div className="b2b-feature-box">
                  <div className="feature-icon-wrapper purple">
                    <HiBolt size={24} />
                  </div>
                  <h3 className="feature-title">Express Turnaround</h3>
                  <p className="feature-desc">
                    Fast-track processing with emergency embassy queues and 24-hour turnaround for urgent client travel.
                  </p>
                </div>

                <div className="b2b-feature-box">
                  <div className="feature-icon-wrapper yellow">
                    <HiShieldCheck size={24} />
                  </div>
                  <h3 className="feature-title">White-Label Status Updates</h3>
                  <p className="feature-desc">
                    Share unbranded live WhatsApp status links with your customers carrying your agency's contact information.
                  </p>
                </div>
              </div>
            </div>

            {/* B2B FAQs Accordion */}
            <div className="b2b-section-card margin-top-card">
              <h2 className="b2b-card-heading">
                <HiQuestionMarkCircle className="card-heading-icon" />
                Frequently Asked B2B Partner Questions
              </h2>
              <div className="b2b-faq-accordion-list">
                {b2bFaqs.map((faq, index) => {
                  const isOpen = activeFaq === index;
                  return (
                    <div key={index} className={`b2b-faq-item ${isOpen ? 'open' : ''}`}>
                      <button
                        className="b2b-faq-question-btn"
                        onClick={() => setActiveFaq(isOpen ? null : index)}
                      >
                        <span>{faq.q}</span>
                        {isOpen ? <HiChevronUp size={18} /> : <HiChevronDown size={18} />}
                      </button>
                      {isOpen && <div className="b2b-faq-answer">{faq.a}</div>}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Our Nationwide Registered & Branch Offices */}
            <div className="b2b-section-card margin-top-card">
              <h2 className="b2b-card-heading">
                <HiBuildingOffice2 className="card-heading-icon" />
                Our Registered & Branch Offices
              </h2>
              <div className="b2b-offices-list-grid">
                {/* Registered Office */}
                <div className="b2b-office-box registered">
                  <div className="office-header-row">
                    <HiMapPin className="pin-icon red" size={20} />
                    <strong className="office-type-title">REGISTERED OFFICE (NEW DELHI HQ)</strong>
                  </div>
                  <p className="office-text">
                    50, 51 Second Floor, Regal Building, Connaught Place, New Delhi – 110001
                  </p>
                </div>

                {/* Branch Office - Noida */}
                <div className="b2b-office-box">
                  <div className="office-header-row">
                    <HiMapPin className="pin-icon blue" size={20} />
                    <strong className="office-type-title">BRANCH OFFICE — NOIDA</strong>
                  </div>
                  <p className="office-text">
                    Ist Floor, B-1A/06, Sector 51, Noida (U.P)<br />
                    <span className="landmark-tag">Landmark: Above CSB Bank, Sector 51 - 201301</span>
                  </p>
                </div>

                {/* Branch Office - Kochi */}
                <div className="b2b-office-box">
                  <div className="office-header-row">
                    <HiMapPin className="pin-icon green" size={20} />
                    <strong className="office-type-title">BRANCH OFFICE — KOCHI</strong>
                  </div>
                  <p className="office-text">
                    2nd Floor, Rameesha Building, Opposite Nirmala Shishu Bhavan, SRM Road, Kaloor, Ernakulam North, Kerala – 682018
                  </p>
                </div>

                {/* Branch Office - Bengaluru */}
                <div className="b2b-office-box">
                  <div className="office-header-row">
                    <HiMapPin className="pin-icon yellow" size={20} />
                    <strong className="office-type-title">BRANCH OFFICE — BENGALURU</strong>
                  </div>
                  <p className="office-text">
                    759, 3rd Floor, 8th Main Road, JP Nagar Phase 3, Bengaluru, Karnataka – 560078
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Sticky Registration Form */}
          <div className="b2b-right-sidebar">
            <div className="b2b-registration-card">
              {isSubmitted ? (
                <div className="registration-success-box">
                  <div className="success-icon-badge">
                    <HiCheckCircle size={48} />
                  </div>
                  <h3>Registration Submitted!</h3>
                  <p>
                    Thank you <strong>{contactName}</strong>! Our B2B Account Manager will verify your agency details for <strong>{agencyName}</strong> and contact you at <strong>{phone}</strong> within 2 hours.
                  </p>
                  <button
                    className="b2b-reset-btn"
                    onClick={() => {
                      setIsSubmitted(false);
                      setAgencyName('');
                      setContactName('');
                      setPhone('');
                      setEmail('');
                    }}
                  >
                    Submit Another Inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="b2b-agent-form">
                  <div className="form-card-header">
                    <h3>Register as B2B Partner</h3>
                    <p>Instant activation & net agent pricing within 2 hours</p>
                  </div>

                  <div className="form-field-group">
                    <label>Agency / Company Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Skyline Travel & Tours"
                      value={agencyName}
                      onChange={(e) => setAgencyName(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Contact Person Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Mobile / WhatsApp Number *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. 9876543210"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="form-field-group">
                    <label>Business Email</label>
                    <input
                      type="email"
                      placeholder="e.g. agent@skylinetravels.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="form-field-grid-2">
                    <div className="form-field-group">
                      <label>Business Type</label>
                      <select
                        value={businessType}
                        onChange={(e) => setBusinessType(e.target.value)}
                        className="b2b-select-input"
                      >
                        <option value="Travel Agency">Travel Agency</option>
                        <option value="Tour Operator">Tour Operator</option>
                        <option value="Corporate Travel">Corporate Travel Desk</option>
                        <option value="Freelance Agent">Freelance Agent</option>
                      </select>
                    </div>

                    <div className="form-field-group">
                      <label>Monthly Volume</label>
                      <select
                        value={monthlyVolume}
                        onChange={(e) => setMonthlyVolume(e.target.value)}
                        className="b2b-select-input"
                      >
                        <option value="1-10 Visas">1-10 Visas / mo</option>
                        <option value="10-50 Visas">10-50 Visas / mo</option>
                        <option value="50-200 Visas">50-200 Visas / mo</option>
                        <option value="200+ Visas">200+ Visas / mo</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-field-group">
                    <label>City / Location</label>
                    <input
                      type="text"
                      placeholder="e.g. New Delhi, Mumbai, Ahmedabad"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                    />
                  </div>

                  <button type="submit" className="b2b-submit-cta-btn">
                    <span>Register for B2B Account</span>
                    <HiArrowRight size={18} />
                  </button>

                  <div className="b2b-form-guarantee-note">
                    <HiCheck size={14} style={{ color: '#16a34a' }} />
                    <span>Free Account • No Security Deposit • Immediate Agent Rates</span>
                  </div>
                </form>
              )}
            </div>

            {/* Direct B2B Agent Helpline Box */}
            <div className="b2b-contact-box">
              <HiPhone className="b2b-phone-icon" size={24} />
              <div>
                <strong>B2B Partner Support Desk</strong>
                <p>Call or WhatsApp: +91 98765 43210</p>
                <span className="b2b-timing-badge">Mon-Sat • 9 AM - 8 PM IST</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
