import { useState } from 'react';
import { useAdmin } from '../context/AdminContext';
import { HiCheckCircle } from 'react-icons/hi2';

export const AdminSettingsPage = () => {
  const { adminUser } = useAdmin();
  const [defaultVisaPrice, setDefaultVisaPrice] = useState('₹3,500');
  const [defaultOurCharges, setDefaultOurCharges] = useState('₹999');
  const [defaultTaxRate, setDefaultTaxRate] = useState('18% GST');
  const [whatsappSupportPhone, setWhatsappSupportPhone] = useState('+91 98765 43210');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="admin-settings-page-container">
      <div className="admin-page-header-flex">
        <div>
          <h1 className="admin-page-title">Admin & System Settings</h1>
          <p className="admin-page-subtitle">
            Configure default 3-column pricing structure (Visa Price, Our Charges, Tax) and platform support numbers.
          </p>
        </div>

        <button className="admin-primary-btn" onClick={handleSaveSettings}>
          <HiCheckCircle size={20} />
          <span>Save System Settings</span>
        </button>
      </div>

      {savedSuccess && (
        <div className="form-validation-alert" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <HiCheckCircle size={18} />
          <span>System pricing settings saved successfully!</span>
        </div>
      )}

      <form onSubmit={handleSaveSettings} className="admin-content-section-card">
        <h3 className="card-title" style={{ marginBottom: '1.25rem' }}>Global Pricing Breakdown Structure</h3>

        <div className="form-grid-3col">
          <div className="form-input-block">
            <label>1. Visa Price (Embassy/Govt Fee) *</label>
            <input
              type="text"
              value={defaultVisaPrice}
              onChange={(e) => setDefaultVisaPrice(e.target.value)}
              placeholder="e.g. ₹3,500"
            />
          </div>

          <div className="form-input-block">
            <label>2. Our Charges (PehlaVisa Service Fee) *</label>
            <input
              type="text"
              value={defaultOurCharges}
              onChange={(e) => setDefaultOurCharges(e.target.value)}
              placeholder="e.g. ₹999"
            />
          </div>

          <div className="form-input-block">
            <label>3. Tax (GST Rate / Tax Amount) *</label>
            <input
              type="text"
              value={defaultTaxRate}
              onChange={(e) => setDefaultTaxRate(e.target.value)}
              placeholder="e.g. 18% GST"
            />
          </div>
        </div>

        <h3 className="card-title" style={{ margin: '1.75rem 0 1.25rem 0' }}>Support & Notification Line</h3>

        <div className="form-grid-2col">
          <div className="form-input-block">
            <label>WhatsApp Support Phone Number</label>
            <input
              type="text"
              value={whatsappSupportPhone}
              onChange={(e) => setWhatsappSupportPhone(e.target.value)}
            />
          </div>

          <div className="form-input-block">
            <label>Default Platform Currency</label>
            <input type="text" readOnly value="INR (₹ Indian Rupee)" />
          </div>
        </div>
      </form>
    </div>
  );
};
