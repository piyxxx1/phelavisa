import { useState } from 'react';
import { HiDevicePhoneMobile, HiEnvelope, HiUser, HiArrowLeft } from 'react-icons/hi2';

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
}

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigateHome: () => void;
}

export const LoginPage = ({ onLoginSuccess, onNavigateHome }: LoginPageProps) => {
  const [loginMethod, setLoginMethod] = useState<'phone' | 'email'>('phone');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (loginMethod === 'phone' && !phone) {
      alert('Please enter your mobile number.');
      return;
    }
    if (loginMethod === 'email' && !email) {
      alert('Please enter your email address.');
      return;
    }
    setOtpSent(true);
  };

  const handleVerifyAndLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() ? name.trim() : 'Piyush';
    const userProfile: UserProfile = {
      name: finalName,
      email: email || `${finalName.toLowerCase()}@example.com`,
      phone: phone || '9876543210',
    };
    onLoginSuccess(userProfile);
  };

  const handleQuickLogin = (quickName: string) => {
    const userProfile: UserProfile = {
      name: quickName,
      email: `${quickName.toLowerCase()}@example.com`,
      phone: '9876543210',
    };
    onLoginSuccess(userProfile);
  };

  return (
    <div className="login-page-wrapper">
      <div className="login-floating-card">
        {/* Top Header */}
        <div className="login-card-header">
          <div className="brand-logo-circle">
            <img src="/logo.png" alt="Pehla Visa" className="login-logo-img" />
          </div>
          <h2 className="login-welcome-title">Welcome to Pehla Visa</h2>
          <p className="login-welcome-subtitle">
            Sign in to track your visa applications, manage documents, and get express approvals.
          </p>
        </div>

        {/* Quick One-Click Test Login Demo Buttons */}
        <div className="quick-login-demo-bar">
          <span className="demo-label">⚡ Quick One-Click Login:</span>
          <div className="demo-btn-group">
            <button type="button" className="quick-demo-chip" onClick={() => handleQuickLogin('Piyush')}>
              <HiUser style={{ display: 'inline', marginRight: 4 }} /> Login as Piyush
            </button>
            <button type="button" className="quick-demo-chip" onClick={() => handleQuickLogin('Ananya')}>
              <HiUser style={{ display: 'inline', marginRight: 4 }} /> Login as Ananya
            </button>
          </div>
        </div>

        <div className="login-divider-or">
          <span>OR ENTER YOUR DETAILS</span>
        </div>

        {/* Tab Switcher */}
        <div className="login-tabs-bar">
          <button
            type="button"
            className={`login-tab ${loginMethod === 'phone' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('phone'); setOtpSent(false); }}
          >
            <HiDevicePhoneMobile style={{ display: 'inline', marginRight: 4 }} /> Mobile Number
          </button>
          <button
            type="button"
            className={`login-tab ${loginMethod === 'email' ? 'active' : ''}`}
            onClick={() => { setLoginMethod('email'); setOtpSent(false); }}
          >
            <HiEnvelope style={{ display: 'inline', marginRight: 4 }} /> Email Address
          </button>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="login-form-body">
            <div className="login-input-group">
              <label>Your Full Name</label>
              <input
                type="text"
                placeholder="e.g. Piyush Sharma"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {loginMethod === 'phone' ? (
              <div className="login-input-group">
                <label>Mobile Number</label>
                <div className="phone-prefix-input-row">
                  <span className="country-code-badge">+91</span>
                  <input
                    type="tel"
                    placeholder="Enter 10 digit number"
                    maxLength={10}
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                  />
                </div>
              </div>
            ) : (
              <div className="login-input-group">
                <label>Email Address</label>
                <input
                  type="email"
                  placeholder="e.g. piyush@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            )}

            <button type="submit" className="login-submit-btn">
              Get OTP Verification Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyAndLogin} className="login-form-body">
            <div className="otp-sent-notice">
              <span>Code sent to <strong>{loginMethod === 'phone' ? `+91 ${phone}` : email}</strong></span>
              <button type="button" className="edit-num-btn" onClick={() => setOtpSent(false)}>Edit</button>
            </div>

            <div className="login-input-group">
              <label>Enter 4-Digit OTP Code</label>
              <input
                type="text"
                placeholder="Enter 1 2 3 4"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="otp-center-input"
                required
              />
            </div>

            <button type="submit" className="login-submit-btn">
              Verify OTP & Login Now
            </button>
          </form>
        )}

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
