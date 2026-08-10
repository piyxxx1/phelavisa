import { useState, useMemo, useEffect } from 'react';
import type { VisaDestination } from '../data/visasData';
import type { UserProfile } from './LoginPage';
import {
  HiArrowLeft,
  HiChevronRight,
  HiUser,
  HiPhone,
  HiCreditCard,
  HiBuildingLibrary,
  HiLockClosed,
  HiSparkles,
  HiCheckCircle,
  HiChatBubbleLeftRight,
  HiShieldCheck,
  HiClock,
  HiXMark,
  HiUserPlus,
  HiTrash,
  HiDocumentArrowUp,
  HiArrowUpTray,
  HiDocumentCheck,
} from 'react-icons/hi2';
import { FaGooglePay } from 'react-icons/fa6';

export interface ApplicantDetail {
  id: number;
  name: string;
  gender: string;
  dob: string;
  passportNumber: string;
  passportExpiry: string;
  passportIssuePlace: string;
}

interface ApplyVisaPageProps {
  visa: VisaDestination;
  user: UserProfile | null;
  initialTravelersCount?: number;
  initialVariant?: string;
  onBackToVisaDetail: () => void;
  onNavigateHome: () => void;
  onNavigateVisas: () => void;
}

export const ApplyVisaPage = ({
  visa,
  user,
  initialTravelersCount = 1,
  initialVariant = 'tourist',
  onBackToVisaDetail,
  onNavigateHome,
  onNavigateVisas,
}: ApplyVisaPageProps) => {
  const [selectedVariant, setSelectedVariant] = useState<string>(initialVariant);

  // Dynamic Applicants State Array (Person 1, Person 2, Person 3...)
  const [applicants, setApplicants] = useState<ApplicantDetail[]>(() => {
    const list: ApplicantDetail[] = [];
    const count = Math.max(1, initialTravelersCount);
    for (let i = 0; i < count; i++) {
      list.push({
        id: i + 1,
        name: i === 0 ? user?.name || '' : '',
        gender: 'Male',
        dob: '',
        passportNumber: '',
        passportExpiry: '',
        passportIssuePlace: 'India',
      });
    }
    return list;
  });

  const travelersCount = applicants.length;

  // Contact & Travel Info
  const [applicantPhone, setApplicantPhone] = useState(user?.phone || '');
  const [applicantEmail, setApplicantEmail] = useState(user?.email || '');
  const [travelDate, setTravelDate] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking'>('upi');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [bookingRefId, setBookingRefId] = useState('');
  const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);

  // Uploaded Documents State (Document ID -> File)
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  // Document Checklist configuration (from admin or standard defaults)
  const requiredDocs = useMemo(() => {
    if (visa.docChecklist && visa.docChecklist.length > 0) {
      return visa.docChecklist;
    }
    return [
      {
        id: 'doc-passport-front',
        category: 'mandatory' as const,
        title: 'Original Passport Front Page (Bio Page)',
        description: 'Clear color scan of passport first page showing full name, photo, & passport number.',
        isRequired: true,
      },
      {
        id: 'doc-passport-back',
        category: 'mandatory' as const,
        title: 'Passport Back Page (Address Page)',
        description: 'Clear color scan of passport last page showing parents name & address.',
        isRequired: true,
      },
      {
        id: 'doc-photo',
        category: 'mandatory' as const,
        title: 'Recent Passport Size Photograph',
        description: 'White background, 35mm x 45mm, 80% face coverage color photo.',
        isRequired: true,
      },
      {
        id: 'doc-bank-statement',
        category: 'financial' as const,
        title: '6 Months Bank Account Statement',
        description: 'Updated bank statement showing sufficient funds with bank seal/stamp.',
        isRequired: visa.documents === 'Bank Statement Required',
      },
    ];
  }, [visa]);

  // Sync user details to Primary Applicant (Person 1)
  useEffect(() => {
    if (user && applicants.length > 0 && !applicants[0].name) {
      setApplicants((prev) => {
        const copy = [...prev];
        copy[0].name = user.name;
        return copy;
      });
      if (!applicantPhone) setApplicantPhone(user.phone || '');
      if (!applicantEmail) setApplicantEmail(user.email || '');
    }
  }, [user]);

  // Handlers for dynamic applicants
  const handleAddApplicant = () => {
    setApplicants((prev) => [
      ...prev,
      {
        id: Date.now() + Math.random(),
        name: '',
        gender: 'Male',
        dob: '',
        passportNumber: '',
        passportExpiry: '',
        passportIssuePlace: 'India',
      },
    ]);
  };

  const handleRemoveApplicant = (indexToRemove?: number) => {
    if (applicants.length <= 1) return;
    setApplicants((prev) => {
      if (typeof indexToRemove === 'number') {
        return prev.filter((_, idx) => idx !== indexToRemove);
      }
      return prev.slice(0, -1);
    });
  };

  const updateApplicantField = (index: number, field: keyof ApplicantDetail, value: string) => {
    setApplicants((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  // Handlers for File Uploads
  const handleFileUpload = (docId: string, file: File | null) => {
    if (!file) return;
    setUploadedFiles((prev) => ({
      ...prev,
      [docId]: file,
    }));
  };

  const handleRemoveFile = (docId: string) => {
    setUploadedFiles((prev) => {
      const copy = { ...prev };
      delete copy[docId];
      return copy;
    });
  };

  // Form Validation check: returns true ONLY when ALL applicants, contact info, AND MANDATORY DOCUMENTS are uploaded!
  const isFormValid = useMemo(() => {
    const allApplicantsValid = applicants.every(
      (app) => app.name.trim() && app.dob && app.passportNumber.trim() && app.passportExpiry
    );

    const mandatoryDocsList = requiredDocs.filter((d) => d.isRequired);
    const allDocsUploaded = mandatoryDocsList.every((d) => Boolean(uploadedFiles[d.id]));

    return Boolean(
      allApplicantsValid &&
      allDocsUploaded &&
      applicantPhone.trim() &&
      applicantEmail.trim() &&
      travelDate
    );
  }, [applicants, requiredDocs, uploadedFiles, applicantPhone, applicantEmail, travelDate]);

  // Calculate pricing & fee breakdown
  const basePriceNum = useMemo(() => {
    const cleanNum = parseInt(visa.price.replace(/[^0-9]/g, ''), 10);
    return isNaN(cleanNum) ? 4999 : cleanNum;
  }, [visa.price]);

  const variantMultiplier = selectedVariant === 'express' ? 1.3 : selectedVariant === 'business' ? 1.5 : 1;
  const totalPrice = Math.round(basePriceNum * variantMultiplier * travelersCount);

  // Itemized fee split
  const embassyFee = Math.round(totalPrice * 0.7);
  const serviceFee = Math.round(totalPrice * 0.2);
  const gstTax = totalPrice - embassyFee - serviceFee;

  const handleSubmitApplication = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) {
      alert('Please fill out all mandatory applicant details AND upload all required documents before proceeding to payment.');
      return;
    }
    const generatedRef = 'PV-' + Math.floor(100000 + Math.random() * 900000);
    setBookingRefId(generatedRef);
    setIsSubmitted(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="apply-visa-page-wrapper bg-gray-light min-h-screen">
      {/* Top Banner / Breadcrumbs */}
      <section className="apply-page-hero">
        <div className="apply-hero-container">
          <div className="apply-breadcrumb-bar">
            <button className="back-link-btn" onClick={onBackToVisaDetail}>
              <HiArrowLeft size={16} />
              <span>Back to Details</span>
            </button>
            <div className="breadcrumb-paths">
              <span onClick={onNavigateHome} className="bc-link">Home</span>
              <HiChevronRight size={12} className="bc-sep" />
              <span onClick={onNavigateVisas} className="bc-link">Visas</span>
              <HiChevronRight size={12} className="bc-sep" />
              <span onClick={onBackToVisaDetail} className="bc-link">{visa.country}</span>
              <HiChevronRight size={12} className="bc-sep" />
              <span className="bc-current">Application & Checkout</span>
            </div>
          </div>

          <div className="apply-hero-header">
            <div className="apply-country-flag-box">
              <img
                src={`https://flagcdn.com/w80/${visa.flagCode === 'eu' ? 'eu' : visa.flagCode}.png`}
                alt={visa.country}
                className="apply-flag-img"
              />
              <span className="apply-step-tag">
                {travelersCount} Person{travelersCount > 1 ? 's' : ''} • Document Upload & Checkout
              </span>
            </div>
            <h1 className="apply-page-title">{visa.country} Visa Application Form</h1>
            <p className="apply-page-subtitle">
              Upload passport & documents for <strong>{travelersCount} Person{travelersCount > 1 ? 's' : ''}</strong> for <strong>{visa.country}</strong>.
            </p>
          </div>
        </div>
      </section>

      {/* Main Content Form Area */}
      <section className="section-padding">
        <div className="apply-page-content-container">
          {isSubmitted ? (
            /* SUCCESS CONFIRMATION VIEW */
            <div className="apply-success-card">
              <div className="success-checkmark-big"><HiCheckCircle size={56} /></div>
              <h2 className="success-title">Payment Successful & {travelersCount} Visa Application{travelersCount > 1 ? 's' : ''} Initiated!</h2>
              <p className="success-subtitle">
                Booking Reference ID: <strong className="ref-badge">{bookingRefId}</strong>
              </p>

              <div className="success-info-box">
                <div className="info-row">
                  <span>Total Applicants:</span>
                  <strong>{travelersCount} Person{travelersCount > 1 ? 's' : ''}</strong>
                </div>
                {applicants.map((app, i) => (
                  <div key={i} className="info-row" style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.4rem' }}>
                    <span>Person {i + 1}:</span>
                    <strong>{app.name} ({app.passportNumber.toUpperCase()})</strong>
                  </div>
                ))}
                <div className="info-row" style={{ paddingTop: '0.4rem' }}>
                  <span>Uploaded Documents:</span>
                  <strong><HiDocumentCheck className="inline-icon green" /> {Object.keys(uploadedFiles).length} Files Verification Received</strong>
                </div>
                <div className="info-row">
                  <span>Country & Category:</span>
                  <strong>{visa.country} ({selectedVariant.toUpperCase()} Visa)</strong>
                </div>
                <div className="info-row">
                  <span>Travel Date:</span>
                  <strong>{travelDate || 'Not specified'}</strong>
                </div>
                <div className="info-row">
                  <span>Total Amount Paid:</span>
                  <strong className="total-highlight">₹{totalPrice.toLocaleString('en-IN')}</strong>
                </div>
              </div>

              <div className="whatsapp-notice-card">
                <HiChatBubbleLeftRight size={28} className="wa-icon" />
                <div>
                  <strong>WhatsApp Status Notification Sent!</strong>
                  <p>Order confirmation and uploaded documents for all {travelersCount} applicant{travelersCount > 1 ? 's' : ''} sent to <strong>{applicantPhone}</strong>. Our senior visa manager will review documents within 15 minutes.</p>
                </div>
              </div>

              <div className="success-actions-row">
                <button className="done-close-btn" onClick={onNavigateHome}>
                  Return to Home
                </button>
                <button className="back-link-btn" style={{ background: '#0f172a', border: 'none', color: '#fff' }} onClick={onNavigateVisas}>
                  Browse Other Visas
                </button>
              </div>
            </div>
          ) : (
            /* FORM & CHECKOUT LAYOUT */
            <form onSubmit={handleSubmitApplication} className="apply-form-layout-grid">
              {/* Left Column: Applicant Cards + Add Documents Card */}
              <div className="apply-form-left-col">
                {/* Form Validation Alert */}
                {!isFormValid && (
                  <div className="form-validation-alert">
                    <span>⚠️ Please fill out all required applicant details AND upload all mandatory documents (* Passport, Photo) to enable the payment button.</span>
                  </div>
                )}

                {/* Dynamic Applicant Form Cards: Person 1, Person 2, Person 3... */}
                {applicants.map((app, idx) => (
                  <div key={app.id || idx} className="apply-form-section-card">
                    <div className="applicant-card-header">
                      <h3 className="form-card-title">
                        <HiUser size={20} className="title-icon green" />
                        Person {idx + 1} Details {idx === 0 ? '(Primary Traveler)' : `(Applicant ${idx + 1})`}
                      </h3>
                      {idx > 0 && (
                        <button
                          type="button"
                          className="remove-applicant-btn"
                          onClick={() => handleRemoveApplicant(idx)}
                          title="Remove Person"
                        >
                          <HiTrash size={16} />
                          <span>Remove Person {idx + 1}</span>
                        </button>
                      )}
                    </div>

                    <div className="form-grid-2col">
                      <div className="form-input-block">
                        <label>Person {idx + 1} Full Name (as per Passport) *</label>
                        <input
                          type="text"
                          required
                          placeholder={idx === 0 ? 'e.g. Piyush Sharma' : `e.g. Person ${idx + 1} Name`}
                          value={app.name}
                          onChange={(e) => updateApplicantField(idx, 'name', e.target.value)}
                        />
                      </div>

                      <div className="form-input-block">
                        <label>Gender *</label>
                        <select
                          value={app.gender}
                          onChange={(e) => updateApplicantField(idx, 'gender', e.target.value)}
                          className="form-select-input"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-grid-3col">
                      <div className="form-input-block">
                        <label>Date of Birth *</label>
                        <input
                          type="date"
                          required
                          value={app.dob}
                          onChange={(e) => updateApplicantField(idx, 'dob', e.target.value)}
                        />
                      </div>

                      <div className="form-input-block">
                        <label>Passport Number *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Z1234567"
                          style={{ textTransform: 'uppercase' }}
                          value={app.passportNumber}
                          onChange={(e) => updateApplicantField(idx, 'passportNumber', e.target.value)}
                        />
                      </div>

                      <div className="form-input-block">
                        <label>Passport Expiry Date *</label>
                        <input
                          type="date"
                          required
                          value={app.passportExpiry}
                          onChange={(e) => updateApplicantField(idx, 'passportExpiry', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                {/* Add Another Person Button */}
                <button
                  type="button"
                  className="add-applicant-dashed-btn"
                  onClick={handleAddApplicant}
                >
                  <HiUserPlus size={20} />
                  <span>+ Add Person {travelersCount + 1} (Another Traveler)</span>
                </button>

                {/* Contact & Travel Information Section */}
                <div className="apply-form-section-card">
                  <h3 className="form-card-title">
                    <HiPhone size={20} className="title-icon purple" />
                    Contact & Travel Information
                  </h3>

                  <div className="form-grid-2col">
                    <div className="form-input-block">
                      <label>WhatsApp Phone Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="e.g. 9876543210"
                        value={applicantPhone}
                        onChange={(e) => setApplicantPhone(e.target.value)}
                      />
                    </div>

                    <div className="form-input-block">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="e.g. piyush@example.com"
                        value={applicantEmail}
                        onChange={(e) => setApplicantEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="form-grid-2col">
                    <div className="form-input-block">
                      <label>Intended Date of Travel *</label>
                      <input
                        type="date"
                        required
                        value={travelDate}
                        onChange={(e) => setTravelDate(e.target.value)}
                      />
                    </div>

                    <div className="form-input-block">
                      <label>Processing Speed & Category</label>
                      <select
                        value={selectedVariant}
                        onChange={(e) => setSelectedVariant(e.target.value)}
                        className="form-select-input"
                      >
                        <option value="tourist">Tourist Visa (Standard)</option>
                        <option value="express">Express eVisa (⚡ 24 Hours)</option>
                        <option value="business">Business Visa (1 Year)</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 4: ADD DOCUMENTS / UPLOAD REQUIRED DOCUMENTS */}
                <div className="apply-form-section-card">
                  <div className="applicant-card-header">
                    <h3 className="form-card-title">
                      <HiDocumentArrowUp size={20} className="title-icon green" />
                      Add Documents (Mandatory Document Checklist) *
                    </h3>
                    <span className="doc-count-badge">
                      {Object.keys(uploadedFiles).length} / {requiredDocs.filter((d) => d.isRequired).length} Mandatory Uploaded
                    </span>
                  </div>
                  <p className="doc-section-help-text" style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                    Please upload clear photos or scans of all mandatory documents below. You cannot proceed to payment without uploading these documents.
                  </p>

                  <div className="docs-upload-list">
                    {requiredDocs.map((doc) => {
                      const isUploaded = Boolean(uploadedFiles[doc.id]);
                      const currentFile = uploadedFiles[doc.id];
                      return (
                        <div key={doc.id} className={`doc-upload-item-card ${isUploaded ? 'uploaded' : ''}`}>
                          <div className="doc-item-left">
                            <div className="doc-header-row">
                              <strong className="doc-title-text">{doc.title}</strong>
                              {doc.isRequired ? (
                                <span className="req-pill mandatory">* Mandatory</span>
                              ) : (
                                <span className="req-pill optional">Optional</span>
                              )}
                            </div>
                            <p className="doc-desc-text">{doc.description}</p>
                          </div>

                          <div className="doc-item-right">
                            {isUploaded && currentFile ? (
                              <div className="file-uploaded-status-badge">
                                <HiCheckCircle size={18} className="check-icon" />
                                <div className="uploaded-file-details">
                                  <span className="file-name-truncated" title={currentFile.name}>
                                    {currentFile.name}
                                  </span>
                                  <span className="file-size">
                                    ({(currentFile.size / 1024).toFixed(0)} KB)
                                  </span>
                                </div>
                                <button
                                  type="button"
                                  className="remove-file-btn"
                                  onClick={() => handleRemoveFile(doc.id)}
                                  title="Remove uploaded file"
                                >
                                  <HiXMark size={16} />
                                </button>
                              </div>
                            ) : (
                              <label className="upload-file-label-btn">
                                <HiArrowUpTray size={16} />
                                <span>Upload File</span>
                                <input
                                  type="file"
                                  accept="image/*,application/pdf"
                                  className="hidden-file-input"
                                  onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                      handleFileUpload(doc.id, e.target.files[0]);
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column: Sticky Summary & Payment Gateway Sidebar */}
              <div className="apply-form-right-sidebar">
                <div className="sticky-apply-sidebar-card">
                  {/* Country Header Pill */}
                  <div className="sidebar-country-header">
                    <img
                      src={`https://flagcdn.com/w40/${visa.flagCode === 'eu' ? 'eu' : visa.flagCode}.png`}
                      alt={visa.country}
                      className="mini-country-flag"
                    />
                    <div>
                      <h4 className="mini-country-title">{visa.country} Visa</h4>
                      <span className="mini-country-sub">{visa.visaCategory}</span>
                    </div>
                  </div>

                  {/* Travelers Counter */}
                  <div className="sidebar-traveler-counter-block">
                    <label className="sidebar-label">Number of Visas / Applicants</label>
                    <div className="traveler-counter-row">
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={() => handleRemoveApplicant()}
                        disabled={travelersCount <= 1}
                      >
                        −
                      </button>
                      <span className="traveler-num-display">{travelersCount} Person{travelersCount > 1 ? 's' : ''}</span>
                      <button
                        type="button"
                        className="counter-btn"
                        onClick={handleAddApplicant}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Document Upload Progress Meter */}
                  <div className="doc-upload-progress-meter">
                    <div className="meter-label-row">
                      <span>Document Upload Status:</span>
                      <strong>{Object.keys(uploadedFiles).length} / {requiredDocs.filter((d) => d.isRequired).length} Ready</strong>
                    </div>
                    <div className="meter-bar-track">
                      <div
                        className="meter-bar-fill"
                        style={{
                          width: `${Math.min(
                            100,
                            Math.round((Object.keys(uploadedFiles).length / requiredDocs.filter((d) => d.isRequired).length) * 100)
                          )}%`,
                        }}
                      ></div>
                    </div>
                  </div>

                  {/* Itemized Price Breakdown */}
                  <div className="itemized-price-card">
                    <h4 className="summary-title">Itemized Fee Breakdown</h4>
                    <div className="price-item-row">
                      <span>Embassy Govt Fee ({travelersCount} Person{travelersCount > 1 ? 's' : ''})</span>
                      <span>₹{embassyFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-item-row">
                      <span>Pehla Visa Expert Review</span>
                      <span>₹{serviceFee.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-item-row">
                      <span>GST & Taxes (18%)</span>
                      <span>₹{gstTax.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="price-divider"></div>
                    <div className="price-total-row">
                      <span>Total Amount Payable</span>
                      <span className="total-highlight">₹{totalPrice.toLocaleString('en-IN')}</span>
                    </div>
                  </div>

                  {/* Payment Gateway Modes */}
                  <div className="payment-options-card">
                    <h4 className="summary-title">
                      <HiCreditCard size={16} /> Select Payment Option
                    </h4>
                    <div className="payment-modes-list">
                      <button
                        type="button"
                        className={`payment-mode-btn ${paymentMethod === 'upi' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('upi')}
                      >
                        <FaGooglePay size={24} className="pay-mode-icon green" />
                        <div className="pay-mode-text">
                          <strong>UPI / QR Code</strong>
                          <span>GPay, PhonePe, Paytm, BHIM</span>
                        </div>
                        <span className="pay-radio"></span>
                      </button>

                      <button
                        type="button"
                        className={`payment-mode-btn ${paymentMethod === 'card' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('card')}
                      >
                        <HiCreditCard size={20} className="pay-mode-icon blue" />
                        <div className="pay-mode-text">
                          <strong>Credit / Debit Card</strong>
                          <span>Visa, Mastercard, RuPay</span>
                        </div>
                        <span className="pay-radio"></span>
                      </button>

                      <button
                        type="button"
                        className={`payment-mode-btn ${paymentMethod === 'netbanking' ? 'active' : ''}`}
                        onClick={() => setPaymentMethod('netbanking')}
                      >
                        <HiBuildingLibrary size={20} className="pay-mode-icon purple" />
                        <div className="pay-mode-text">
                          <strong>Net Banking</strong>
                          <span>All Major Indian Banks</span>
                        </div>
                        <span className="pay-radio"></span>
                      </button>
                    </div>
                  </div>

                  {/* Pay Now CTA - Non-Green / Muted Gray until all fields AND documents are uploaded */}
                  <button
                    type="submit"
                    disabled={!isFormValid}
                    className={`pay-now-primary-btn ${isFormValid ? 'enabled-green' : 'disabled-gray'}`}
                  >
                    <HiLockClosed size={18} />
                    <span>
                      {isFormValid
                        ? `Pay ₹${totalPrice.toLocaleString('en-IN')} & Submit`
                        : `Upload Documents to Pay ₹${totalPrice.toLocaleString('en-IN')}`}
                    </span>
                    <HiSparkles size={18} />
                  </button>

                  {/* Contact Support Button below Pay Now button */}
                  <button
                    type="button"
                    className="contact-support-btn"
                    onClick={() => setIsSupportModalOpen(true)}
                  >
                    <HiPhone size={16} />
                    <span>Need Help? Contact Support</span>
                  </button>

                  <div className="trust-bullets-list" style={{ marginTop: '0.5rem' }}>
                    <div className="trust-item">
                      <HiShieldCheck size={16} className="trust-icon" />
                      <span>100% Refund Guarantee on Rejection</span>
                    </div>
                    <div className="trust-item">
                      <HiClock size={16} className="trust-icon" />
                      <span>Guaranteed Turnaround ({visa.processingTime})</span>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          )}
        </div>
      </section>

      {/* SUPPORT MODAL POPUP */}
      {isSupportModalOpen && (
        <div className="modal-backdrop-overlay">
          <div className="modal-content-card text-center">
            <button className="modal-close-btn" onClick={() => setIsSupportModalOpen(false)}>
              <HiXMark size={20} />
            </button>

            <div className="modal-header-box">
              <div className="login-modal-icon-badge"><HiPhone /></div>
              <h3 className="modal-title">Pehla Visa Support</h3>
              <p className="modal-desc">
                Have questions about document uploads for {travelersCount} applicant{travelersCount > 1 ? 's' : ''} for {visa.country}? Our visa managers are online.
              </p>
            </div>

            <div className="support-contact-list">
              <a href="tel:+919876543210" className="support-card-btn phone">
                <HiPhone size={20} />
                <div>
                  <strong>Call Visa Helpline</strong>
                  <span>+91 98765 43210 (Toll Free 24/7)</span>
                </div>
              </a>

              <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="support-card-btn whatsapp">
                <HiChatBubbleLeftRight size={20} />
                <div>
                  <strong>WhatsApp Support</strong>
                  <span>Instant Chat with Visa Manager</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
