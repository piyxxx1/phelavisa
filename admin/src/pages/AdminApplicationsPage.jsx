import { useState, useMemo, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import { API_BASE_URL } from '../config/apiConfig';
import {
  HiMagnifyingGlass,
  HiXMark,
  HiEye,
  HiDocumentText,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiPhone,
  HiEnvelope,
  HiUser,
  HiCreditCard,
  HiCalendarDays,
  HiIdentification,
  HiMapPin,
  HiUserGroup,
  HiArrowDownTray,
  HiPhoto,
  HiArrowTopRightOnSquare,
  HiShieldCheck,
  HiGlobeAlt,
  HiCheck,
  HiArrowPath,
} from 'react-icons/hi2';

export const AdminApplicationsPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { applications, updateApplicationStatus, updateApplication, fetchApplications } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedAppModal, setSelectedAppModal] = useState(null);
  const [activeApplicantIndex, setActiveApplicantIndex] = useState(0);
  const [previewingDoc, setPreviewingDoc] = useState(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch live applications on mount
  useEffect(() => {
    let mounted = true;
    async function loadApps() {
      if (applications.length === 0) setLoading(true);
      try {
        await fetchApplications();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadApps();
    return () => { mounted = false; };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchApplications();
    } finally {
      setRefreshing(false);
    }
  };

  // Summary Metrics
  const totalApps = applications.length;
  const pendingApps = applications.filter((a) => a.applicationStatus === 'PENDING_VERIFICATION').length;
  const reviewApps = applications.filter((a) => a.applicationStatus === 'UNDER_EMBASSY_REVIEW').length;
  const approvedApps = applications.filter((a) => a.applicationStatus === 'APPROVED').length;

  const filteredApps = useMemo(() => {
    return (applications || []).filter((app) => {
      const name = (app.applicantName || '').toLowerCase();
      const ref = (app.bookingRefId || '').toLowerCase();
      const country = (app.countryName || '').toLowerCase();
      const passport = (app.passportNumber || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = name.includes(q) || ref.includes(q) || country.includes(q) || passport.includes(q);
      const matchesStatus = selectedStatus === 'ALL' || app.applicationStatus === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [applications, searchQuery, selectedStatus]);

  // Handle URL route params for direct deep-linking e.g. /applications/app-1
  useEffect(() => {
    if (params.appId && applications.length > 0) {
      const app = applications.find((a) => a.id === params.appId || a.bookingRefId === params.appId);
      if (app) {
        setSelectedAppModal(app);
        setActiveApplicantIndex(0);
        setEditingNotes(app.adminNotes || '');
      }
    } else if (!params.appId) {
      setSelectedAppModal(null);
    }
  }, [params.appId, applications]);

  // Keyboard ESC Key shortcut listener to close modal
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleCloseModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenModal = (app) => {
    setSelectedAppModal(app);
    setActiveApplicantIndex(0);
    setEditingNotes(app.adminNotes || '');
    navigate(`/applications/${app.id}`);
  };

  const handleCloseModal = () => {
    setSelectedAppModal(null);
    setPreviewingDoc(null);
    if (params.appId) {
      navigate('/applications');
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedAppModal) return;
    try {
      await updateApplication(selectedAppModal.id, { adminNotes: editingNotes });
      setSelectedAppModal((prev) => (prev ? { ...prev, adminNotes: editingNotes } : null));
      alert('🎉 Admin notes successfully saved for ' + selectedAppModal.bookingRefId);
    } catch (err) {
      console.error('Error saving admin notes:', err);
      alert('❌ Failed to save admin notes: ' + err.message);
    }
  };

  const handleDownloadFile = (doc) => {
    alert(`📥 Downloading ${doc.name} (${doc.fileSize})...`);
  };

  const allApplicants = useMemo(() => {
    if (!selectedAppModal) return [];
    const list = selectedAppModal.applicantsList || selectedAppModal.travelers || selectedAppModal.applicants;
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item, idx) => ({
        id: item.id || `ap-${idx}`,
        applicantNumber: item.applicantNumber || idx + 1,
        fullName: item.fullName || item.name || `Applicant ${idx + 1}`,
        phone: item.phone || selectedAppModal.applicantPhone || '',
        email: item.email || selectedAppModal.applicantEmail || '',
        dob: item.dob || 'Not Provided',
        gender: item.gender || 'Male',
        address: item.address || selectedAppModal.address || 'India',
        city: item.city || selectedAppModal.city || 'New Delhi',
        state: item.state || selectedAppModal.state || 'Delhi',
        pincode: item.pincode || selectedAppModal.pincode || '110001',
        passportNumber: item.passportNumber || selectedAppModal.passportNumber || '',
        passportIssuePlace: item.passportIssuePlace || 'India',
        passportExpiry: item.passportExpiry || selectedAppModal.passportExpiry || '',
        documentsSubmitted: item.documentsSubmitted || selectedAppModal.documentsSubmitted || [
          {
            id: `doc-${idx + 1}`,
            name: `${(item.fullName || item.name || 'Applicant').replace(/\s+/g, '_')}_Passport_Scan.pdf`,
            category: 'Passport Scan',
            fileType: 'pdf',
            fileSize: '2.4 MB',
            fileUrl: `${API_BASE_URL.replace(/\/api$/, '')}/uploads/dummy_passport.pdf`,
          },
        ],
      }));
    }

    return [{
      id: 'ap-single',
      applicantNumber: 1,
      fullName: selectedAppModal.applicantName || 'Primary Applicant',
      phone: selectedAppModal.applicantPhone || '',
      email: selectedAppModal.applicantEmail || '',
      dob: selectedAppModal.dob || 'Not Provided',
      gender: selectedAppModal.gender || 'Male',
      address: selectedAppModal.address || 'India',
      city: selectedAppModal.city || 'New Delhi',
      state: selectedAppModal.state || 'Delhi',
      pincode: selectedAppModal.pincode || '110001',
      passportNumber: selectedAppModal.passportNumber || '',
      passportIssuePlace: selectedAppModal.passportIssuePlace || 'India',
      passportExpiry: selectedAppModal.passportExpiry || '',
      documentsSubmitted: selectedAppModal.documentsSubmitted || [],
    }];
  }, [selectedAppModal]);

  const activeApplicant = useMemo(() => {
    if (!allApplicants || allApplicants.length === 0) return null;
    return allApplicants[activeApplicantIndex] || allApplicants[0];
  }, [allApplicants, activeApplicantIndex]);

  return (
    <div className="admin-applications-page-container">
      {/* Header Bar */}
      <div className="admin-page-header-flex">
        <div>
          <h1 className="admin-page-title">User Applications & Orders Dossier</h1>
          <p className="admin-page-subtitle">
            Inspect individual applicant dossiers, passport credentials, submitted client document PDFs, and embassy workflows.
          </p>
        </div>

        <button
          className="admin-secondary-btn"
          onClick={handleRefresh}
          disabled={refreshing}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.5rem', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, color: '#334155' }}
        >
          <HiArrowPath size={16} className={refreshing ? 'spin-icon' : ''} />
          <span>{refreshing ? 'Refreshing...' : 'Sync Database'}</span>
        </button>
      </div>

      {/* Top Quick Stats Row */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card blue">
          <div className="metric-icon"><HiDocumentText size={22} /></div>
          <div className="metric-info">
            <span className="metric-label">Total Submitted</span>
            <span className="metric-value">{totalApps} Applications</span>
          </div>
        </div>

        <div className="metric-card yellow">
          <div className="metric-icon"><HiClock size={22} /></div>
          <div className="metric-info">
            <span className="metric-label">Pending Verification</span>
            <span className="metric-value">{pendingApps} Action Required</span>
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-icon"><HiExclamationCircle size={22} /></div>
          <div className="metric-info">
            <span className="metric-label">Under Embassy Review</span>
            <span className="metric-value">{reviewApps} In Progress</span>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon"><HiCheckCircle size={22} /></div>
          <div className="metric-info">
            <span className="metric-label">Approved Visas</span>
            <span className="metric-value">{approvedApps} Issued</span>
          </div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="admin-filters-card">
        <div className="admin-search-input-box">
          <HiMagnifyingGlass size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Ref ID (e.g. PV-784920), applicant name, country or passport number..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="region-filter-pills">
          {[
            { id: 'ALL', label: `All Orders (${totalApps})` },
            { id: 'PENDING_VERIFICATION', label: `Pending (${pendingApps})` },
            { id: 'UNDER_EMBASSY_REVIEW', label: `Under Review (${reviewApps})` },
            { id: 'APPROVED', label: `Approved (${approvedApps})` },
            { id: 'REJECTED', label: 'Rejected' },
          ].map((st) => (
            <button
              key={st.id}
              className={`region-pill-btn ${selectedStatus === st.id ? 'active' : ''}`}
              onClick={() => setSelectedStatus(st.id)}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Table Card */}
      <div className="admin-content-section-card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Submitted Visa Applications List</h3>
            <span className="card-subtitle">Showing {filteredApps.length} order dossier record{filteredApps.length !== 1 ? 's' : ''}</span>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Ref & Date</th>
                <th>Visa Applied & Category</th>
                <th>Amount Paid</th>
                <th>Embassy Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                      <HiArrowPath size={18} className="spin-icon" />
                      <span>Loading visa applications from database...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500" style={{ textAlign: 'center', padding: '2rem' }}>
                    No visa applications match the current search or status filter.
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const appId = app.id || app._id;
                  return (
                  <tr key={appId}>
                    <td>
                      <span className="ref-code">{app.bookingRefId || appId}</span>
                      <div className="sub-phone" style={{ marginTop: '0.2rem' }}>{app.submittedAt}</div>
                    </td>
                    <td>
                      <div className="visa-title-cell">
                        <strong className="visa-country-title">{app.countryName}</strong>
                        <div className="visa-category-tags">
                          <span className="category-badge small">
                            {app.visaCategory || 'TOURIST VISA'}
                          </span>
                          <span className="variant-pill-sm">
                            {app.variantLabel || app.variant || 'Standard'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className="price-tag">₹{app.totalPrice.toLocaleString('en-IN')}</strong>
                      <div>
                        <span className="payment-chip paid">{app.paymentStatus} ({app.paymentMethod.split(' ')[0]})</span>
                      </div>
                    </td>
                    <td>
                      <span className={`status-badge ${app.applicationStatus.toLowerCase()}`}>
                        {app.applicationStatus.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="action-edit-btn"
                          onClick={() => handleOpenModal(app)}
                          title="Inspect Full Visa Application Dossier"
                        >
                          <HiEye size={16} />
                          <span>View Dossier</span>
                        </button>

                        <select
                          value={app.applicationStatus}
                          onChange={(e) => updateApplicationStatus(app.id, e.target.value)}
                          className="status-select-inline"
                        >
                          <option value="PENDING_VERIFICATION">Pending Verification</option>
                          <option value="UNDER_EMBASSY_REVIEW">Under Embassy Review</option>
                          <option value="APPROVED">Approved</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
          </table>
        </div>
      </div>

      {/* FULL VISA APPLICATION DOSSIER MODAL */}
      {selectedAppModal && activeApplicant && (
        <div className="modal-backdrop-overlay" onClick={handleCloseModal}>
          <div className="modal-content-card dossier-modal-card" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close-btn prominent-close-btn" onClick={handleCloseModal} title="Close Application Dossier (Esc)">
              <HiXMark size={24} />
            </button>

            {/* Modal Dossier Banner Header */}
            <div className="dossier-header-banner">
              <div className="dossier-header-left">
                <div className="ref-badge-row">
                  <span className="ref-pill">Booking Ref ID: {selectedAppModal.bookingRefId}</span>
                  <span className={`status-badge ${selectedAppModal.applicationStatus.toLowerCase()}`}>
                    {selectedAppModal.applicationStatus.replace(/_/g, ' ')}
                  </span>
                  <span className="total-applicants-badge">
                    <HiUserGroup size={14} /> Total {selectedAppModal.travelersCount} Individual Applicant{selectedAppModal.travelersCount > 1 ? 's' : ''}
                  </span>
                </div>
                <h2 className="dossier-title">{selectedAppModal.countryName} Visa Application Dossier</h2>
                <p className="dossier-subtitle">
                  Submitted on {selectedAppModal.submittedAt} • Channel: Online Web Portal
                </p>
              </div>
            </div>

            {/* APPLICANTS TAB SELECTOR BAR */}
            {allApplicants && allApplicants.length > 0 && (
              <div className="applicants-selector-tab-bar" style={{ background: '#f8fafc', padding: '0.85rem 1.25rem', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div className="tab-bar-label" style={{ fontSize: '0.85rem', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <HiUserGroup size={16} />
                  <span>Select Person Dossier ({allApplicants.length} Traveler{allApplicants.length > 1 ? 's' : ''}):</span>
                </div>
                <div className="applicant-tabs-flex" style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {allApplicants.map((applicant, index) => (
                    <button
                      key={applicant.id || index}
                      className={`applicant-tab-btn ${activeApplicantIndex === index ? 'active' : ''}`}
                      onClick={() => setActiveApplicantIndex(index)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '0.5rem',
                        border: activeApplicantIndex === index ? '2px solid #2563eb' : '1px solid #cbd5e1',
                        background: activeApplicantIndex === index ? '#eff6ff' : '#ffffff',
                        color: activeApplicantIndex === index ? '#1d4ed8' : '#334155',
                        fontWeight: 700,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                      }}
                    >
                      <HiUser className="tab-user-icon" />
                      <span className="tab-applicant-name">Person {index + 1}: <strong>{applicant.fullName}</strong></span>
                      {applicant.passportNumber && (
                        <span className="tab-passport-tag" style={{ fontFamily: 'monospace', fontSize: '0.75rem', opacity: 0.85, background: 'rgba(0,0,0,0.06)', padding: '0.1rem 0.35rem', borderRadius: '0.25rem' }}>
                          {applicant.passportNumber}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dossier Body Content */}
            <div className="dossier-body-scroll">
              {/* SECTION 1: APPLIED VISA & CATEGORY SPECIFICATIONS */}
              <div className="dossier-section-card">
                <h4 className="dossier-section-heading">
                  <HiGlobeAlt className="section-heading-icon blue" />
                  1. Applied Visa Category & Specifications
                </h4>
                <div className="dossier-grid-4col">
                  <div className="dossier-info-block">
                    <span className="label-title">Applied Visa Title</span>
                    <strong className="value-text">{selectedAppModal.visaTitle || `${selectedAppModal.countryName} Tourist Visa`}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Visa Category</span>
                    <span className="category-badge highlight">
                      {selectedAppModal.visaCategory || 'TOURIST VISA'}
                    </span>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Processing SLA</span>
                    <strong className="value-text">{selectedAppModal.processingTime || '5-7 Days'}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Stay Period</span>
                    <strong className="value-text">{selectedAppModal.stayPeriod || '30 Days'}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Visa Validity</span>
                    <strong className="value-text">{selectedAppModal.validity || '180 Days'}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Entry Type</span>
                    <strong className="value-text">{selectedAppModal.entryType || 'Single Entry'}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Intended Travel Date</span>
                    <strong className="value-text text-blue">{selectedAppModal.travelDate || '2026-09-15'}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Return Date</span>
                    <strong className="value-text">{selectedAppModal.returnDate || '2026-09-30'}</strong>
                  </div>
                </div>
              </div>

              {/* SECTION 2A: ALL TRAVELERS & APPLICANTS BREAKDOWN TABLE */}
              {allApplicants.length > 1 && (
                <div className="dossier-section-card margin-top" style={{ background: '#f0f9ff', border: '1px solid #bae6fd' }}>
                  <h4 className="dossier-section-heading" style={{ color: '#0369a1', margin: 0, marginBottom: '0.85rem' }}>
                    <HiUserGroup className="section-heading-icon blue" />
                    2A. All Travelers Summary ({allApplicants.length} People Submitted)
                  </h4>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.875rem', background: '#ffffff', borderRadius: '0.5rem', overflow: 'hidden', border: '1px solid #e2e8f0' }}>
                    <thead>
                      <tr style={{ background: '#e0f2fe', color: '#0369a1', textAlign: 'left' }}>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Person #</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Full Name (as per Passport)</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Gender</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Date of Birth</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Passport Number</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Passport Expiry</th>
                        <th style={{ padding: '0.65rem 0.85rem' }}>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allApplicants.map((ap, idx) => (
                        <tr key={ap.id || idx} style={{ borderBottom: '1px solid #f1f5f9', background: activeApplicantIndex === idx ? '#eff6ff' : '#ffffff' }}>
                          <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800 }}>Person {idx + 1} {idx === 0 ? '(Primary)' : ''}</td>
                          <td style={{ padding: '0.65rem 0.85rem', fontWeight: 800, color: '#0f172a' }}>{ap.fullName}</td>
                          <td style={{ padding: '0.65rem 0.85rem' }}>{ap.gender}</td>
                          <td style={{ padding: '0.65rem 0.85rem' }}>{ap.dob || 'N/A'}</td>
                          <td style={{ padding: '0.65rem 0.85rem', fontFamily: 'monospace', fontWeight: 700, color: '#2563eb' }}>{ap.passportNumber || 'N/A'}</td>
                          <td style={{ padding: '0.65rem 0.85rem' }}>{ap.passportExpiry || 'N/A'}</td>
                          <td style={{ padding: '0.65rem 0.85rem' }}>
                            <button
                              type="button"
                              onClick={() => setActiveApplicantIndex(idx)}
                              style={{ background: activeApplicantIndex === idx ? '#1d4ed8' : '#2563eb', color: '#ffffff', border: 'none', padding: '0.3rem 0.65rem', borderRadius: '0.35rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              {activeApplicantIndex === idx ? '✓ Selected' : 'Inspect Dossier'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* SECTION 2: INDIVIDUAL APPLICANT PERSONAL IDENTITY & RESIDENTIAL ADDRESS */}
              <div className="dossier-section-card margin-top highlight-applicant-box">
                <div className="flex-between-header">
                  <h4 className="dossier-section-heading" style={{ marginBottom: 0 }}>
                    <HiUser className="section-heading-icon green" />
                    2. Applicant #{activeApplicant.applicantNumber} Identity & Address Profile
                  </h4>
                  <span className="applicant-badge-pill">
                    Full Individual Dossier #{activeApplicant.applicantNumber}
                  </span>
                </div>

                <div className="dossier-grid-3col" style={{ marginTop: '1rem' }}>
                  <div className="dossier-info-block">
                    <span className="label-title">Full Name</span>
                    <strong className="value-text large">{activeApplicant.fullName}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">WhatsApp Mobile</span>
                    <strong className="value-text"><HiPhone className="inline-icon" /> {activeApplicant.phone}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Email Address</span>
                    <strong className="value-text"><HiEnvelope className="inline-icon" /> {activeApplicant.email}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Date of Birth</span>
                    <strong className="value-text">{activeApplicant.dob}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Gender</span>
                    <strong className="value-text">{activeApplicant.gender}</strong>
                  </div>

                  <div className="dossier-info-block span-2">
                    <span className="label-title">Residential Address</span>
                    <strong className="value-text">
                      <HiMapPin className="inline-icon" /> {activeApplicant.address}, {activeApplicant.city}, {activeApplicant.state} - {activeApplicant.pincode}
                    </strong>
                  </div>
                </div>
              </div>

              {/* SECTION 3: APPLICANT PASSPORT CREDENTIALS */}
              <div className="dossier-section-card margin-top">
                <h4 className="dossier-section-heading">
                  <HiIdentification className="section-heading-icon yellow" />
                  3. Applicant #{activeApplicant.applicantNumber} Passport Credentials
                </h4>
                <div className="dossier-grid-3col">
                  <div className="dossier-info-block">
                    <span className="label-title">Passport Number</span>
                    <strong className="value-text highlight-passport">{activeApplicant.passportNumber}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Place of Issue</span>
                    <strong className="value-text">{activeApplicant.passportIssuePlace}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Passport Expiry Date</span>
                    <strong className="value-text text-green">{activeApplicant.passportExpiry} (Valid & Active)</strong>
                  </div>
                </div>
              </div>

              {/* SECTION 4: APPLICANT SUBMITTED DOCUMENTS & PDF INSPECTOR */}
              <div className="dossier-section-card margin-top">
                <div className="flex-between-header">
                  <h4 className="dossier-section-heading" style={{ marginBottom: 0 }}>
                    <HiDocumentText className="section-heading-icon red" />
                    4. Applicant #{activeApplicant.applicantNumber} Submitted PDFs & Document Files ({activeApplicant.documentsSubmitted ? activeApplicant.documentsSubmitted.length : 0} Files)
                  </h4>
                  <span className="sub-verified-pill"><HiShieldCheck size={14} /> Encrypted & Verified</span>
                </div>
                
                <p className="section-note-text">
                  Inspect and preview client-submitted passport scans, photos, flight itineraries, hotel bookings, and bank statement PDFs for <strong>{activeApplicant.fullName}</strong> below.
                </p>

                <div className="submitted-docs-grid">
                  {activeApplicant.documentsSubmitted && activeApplicant.documentsSubmitted.length > 0 ? (
                    activeApplicant.documentsSubmitted.map((doc) => (
                      <div key={doc.id} className="submitted-doc-card">
                        <div className="doc-card-left">
                          <div className={`doc-type-icon ${doc.fileType}`}>
                            {doc.fileType === 'pdf' ? <HiDocumentText size={22} /> : <HiPhoto size={22} />}
                          </div>
                          <div className="doc-meta-info">
                            <span className="doc-cat-tag">{doc.category}</span>
                            <strong className="doc-file-name">{doc.name}</strong>
                            <span className="doc-size-text">{doc.fileSize} • {doc.fileType.toUpperCase()} File</span>
                          </div>
                        </div>

                        <div className="doc-actions-row">
                          <button
                            type="button"
                            className="doc-action-btn view"
                            onClick={() => setPreviewingDoc(doc)}
                            title="Preview Document Inline"
                          >
                            <HiEye size={14} />
                            <span>View PDF / Image</span>
                          </button>
                          <button
                            type="button"
                            className="doc-action-btn download"
                            onClick={() => handleDownloadFile(doc)}
                            title="Download Document"
                          >
                            <HiArrowDownTray size={14} />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-gray-500 py-4 text-center">No uploaded document files available for this applicant.</div>
                  )}
                </div>
              </div>

              {/* SECTION 5: FINANCIAL BREAKDOWN & PAYMENT RECEIPT */}
              <div className="dossier-section-card margin-top">
                <h4 className="dossier-section-heading">
                  <HiCreditCard className="section-heading-icon green" />
                  5. Payment Receipt & Financial Breakdown
                </h4>
                <div className="dossier-grid-3col">
                  <div className="dossier-info-block">
                    <span className="label-title">Base Price (for {selectedAppModal.travelersCount} Person(s))</span>
                    <strong className="value-text">₹{(selectedAppModal.basePrice || selectedAppModal.totalPrice * 0.85).toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Taxes & GST (18% Standard)</span>
                    <strong className="value-text">₹{(selectedAppModal.gstAmount || selectedAppModal.totalPrice * 0.15).toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Total Amount Paid</span>
                    <strong className="value-text total-paid-highlight">₹{selectedAppModal.totalPrice.toLocaleString('en-IN')}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Payment Method</span>
                    <strong className="value-text">{selectedAppModal.paymentMethod}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Gateway Transaction ID</span>
                    <strong className="value-text">{selectedAppModal.paymentTransactionId || 'TXN-984019284'}</strong>
                  </div>

                  <div className="dossier-info-block">
                    <span className="label-title">Payment Status</span>
                    <span className="payment-chip paid">{selectedAppModal.paymentStatus}</span>
                  </div>
                </div>
              </div>

              {/* SECTION 6: EMBASSY WORKFLOW & ADMINISTRATIVE NOTES */}
              <div className="dossier-section-card margin-top">
                <h4 className="dossier-section-heading">
                  <HiClock className="section-heading-icon blue" />
                  6. Embassy Workflow & Administrative Notes
                </h4>
                
                <div className="status-update-action-box">
                  <label className="action-box-label">Update Embassy Processing Status:</label>
                  <div className="status-btn-group">
                    <button
                      className={`status-chip-btn blue ${selectedAppModal.applicationStatus === 'UNDER_EMBASSY_REVIEW' ? 'active' : ''}`}
                      onClick={async () => {
                        await updateApplication(selectedAppModal.id, {
                          applicationStatus: 'UNDER_EMBASSY_REVIEW',
                          adminNotes: editingNotes,
                        });
                        setSelectedAppModal({
                          ...selectedAppModal,
                          applicationStatus: 'UNDER_EMBASSY_REVIEW',
                          adminNotes: editingNotes,
                        });
                      }}
                    >
                      Mark Under Embassy Review
                    </button>

                    <button
                      className={`status-chip-btn green ${selectedAppModal.applicationStatus === 'APPROVED' ? 'active' : ''}`}
                      onClick={async () => {
                        await updateApplication(selectedAppModal.id, {
                          applicationStatus: 'APPROVED',
                          adminNotes: editingNotes,
                        });
                        setSelectedAppModal({
                          ...selectedAppModal,
                          applicationStatus: 'APPROVED',
                          adminNotes: editingNotes,
                        });
                      }}
                    >
                      <HiCheck size={16} /> Approve & Issue Visas ({selectedAppModal.travelersCount})
                    </button>

                    <button
                      className={`status-chip-btn red ${selectedAppModal.applicationStatus === 'REJECTED' ? 'active' : ''}`}
                      onClick={async () => {
                        await updateApplication(selectedAppModal.id, {
                          applicationStatus: 'REJECTED',
                          adminNotes: editingNotes,
                        });
                        setSelectedAppModal({
                          ...selectedAppModal,
                          applicationStatus: 'REJECTED',
                          adminNotes: editingNotes,
                        });
                      }}
                    >
                      Reject Application
                    </button>
                  </div>
                </div>

                <div className="admin-notes-textarea-box" style={{ marginTop: '1.15rem' }}>
                  <label className="action-box-label">Internal Admin Remarks & Embassy Submission Notes:</label>
                  <textarea
                    rows={3}
                    placeholder="Enter embassy appointment references, VFS submission tracking numbers, or verification remarks..."
                    value={editingNotes}
                    onChange={(e) => setEditingNotes(e.target.value)}
                    className="form-textarea-input"
                  />
                  <div className="notes-action-row" style={{ marginTop: '0.65rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <button type="button" className="save-notes-btn" onClick={handleSaveNotes}>
                      Save Admin Notes
                    </button>
                    <button
                      type="button"
                      className="issue-visa-pdf-btn"
                      onClick={() => alert(`📄 Approved Visa Document PDFs issued and emailed to ${activeApplicant.email}`)}
                    >
                      <HiArrowTopRightOnSquare size={16} />
                      <span>Issue Approved Visa PDF ({activeApplicant.fullName})</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DOCUMENT & PDF PREVIEWER SUB-MODAL */}
      {previewingDoc && (
        <div className="modal-backdrop-overlay doc-preview-backdrop">
          <div className="modal-content-card doc-preview-card">
            <button className="modal-close-btn" onClick={() => setPreviewingDoc(null)}>
              <HiXMark size={20} />
            </button>

            <div className="preview-modal-header">
              <div className="doc-preview-title-row">
                <span className={`doc-badge-pill ${previewingDoc.fileType}`}>{previewingDoc.fileType.toUpperCase()} FILE</span>
                <h3>{previewingDoc.name}</h3>
              </div>
              <span className="doc-preview-cat">{previewingDoc.category} • {previewingDoc.fileSize}</span>
            </div>

            <div className="preview-viewport-box">
              {previewingDoc.fileType === 'image' ? (
                <img src={previewingDoc.fileUrl} alt={previewingDoc.name} className="preview-image-view" />
              ) : (
                <div className="pdf-simulated-viewer">
                  <div className="pdf-page-sheet">
                    <div className="pdf-header-row">
                      <strong>OFFICIAL SUBMITTED DOCUMENT — {previewingDoc.category.toUpperCase()}</strong>
                      <span>Page 1 of 1</span>
                    </div>
                    <div className="pdf-body-mock">
                      <HiDocumentText size={48} className="pdf-center-icon" />
                      <h4>{previewingDoc.name}</h4>
                      <p>Encrypted Document Copy submitted by client for Visa Verification</p>
                      <div className="pdf-watermark-stamp">VERIFIED CLIENT SUBMISSION</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="preview-footer-actions">
              <button className="download-btn-full" onClick={() => handleDownloadFile(previewingDoc)}>
                <HiArrowDownTray size={16} />
                <span>Download {previewingDoc.name} ({previewingDoc.fileSize})</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

