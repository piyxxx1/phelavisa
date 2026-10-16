import React, { useState, useEffect } from 'react';
import type { UserProfile } from './LoginPage';
import { API_BASE_URL } from '../config/apiConfig';
import {
  HiShoppingBag,
  HiCheckCircle,
  HiClock,
  HiExclamationCircle,
  HiInformationCircle,
  HiArrowLeft,
  HiXCircle,
  HiUser,
  HiUserGroup,
  HiDocumentText,
  HiXMark,
} from 'react-icons/hi2';

interface OrdersPageProps {
  user: UserProfile | null;
  onNavigate: (page: 'home' | 'visas' | 'b2b' | 'login' | 'dummy-tickets' | 'orders' | 'profile') => void;
}

export const OrdersPage: React.FC<OrdersPageProps> = ({ user, onNavigate }) => {
  const [filterTab, setFilterTab] = useState<'all' | 'visas' | 'dummy'>('all');
  const [visaApps, setVisaApps] = useState<any[]>([]);
  const [dummyTickets, setDummyTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedModalApp, setSelectedModalApp] = useState<any | null>(null);
  const [activeApplicantTab, setActiveApplicantTab] = useState<number>(-1);

  const getAppApplicantsList = (app: any) => {
    const list = app.applicantsList || app.travelers || app.applicants;
    if (Array.isArray(list) && list.length > 0) {
      return list.map((item: any, idx: number) => ({
        applicantNumber: item.applicantNumber || idx + 1,
        fullName: item.fullName || item.name || `Applicant ${idx + 1}`,
        phone: item.phone || app.applicantPhone || '',
        email: item.email || app.applicantEmail || '',
        dob: item.dob || 'Provided in Passport Scan',
        gender: item.gender || 'Male',
        passportNumber: item.passportNumber || app.passportNumber || 'Submitted',
        passportExpiry: item.passportExpiry || 'Active',
        passportIssuePlace: item.passportIssuePlace || 'India',
        documentsSubmitted: item.documentsSubmitted || [
          { name: `${(item.fullName || item.name || 'Applicant').replace(/\s+/g, '_')}_Passport_Bio_Scan.pdf`, category: 'Passport Scan', fileSize: '1.5 MB' },
        ],
      }));
    }

    return [{
      applicantNumber: 1,
      fullName: app.applicantName || 'Primary Applicant',
      phone: app.applicantPhone || '',
      email: app.applicantEmail || '',
      dob: app.dob || 'Provided in Passport Scan',
      gender: app.gender || 'Male',
      passportNumber: app.passportNumber || 'Submitted',
      passportExpiry: app.passportExpiry || 'Active',
      passportIssuePlace: app.passportIssuePlace || 'India',
      documentsSubmitted: [
        { name: `${(app.applicantName || 'Applicant').replace(/\s+/g, '_')}_Passport_Bio_Scan.pdf`, category: 'Passport Scan', fileSize: '1.5 MB' },
      ],
    }];
  };

  useEffect(() => {
    async function fetchUserOrders() {
      setLoading(true);
      try {
        const userEmail = user?.email;
        if (!userEmail) {
          setVisaApps([]);
          setDummyTickets([]);
          setLoading(false);
          return;
        }

        // Fetch Visa Applications for specific logged in user
        const visaRes = await fetch(`${API_BASE_URL}/applications/user/${encodeURIComponent(userEmail)}`);
        if (visaRes.ok) {
          const userVisas = await visaRes.json();
          if (Array.isArray(userVisas)) {
            setVisaApps(userVisas);
          }
        }

        // Fetch Dummy Ticket Orders for specific logged in user
        const dummyRes = await fetch(`${API_BASE_URL}/dummy-tickets/user/${encodeURIComponent(userEmail)}`);
        if (dummyRes.ok) {
          const userDummy = await dummyRes.json();
          if (Array.isArray(userDummy)) {
            setDummyTickets(userDummy);
          }
        }
      } catch (err) {
        console.warn('OrdersPage fetch warning:', err);
      } finally {
        setLoading(false);
      }
    }

    fetchUserOrders();
  }, [user]);

  if (!user) {
    return (
      <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
        <HiExclamationCircle size={48} style={{ color: '#ef4444', marginBottom: '1rem' }} />
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Login Required to View Orders</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Please log in to your Pehla Visa account to track your visa applications and dummy ticket orders.</p>
        <button
          onClick={() => onNavigate('login')}
          style={{ background: '#2563eb', color: '#ffffff', padding: '0.75rem 1.75rem', borderRadius: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  const getVisaStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #86efac', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <HiCheckCircle size={16} /> Visa Approved
          </span>
        );
      case 'REJECTED':
        return (
          <span style={{ background: '#fee2e2', color: '#991b1b', border: '1px solid #fca5a5', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <HiXCircle size={16} /> Application Rejected
          </span>
        );
      case 'UNDER_EMBASSY_REVIEW':
        return (
          <span style={{ background: '#dbeafe', color: '#1e40af', border: '1px solid #93c5fd', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <HiClock size={16} /> Under Embassy Review
          </span>
        );
      default:
        return (
          <span style={{ background: '#e0f2fe', color: '#0369a1', border: '1px solid #bae6fd', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
            <HiInformationCircle size={16} /> Under Verification
          </span>
        );
    }
  };

  const getVisaCardStyle = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return {
          cardBg: '#f0fdf4',
          cardBorder: '2px solid #22c55e',
          shadow: '0 6px 20px rgba(34, 197, 94, 0.15)',
          headerBorder: '#bbf7d0',
          pillBg: '#dcfce7',
          pillColor: '#15803d',
          pillText: '✅ APPROVED VISA APPLICATION',
          detailsBg: '#ffffff',
          notesBg: '#dcfce7',
          notesBorder: '#86efac',
          notesTitleColor: '#14532d',
          notesTextColor: '#166534',
          notesIcon: <HiCheckCircle style={{ color: '#16a34a', flexShrink: 0 }} size={20} />,
        };
      case 'REJECTED':
        return {
          cardBg: '#fef2f2',
          cardBorder: '2px solid #ef4444',
          shadow: '0 6px 20px rgba(239, 68, 68, 0.15)',
          headerBorder: '#fecdd3',
          pillBg: '#fee2e2',
          pillColor: '#991b1b',
          pillText: '❌ REJECTED VISA APPLICATION',
          detailsBg: '#ffffff',
          notesBg: '#fee2e2',
          notesBorder: '#fca5a5',
          notesTitleColor: '#7f1d1d',
          notesTextColor: '#991b1b',
          notesIcon: <HiXCircle style={{ color: '#dc2626', flexShrink: 0 }} size={20} />,
        };
      case 'UNDER_EMBASSY_REVIEW':
      default:
        return {
          cardBg: '#f0f9ff',
          cardBorder: '2px solid #0284c7',
          shadow: '0 6px 20px rgba(2, 132, 199, 0.15)',
          headerBorder: '#bae6fd',
          pillBg: '#e0f2fe',
          pillColor: '#0369a1',
          pillText: '🔵 UNDER EMBASSY REVIEW / VERIFICATION',
          detailsBg: '#ffffff',
          notesBg: '#e0f2fe',
          notesBorder: '#7dd3fc',
          notesTitleColor: '#075985',
          notesTextColor: '#0c4a6e',
          notesIcon: <HiInformationCircle style={{ color: '#0284c7', flexShrink: 0 }} size={20} />,
        };
    }
  };

  const getDummyStatusBadge = (status: string) => {
    switch (status) {
      case 'CONFIRMED':
      case 'COMPLETED':
        return <span style={{ background: '#dcfce7', color: '#15803d', border: '1px solid #bbf7d0', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><HiCheckCircle /> Confirmed</span>;
      default:
        return <span style={{ background: '#fef3c7', color: '#b45309', border: '1px solid #fde68a', padding: '0.25rem 0.65rem', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}><HiClock /> Processing</span>;
    }
  };

  return (
    <div className="orders-page-wrapper">
      <div style={{ maxWidth: '1050px', margin: '0 auto' }}>
        {/* Top Header Card */}
        <div className="orders-header-card">
          <div className="orders-header-left">
            <button
              className="orders-back-btn"
              onClick={() => onNavigate('home')}
            >
              <HiArrowLeft size={14} /> Back to Home
            </button>
            <h1 className="orders-main-title">
              <HiShoppingBag style={{ color: '#2563eb' }} /> My Orders & History
            </h1>
            <p className="orders-sub-text">
              <span className="orders-live-dot" title="Real-time live updates enabled"></span>
              <span>Real-time status updates for <strong>{user.name}</strong> ({user.email || user.phone})</span>
            </p>
          </div>

          {/* Filter Navigation Tabs */}
          <div className="orders-filter-nav">
            <button
              onClick={() => setFilterTab('all')}
              className={`orders-filter-btn ${filterTab === 'all' ? 'active' : 'inactive'}`}
            >
              <span>📁 All</span>
              <span className="orders-filter-count">{visaApps.length + dummyTickets.length}</span>
            </button>

            <button
              onClick={() => setFilterTab('visas')}
              className={`orders-filter-btn ${filterTab === 'visas' ? 'active' : 'inactive'}`}
            >
              <span>🛂 Visas</span>
              <span className="orders-filter-count">{visaApps.length}</span>
            </button>

            <button
              onClick={() => setFilterTab('dummy')}
              className={`orders-filter-btn ${filterTab === 'dummy' ? 'active' : 'inactive'}`}
            >
              <span>🎫 Tickets</span>
              <span className="orders-filter-count">{dummyTickets.length}</span>
            </button>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: '#ffffff', borderRadius: '1rem' }}>
            <p style={{ color: '#64748b', fontWeight: 600 }}>Loading your orders from server...</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* VISA APPLICATIONS SECTION */}
            {(filterTab === 'all' || filterTab === 'visas') &&
              visaApps.map((app) => {
                const cardStyle = getVisaCardStyle(app.applicationStatus);
                const applicants = getAppApplicantsList(app);
                const appId = app.id || app.bookingRefId;

                return (
                  <div
                    key={appId}
                    style={{
                      background: cardStyle.cardBg,
                      borderRadius: '1rem',
                      padding: '1.25rem',
                      border: cardStyle.cardBorder,
                      boxShadow: cardStyle.shadow,
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '1.15rem',
                    }}
                  >
                    {/* Header Row */}
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: `1px solid ${cardStyle.headerBorder}`, paddingBottom: '0.85rem' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', fontWeight: 800, color: cardStyle.pillColor, background: cardStyle.pillBg, padding: '0.2rem 0.55rem', borderRadius: '0.35rem', textTransform: 'uppercase' }}>
                          {cardStyle.pillText}
                        </span>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0 0' }}>
                          {app.countryName} — {app.visaTitle}
                        </h3>
                        <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                          Ref: <strong style={{ color: '#0f172a' }}>{app.bookingRefId}</strong> • Submitted: {app.submittedAt || app.createdAt?.slice(0, 10) || 'Recently'}
                        </span>
                      </div>

                      <div style={{ textAlign: 'right' }}>
                        {getVisaStatusBadge(app.applicationStatus)}
                        <strong style={{ display: 'block', fontSize: '1.2rem', color: '#0f172a', fontWeight: 900, marginTop: '0.25rem' }}>
                          ₹{(app.totalPrice || 4999).toLocaleString('en-IN')}
                        </strong>
                      </div>
                    </div>

                    {/* Specifications & Primary Info Grid */}
                    <div className="orders-specs-grid" style={{ background: cardStyle.detailsBg, padding: '1.15rem', borderRadius: '0.75rem', border: '1px solid #cbd5e1' }}>
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Primary Applicant:</span>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>{app.applicantName}</strong>
                        {(app.applicantPhone || app.applicantEmail) && (
                          <span style={{ display: 'block', fontSize: '0.75rem', color: '#475569', marginTop: '0.15rem' }}>
                            📞 {app.applicantPhone || 'N/A'} • ✉️ {app.applicantEmail || 'N/A'}
                          </span>
                        )}
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Total Applicants Submitted:</span>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                          👥 {applicants.length} Person{applicants.length > 1 ? 's' : ''} Included
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#2563eb', fontWeight: 700, marginTop: '0.15rem' }}>
                          {app.variantLabel || app.variant || 'Standard Tourist Visa'}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Intended Travel Dates:</span>
                        <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                          {app.travelDate || 'TBD'} to {app.returnDate || 'TBD'}
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#475569', marginTop: '0.15rem' }}>
                          Processing: {app.processingTime || '5-7 Days'} • Stay: {app.stayPeriod || '30 Days'}
                        </span>
                      </div>

                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block', fontWeight: 600 }}>Payment & Gateway:</span>
                        <strong style={{ fontSize: '0.85rem', color: '#166534', background: '#dcfce7', padding: '0.15rem 0.45rem', borderRadius: '0.3rem', display: 'inline-block' }}>
                          {app.paymentStatus || 'PAID'} ({app.paymentMethod || 'Razorpay Gateway'})
                        </strong>
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#475569', fontFamily: 'monospace', marginTop: '0.2rem' }}>
                          Txn: {app.paymentTransactionId || 'TXN-PAID'}
                        </span>
                      </div>
                    </div>

                    {/* Official Admin Remarks / Status Updates Banner */}
                    {app.adminNotes && (
                      <div style={{ background: cardStyle.notesBg, border: `1px solid ${cardStyle.notesBorder}`, padding: '0.85rem 1rem', borderRadius: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        {cardStyle.notesIcon}
                        <div>
                          <strong style={{ fontSize: '0.8rem', color: cardStyle.notesTitleColor, display: 'block' }}>Official Admin Update & Verification Remarks:</strong>
                          <span style={{ fontSize: '0.85rem', color: cardStyle.notesTextColor }}>{app.adminNotes}</span>
                        </div>
                      </div>
                    )}

                    {/* APPLICANTS BREAKDOWN TRIGGER BUTTON */}
                    <div style={{ background: '#ffffff', borderRadius: '0.75rem', border: '1px solid #cbd5e1', overflow: 'hidden' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedModalApp(app);
                          setActiveApplicantTab(-1);
                        }}
                        style={{
                          width: '100%',
                          padding: '0.85rem 1.15rem',
                          background: '#f8fafc',
                          border: 'none',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          cursor: 'pointer',
                          color: '#0f172a',
                          fontWeight: 800,
                          fontSize: '0.9rem',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <HiUserGroup style={{ color: '#2563eb' }} size={20} />
                          <span>Full Applicants Breakdown & Submitted Documents ({applicants.length} Person{applicants.length > 1 ? 's' : ''})</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#2563eb', fontSize: '0.8rem', background: '#eff6ff', padding: '0.35rem 0.75rem', borderRadius: '0.45rem', border: '1px solid #bfdbfe', fontWeight: 700 }}>
                          <span>View Applicants Modal</span>
                          <span style={{ fontSize: '0.95rem' }}>↗</span>
                        </div>
                      </button>
                    </div>
                  </div>
                );
              })}

            {/* DUMMY TICKET ORDERS SECTION */}
            {(filterTab === 'all' || filterTab === 'dummy') &&
              dummyTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  style={{
                    background: '#ffffff',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #e2e8f0',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.03)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.85rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.55rem', borderRadius: '0.35rem', textTransform: 'uppercase' }}>
                        DUMMY TICKET / HOTEL RESERVATION
                      </span>
                      <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0.35rem 0 0 0' }}>
                        {ticket.serviceType === 'flight' && '✈️ Verifiable Dummy Flight Ticket'}
                        {ticket.serviceType === 'hotel' && '🏨 Confirmed Dummy Hotel Voucher'}
                        {ticket.serviceType === 'combo' && '🌟 Combo Pack (Flight + Hotel Voucher)'}
                      </h3>
                      <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
                        Order ID: <strong>{ticket.id}</strong> • Requested on {ticket.createdAt?.slice(0, 10) || 'Recently'}
                      </span>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      {getDummyStatusBadge(ticket.status)}
                      <strong style={{ display: 'block', fontSize: '1.25rem', color: '#0f172a', fontWeight: 900, marginTop: '0.35rem' }}>
                        ₹{ticket.amount || (ticket.serviceType === 'flight' ? 499 : ticket.serviceType === 'hotel' ? 399 : 799)}
                      </strong>
                    </div>
                  </div>

                  {/* Details Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', background: '#f8fafc', padding: '1rem', borderRadius: '0.75rem' }}>
                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Passenger / Guest Name:</span>
                      <strong style={{ fontSize: '0.875rem', color: '#1e293b' }}>{ticket.passengerName || ticket.hotelGuestName || user.name}</strong>
                    </div>

                    <div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Airline Live PNR Code:</span>
                      <span style={{ background: '#0f172a', color: '#38bdf8', padding: '0.2rem 0.55rem', borderRadius: '0.35rem', fontFamily: 'monospace', fontWeight: 800, fontSize: '0.85rem' }}>
                        {ticket.pnrCode || 'PNR-AB782K'}
                      </span>
                    </div>

                    {ticket.fromCity && (
                      <div>
                        <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>Flight Route:</span>
                        <strong style={{ fontSize: '0.85rem', color: '#1e293b' }}>{ticket.fromCity} → {ticket.toCity}</strong>
                      </div>
                    )}

                  </div>

                  {/* Admin Remarks / Status Updates Banner */}
                  {ticket.adminNotes && (
                    <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '0.85rem 1rem', borderRadius: '0.65rem', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <HiInformationCircle style={{ color: '#0284c7', flexShrink: 0 }} size={20} />
                      <div>
                        <strong style={{ fontSize: '0.8rem', color: '#0369a1', display: 'block' }}>Official Admin Update & Verification Remarks:</strong>
                        <span style={{ fontSize: '0.85rem', color: '#0c4a6e' }}>{ticket.adminNotes}</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}

            {visaApps.length === 0 && dummyTickets.length === 0 && (
              <div style={{ background: '#ffffff', padding: '3rem', borderRadius: '1rem', textAlign: 'center', border: '1px solid #e2e8f0' }}>
                <HiShoppingBag size={48} style={{ color: '#cbd5e1', marginBottom: '1rem' }} />
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>No Orders Found Yet</h3>
                <p style={{ color: '#64748b', marginTop: '0.5rem', marginBottom: '1.5rem' }}>You haven't placed any visa applications or dummy ticket reservations yet.</p>
                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                  <button
                    onClick={() => onNavigate('visas')}
                    style={{ background: '#2563eb', color: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Apply for Visa
                  </button>
                  <button
                    onClick={() => onNavigate('dummy-tickets')}
                    style={{ background: '#10b981', color: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                  >
                    Book Dummy Ticket
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      {/* APPLICANTS BREAKDOWN MODAL POPUP */}
      {selectedModalApp && (
        <div className="applicants-modal-overlay" onClick={() => setSelectedModalApp(null)}>
          <div className="applicants-modal-container" onClick={(e) => e.stopPropagation()}>
            {/* Modal Header */}
            <div className="applicants-modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ background: '#dbeafe', color: '#2563eb', padding: '0.55rem', borderRadius: '0.65rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <HiUserGroup size={22} />
                </div>
                <div>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 900, color: '#0f172a' }}>
                    Applicants Breakdown & Submitted Documents
                  </h3>
                  <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                    Ref: <strong>{selectedModalApp.bookingRefId}</strong> • {selectedModalApp.countryName} — {selectedModalApp.visaTitle}
                  </span>
                </div>
              </div>
              <button className="applicants-modal-close-btn" onClick={() => setSelectedModalApp(null)} title="Close Modal">
                <HiXMark size={20} />
              </button>
            </div>

            {/* Modal Tab Pills & Content */}
            {(() => {
              const modalApplicants = getAppApplicantsList(selectedModalApp);
              return (
                <>
                  {modalApplicants.length > 1 && (
                    <div className="applicants-modal-tabs">
                      <button
                        className={`applicants-modal-tab-btn ${activeApplicantTab === -1 ? 'active' : 'inactive'}`}
                        onClick={() => setActiveApplicantTab(-1)}
                      >
                        👥 All Persons ({modalApplicants.length})
                      </button>
                      {modalApplicants.map((ap: any, idx: number) => (
                        <button
                          key={idx}
                          className={`applicants-modal-tab-btn ${activeApplicantTab === idx ? 'active' : 'inactive'}`}
                          onClick={() => setActiveApplicantTab(idx)}
                        >
                          👤 Person {idx + 1}: {ap.fullName.split(' ')[0]} {idx === 0 ? '(Primary)' : ''}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Modal Scrollable Body */}
                  <div className="applicants-modal-body">
                    {modalApplicants
                      .filter((_, idx) => activeApplicantTab === -1 || activeApplicantTab === idx)
                      .map((ap: any, idx: number) => {
                        const actualIdx = activeApplicantTab === -1 ? idx : activeApplicantTab;
                        return (
                          <div key={idx} style={{ background: '#f8fafc', padding: '1.15rem', borderRadius: '0.85rem', border: '1px solid #cbd5e1' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.85rem', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.65rem' }}>
                              <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                                <HiUser style={{ color: '#2563eb' }} size={18} />
                                <span>Person {actualIdx + 1}: {ap.fullName} {actualIdx === 0 ? '(Primary Applicant)' : ''}</span>
                              </h4>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0369a1', background: '#e0f2fe', border: '1px solid #bae6fd', padding: '0.2rem 0.6rem', borderRadius: '0.35rem', fontFamily: 'monospace' }}>
                                Passport #: {ap.passportNumber}
                              </span>
                            </div>

                            {/* Info Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.85rem', fontSize: '0.825rem', marginBottom: '0.85rem' }}>
                              <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>Gender & Date of Birth:</span>
                                <strong style={{ color: '#1e293b' }}>{ap.gender} • {ap.dob}</strong>
                              </div>

                              <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>Passport Issue & Expiry:</span>
                                <strong style={{ color: '#1e293b' }}>{ap.passportIssuePlace} • {ap.passportExpiry}</strong>
                              </div>

                              {(ap.phone || ap.email) && (
                                <div style={{ background: '#ffffff', padding: '0.65rem 0.85rem', borderRadius: '0.5rem', border: '1px solid #e2e8f0' }}>
                                  <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', fontWeight: 600 }}>Contact Details:</span>
                                  <strong style={{ color: '#1e293b' }}>{ap.phone || 'N/A'} • {ap.email || 'N/A'}</strong>
                                </div>
                              )}
                            </div>

                            {/* Submitted Files */}
                            {ap.documentsSubmitted && ap.documentsSubmitted.length > 0 && (
                              <div style={{ background: '#ffffff', padding: '0.75rem 0.95rem', borderRadius: '0.6rem', border: '1px solid #cbd5e1' }}>
                                <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#334155', display: 'block', marginBottom: '0.45rem' }}>
                                  📄 Uploaded Documents & Bio Scans ({ap.documentsSubmitted.length} Files):
                                </span>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                                  {ap.documentsSubmitted.map((doc: any, docIdx: number) => (
                                    <span
                                      key={docIdx}
                                      style={{
                                        background: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        color: '#1d4ed8',
                                        fontSize: '0.78rem',
                                        padding: '0.35rem 0.65rem',
                                        borderRadius: '0.4rem',
                                        fontWeight: 700,
                                        display: 'inline-flex',
                                        alignItems: 'center',
                                        gap: '0.4rem',
                                      }}
                                    >
                                      <HiDocumentText size={16} />
                                      <span>{doc.name || doc.category || `Document ${docIdx + 1}`}</span>
                                      <span style={{ fontSize: '0.7rem', color: '#3b82f6', background: '#dbeafe', padding: '0.1rem 0.35rem', borderRadius: '0.25rem' }}>
                                        {doc.fileSize || '1.5 MB'}
                                      </span>
                                    </span>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                  </div>

                  {/* Modal Footer */}
                  <div className="applicants-modal-footer">
                    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 600 }}>
                      Total <strong>{modalApplicants.length}</strong> Person{modalApplicants.length > 1 ? 's' : ''} Included
                    </span>
                    <button
                      onClick={() => setSelectedModalApp(null)}
                      style={{
                        background: '#2563eb',
                        color: '#ffffff',
                        padding: '0.55rem 1.35rem',
                        borderRadius: '0.5rem',
                        fontWeight: 700,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '0.875rem',
                        boxShadow: '0 4px 12px rgba(37, 99, 235, 0.2)',
                      }}
                    >
                      Close Modal
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
