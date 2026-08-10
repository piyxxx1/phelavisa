import { useState, useMemo } from 'react';
import type { VisaDestination } from '../data/visasData';
import type { UserProfile } from './LoginPage';
import {
  HiArrowLeft,
  HiCheckCircle,
  HiBolt,
  HiShieldCheck,
  HiClock,
  HiCalendarDays,
  HiDocumentCheck,
  HiIdentification,
  HiCheck,
  HiPlus,
  HiMinus,
  HiArrowRight,
  HiLockClosed,
  HiPhone,
  HiChatBubbleLeftRight,
  HiXMark,
  HiUser,
  HiChevronRight,
} from 'react-icons/hi2';

interface VisaDetailPageProps {
  visa: VisaDestination;
  user: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
  onBack: () => void;
  onNavigateVisas: () => void;
  onStartApplication: (visa: VisaDestination, travelersCount: number, selectedVariant: string) => void;
}

export const VisaDetailPage = ({
  visa,
  user,
  onLoginSuccess,
  onBack,
  onNavigateVisas,
  onStartApplication,
}: VisaDetailPageProps) => {
  const [activeDocTab, setActiveDocTab] = useState<'mandatory' | 'financial' | 'travel'>('mandatory');
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('tourist');
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Login Modal Form states
  const [quickLoginName, setQuickLoginName] = useState('');
  const [quickLoginPhone, setQuickLoginPhone] = useState('');

  // Calculate pricing
  const basePriceNum = useMemo(() => {
    const cleanNum = parseInt(visa.price.replace(/[^0-9]/g, ''), 10);
    return isNaN(cleanNum) ? 4999 : cleanNum;
  }, [visa.price]);

  const variantMultiplier = selectedVariant === 'express' ? 1.3 : selectedVariant === 'business' ? 1.5 : 1;
  const totalPrice = Math.round(basePriceNum * variantMultiplier * travelersCount);

  // Click Handler for "Apply For Visa" Button
  const handleApplyButtonClick = () => {
    if (!user) {
      setIsLoginRequiredModalOpen(true);
    } else {
      onStartApplication(visa, travelersCount, selectedVariant);
    }
  };

  const handleModalQuickLogin = (nameToUse: string) => {
    const newUser: UserProfile = {
      name: nameToUse,
      email: `${nameToUse.toLowerCase()}@example.com`,
      phone: '9876543210',
    };
    onLoginSuccess(newUser);
    setIsLoginRequiredModalOpen(false);
    onStartApplication(visa, travelersCount, selectedVariant);
  };

  const handleModalCustomLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = quickLoginName.trim() ? quickLoginName.trim() : 'Piyush';
    const newUser: UserProfile = {
      name: finalName,
      email: `${finalName.toLowerCase()}@example.com`,
      phone: quickLoginPhone || '9876543210',
    };
    onLoginSuccess(newUser);
    setIsLoginRequiredModalOpen(false);
    onStartApplication(visa, travelersCount, selectedVariant);
  };

  // Reusable Pricing & Fee Component
  const renderPricingCard = () => (
    <div className="sticky-pricing-card">
      <div className="pricing-header-banner">
        <span className="starting-label">Total Visa Fee</span>
        <div className="price-big-display">
          ₹{totalPrice.toLocaleString('en-IN')}
          <span className="price-unit">/ total</span>
        </div>
        <span className="price-tax-note">Govt Fee + Taxes Included</span>
      </div>

      <div className="pricing-options-body">
        {/* User Auth Status Banner */}
        {user ? (
          <div className="logged-in-status-banner">
            <span className="user-mini-dot"></span>
            <span>Logged in as <strong>{user.name}</strong></span>
          </div>
        ) : (
          <div className="login-alert-banner">
            <HiLockClosed style={{ display: 'inline', marginRight: 4 }} /> Login required to apply
          </div>
        )}

        {/* Select Visa Variant */}
        <div className="sidebar-field-group">
          <label className="sidebar-label">Select Visa Category</label>
          <div className="variant-radio-grid">
            <button
              className={`variant-btn ${selectedVariant === 'tourist' ? 'active' : ''}`}
              onClick={() => setSelectedVariant('tourist')}
            >
              <span>Tourist Visa</span>
              <span className="variant-badge">Standard</span>
            </button>
            <button
              className={`variant-btn ${selectedVariant === 'express' ? 'active' : ''}`}
              onClick={() => setSelectedVariant('express')}
            >
              <span>Express eVisa</span>
              <span className="variant-badge highlight">⚡ 24h</span>
            </button>
            <button
              className={`variant-btn ${selectedVariant === 'business' ? 'active' : ''}`}
              onClick={() => setSelectedVariant('business')}
            >
              <span>Business Visa</span>
              <span className="variant-badge">1 Year</span>
            </button>
          </div>
        </div>

        {/* Number of Travelers Counter */}
        <div className="sidebar-field-group">
          <label className="sidebar-label">Number of Applicants</label>
          <div className="traveler-counter-row">
            <button
              className="counter-btn"
              onClick={() => setTravelersCount(Math.max(1, travelersCount - 1))}
            >
              −
            </button>
            <span className="traveler-num-display">{travelersCount} Traveler{travelersCount > 1 ? 's' : ''}</span>
            <button
              className="counter-btn"
              onClick={() => setTravelersCount(travelersCount + 1)}
            >
              +
            </button>
          </div>
        </div>

        {/* Apply Now Primary CTA */}
        <button
          className="apply-primary-btn"
          onClick={handleApplyButtonClick}
        >
          <span className="apply-btn-text">Apply for {visa.country} Visa</span>
          <HiArrowRight size={18} style={{ flexShrink: 0 }} />
        </button>

        {/* Trust Badges */}
        <div className="trust-bullets-list">
          <div className="trust-item">
            <HiLockClosed className="trust-icon" size={16} />
            <span>256-bit Secure Encryption</span>
          </div>
          <div className="trust-item">
            <HiPhone className="trust-icon" size={16} />
            <span>Dedicated Visa Expert Support</span>
          </div>
          <div className="trust-item">
            <HiChatBubbleLeftRight className="trust-icon" size={16} />
            <span>Real-time WhatsApp Status Updates</span>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="visa-detail-page-wrapper">
      {/* Top Banner / Breadcrumb Header */}
      <section className="detail-hero-banner" style={{ backgroundImage: `url(${visa.coverImg})` }}>
        <div className="detail-hero-overlay"></div>
        <div className="detail-hero-container">
          {/* Breadcrumb & Back Action */}
          <div className="detail-breadcrumb-bar">
            <button className="back-link-btn" onClick={onBack}>
              <HiArrowLeft size={16} />
              <span>Back</span>
            </button>
            <div className="breadcrumb-paths">
              <span onClick={onBack} className="bc-link">Home</span>
              <HiChevronRight size={12} className="bc-sep" />
              <span onClick={onNavigateVisas} className="bc-link">Visas</span>
              <HiChevronRight size={12} className="bc-sep" />
              <span className="bc-current">{visa.country}</span>
            </div>
          </div>

          {/* Title & Badge Content */}
          <div className="detail-hero-main">
            <div className="detail-flag-badge-box">
              <img
                src={`https://flagcdn.com/w80/${visa.flagCode === 'eu' ? 'eu' : visa.flagCode}.png`}
                alt={visa.country}
                className="detail-flag-img"
              />
              <span className="detail-country-tag">{visa.region} • {visa.visaCategory}</span>
            </div>

            <h1 className="detail-page-title">{visa.country} Visa Online</h1>
            <p className="detail-page-subtitle">
              Get your {visa.title} fast with India's #1 trusted visa platform. 100% verified documentation & guaranteed on-time processing.
            </p>

            <div className="detail-guarantee-pills">
              <span className="guarantee-pill green">
                <HiCheckCircle size={16} />
                99.4% High Approval Rate
              </span>
              <span className="guarantee-pill blue">
                <HiBolt size={16} />
                Turnaround: {visa.processingTime}
              </span>
              <span className="guarantee-pill yellow">
                <HiShieldCheck size={16} />
                Verified Embassy Process
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="section-padding bg-gray-light">
        <div className="detail-content-layout-container">
          {/* Main Left Content */}
          <div className="detail-left-content">
            {/* Mobile-Only Upfront Total Visa Fee Box */}
            <div className="mobile-pricing-top-block">
              {renderPricingCard()}
            </div>

            {/* 1. Quick Metrics Cards Row */}
            <div className="metrics-specs-card">
              <h2 className="specs-card-title">Visa Key Specifications</h2>
              <div className="specs-grid">
                <div className="spec-box">
                  <div className="spec-icon blue"><HiClock /></div>
                  <div className="spec-info">
                    <span className="spec-label">Processing Time</span>
                    <span className="spec-val">{visa.processingTime}</span>
                  </div>
                </div>

                <div className="spec-box">
                  <div className="spec-icon green"><HiCalendarDays /></div>
                  <div className="spec-info">
                    <span className="spec-label">Stay Duration</span>
                    <span className="spec-val">{visa.stayPeriod}</span>
                  </div>
                </div>

                <div className="spec-box">
                  <div className="spec-icon yellow"><HiDocumentCheck /></div>
                  <div className="spec-info">
                    <span className="spec-label">Visa Validity</span>
                    <span className="spec-val">{visa.validity}</span>
                  </div>
                </div>

                <div className="spec-box">
                  <div className="spec-icon purple"><HiIdentification /></div>
                  <div className="spec-info">
                    <span className="spec-label">Entry Type</span>
                    <span className="spec-val">{visa.entryType}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Documents Required Checklist */}
            <div className="detail-section-block">
              <span className="detail-section-tag">Requirements Checklist</span>
              <h2 className="detail-section-heading">Documents Required for {visa.country} Visa</h2>
              
              <div className="docs-tab-navigation">
                <button
                  className={`doc-tab-btn ${activeDocTab === 'mandatory' ? 'active' : ''}`}
                  onClick={() => setActiveDocTab('mandatory')}
                >
                  Passport & ID
                </button>
                <button
                  className={`doc-tab-btn ${activeDocTab === 'financial' ? 'active' : ''}`}
                  onClick={() => setActiveDocTab('financial')}
                >
                  Bank & Employment
                </button>
                <button
                  className={`doc-tab-btn ${activeDocTab === 'travel' ? 'active' : ''}`}
                  onClick={() => setActiveDocTab('travel')}
                >
                  Flight & Hotel
                </button>
              </div>

              <div className="docs-checklist-container">
                {activeDocTab === 'mandatory' && (
                  <ul className="docs-check-list">
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Original Passport:</strong> Valid for at least 6 months beyond intended stay with minimum 2 blank pages.
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Passport Size Photographs:</strong> 2 recent color photos (35x45mm, white background, 80% face view).
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>National ID / PAN Card:</strong> Scanned front and back copy of Indian PAN Card or Aadhaar.
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Visa Application Form:</strong> Duly completed and signed visa application form.
                      </div>
                    </li>
                  </ul>
                )}

                {activeDocTab === 'financial' && (
                  <ul className="docs-check-list">
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Bank Statement:</strong> Updated original bank account statement for the last 6 months with bank seal & signature.
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Salary Slips / Income Proof:</strong> Salary slips for the last 3 months (for employed applicants).
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>ITR Returns:</strong> Income Tax Returns (ITR-V) for the last 2 financial years.
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Leave Sanction Letter:</strong> Approved leave letter from employer on official company letterhead.
                      </div>
                    </li>
                  </ul>
                )}

                {activeDocTab === 'travel' && (
                  <ul className="docs-check-list">
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Flight Tickets:</strong> Confirmed round-trip flight ticket reservations.
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Hotel Reservation:</strong> Confirmed hotel booking confirmation for the entire duration of stay.
                      </div>
                    </li>
                    <li>
                      <span className="check-icon"><HiCheck /></span>
                      <div>
                        <strong>Day-wise Travel Itinerary:</strong> Detailed day-by-day travel plan detailing places to visit.
                      </div>
                    </li>
                  </ul>
                )}
              </div>
            </div>

            {/* 3. Step by Step Process (How It Works) */}
            <div className="detail-section-block">
              <span className="detail-section-tag">How It Works</span>
              <h2 className="detail-section-heading">4 Simple Steps to Get Your {visa.country} Visa</h2>
              
              <div className="process-timeline-grid">
                <div className="timeline-step-card">
                  <div className="step-num-badge">1</div>
                  <h3 className="step-title">Submit Details</h3>
                  <p className="step-desc">Fill out basic traveler info online in under 2 minutes.</p>
                </div>

                <div className="timeline-step-card">
                  <div className="step-num-badge">2</div>
                  <h3 className="step-title">Upload Documents</h3>
                  <p className="step-desc">Upload passport scan & photo to our secure portal.</p>
                </div>

                <div className="timeline-step-card">
                  <div className="step-num-badge">3</div>
                  <h3 className="step-title">Expert Verification</h3>
                  <p className="step-desc">Our experts verify every document to ensure 0% rejection.</p>
                </div>

                <div className="timeline-step-card">
                  <div className="step-num-badge">4</div>
                  <h3 className="step-title">Receive eVisa</h3>
                  <p className="step-desc">Get your approved eVisa directly on WhatsApp & Email.</p>
                </div>
              </div>
            </div>

            {/* 4. FAQs Accordion */}
            <div className="detail-section-block">
              <span className="detail-section-tag">Got Questions?</span>
              <h2 className="detail-section-heading">Frequently Asked Questions</h2>

              <div className="faq-accordion-list">
                {[
                  {
                    q: `Is a physical interview required for ${visa.country} Visa?`,
                    a: `Most tourist visas for ${visa.country} are processed online without requiring a physical interview. If the embassy requests biometrics or an interview, Pehla Visa will guide you step-by-step.`
                  },
                  {
                    q: `How far in advance should I apply for a ${visa.country} Visa?`,
                    a: `We recommend applying at least 3-4 weeks prior to your intended date of travel to accommodate document verification and embassy processing times.`
                  },
                  {
                    q: `What is the minimum bank balance required for ${visa.country}?`,
                    a: `The embassy generally expects applicants to show sufficient funds to cover stay expenses (approx ₹1.5L to ₹3L per person depending on duration).`
                  },
                  {
                    q: `Will I get a refund if my visa is rejected?`,
                    a: `Pehla Visa offers a 100% Document Verification Guarantee. We check your files thoroughly before submitting so rejections are extremely rare (under 0.8%).`
                  }
                ].map((faq, idx) => (
                  <div
                    key={idx}
                    className={`faq-detail-item ${activeFaq === idx ? 'open' : ''}`}
                    onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                  >
                    <div className="faq-detail-question">
                      <span>{faq.q}</span>
                      <span className="faq-toggle-plus">{activeFaq === idx ? <HiMinus /> : <HiPlus />}</span>
                    </div>
                    {activeFaq === idx && <div className="faq-detail-answer">{faq.a}</div>}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Desktop Right Column: Sticky Pricing Sidebar */}
          <div className="detail-right-sidebar">
            {renderPricingCard()}
          </div>
        </div>
      </section>

      {/* REQUIRED LOGIN POP-UP MODAL */}
      {isLoginRequiredModalOpen && (
        <div className="modal-backdrop-overlay">
          <div className="modal-content-card">
            <button className="modal-close-btn" onClick={() => setIsLoginRequiredModalOpen(false)}>
              <HiXMark size={20} />
            </button>

            <div className="modal-header-box text-center">
              <div className="login-modal-icon-badge"><HiLockClosed /></div>
              <span className="modal-tag">Authentication Required</span>
              <h3 className="modal-title">Please Login to Continue</h3>
              <p className="modal-desc">
                Bina login kiye aap visa apply nahi kar sakte. Please login with your name or mobile number to proceed.
              </p>
            </div>

            {/* One-Click Quick Login Buttons */}
            <div className="quick-modal-login-bar">
              <span className="quick-login-label">⚡ One-Click Instant Login:</span>
              <div className="modal-quick-btn-group">
                <button
                  type="button"
                  className="quick-demo-chip"
                  onClick={() => handleModalQuickLogin('Piyush')}
                >
                  <HiUser style={{ display: 'inline', marginRight: 4 }} /> Login as Piyush
                </button>
                <button
                  type="button"
                  className="quick-demo-chip"
                  onClick={() => handleModalQuickLogin('Ananya')}
                >
                  <HiUser style={{ display: 'inline', marginRight: 4 }} /> Login as Ananya
                </button>
              </div>
            </div>

            <div className="login-divider-or" style={{ margin: '1rem 0' }}>
              <span>OR ENTER DETAILS</span>
            </div>

            <form onSubmit={handleModalCustomLogin} className="modal-form-body">
              <div className="form-input-block">
                <label>Your Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Piyush"
                  value={quickLoginName}
                  onChange={(e) => setQuickLoginName(e.target.value)}
                />
              </div>

              <div className="form-input-block">
                <label>Mobile Number</label>
                <input
                  type="tel"
                  placeholder="e.g. 9876543210"
                  maxLength={10}
                  value={quickLoginPhone}
                  onChange={(e) => setQuickLoginPhone(e.target.value)}
                />
              </div>

              <button type="submit" className="form-submit-btn">
                Login & Continue Application
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
