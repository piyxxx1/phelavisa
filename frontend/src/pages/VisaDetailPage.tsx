import { useState, useMemo, useEffect } from 'react';
import type { VisaDestination } from '../data/visasData';
import type { UserProfile } from './LoginPage';
import { API_BASE_URL } from '../config/apiConfig';
import { calculateCategoryTotal, getStartingPrice } from '../utils/pricingUtils';
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
  HiDocumentText,
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
  const [currentVisa, setCurrentVisa] = useState<VisaDestination>(visa);
  const [travelersCount, setTravelersCount] = useState<number>(1);
  const [selectedVariant, setSelectedVariant] = useState<string>('tourist');
  const [isLoginRequiredModalOpen, setIsLoginRequiredModalOpen] = useState<boolean>(false);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  // Live Sync with Backend Endpoint /api/visas/:id
  useEffect(() => {
    setCurrentVisa(visa);
    let isMounted = true;
    async function fetchLiveVisaEndpoint() {
      try {
        const res = await fetch(`${API_BASE_URL}/visas/${visa.id}`);
        if (res.ok) {
          const freshData = await res.json();
          if (isMounted && freshData && freshData.id) {
            setCurrentVisa(freshData);
          }
        }
      } catch (err) {
        console.warn('VisaDetailPage live endpoint fetch:', err);
      }
    }
    fetchLiveVisaEndpoint();
    return () => {
      isMounted = false;
    };
  }, [visa.id, visa]);

  // Categories List configured from Admin (Custom or Default) with verified calculation
  const categoriesList = useMemo(() => {
    if (currentVisa.customCategories && currentVisa.customCategories.length > 0) {
      return currentVisa.customCategories.map((c) => {
        const { formattedTotal } = calculateCategoryTotal(c.visaPrice, c.ourCharges, c.taxRate);
        return {
          ...c,
          price: formattedTotal,
        };
      });
    }

    // Fallback for legacy database records
    const legacyMap: Record<string, { name: string; badge: string; defaultVisa: string; defaultOur: string; defaultTax: string }> = {
      tourist: { name: 'Tourist Visa', badge: 'Standard Process', defaultVisa: '₹3,500', defaultOur: '₹999', defaultTax: '₹499 (18% GST)' },
      express: { name: 'Express eVisa', badge: '⚡ 24h Fast Track', defaultVisa: '₹5,500', defaultOur: '₹1,499', defaultTax: '₹999 (18% GST)' },
      business: { name: 'Business Visa', badge: '1 Year Multiple', defaultVisa: '₹10,500', defaultOur: '₹2,499', defaultTax: '₹1,999 (18% GST)' },
    };
    const availableKeys = currentVisa.availableCategories && currentVisa.availableCategories.length > 0
      ? currentVisa.availableCategories
      : ['tourist', 'express', 'business'];

    return availableKeys.map((key) => {
      const cp = currentVisa.categoryPricing?.[key as 'tourist' | 'express' | 'business'];
      const info = legacyMap[key] || { name: key.toUpperCase(), badge: 'Standard', defaultVisa: '₹3,500', defaultOur: '₹999', defaultTax: '₹499' };
      const vP = cp?.visaPrice || (key === 'tourist' ? currentVisa.visaPrice : info.defaultVisa) || '₹3,500';
      const oC = cp?.ourCharges || (key === 'tourist' ? currentVisa.ourCharges : info.defaultOur) || '₹999';
      const tR = cp?.taxRate || (key === 'tourist' ? currentVisa.taxRate : info.defaultTax) || '₹499 (18% GST)';
      const { formattedTotal } = calculateCategoryTotal(vP, oC, tR);

      return {
        id: key,
        name: info.name,
        badge: info.badge,
        price: formattedTotal,
        visaPrice: vP,
        ourCharges: oC,
        taxRate: tR,
      };
    });
  }, [currentVisa]);

  useEffect(() => {
    if (categoriesList.length > 0 && !categoriesList.some((c) => c.id === selectedVariant)) {
      setSelectedVariant(categoriesList[0].id);
    }
  }, [categoriesList, selectedVariant]);

  // Login Modal Form states
  const [quickLoginName, setQuickLoginName] = useState('');
  const [quickLoginPhone, setQuickLoginPhone] = useState('');

  const selectedCategoryObj = useMemo(() => {
    return categoriesList.find((c) => c.id === selectedVariant) || categoriesList[0];
  }, [categoriesList, selectedVariant]);

  // 1. Filter documents specifically for the selected category option (e.g. Tourist, Express, Business)
  const variantScopedDocuments = useMemo(() => {
    if (!currentVisa.docChecklist || currentVisa.docChecklist.length === 0) return [];

    const activeId = selectedVariant.toLowerCase().trim();
    const activeName = (selectedCategoryObj?.name || '').toLowerCase().trim();

    return currentVisa.docChecklist.filter((d) => {
      const docCat = (d.forVisaCategory || 'all').toLowerCase().trim();

      // If document is marked for 'all', it applies to every category
      if (docCat === 'all') return true;

      // Match document category ID or Name
      if (docCat === activeId) return true;
      if (activeName && docCat === activeName) return true;

      // Handle variant string matching
      if (activeId.includes(docCat) || docCat.includes(activeId)) return true;

      return false;
    });
  }, [currentVisa.docChecklist, selectedVariant, selectedCategoryObj]);

  // 2. Dynamic Group Categories extracted from variantScopedDocuments
  const documentCategories = useMemo(() => {
    if (variantScopedDocuments.length === 0) return [];
    const cats = Array.from(new Set(variantScopedDocuments.map((d) => d.category || 'Passport & ID')));
    return cats;
  }, [variantScopedDocuments]);

  const [activeDocCategory, setActiveDocCategory] = useState<string>('');

  useEffect(() => {
    if (documentCategories.length > 0 && !documentCategories.includes(activeDocCategory)) {
      setActiveDocCategory(documentCategories[0]);
    }
  }, [documentCategories, activeDocCategory]);

  const currentCategoryDocs = useMemo(() => {
    if (variantScopedDocuments.length === 0) return [];
    return variantScopedDocuments.filter((d) => (d.category || 'Passport & ID') === activeDocCategory);
  }, [variantScopedDocuments, activeDocCategory]);

  // Dynamic Key Specifications renderer helper - STRICTLY 4 Core Specifications
  const displayKeySpecs = useMemo(() => {
    return [
      { id: 'ks-1', label: 'Processing Time', value: currentVisa.processingTime || '5-7 Days', icon: 'clock' },
      { id: 'ks-2', label: 'Stay Duration', value: currentVisa.stayPeriod || '30 Days', icon: 'calendar' },
      { id: 'ks-3', label: 'Visa Validity', value: currentVisa.validity || '180 Days', icon: 'document' },
      { id: 'ks-4', label: 'Entry Type', value: currentVisa.entryType || 'Single Entry', icon: 'id' },
    ];
  }, [currentVisa.processingTime, currentVisa.stayPeriod, currentVisa.validity, currentVisa.entryType]);

  const getSpecIconConfig = (iconName?: string, index: number = 0) => {
    const colors = ['blue', 'green', 'yellow', 'purple', 'indigo', 'rose'];
    const colorClass = colors[index % colors.length];

    switch (iconName) {
      case 'clock':
        return { icon: <HiClock />, colorClass };
      case 'calendar':
        return { icon: <HiCalendarDays />, colorClass };
      case 'document':
        return { icon: <HiDocumentCheck />, colorClass };
      case 'id':
        return { icon: <HiIdentification />, colorClass };
      case 'shield':
        return { icon: <HiShieldCheck />, colorClass };
      case 'bolt':
        return { icon: <HiBolt />, colorClass };
      case 'check':
        return { icon: <HiCheckCircle />, colorClass };
      default:
        return { icon: <HiCheckCircle />, colorClass };
    }
  };

  // Calculate per-variant pricing from database categoriesList
  const currentPricing = useMemo(() => {
    const found = categoriesList.find((c) => c.id === selectedVariant) || categoriesList[0];
    const { vP, oC, tR, total, formattedTotal } = calculateCategoryTotal(
      found?.visaPrice,
      found?.ourCharges,
      found?.taxRate
    );
    return {
      id: found?.id || 'tourist',
      name: found?.name || 'Tourist Visa',
      badge: found?.badge || 'Standard Process',
      price: formattedTotal,
      visaPrice: `₹${vP.toLocaleString('en-IN')}`,
      ourCharges: `₹${oC.toLocaleString('en-IN')}`,
      taxRate: `₹${tR.toLocaleString('en-IN')}`,
      rawTotal: total,
    };
  }, [categoriesList, selectedVariant]);

  const totalPrice = currentPricing.rawTotal * travelersCount;

  // Click Handler for "Apply For Visa" Button
  const handleApplyButtonClick = () => {
    if (!user) {
      setIsLoginRequiredModalOpen(true);
    } else {
      onStartApplication(currentVisa, travelersCount, selectedVariant);
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
    onStartApplication(currentVisa, travelersCount, selectedVariant);
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
    onStartApplication(currentVisa, travelersCount, selectedVariant);
  };

  // Reusable Pricing & Fee Component
  const renderPricingCard = () => (
    <div className="sticky-pricing-card">
      <div className="pricing-header-banner">
        <span className="starting-label">{currentPricing.name} Total Fee</span>
        <div className="price-big-display">
          ₹{totalPrice.toLocaleString('en-IN')}
          <span className="price-unit">/ {travelersCount > 1 ? `${travelersCount} travelers` : 'applicant'}</span>
        </div>
        <span className="price-tax-note">{currentVisa.feeLabel || 'Govt Fee'} + Taxes Included</span>
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

        {/* Dynamic Visa Category Selection Buttons */}
        {categoriesList.length > 0 && (
          <div className="sidebar-field-group">
            <label className="sidebar-label">Select Visa Category Option</label>
            <div className="variant-radio-grid">
              {categoriesList.map((cat) => {
                const { formattedTotal } = calculateCategoryTotal(cat.visaPrice, cat.ourCharges, cat.taxRate);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    className={`variant-btn ${selectedVariant === cat.id ? 'active' : ''}`}
                    onClick={() => setSelectedVariant(cat.id)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'flex-start',
                      gap: '0.2rem',
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700 }}>{cat.name}</span>
                      <span className="variant-badge">{cat.badge || 'Standard'}</span>
                    </div>
                    <span style={{ fontSize: '0.85rem', fontWeight: 800, color: selectedVariant === cat.id ? '#2563eb' : '#475569' }}>
                      {formattedTotal}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

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

        {/* 3-Column Pricing Breakdown Matching Selected Variant */}
        <div style={{ background: '#f8fafc', padding: '0.85rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0', margin: '1rem 0' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#475569', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {currentPricing.name.toUpperCase()} FEE BREAKDOWN:
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.4rem', textAlign: 'center' }}>
            <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>{currentVisa.feeLabel || 'Govt Visa Fee'}</span>
              <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>{currentPricing.visaPrice}</strong>
            </div>
            <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Our Charges</span>
              <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>{currentPricing.ourCharges}</strong>
            </div>
            <div style={{ background: '#ffffff', padding: '0.4rem', borderRadius: '0.4rem', border: '1px solid #cbd5e1' }}>
              <span style={{ fontSize: '0.65rem', color: '#64748b', display: 'block' }}>Tax / GST</span>
              <strong style={{ fontSize: '0.8rem', color: '#0f172a' }}>{currentPricing.taxRate}</strong>
            </div>
          </div>
        </div>

        {/* Apply Now Primary CTA */}
        <button
          className="apply-primary-btn"
          onClick={handleApplyButtonClick}
        >
          <span className="apply-btn-text">Apply for {currentVisa.country} Visa</span>
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
      <section className="detail-hero-banner" style={{ backgroundImage: `url(${currentVisa.coverImg})` }}>
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
              <span className="bc-current">{currentVisa.country}</span>
            </div>
          </div>

          {/* Title & Badge Content */}
          <div className="detail-hero-main">
            <div className="detail-flag-badge-box">
              <img
                src={`https://flagcdn.com/w80/${(currentVisa.flagCode || 'fr').toLowerCase()}.png`}
                alt={currentVisa.country}
                className="detail-flag-img"
              />
              <span className="detail-country-tag">{currentVisa.region} • {currentVisa.visaCategory}</span>
            </div>

            <h1 className="detail-page-title">{currentVisa.country} Visa Online</h1>
            <p className="detail-page-subtitle">
              Get your {currentVisa.title} fast with India's #1 trusted visa platform. 100% verified documentation & guaranteed on-time processing.
            </p>

            <div className="detail-guarantee-pills">
              <span className="guarantee-pill green">
                <HiCheckCircle size={16} />
                Starting at {getStartingPrice(currentVisa)}
              </span>
              <span className="guarantee-pill blue">
                <HiBolt size={16} />
                Turnaround: {currentVisa.processingTime}
              </span>
              <span className="guarantee-pill yellow">
                <HiShieldCheck size={16} />
                Approval Rate 99.4%
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
                {displayKeySpecs.map((spec, idx) => {
                  const { icon, colorClass } = getSpecIconConfig(spec.icon, idx);
                  return (
                    <div key={spec.id || idx} className="spec-box">
                      <div className={`spec-icon ${colorClass}`}>{icon}</div>
                      <div className="spec-info">
                        <span className="spec-label">{spec.label}</span>
                        <span className="spec-val">{spec.value}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 2. Documents Required Checklist */}
            <div className="detail-section-block">
              <span className="detail-section-tag">Requirements Checklist</span>
              <h2 className="detail-section-heading">Documents Required for {currentVisa.country} ({currentPricing.name})</h2>
              
              {variantScopedDocuments.length > 0 ? (
                <>
                  <div className="docs-tab-navigation">
                    {documentCategories.map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`doc-tab-btn ${activeDocCategory === cat ? 'active' : ''}`}
                        onClick={() => setActiveDocCategory(cat)}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  <div className="docs-checklist-container">
                    <ul className="docs-check-list">
                      {currentCategoryDocs.map((doc) => (
                        <li key={doc.id || doc.title} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                          <span className="check-icon" style={{ marginTop: '0.2rem' }}><HiCheck /></span>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem', flexWrap: 'wrap' }}>
                              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{doc.title}</strong>
                              <span
                                style={{
                                  fontSize: '0.7rem',
                                  padding: '0.15rem 0.5rem',
                                  borderRadius: '0.25rem',
                                  fontWeight: 700,
                                  background: doc.isRequired !== false ? '#fee2e2' : '#e0f2fe',
                                  color: doc.isRequired !== false ? '#991b1b' : '#0369a1',
                                }}
                              >
                                {doc.isRequired !== false ? 'Mandatory' : 'Optional'}
                              </span>
                            </div>
                            <p style={{ margin: 0, fontSize: '0.825rem', color: '#64748b' }}>
                              {doc.description || 'Required for visa application processing.'}
                            </p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </>
              ) : (
                <div style={{ background: '#f8fafc', padding: '1.75rem', borderRadius: '0.75rem', border: '1px dashed #cbd5e1', textAlign: 'center', margin: '1.25rem 0' }}>
                  <HiDocumentText size={32} style={{ color: '#94a3b8', marginBottom: '0.5rem' }} />
                  <h4 style={{ margin: 0, color: '#334155', fontSize: '1rem', fontWeight: 700 }}>No Documents Listed Yet</h4>
                  <p style={{ margin: '0.35rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    Document checklist for {currentVisa.country} has not been added in the Admin panel yet. Items will appear here as soon as they are added in Admin.
                  </p>
                </div>
              )}
            </div>

            {/* 3. Step by Step Process (How It Works) */}
            <div className="detail-section-block">
              <span className="detail-section-tag">How It Works</span>
              <h2 className="detail-section-heading">4 Simple Steps to Get Your {currentVisa.country} Visa</h2>
              
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

              {currentVisa.faqs && currentVisa.faqs.length > 0 ? (
                <div className="faq-accordion-list">
                  {currentVisa.faqs.map((faq, idx) => (
                    <div
                      key={faq.id || idx}
                      className={`faq-detail-item ${activeFaq === idx ? 'open' : ''}`}
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                    >
                      <div className="faq-detail-question">
                        <span>{faq.question}</span>
                        <span className="faq-toggle-plus">{activeFaq === idx ? <HiMinus /> : <HiPlus />}</span>
                      </div>
                      {activeFaq === idx && <div className="faq-detail-answer">{faq.answer}</div>}
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '0.75rem', border: '1px dashed #cbd5e1', textAlign: 'center', margin: '1rem 0' }}>
                  <h4 style={{ margin: 0, color: '#334155', fontSize: '0.95rem', fontWeight: 700 }}>No FAQs Added Yet</h4>
                  <p style={{ margin: '0.35rem 0 0 0', color: '#64748b', fontSize: '0.85rem' }}>
                    FAQs for {currentVisa.country} have not been added in Admin yet. Items added in Tab 3 of Admin will appear here automatically.
                  </p>
                </div>
              )}
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
