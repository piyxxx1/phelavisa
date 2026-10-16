import { useState, useMemo, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import {
  HiBuildingOffice2,
  HiMagnifyingGlass,
  HiEye,
  HiCheckCircle,
  HiClock,
  HiPhone,
  HiEnvelope,
  HiMapPin,
  HiBriefcase,
  HiUserGroup,
  HiUser,
  HiArrowTopRightOnSquare,
  HiChatBubbleLeftRight,
  HiXMark,
  HiPencilSquare,
  HiGlobeAlt,
  HiSparkles,
  HiArrowUpTray,
} from 'react-icons/hi2';

export const AdminB2BPage = () => {
  // B2B Registered Partner Agencies (Loaded live from MongoDB REST API)
  const [b2bApplications, setB2bApplications] = useState([]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedB2bModal, setSelectedB2bModal] = useState(null);
  const [editingNotes, setEditingNotes] = useState('');
  const [editingStatus, setEditingStatus] = useState('ACTIVE');
  const [editingFile, setEditingFile] = useState('');
  const [editingFileName, setEditingFileName] = useState('');
  const [uploadingFile, setUploadingFile] = useState(false);

  // Summary Metrics
  const totalAgencies = b2bApplications.length;
  const activeAgencies = b2bApplications.filter((a) => a.status === 'ACTIVE').length;
  const pendingAgencies = b2bApplications.filter((a) => a.status === 'PENDING_VERIFICATION').length;

  const filteredB2b = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return (b2bApplications || []).filter((app) => {
      const matchesSearch =
        (app.agencyName || '').toLowerCase().includes(q) ||
        (app.contactName || '').toLowerCase().includes(q) ||
        (app.phone || '').toLowerCase().includes(q) ||
        (app.city || '').toLowerCase().includes(q) ||
        (app.email || '').toLowerCase().includes(q);
      const matchesStatus = selectedStatus === 'ALL' || app.status === selectedStatus;
      return matchesSearch && matchesStatus;
    });
  }, [b2bApplications, searchQuery, selectedStatus]);

  // Fetch live B2B partner applications from MongoDB REST API on mount
  useEffect(() => {
    async function fetchB2bPartners() {
      try {
        const res = await fetch(`${API_BASE_URL}/b2b/partners`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setB2bApplications(data);
          }
        }
      } catch (err) {
        console.warn('[B2B API] Offline or fallback mode:', err);
      }
    }

    fetchB2bPartners();
  }, []);

  const handleOpenModal = (app) => {
    setSelectedB2bModal(app);
    setEditingNotes(app.adminNotes || '');
    setEditingStatus(app.status);
    setEditingFile(app.verificationFile || '');
    setEditingFileName(app.verificationFileName || '');
  };

  const handleB2bFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingFile(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (data.fileUrl) {
        setEditingFile(data.fileUrl);
        setEditingFileName(file.name);
      } else {
        const reader = new FileReader();
        reader.onload = (evt) => {
          setEditingFile(evt.target?.result || '');
          setEditingFileName(file.name);
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('File upload endpoint failed, falling back to data URL:', err);
      const reader = new FileReader();
      reader.onload = (evt) => {
        setEditingFile(evt.target?.result || '');
        setEditingFileName(file.name);
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingFile(false);
    }
  };

  const handleStatusToggle = async (appId, newStatus) => {
    setB2bApplications((prev) =>
      prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
    );

    try {
      await fetch(`${API_BASE_URL}/b2b/partners/${appId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
    } catch (err) {
      console.warn('Failed to update B2B status on API:', err);
    }
  };

  const handleSaveNotesAndStatus = async () => {
    if (!selectedB2bModal) return;
    const payload = {
      adminNotes: editingNotes,
      status: editingStatus,
      verificationFile: editingFile,
      verificationFileName: editingFileName,
    };

    setB2bApplications((prev) =>
      prev.map((app) =>
        app.id === selectedB2bModal.id
          ? { ...app, ...payload }
          : app
      )
    );

    try {
      await fetch(`${API_BASE_URL}/b2b/partners/${selectedB2bModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn('Failed to update B2B notes on API:', err);
    }

    setSelectedB2bModal((prev) =>
      prev ? { ...prev, ...payload } : null
    );
    alert(`🎉 B2B Partner profile, notes & verification documents updated for ${selectedB2bModal.agencyName}!`);
  };

  return (
    <div className="admin-b2b-page-container">
      {/* Header Bar */}
      <div className="admin-page-header-flex">
        <div>
          <h1 className="admin-page-title">B2B Partner Portal & Agency Desk</h1>
          <p className="admin-page-subtitle">
            Direct B2B agency partnerships, corporate desks, partner onboarding inquiries, and nationwide branch offices.
          </p>
        </div>
      </div>

      {/* Top Quick Metrics */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card blue">
          <div className="metric-icon"><HiBuildingOffice2 size={22} /></div>
          <div className="metric-info">
            <span className="metric-label">Total B2B Agencies</span>
            <span className="metric-value">{totalAgencies} Registered Partners</span>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon"><HiCheckCircle size={22} /></div>
          <div className="metric-info">
            <span className="metric-label">Active B2B Partners</span>
            <span className="metric-value">{activeAgencies} Verified Partners</span>
          </div>
        </div>

        <div className="metric-card yellow">
          <div className="metric-icon"><HiClock size={22} /></div>
          <div className="metric-info">
            <span className="metric-label">Pending Verification</span>
            <span className="metric-value">{pendingAgencies} Action Required</span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="admin-filters-card">
        <div className="admin-search-input-box">
          <HiMagnifyingGlass size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Agency name, contact person, phone, email, or city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="region-filter-pills">
          {[
            { id: 'ALL', label: `All Partners (${totalAgencies})` },
            { id: 'ACTIVE', label: `Active (${activeAgencies})` },
            { id: 'PENDING_VERIFICATION', label: `Pending (${pendingAgencies})` },
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

      {/* B2B Agency Registrations Table */}
      <div className="admin-content-section-card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Submitted B2B Partner Applications</h3>
            <span className="card-subtitle">
              Showing {filteredB2b.length} registered partner record{filteredB2b.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>

        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Agency Name & City</th>
                <th>Contact Person & Contact</th>
                <th>Business Type</th>
                <th>Monthly Volume</th>
                <th>Assigned Office</th>
                <th>Partner Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredB2b.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500">
                    No B2B partner applications match your search query.
                  </td>
                </tr>
              ) : (
                filteredB2b.map((app) => (
                  <tr key={app.id}>
                    <td>
                      <div>
                        <strong className="visa-country-title" style={{ fontSize: '0.95rem' }}>
                          {app.agencyName}
                        </strong>
                        <div className="sub-phone">
                          <HiMapPin size={12} style={{ display: 'inline', marginRight: 2 }} />
                          {app.city} • {app.id}
                        </div>
                      </div>
                    </td>
                    <td>
                      <strong className="user-name-text">{app.contactName}</strong>
                      <div className="sub-phone">{app.phone}</div>
                      <div className="sub-phone" style={{ color: '#2563eb' }}>{app.email}</div>
                    </td>
                    <td>
                      <span className="category-badge small">{app.businessType}</span>
                    </td>
                    <td>
                      <span className="passport-chip">{app.monthlyVolume}</span>
                    </td>
                    <td>
                      <span className="time-badge">{app.assignedOffice}</span>
                    </td>
                    <td>
                      <span className={`status-badge ${app.status === 'ACTIVE' ? 'approved' : 'pending_verification'}`}>
                        {app.status === 'ACTIVE' ? 'ACTIVE PARTNER' : 'PENDING VERIFICATION'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="action-edit-btn"
                          onClick={() => handleOpenModal(app)}
                          title="Inspect Stylish B2B Agency Dossier"
                        >
                          <HiEye size={16} />
                          <span>View Partner</span>
                        </button>

                        <select
                          value={app.status}
                          onChange={(e) => handleStatusToggle(app.id, e.target.value)}
                          className="status-select-inline"
                        >
                          <option value="PENDING_VERIFICATION">Pending</option>
                          <option value="ACTIVE">Active Partner</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* STYLISH & PREMIUM B2B AGENCY DOSSIER MODAL */}
      {selectedB2bModal && (
        <div className="modal-backdrop-overlay" onClick={() => setSelectedB2bModal(null)}>
          <div className="modal-content-card b2b-stylish-modal-card" onClick={(e) => e.stopPropagation()}>
            <button
              className="modal-close-btn prominent-close-btn"
              onClick={() => setSelectedB2bModal(null)}
              title="Close Partner View (Esc)"
            >
              <HiXMark size={24} />
            </button>

            {/* Premium Dark Gradient Header Banner */}
            <div className="b2b-stylish-header-banner">
              <div className="b2b-header-top-row">
                <span className="b2b-ref-chip">
                  <HiSparkles size={14} /> Partner ID: {selectedB2bModal.id}
                </span>
                <span className={`b2b-status-pill ${selectedB2bModal.status === 'ACTIVE' ? 'active' : 'pending'}`}>
                  {selectedB2bModal.status === 'ACTIVE' ? (
                    <>
                      <HiCheckCircle size={14} /> ACTIVE B2B PARTNER
                    </>
                  ) : (
                    <>
                      <HiClock size={14} /> PENDING VERIFICATION
                    </>
                  )}
                </span>
              </div>

              <h2 className="b2b-agency-title-lg">{selectedB2bModal.agencyName}</h2>
              <div className="b2b-sub-location">
                <HiMapPin size={16} />
                <span>{selectedB2bModal.city}, India • Registered on {selectedB2bModal.submittedAt}</span>
              </div>

              {/* Direct One-Click Contact Actions */}
              <div className="b2b-contact-actions-bar">
                <a
                  href={`tel:${selectedB2bModal.phone.replace(/[^0-9+]/g, '')}`}
                  className="b2b-action-btn call"
                >
                  <HiPhone size={16} />
                  <span>Call Agency ({selectedB2bModal.phone})</span>
                </a>

                <a
                  href={`https://wa.me/${selectedB2bModal.phone.replace(/[^0-9]/g, '')}?text=Hello%20${encodeURIComponent(selectedB2bModal.contactName)},%20greeting%20from%20Pehla%20Visa%20B2B%20Desk!`}
                  target="_blank"
                  rel="noreferrer"
                  className="b2b-action-btn whatsapp"
                >
                  <HiChatBubbleLeftRight size={16} />
                  <span>WhatsApp Chat</span>
                </a>

                <a
                  href={`mailto:${selectedB2bModal.email}`}
                  className="b2b-action-btn email"
                >
                  <HiEnvelope size={16} />
                  <span>Send Email</span>
                </a>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="b2b-stylish-modal-body">
              <div className="b2b-dossier-grid-2col">
                {/* Left Column: 6 Styled Profile Cards */}
                <div className="b2b-credentials-section">
                  <h4 className="b2b-section-heading">
                    <HiBuildingOffice2 size={20} className="heading-icon" />
                    Verified Agency Profile & Contact
                  </h4>

                  <div className="b2b-info-cards-grid">
                    <div className="b2b-mini-card">
                      <div className="mini-card-icon blue"><HiBuildingOffice2 size={20} /></div>
                      <div className="mini-card-content">
                        <span className="card-lbl">Agency Name</span>
                        <strong className="card-val">{selectedB2bModal.agencyName}</strong>
                      </div>
                    </div>

                    <div className="b2b-mini-card">
                      <div className="mini-card-icon purple"><HiUser size={20} /></div>
                      <div className="mini-card-content">
                        <span className="card-lbl">Contact Person</span>
                        <strong className="card-val">{selectedB2bModal.contactName}</strong>
                      </div>
                    </div>

                    <div className="b2b-mini-card">
                      <div className="mini-card-icon green"><HiPhone size={20} /></div>
                      <div className="mini-card-content">
                        <span className="card-lbl">Mobile / WhatsApp</span>
                        <strong className="card-val">{selectedB2bModal.phone}</strong>
                      </div>
                    </div>

                    <div className="b2b-mini-card">
                      <div className="mini-card-icon red"><HiEnvelope size={20} /></div>
                      <div className="mini-card-content">
                        <span className="card-lbl">Business Email</span>
                        <strong className="card-val">{selectedB2bModal.email}</strong>
                      </div>
                    </div>

                    <div className="b2b-mini-card">
                      <div className="mini-card-icon yellow"><HiBriefcase size={20} /></div>
                      <div className="mini-card-content">
                        <span className="card-lbl">Business Type</span>
                        <strong className="card-val">{selectedB2bModal.businessType}</strong>
                      </div>
                    </div>

                    <div className="b2b-mini-card">
                      <div className="mini-card-icon cyan"><HiUserGroup size={20} /></div>
                      <div className="mini-card-content">
                        <span className="card-lbl">Monthly Visa Volume</span>
                        <strong className="card-val">{selectedB2bModal.monthlyVolume}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Column: Status & Account Notes Form */}
                <div className="b2b-verification-section">
                  <h4 className="b2b-section-heading">
                    <HiPencilSquare size={20} className="heading-icon" />
                    Account Activation & Internal Notes
                  </h4>

                  <div className="form-input-block" style={{ marginBottom: '1.15rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800 }}>Update Partnership Status</label>
                    <div className="status-toggle-pills-row">
                      <button
                        type="button"
                        className={`status-pill-btn active-btn ${editingStatus === 'ACTIVE' ? 'selected' : ''}`}
                        onClick={() => setEditingStatus('ACTIVE')}
                      >
                        <HiCheckCircle size={16} />
                        <span>Active Partner</span>
                      </button>

                      <button
                        type="button"
                        className={`status-pill-btn pending-btn ${editingStatus === 'PENDING_VERIFICATION' ? 'selected' : ''}`}
                        onClick={() => setEditingStatus('PENDING_VERIFICATION')}
                      >
                        <HiClock size={16} />
                        <span>Pending Verification</span>
                      </button>
                    </div>
                  </div>

                  <div className="form-input-block" style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800 }}>Account Manager Verification Notes</label>
                    <textarea
                      rows={4}
                      className="form-textarea-input b2b-notes-textarea"
                      placeholder="Enter agency verification details, license verification, SLA preferences, or account notes..."
                      value={editingNotes}
                      onChange={(e) => setEditingNotes(e.target.value)}
                    />
                  </div>

                  {/* Verification Attachment File Upload */}
                  <div className="form-input-block" style={{ marginBottom: '1.25rem' }}>
                    <label style={{ fontSize: '0.85rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0f172a' }}>
                      <HiArrowUpTray size={16} style={{ color: '#2563eb' }} />
                      <span>Verification Document / Image / PDF Attachment</span>
                    </label>

                    {editingFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#f8fafc', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.35rem' }}>
                        <div style={{ background: '#eff6ff', color: '#2563eb', padding: '0.4rem', borderRadius: '0.35rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                          <HiDocumentText size={22} />
                        </div>
                        <div style={{ flex: 1, overflow: 'hidden' }}>
                          <strong style={{ fontSize: '0.8rem', color: '#0f172a', display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {editingFileName || 'Verification Document Attached'}
                          </strong>
                          <a
                            href={editingFile}
                            target="_blank"
                            rel="noreferrer"
                            style={{ fontSize: '0.725rem', color: '#2563eb', fontWeight: 700, textDecoration: 'underline', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}
                          >
                            👁️ Open / Download Document
                          </a>
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setEditingFile('');
                            setEditingFileName('');
                          }}
                          style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.35rem', padding: '0.35rem 0.6rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          ✕ Remove
                        </button>
                      </div>
                    ) : (
                      <div style={{ marginTop: '0.35rem' }}>
                        <input
                          type="file"
                          id="b2b-doc-upload-modal"
                          accept=".pdf,.png,.jpg,.jpeg,.doc,.docx,.webp"
                          onChange={handleB2bFileUpload}
                          style={{ display: 'none' }}
                        />
                        <label
                          htmlFor="b2b-doc-upload-modal"
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '0.5rem',
                            background: '#ffffff',
                            border: '2px dashed #94a3b8',
                            padding: '0.65rem 1rem',
                            borderRadius: '0.5rem',
                            cursor: 'pointer',
                            fontSize: '0.825rem',
                            fontWeight: 700,
                            color: '#334155',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <HiArrowUpTray size={18} style={{ color: '#2563eb' }} />
                          <span>{uploadingFile ? 'Uploading document...' : 'Click to Upload Verification File / PDF / Image'}</span>
                        </label>
                      </div>
                    )}
                  </div>

                  <button
                    className="admin-primary-btn b2b-save-btn"
                    onClick={handleSaveNotesAndStatus}
                  >
                    <HiCheckCircle size={20} />
                    <span>Save Partner Profile, Notes & Document</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
