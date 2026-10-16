import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../context/AdminContext';
import {
  HiPlus,
  HiMagnifyingGlass,
  HiPencilSquare,
  HiTrash,
  HiClock,
  HiGlobeAlt,
  HiArrowPath,
} from 'react-icons/hi2';

export const AdminVisasPage = ({ onNavigateNewVisa, onEditVisa }) => {
  const navigate = useNavigate();
  const { visas, deleteVisa, updateVisa, fetchVisas } = useAdmin();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch live visas from MongoDB Atlas on page mount
  useEffect(() => {
    let mounted = true;
    async function loadVisas() {
      if (visas.length === 0) setLoading(true);
      try {
        await fetchVisas();
      } finally {
        if (mounted) setLoading(false);
      }
    }
    loadVisas();
    return () => { mounted = false; };
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await fetchVisas();
    } finally {
      setRefreshing(false);
    }
  };

  const handleNewVisa = () => {
    if (onNavigateNewVisa) onNavigateNewVisa();
    navigate('/newvisa');
  };

  const handleEditVisaClick = (visaId) => {
    if (onEditVisa) onEditVisa(visaId);
    navigate(`/visas/edit/${visaId}`);
  };

  const filteredVisas = useMemo(() => {
    return (visas || []).filter((visa) => {
      const countryStr = (visa.country || '').toLowerCase();
      const titleStr = (visa.title || '').toLowerCase();
      const q = searchQuery.toLowerCase();
      const matchesSearch = countryStr.includes(q) || titleStr.includes(q);
      const matchesRegion = selectedRegion === 'All' || visa.region === selectedRegion;
      return matchesSearch && matchesRegion;
    });
  }, [visas, searchQuery, selectedRegion]);

  const handleDelete = (id, country) => {
    if (window.confirm(`Are you sure you want to delete ${country} visa listing?`)) {
      deleteVisa(id);
    }
  };

  const togglePopular = (visa) => {
    updateVisa({ ...visa, popular: !visa.popular });
  };

  return (
    <div className="admin-visas-page-container">
      {/* Header Bar */}
      <div className="admin-page-header-flex">
        <div>
          <h1 className="admin-page-title">Visa Listings Manager</h1>
          <p className="admin-page-subtitle">
            Create, edit page details, update prices, manage required documents, and configure visa listings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="admin-secondary-btn"
            onClick={handleRefresh}
            disabled={refreshing}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.6rem 1rem', borderRadius: '0.5rem', background: '#f1f5f9', border: '1px solid #cbd5e1', cursor: 'pointer', fontWeight: 600, color: '#334155' }}
          >
            <HiArrowPath size={16} className={refreshing ? 'spin-icon' : ''} />
            <span>{refreshing ? 'Refreshing...' : 'Sync Database'}</span>
          </button>

          <button className="admin-primary-btn" onClick={handleNewVisa}>
            <HiPlus size={18} />
            <span>Add New Visa Listing</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="admin-filters-card">
        <div className="admin-search-input-box">
          <HiMagnifyingGlass size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search visa by country or title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="region-filter-pills">
          {['All', 'Americas', 'Europe', 'Asia', 'Middle East', 'Africa', 'Oceania'].map((reg) => (
            <button
              key={reg}
              className={`region-pill-btn ${selectedRegion === reg ? 'active' : ''}`}
              onClick={() => setSelectedRegion(reg)}
            >
              {reg}
            </button>
          ))}
        </div>
      </div>

      {/* Visas Table */}
      <div className="admin-content-section-card">
        <div className="table-responsive-wrapper">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Country</th>
                <th>Region</th>
                <th>Category</th>
                <th>Price (₹)</th>
                <th>Processing Time</th>
                <th>Popular Tag</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500" style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                      <HiArrowPath size={18} className="spin-icon" />
                      <span>Loading visa listings from MongoDB Atlas...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredVisas.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-6 text-gray-500" style={{ textAlign: 'center', padding: '2rem' }}>
                    No visa listings found in database matching your filter.
                  </td>
                </tr>
              ) : (
                filteredVisas.map((visa) => {
                  const effectiveId = visa.id || visa._id;
                  return (
                  <tr key={effectiveId}>
                    <td>
                      <div className="visa-country-cell" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ position: 'relative', width: '46px', height: '32px', flexShrink: 0 }}>
                          <img
                            src={visa.coverImg || `https://flagcdn.com/w80/${(visa.flagCode || 'fr').toLowerCase()}.png`}
                            alt={visa.country}
                            style={{ width: '46px', height: '32px', borderRadius: '0.4rem', objectFit: 'cover', border: '1px solid #cbd5e1' }}
                            onError={(e) => {
                              e.currentTarget.src = `https://flagcdn.com/w80/${(visa.flagCode || 'fr').toLowerCase()}.png`;
                            }}
                          />
                          <img
                            src={`https://flagcdn.com/w40/${(visa.flagCode || 'fr').toLowerCase()}.png`}
                            alt={`${visa.country} Flag`}
                            style={{
                              position: 'absolute',
                              bottom: '-4px',
                              right: '-4px',
                              width: '22px',
                              height: '16px',
                              borderRadius: '0.2rem',
                              objectFit: 'cover',
                              border: '1.5px solid #ffffff',
                              boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                            }}
                            onError={(e) => {
                              e.currentTarget.style.display = 'none';
                            }}
                          />
                        </div>
                        <div>
                          <strong className="visa-country-title" style={{ fontSize: '0.925rem', color: '#0f172a', display: 'block' }}>
                            {visa.country}
                          </strong>
                          <div className="visa-sub-title" style={{ fontSize: '0.75rem', color: '#64748b' }}>
                            {visa.title}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="region-badge"><HiGlobeAlt size={12} /> {visa.region}</span>
                    </td>
                    <td>
                      <span className="category-badge">{visa.visaCategory}</span>
                    </td>
                    <td>
                      <strong className="price-tag">{visa.price}</strong>
                    </td>
                    <td>
                      <span className="time-badge"><HiClock size={12} /> {visa.processingTime}</span>
                    </td>
                    <td>
                      <button
                        className={`toggle-switch-btn ${visa.popular ? 'on' : 'off'}`}
                        onClick={() => togglePopular(visa)}
                      >
                        {visa.popular ? '★ Featured' : 'Normal'}
                      </button>
                    </td>
                    <td>
                      <div className="action-buttons-group">
                        <button
                          className="action-edit-btn"
                          onClick={() => handleEditVisaClick(effectiveId)}
                          title="Edit Visa Page Details & Required Documents"
                        >
                          <HiPencilSquare size={16} />
                          <span>Edit Details</span>
                        </button>
                        <button
                          className="action-delete-btn"
                          onClick={() => handleDelete(effectiveId, visa.country)}
                          title="Delete Visa Listing"
                        >
                          <HiTrash size={16} />
                        </button>
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
    </div>
  );
};
