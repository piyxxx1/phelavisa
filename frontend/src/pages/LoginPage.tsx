import React, { useState } from 'react';
import { HiEnvelope, HiUser, HiArrowLeft } from 'react-icons/hi2';
import { API_BASE_URL } from '../config/apiConfig';

export interface UserProfile {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  passportNumber?: string;
  role?: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateHome: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onLoginSuccess, onNavigateHome }) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMessage(null);

    if (!email || !password) {
      alert('Please enter your email and password.');
      return;
    }
    if (authMode === 'register' && !name) {
      alert('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      const endpoint = authMode === 'register' ? `${API_BASE_URL}/auth/register` : `${API_BASE_URL}/auth/login`;
      const body = authMode === 'register'
        ? { name, email, phone, password, passportNumber }
        : { email, password };

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) {
        alert(data.message || 'Authentication failed. Please try again.');
        setLoading(false);
        return;
      }

      // REGISTRATION SUCCESS FLOW: DO NOT Auto-login. Show Alert & Switch to Sign In Tab!
      if (authMode === 'register') {
        setSuccessMessage('🎉 Account created successfully! Please log in with your ID & Password below.');
        setAuthMode('login');
        setPassword('');
        setLoading(false);
        return;
      }

      // LOGIN SUCCESS FLOW: Save tokens and log user in
      if (data.token) {
        try {
          localStorage.setItem('pehla_visa_token', data.token);
          if (data.refreshToken) localStorage.setItem('pehla_visa_refresh_token', data.refreshToken);
        } catch {
          // ignore
        }
      }

      const userProfile: UserProfile = {
        id: data.user.id || data.user._id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone || '',
        passportNumber: data.user.passportNumber || '',
        role: data.user.role || 'USER',
      };

      onLoginSuccess(userProfile);
    } catch (err) {
      console.error('Auth error:', err);
      alert('Server connection error. Please make sure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-floating-card">
        {/* Top Header */}
        <div className="login-card-header">
          <div className="brand-logo-circle">
            <img src="/logo.png" alt="Pehla Visa" className="login-logo-img" />
          </div>
          <h2 className="login-welcome-title">
            {authMode === 'login' ? 'Welcome to Pehla Visa' : 'Create New User Account'}
          </h2>
          <p className="login-welcome-subtitle">
            {authMode === 'login'
              ? 'Sign in to track your visa applications and access your account.'
              : 'Register your account to save application history into MongoDB Auth schema.'}
          </p>
        </div>

        {/* Registration Success Notification Banner */}
        {successMessage && (
          <div style={{ background: '#dcfce7', border: '1px solid #86efac', color: '#166534', padding: '0.85rem 1rem', borderRadius: '0.65rem', marginBottom: '1.25rem', fontSize: '0.9rem', fontWeight: 700, textAlign: 'center' }}>
            {successMessage}
          </div>
        )}

        {/* Tab Switcher: Login vs Register */}
        <div className="login-tabs-bar">
          <button
            type="button"
            className={`login-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => setAuthMode('login')}
          >
            <HiUser style={{ display: 'inline', marginRight: 4 }} /> Sign In
          </button>
          <button
            type="button"
            className={`login-tab ${authMode === 'register' ? 'active' : ''}`}
            onClick={() => setAuthMode('register')}
          >
            <HiEnvelope style={{ display: 'inline', marginRight: 4 }} /> Register Account
          </button>
        </div>

        <form onSubmit={handleSubmit} className="login-form-body">
          {authMode === 'register' && (
            <div className="login-input-group">
              <label>Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Piyush Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div className="login-input-group">
            <label>Email Address *</label>
            <input
              type="email"
              placeholder="e.g. piyush@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {authMode === 'register' && (
            <div className="login-input-group">
              <label>Mobile Number (Optional)</label>
              <input
                type="tel"
                placeholder="e.g. +91 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          )}

          <div className="login-input-group">
            <label>Password *</label>
            <input
              type="password"
              placeholder="Enter secure password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {authMode === 'register' && (
            <div className="login-input-group">
              <label>Passport Number (Optional)</label>
              <input
                type="text"
                placeholder="e.g. Z9876543"
                value={passportNumber}
                onChange={(e) => setPassportNumber(e.target.value.toUpperCase())}
              />
            </div>
          )}

          <button type="submit" className="login-submit-btn" disabled={loading}>
            {loading ? 'Processing...' : authMode === 'login' ? 'Sign In Now' : 'Create Account Now'}
          </button>
        </form>

        {/* Back Link Footer */}
        <div className="login-card-footer">
          <button type="button" className="cancel-back-btn" onClick={onNavigateHome}>
            <HiArrowLeft style={{ display: 'inline', marginRight: 4 }} /> Back to Home Page
          </button>
        </div>
      </div>
    </div>
  );
};
