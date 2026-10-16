import React from 'react';
import type { UserProfile } from './LoginPage';
import {
  HiUser,
  HiEnvelope,
  HiPhone,
  HiIdentification,
  HiShieldCheck,
  HiArrowLeft,
  HiShoppingBag,
  HiArrowRightOnRectangle,
} from 'react-icons/hi2';

interface ProfilePageProps {
  user: UserProfile | null;
  onLogout: () => void;
  onNavigate: (page: 'home' | 'visas' | 'b2b' | 'login' | 'dummy-tickets' | 'orders' | 'profile') => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({ user, onLogout, onNavigate }) => {
  if (!user) {
    return (
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem', textAlign: 'center', background: '#ffffff', borderRadius: '1rem', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.08)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>Login Required</h2>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Please log in to view your profile account details.</p>
        <button
          onClick={() => onNavigate('login')}
          style={{ background: '#2563eb', color: '#ffffff', padding: '0.75rem 1.75rem', borderRadius: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer' }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div className="profile-page-wrapper">
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <button
          onClick={() => onNavigate('home')}
          style={{ background: 'none', border: 'none', color: '#2563eb', fontSize: '0.875rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '1rem' }}
        >
          <HiArrowLeft /> Back to Home
        </button>

        {/* Profile Card Header */}
        <div className="profile-header-card" style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.75rem', border: '1px solid #e2e8f0', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)', marginBottom: '1.25rem' }}>
          <div className="profile-avatar-row" style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', flexWrap: 'wrap' }}>
            <div className="profile-avatar-circle" style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', fontWeight: 900, boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)' }}>
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'inherit' }}>
                <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>{user.name}</h1>
                <span style={{ background: '#dcfce7', color: '#15803d', fontSize: '0.725rem', fontWeight: 800, padding: '0.15rem 0.5rem', borderRadius: '999px', display: 'inline-flex', alignItems: 'center', gap: '0.25rem' }}>
                  <HiShieldCheck /> Verified Member
                </span>
              </div>
              <p style={{ color: '#64748b', margin: '0.25rem 0 0 0', fontSize: '0.875rem' }}>{user.email || user.phone}</p>
            </div>

            <button
              className="profile-orders-btn"
              onClick={() => onNavigate('orders')}
              style={{ background: '#2563eb', color: '#ffffff', padding: '0.65rem 1.25rem', borderRadius: '0.5rem', fontWeight: 700, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            >
              <HiShoppingBag /> View My Orders
            </button>
          </div>
        </div>

        {/* Profile Info Details Grid */}
        <div style={{ background: '#ffffff', borderRadius: '1rem', padding: '1.5rem', border: '1px solid #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.03)' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: '0 0 1.15rem 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '0.65rem' }}>
            Personal Account Information
          </h3>

          <div className="profile-info-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
            <div className="profile-info-card" style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <HiUser style={{ color: '#2563eb' }} /> Full Name
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.name}</strong>
            </div>

            <div className="profile-info-card" style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <HiEnvelope style={{ color: '#2563eb' }} /> Email Address
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.email || 'Not Provided'}</strong>
            </div>

            <div className="profile-info-card" style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <HiPhone style={{ color: '#2563eb' }} /> Phone Number
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a' }}>{user.phone || 'Not Provided'}</strong>
            </div>

            <div className="profile-info-card" style={{ background: '#f8fafc', padding: '0.9rem', borderRadius: '0.75rem', border: '1px solid #e2e8f0' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.25rem' }}>
                <HiIdentification style={{ color: '#2563eb' }} /> Passport Number
              </span>
              <strong style={{ fontSize: '0.95rem', color: '#0f172a', fontFamily: 'monospace' }}>{user.passportNumber || 'Not Provided'}</strong>
            </div>
          </div>

          <div className="profile-footer-bar" style={{ marginTop: '1.5rem', paddingTop: '1.15rem', borderTop: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>Account Security Status: <strong style={{ color: '#166534' }}>Encrypted & Active</strong></span>
            <button
              className="profile-logout-btn"
              onClick={() => {
                onLogout();
                onNavigate('home');
              }}
              style={{ background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5', padding: '0.6rem 1.15rem', borderRadius: '0.5rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
            >
              <HiArrowRightOnRectangle /> Logout Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
