import { useEffect } from 'react';
import { useAdmin } from '../context/AdminContext';
import {
  HiGlobeAlt,
  HiDocumentText,
  HiCurrencyRupee,
  HiCheckCircle,
  HiArrowRight,
  HiPencilSquare,
} from 'react-icons/hi2';

export const AdminDashboardPage = ({ onNavigateTab, onEditVisa }) => {
  const { visas, applications, updateApplicationStatus, fetchVisas, fetchApplications } = useAdmin();

  useEffect(() => {
    fetchVisas();
    fetchApplications();
  }, []);

  // Metrics
  const totalVisas = visas.length;
  const totalApps = applications.length;
  const totalRevenue = applications.reduce((sum, a) => sum + (a.paymentStatus === 'PAID' ? a.totalPrice : 0), 0);
  const approvedApps = applications.filter((a) => a.applicationStatus === 'APPROVED').length;
  const approvalRate = totalApps > 0 ? Math.round((approvedApps / totalApps) * 100) : 99;

  return (
    <div className="admin-dashboard-container">
      {/* Metrics Cards Grid */}
      <div className="dashboard-metrics-grid">
        <div className="metric-card blue">
          <div className="metric-icon"><HiGlobeAlt size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Active Visa Listings</span>
            <span className="metric-value">{totalVisas} Countries</span>
          </div>
        </div>

        <div className="metric-card purple">
          <div className="metric-icon"><HiDocumentText size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Applications Received</span>
            <span className="metric-value">{totalApps} Total</span>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon"><HiCurrencyRupee size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Revenue Processed</span>
            <span className="metric-value">₹{totalRevenue.toLocaleString('en-IN')}</span>
          </div>
        </div>

        <div className="metric-card yellow">
          <div className="metric-icon"><HiCheckCircle size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Approval Rate</span>
            <span className="metric-value">{approvalRate}% Success</span>
          </div>
        </div>
      </div>

      {/* Recent Applications Table */}
      <div className="admin-content-section-card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Recent User Applications</h3>
            <span className="card-subtitle">Real-time submitted visa applications requiring verification</span>
          </div>
          <button className="view-all-link" onClick={() => onNavigateTab('applications')}>
            <span>View All Applications</span>
            <HiArrowRight size={16} />
          </button>
        </div>

        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Booking Ref</th>
                <th>Applicant Name</th>
                <th>Destination</th>
                <th>Travelers</th>
                <th>Total Fee</th>
                <th>Status</th>
                <th>Submitted</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.slice(0, 5).map((app) => {
                const appId = app.id || app._id;
                return (
                <tr key={appId}>
                  <td>
                    <span className="ref-code">{app.bookingRefId || appId}</span>
                  </td>
                  <td>
                    <strong className="user-name-text">{app.applicantName || 'Applicant'}</strong>
                    <div className="sub-phone">{app.applicantPhone || ''}</div>
                  </td>
                  <td>
                    <span className="country-chip">{app.countryName || 'Visa'}</span>
                  </td>
                  <td>{app.travelersCount || 1} Traveler{(app.travelersCount || 1) > 1 ? 's' : ''}</td>
                  <td><strong>₹{(app.totalPrice || 0).toLocaleString('en-IN')}</strong></td>
                  <td>
                    <span className={`status-badge ${(app.applicationStatus || 'PENDING_VERIFICATION').toLowerCase()}`}>
                      {(app.applicationStatus || 'PENDING_VERIFICATION').replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td>{app.submittedAt || 'Today'}</td>
                  <td>
                    <select
                      value={app.applicationStatus || 'PENDING_VERIFICATION'}
                      onChange={(e) => updateApplicationStatus(appId, e.target.value)}
                      className="status-select-inline"
                    >
                      <option value="PENDING_VERIFICATION">Pending Verification</option>
                      <option value="UNDER_EMBASSY_REVIEW">Under Embassy Review</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </td>
                </tr>
              );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Popular Visas Quick Management */}
      <div className="admin-content-section-card">
        <div className="card-header-flex">
          <div>
            <h3 className="card-title">Top Active Visas</h3>
            <span className="card-subtitle">Quick access to edit details, pricing, and required documents</span>
          </div>
          <button className="view-all-link" onClick={() => onNavigateTab('visas')}>
            <span>Manage All Visas ({visas.length})</span>
            <HiArrowRight size={16} />
          </button>
        </div>

        <div className="visas-quick-grid">
          {visas.slice(0, 6).map((visa) => {
            const visaId = visa.id || visa._id;
            return (
            <div key={visaId} className="visa-quick-card">
              <img
                src={`https://flagcdn.com/w40/${visa.flagCode === 'eu' ? 'eu' : (visa.flagCode || 'in')}.png`}
                alt={visa.country}
                className="quick-flag"
              />
              <div className="quick-info">
                <strong className="quick-country">{visa.country}</strong>
                <span className="quick-price">{visa.price} • {visa.processingTime}</span>
              </div>
              <button className="quick-edit-btn" onClick={() => onEditVisa(visaId)}>
                <HiPencilSquare size={16} />
                <span>Edit Page Details</span>
              </button>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
};
