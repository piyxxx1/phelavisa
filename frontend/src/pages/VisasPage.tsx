import { useState, useMemo, useEffect, useRef } from 'react';
import type { VisaDestination } from '../data/visasData';
import { FilterBar, type FilterState } from '../components/FilterBar';
import { CountryVisaCard } from '../components/CountryVisaCard';
import { HiMagnifyingGlass, HiXMark, HiArrowRight } from 'react-icons/hi2';
import { API_BASE_URL } from '../config/apiConfig';

const REGIONS = ['All', 'Popular', 'Asia', 'Europe', 'Middle East', 'Americas', 'Africa', 'Oceania'];

interface VisasPageProps {
  onSelectVisa?: (visa: VisaDestination) => void;
}

export const VisasPage = ({ onSelectVisa }: VisasPageProps) => {
  const [visas, setVisas] = useState<VisaDestination[]>([]);
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [filters, setFilters] = useState<FilterState>({
    deliveryTime: 'All',
    type: 'All',
    documents: 'All',
    region: 'All',
  });

  useEffect(() => {
    async function loadVisas() {
      try {
        const res = await fetch(`${API_BASE_URL}/visas`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setVisas(data);
          }
        }
      } catch (err) {
        console.warn('Frontend API visas fetch warning:', err);
      }
    }
    loadVisas();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dropdownSearchResults = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === '') return [];
    const q = searchQuery.toLowerCase().trim();
    return visas.filter((v) => {
      const country = (v.country || '').toLowerCase();
      const title = (v.title || '').toLowerCase();
      const type = (v.type || '').toLowerCase();
      const region = (v.region || '').toLowerCase();
      const cat = (v.visaCategory || '').toLowerCase();
      return (
        country.includes(q) ||
        title.includes(q) ||
        type.includes(q) ||
        region.includes(q) ||
        cat.includes(q)
      );
    }).slice(0, 6);
  }, [searchQuery, visas]);

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'region') {
      setSelectedRegion(value);
    }
  };

  const handleRegionTabClick = (region: string) => {
    setSelectedRegion(region);
    setFilters((prev) => ({ ...prev, region: region === 'Popular' ? 'All' : region }));
  };

  const filteredVisas = useMemo(() => {
    return visas.filter((v: VisaDestination) => {
      // Popular Tab
      if (selectedRegion === 'Popular' && !v.popular) return false;
      // Region Tab / FilterBar Region
      if (selectedRegion !== 'All' && selectedRegion !== 'Popular') {
        const regionMatch = v.region === selectedRegion || (v.regionTags && v.regionTags.includes(selectedRegion));
        if (!regionMatch) return false;
      }

      if (filters.region !== 'All') {
        const regionMatch = v.region === filters.region || (v.regionTags && v.regionTags.includes(filters.region));
        if (!regionMatch) return false;
      }

      // Delivery Time Filter
      if (filters.deliveryTime !== 'All') {
        const targetDelivery = filters.deliveryTime.toLowerCase().trim();
        const vDelivery = (v.deliveryTime || '').toLowerCase().trim();
        const vGetBy = (v.getBy || '').toLowerCase().trim();
        const hasTagMatch = v.deliveryTimeTags?.some((t) => t.toLowerCase().trim().includes(targetDelivery) || targetDelivery.includes(t.toLowerCase().trim()));

        if (!vDelivery.includes(targetDelivery) && !targetDelivery.includes(vDelivery) && !vGetBy.includes(targetDelivery) && !hasTagMatch) {
          return false;
        }
      }

      // Type Filter
      if (filters.type !== 'All') {
        const rawTarget = filters.type.toLowerCase().trim();
        const normTarget = rawTarget.replace(/[^a-z0-9]/g, '');
        const vType = (v.type || '').toLowerCase().replace(/[^a-z0-9]/g, '');
        const vCategory = (v.visaCategory || '').toLowerCase().replace(/[^a-z0-9]/g, '');

        const hasTagMatch = v.typeTags?.some((t) => {
          const normT = t.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normT.includes(normTarget) || normTarget.includes(normT);
        });

        const hasCustomCategoryMatch = v.customCategories?.some((c) => {
          const normC = c.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          return normC.includes(normTarget) || normTarget.includes(normC);
        });

        if (!vType.includes(normTarget) && !normTarget.includes(vType) && !vCategory.includes(normTarget) && !normTarget.includes(vCategory) && !hasCustomCategoryMatch && !hasTagMatch) {
          return false;
        }
      }

      // Documents Filter
      if (filters.documents !== 'All') {
        const targetDoc = filters.documents.toLowerCase().trim();
        const vDoc = (v.documents || '').toLowerCase().trim();
        const hasTagMatch = v.documentsTags?.some((t) => t.toLowerCase().trim().includes(targetDoc) || targetDoc.includes(t.toLowerCase().trim()));

        if (!vDoc.includes(targetDoc) && !targetDoc.includes(vDoc) && !hasTagMatch) {
          return false;
        }
      }

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const countryMatch = v.country ? v.country.toLowerCase().includes(query) : false;
        const titleMatch = v.title ? v.title.toLowerCase().includes(query) : false;
        const regionMatch = v.region ? v.region.toLowerCase().includes(query) : false;
        
        return countryMatch || titleMatch || regionMatch;
      }

      return true;
    });
  }, [visas, selectedRegion, searchQuery, filters]);

  const resetAllFilters = () => {
    setSelectedRegion('All');
    setSearchQuery('');
    setFilters({ deliveryTime: 'All', type: 'All', documents: 'All', region: 'All' });
  };

  return (
    <div className="visas-page-wrapper">
      {/* Header Banner */}
      <section className="visas-hero-section">
        <div className="visas-hero-container">
          <span className="visas-hero-badge">150+ Destinations Available</span>
          <h1 className="visas-hero-title">Explore Visa Services</h1>
          <p className="visas-hero-subtitle">
            Find and apply for international visas online with India's fastest and most reliable visa processing service.
          </p>

          {/* Search Input Box */}
          <div ref={wrapperRef} className="hero-search-box" style={{ margin: '0 auto', marginTop: '2rem', position: 'relative' }}>
            <div className="search-input-inner">
              <div className="search-lens-box-green">
                <HiMagnifyingGlass size={18} />
              </div>
              <input
                type="text"
                className="hero-input-field"
                placeholder="Search Dubai, France, Thailand, USA, Schengen..."
                value={searchQuery}
                onFocus={() => setIsOpen(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsOpen(true);
                }}
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')} style={{ marginRight: '10px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex' }}>
                  <HiXMark size={20} style={{ color: '#64748b' }} />
                </button>
              )}
            </div>

            {/* Real-time Search Dropdown Menu from Database */}
            {isOpen && searchQuery.trim() !== '' && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  zIndex: 100,
                  background: '#ffffff',
                  borderRadius: '0.85rem',
                  border: '1px solid #e2e8f0',
                  boxShadow: '0 20px 40px -10px rgba(0,0,0,0.3)',
                  marginTop: '0.5rem',
                  overflow: 'hidden',
                  textAlign: 'left',
                }}
              >
                <div style={{ padding: '0.5rem 1rem', fontSize: '0.725rem', fontWeight: 800, color: '#2563eb', background: '#eff6ff', borderBottom: '1px solid #dbeafe', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>DATABASE VISA MATCHES FOR "{searchQuery.toUpperCase()}"</span>
                  <span style={{ color: '#64748b' }}>{dropdownSearchResults.length} Results</span>
                </div>

                {dropdownSearchResults.length === 0 ? (
                  <div style={{ padding: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    No visa destinations found matching "{searchQuery}". Try searching "France", "Dubai", or "Thailand".
                  </div>
                ) : (
                  dropdownSearchResults.map((visa) => (
                    <div
                      key={visa.id || (visa as any)._id}
                      onClick={() => {
                        if (onSelectVisa) {
                          onSelectVisa(visa);
                        } else {
                          window.location.href = `/visa/${visa.id || (visa as any)._id}`;
                        }
                        setIsOpen(false);
                      }}
                      style={{
                        padding: '0.85rem 1.15rem',
                        cursor: 'pointer',
                        borderBottom: '1px solid #f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#f8fafc')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#ffffff')}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                        <img
                          src={`https://flagcdn.com/w80/${(visa.flagCode || 'eu').toLowerCase()}.png`}
                          alt={visa.country}
                          style={{ width: '32px', height: '22px', borderRadius: '0.25rem', objectFit: 'cover', boxShadow: '0 2px 4px rgba(0,0,0,0.15)' }}
                        />
                        <div>
                          <strong style={{ fontSize: '0.95rem', color: '#0f172a', display: 'block' }}>
                            {visa.country} — {visa.title}
                          </strong>
                          <span style={{ fontSize: '0.78rem', color: '#64748b' }}>
                            ⚡ {visa.processingTime || visa.deliveryTime || 'Fast Approval'} • {visa.badgeTag || 'POPULAR'}
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <strong style={{ fontSize: '1rem', color: '#2563eb', fontWeight: 800 }}>
                          {visa.price || '₹4,999'}
                        </strong>
                        <HiArrowRight style={{ color: '#94a3b8' }} size={16} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-padding bg-gray-light">
        <div className="section-container">
          {/* Region Tabs */}
          <div className="category-pills-bar" style={{ marginBottom: '2rem' }}>
            {REGIONS.map((region) => (
              <button
                key={region}
                className={`pill-tab ${selectedRegion === region ? 'active' : ''}`}
                onClick={() => handleRegionTabClick(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* 99country Floating Filter Bar */}
          <FilterBar
            filters={filters}
            onFilterChange={handleFilterChange}
            resultsCount={filteredVisas.length}
          />

          {/* Results Count Sub-Header */}
          <div className="results-count-bar-99">
            Showing <strong>{filteredVisas.length}</strong> destinations
          </div>

          {/* 99country Visas Card Grid */}
          <div className="grid-99country">
            {filteredVisas.map((visa) => (
              <CountryVisaCard key={visa.id} visa={visa} onSelect={onSelectVisa} />
            ))}
          </div>

          {filteredVisas.length === 0 && (
            <div className="no-results-box" style={{ margin: '2rem 0 4rem' }}>
              <h3>No Destinations Found</h3>
              <p>We couldn't find any visa matching your selected criteria. Try adjusting filters or search term.</p>
              <button className="reset-search-btn" onClick={resetAllFilters}>
                Reset All Filters
              </button>
            </div>
          )}

          {/* Key Metrics Row */}
          <div className="metrics-banner" style={{ marginTop: '4rem' }}>
            <div className="metric-box">
              <div className="metric-num">150+</div>
              <div className="metric-label">Countries Covered</div>
            </div>
            <div className="metric-box">
              <div className="metric-num">50K+</div>
              <div className="metric-label">Visas Processed</div>
            </div>
            <div className="metric-box">
              <div className="metric-num">99.2%</div>
              <div className="metric-label">Success Rate</div>
            </div>
            <div className="metric-box">
              <div className="metric-num">24/7</div>
              <div className="metric-label">Customer Support</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
