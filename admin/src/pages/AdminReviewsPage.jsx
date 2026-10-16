import { useState, useEffect } from 'react';
import { API_BASE_URL } from '../config/apiConfig';
import {
  HiStar,
  HiPlus,
  HiPencilSquare,
  HiTrash,
  HiCheckCircle,
  HiUser,
  HiXMark,
  HiChatBubbleBottomCenterText,
  HiArrowUpTray,
} from 'react-icons/hi2';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState(null);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);

  // Form & Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    location: 'Mumbai, India',
    visa: 'Dubai Visa',
    rating: 5,
    quote: '',
    date: 'August 2026',
    avatarUrl: '',
    isFeatured: true,
  });

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingAvatar(true);
    const formDataUpload = new FormData();
    formDataUpload.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/upload`, {
        method: 'POST',
        body: formDataUpload,
      });
      const data = await res.json();
      if (data.fileUrl) {
        setFormData((prev) => ({ ...prev, avatarUrl: data.fileUrl }));
      } else {
        const reader = new FileReader();
        reader.onload = (event) => {
          setFormData((prev) => ({ ...prev, avatarUrl: event.target?.result || '' }));
        };
        reader.readAsDataURL(file);
      }
    } catch (err) {
      console.warn('Backend file upload failed, using client-side Data URL:', err);
      const reader = new FileReader();
      reader.onload = (event) => {
        setFormData((prev) => ({ ...prev, avatarUrl: event.target?.result || '' }));
      };
      reader.readAsDataURL(file);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const fetchReviews = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/reviews`);
      const data = await res.json();
      if (data.success) {
        setReviews(data.data || []);
      } else {
        throw new Error(data.message || 'Failed to load customer reviews');
      }
    } catch (err) {
      console.error('Fetch Reviews Error:', err);
      setError('Could not connect to backend server. Ensure backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleOpenAddModal = () => {
    setEditingReview(null);
    setFormData({
      name: '',
      location: 'Mumbai, India',
      visa: 'Dubai Visa',
      rating: 5,
      quote: '',
      date: 'August 2026',
      avatarUrl: '',
      isFeatured: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rev) => {
    setEditingReview(rev);
    setFormData({
      name: rev.name || '',
      location: rev.location || 'India',
      visa: rev.visa || 'Tourist Visa',
      rating: rev.rating || 5,
      quote: rev.quote || '',
      date: rev.date || 'August 2026',
      avatarUrl: rev.avatarUrl || '',
      isFeatured: rev.isFeatured !== undefined ? rev.isFeatured : true,
    });
    setIsModalOpen(true);
  };

  const handleSaveReview = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.quote.trim() || !formData.visa.trim()) {
      alert('Please fill out Customer Name, Visa Destination, and Review Quote.');
      return;
    }

    try {
      if (editingReview) {
        // Update existing review
        const res = await fetch(`${API_BASE_URL}/reviews/${editingReview.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setSuccessMsg(`Review for "${formData.name}" updated successfully!`);
      } else {
        // Create new review
        const res = await fetch(`${API_BASE_URL}/reviews`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message);
        setSuccessMsg(`New review for "${formData.name}" published successfully!`);
      }

      setIsModalOpen(false);
      fetchReviews();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(`Error saving review: ${err.message}`);
    }
  };

  const handleDeleteReview = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the review by "${name}"?`)) return;

    try {
      const res = await fetch(`${API_BASE_URL}/reviews/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      setSuccessMsg(`Review by "${name}" deleted.`);
      fetchReviews();
      setTimeout(() => setSuccessMsg(null), 3000);
    } catch (err) {
      alert(`Error deleting review: ${err.message}`);
    }
  };

  return (
    <div className="admin-reviews-page-container">
      {/* Page Header */}
      <div className="admin-page-header-flex">
        <div>
          <h1 className="admin-page-title" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <HiChatBubbleBottomCenterText style={{ color: '#2563eb' }} />
            <span>Customer Review & Testimonial Management</span>
          </h1>
          <p className="admin-page-subtitle">
            Manage, edit, add, and feature customer reviews displayed on the Pehla Visa Homepage.
          </p>
        </div>

        <div>
          <button className="admin-primary-btn" onClick={handleOpenAddModal}>
            <HiPlus size={18} />
            <span>Add New Review</span>
          </button>
        </div>
      </div>

      {successMsg && (
        <div className="form-validation-alert" style={{ background: '#f0fdf4', borderColor: '#bbf7d0', color: '#166534', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <HiCheckCircle size={18} />
          <span>{successMsg}</span>
        </div>
      )}

      {error && (
        <div className="form-validation-alert" style={{ background: '#fef2f2', borderColor: '#fca5a5', color: '#991b1b', marginBottom: '1.25rem' }}>
          ⚠️ {error}
        </div>
      )}

      {/* Metrics Banner */}
      <div className="dashboard-metrics-grid" style={{ marginBottom: '1.5rem' }}>
        <div className="metric-card blue">
          <div className="metric-icon"><HiChatBubbleBottomCenterText size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Total Customer Reviews</span>
            <span className="metric-value">{reviews.length} Reviews</span>
          </div>
        </div>

        <div className="metric-card yellow">
          <div className="metric-icon"><HiStar size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">5-Star Rated Reviews</span>
            <span className="metric-value">{reviews.filter((r) => r.rating === 5).length} Five-Star</span>
          </div>
        </div>

        <div className="metric-card green">
          <div className="metric-icon"><HiCheckCircle size={24} /></div>
          <div className="metric-info">
            <span className="metric-label">Homepage Featured</span>
            <span className="metric-value">{reviews.filter((r) => r.isFeatured).length} Active</span>
          </div>
        </div>
      </div>

      {/* Reviews Cards List */}
      <div className="admin-content-section-card">
        <h3 className="card-title" style={{ marginBottom: '1rem' }}>
          Published Testimonials & Reviews List ({reviews.length})
        </h3>

        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            Loading reviews from database...
          </div>
        ) : reviews.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
            No reviews found in database. Click "+ Add New Review" above to create your first customer review!
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.25rem' }}>
            {reviews.map((rev) => (
              <div
                key={rev.id}
                style={{
                  background: '#ffffff',
                  borderRadius: '0.75rem',
                  border: '1px solid #e2e8f0',
                  padding: '1.25rem',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                }}
              >
                <div>
                  {/* Top Star Rating & Featured Badge */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', gap: '0.2rem', color: '#f59e0b' }}>
                      {[...Array(rev.rating || 5)].map((_, s) => (
                        <HiStar key={s} size={16} />
                      ))}
                    </div>
                    {rev.isFeatured && (
                      <span style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.25rem', background: '#dcfce7', color: '#15803d', fontWeight: 700 }}>
                        FEATURED ON HOMEPAGE
                      </span>
                    )}
                  </div>

                  {/* Quote Body */}
                  <p style={{ fontSize: '0.875rem', color: '#334155', fontStyle: 'italic', marginBottom: '1.25rem', lineHeight: 1.5 }}>
                    "{rev.quote}"
                  </p>
                </div>

                {/* Author Info & Actions */}
                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                    {rev.avatarUrl ? (
                      <img
                        src={rev.avatarUrl}
                        alt={rev.name}
                        style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '38px',
                          height: '38px',
                          borderRadius: '50%',
                          background: rev.color || '#2563eb',
                          color: '#ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                        }}
                      >
                        {rev.initial || rev.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>{rev.name}</h4>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', display: 'block' }}>
                        {rev.location} • <strong style={{ color: '#2563eb' }}>{rev.visa}</strong>
                      </span>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(rev)}
                      title="Edit Review"
                      style={{ background: '#eff6ff', color: '#2563eb', border: '1px solid #bfdbfe', borderRadius: '0.35rem', padding: '0.35rem 0.5rem', cursor: 'pointer' }}
                    >
                      <HiPencilSquare size={16} />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteReview(rev.id, rev.name)}
                      title="Delete Review"
                      style={{ background: '#fef2f2', color: '#dc2626', border: '1px solid #fca5a5', borderRadius: '0.35rem', padding: '0.35rem 0.5rem', cursor: 'pointer' }}
                    >
                      <HiTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.65)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: '#ffffff', width: '100%', maxWidth: '580px', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
            <div style={{ background: '#0f172a', color: '#ffffff', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <HiChatBubbleBottomCenterText style={{ color: '#38bdf8' }} />
                <span>{editingReview ? 'Edit Customer Review' : 'Add New Customer Review'}</span>
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
              >
                <HiXMark size={24} />
              </button>
            </div>

            <form onSubmit={handleSaveReview} style={{ padding: '1.5rem' }}>
              <div className="form-grid-2col" style={{ marginBottom: '1rem' }}>
                <div className="form-input-block">
                  <label>Customer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Priya Sharma"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div className="form-input-block">
                  <label>Customer Location</label>
                  <input
                    type="text"
                    placeholder="e.g. Mumbai, India"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-grid-2col" style={{ marginBottom: '1rem' }}>
                <div className="form-input-block">
                  <label>Visa Destination / Category *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dubai Visa, Schengen Visa"
                    value={formData.visa}
                    onChange={(e) => setFormData({ ...formData, visa: e.target.value })}
                  />
                </div>

                <div className="form-input-block">
                  <label>Star Rating (1 to 5) *</label>
                  <select
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                    className="form-select-input"
                  >
                    <option value={5}>⭐⭐⭐⭐⭐ 5 Stars (Excellent)</option>
                    <option value={4}>⭐⭐⭐⭐ 4 Stars (Very Good)</option>
                    <option value={3}>⭐⭐⭐ 3 Stars (Average)</option>
                  </select>
                </div>
              </div>

              <div className="form-input-block" style={{ marginBottom: '1rem' }}>
                <label>Review Quote / Detailed Comment *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="e.g. Amazing service! Got my visa approved in 2 hours with Pehla Visa..."
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  style={{ width: '100%', padding: '0.6rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', fontSize: '0.875rem' }}
                />
              </div>

              <div className="form-grid-2col" style={{ marginBottom: '1.25rem' }}>
                <div className="form-input-block">
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700, color: '#0f172a' }}>
                    <HiArrowUpTray size={16} style={{ color: '#2563eb' }} />
                    <span>Upload Customer Photo (Avatar)</span>
                  </label>

                  {formData.avatarUrl ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', background: '#f8fafc', padding: '0.5rem 0.75rem', borderRadius: '0.5rem', border: '1px solid #cbd5e1', marginTop: '0.25rem' }}>
                      <img
                        src={formData.avatarUrl}
                        alt="Customer Avatar"
                        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #2563eb' }}
                      />
                      <div style={{ flex: 1, overflow: 'hidden' }}>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#1e293b', display: 'block' }}>Photo Uploaded</span>
                        <span style={{ fontSize: '0.7rem', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                          {formData.avatarUrl}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setFormData({ ...formData, avatarUrl: '' })}
                        style={{ background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: '0.35rem', padding: '0.3rem 0.5rem', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                      >
                        ✕ Remove
                      </button>
                    </div>
                  ) : (
                    <div style={{ marginTop: '0.25rem' }}>
                      <input
                        type="file"
                        id="avatar-file-input"
                        accept="image/*"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                      />
                      <label
                        htmlFor="avatar-file-input"
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '0.5rem',
                          background: '#f8fafc',
                          border: '2px dashed #94a3b8',
                          padding: '0.55rem 0.85rem',
                          borderRadius: '0.5rem',
                          cursor: 'pointer',
                          fontSize: '0.825rem',
                          fontWeight: 700,
                          color: '#334155',
                          transition: 'all 0.15s ease',
                        }}
                      >
                        <HiArrowUpTray size={18} style={{ color: '#2563eb' }} />
                        <span>{uploadingAvatar ? 'Uploading photo...' : 'Click to Upload Photo File'}</span>
                      </label>
                    </div>
                  )}
                </div>

                <div className="form-input-block">
                  <label>Review Date</label>
                  <input
                    type="text"
                    placeholder="e.g. August 2026"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  />
                </div>
              </div>

              <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 600, fontSize: '0.875rem', color: '#1e293b' }}>
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                  />
                  <span>Feature this review on Pehla Visa Homepage</span>
                </label>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <button
                  type="button"
                  className="admin-secondary-btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="admin-primary-btn">
                  <HiCheckCircle size={18} />
                  <span>{editingReview ? 'Update Review' : 'Publish Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
