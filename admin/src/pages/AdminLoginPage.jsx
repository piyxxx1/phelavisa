import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { API_BASE_URL } from '../config/apiConfig';
import { HiLockClosed, HiEnvelope, HiShieldCheck, HiSparkles, HiArrowRight } from 'react-icons/hi2';

export const AdminLoginPage = ({ onLoginSuccess }) => {
  const { loginAdmin } = useAdmin();
  const [email, setEmail] = useState('admin@phelavisa.com');
  const [password, setPassword] = useState('Admin@123456');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const performLogin = async (loginEmail, loginPassword) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: loginEmail, password: loginPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.message || 'Invalid admin credentials');
        setLoading(false);
        return;
      }

      if (data.user && data.user.role !== 'ADMIN') {
        setErrorMsg('Access Denied: You do not have Admin privileges.');
        setLoading(false);
        return;
      }

      loginAdmin(data.user, data.token, data.refreshToken);
      onLoginSuccess();
    } catch (err) {
      console.error('Admin login error:', err);
      setErrorMsg('Server connection error. Make sure backend server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    performLogin(email, password);
  };

  const handleQuickDemo = () => {
    setEmail('admin@phelavisa.com');
    setPassword('Admin@123456');
    performLogin('admin@phelavisa.com', 'Admin@123456');
  };

  return (
    <div className="admin-login-page-wrapper">
      <div className="admin-login-card">
        {/* Logo Image */}
        <div className="admin-login-logo-header">
          <img src="/logo.png" alt="Pehla Visa Admin" className="admin-brand-logo-img" />
          <span className="admin-portal-tag">Enterprise Admin Portal</span>
        </div>

        <h1 className="admin-login-title">Control Center Login</h1>
        <p className="admin-login-subtitle">
          Sign in to manage visa listings, pricing multipliers & user applications.
        </p>

        {errorMsg && (
          <div style={{ background: '#fee2e2', border: '1px solid #fca5a5', color: '#b91c1c', padding: '0.75rem 1rem', borderRadius: '0.5rem', marginBottom: '1.25rem', fontSize: '0.875rem', fontWeight: 700, textAlign: 'center' }}>
            {errorMsg}
          </div>
        )}

        {/* Quick Demo Instant Login Button */}
        <div className="admin-quick-demo-block">
          <button type="button" className="admin-quick-login-chip" onClick={handleQuickDemo} disabled={loading}>
            <HiSparkles size={18} />
            <span>{loading ? 'Authenticating...' : 'One-Click Instant Admin Login (admin@phelavisa.com)'}</span>
          </button>
        </div>

        <div className="login-divider-or">
          <span>OR SIGN IN WITH CREDENTIALS</span>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          <div className="form-input-block">
            <label>Admin Email Address</label>
            <div className="input-with-icon">
              <HiEnvelope className="field-icon" />
              <input
                type="email"
                required
                placeholder="admin@phelavisa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="form-input-block">
            <label>Security Password</label>
            <div className="input-with-icon">
              <HiLockClosed className="field-icon" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="admin-submit-btn" disabled={loading}>
            <span>{loading ? 'Authenticating...' : 'Access Dashboard'}</span>
            <HiArrowRight size={18} />
          </button>
        </form>

        <div className="admin-login-footer-note">
          <HiShieldCheck size={16} className="inline-icon" />
          <span>256-Bit SSL Encrypted Admin Control Panel</span>
        </div>
      </div>
    </div>
  );
};
