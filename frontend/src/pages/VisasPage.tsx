import { useState, useMemo } from 'react';
import { ALL_VISAS, type VisaDestination } from '../data/visasData';
import { FilterBar, type FilterState } from '../components/FilterBar';
import { CountryVisaCard } from '../components/CountryVisaCard';
import { HiMagnifyingGlass, HiXMark } from 'react-icons/hi2';

const REGIONS = ['All', 'Popular', 'Asia', 'Europe', 'Middle East', 'Americas', 'Africa', 'Oceania'];

interface VisasPageProps {
  onSelectVisa?: (visa: VisaDestination) => void;
}

export const VisasPage = ({ onSelectVisa }: VisasPageProps) => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    deliveryTime: 'All',
    type: 'All',
    documents: 'All',
    region: 'All',
  });

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
    return ALL_VISAS.filter((v: VisaDestination) => {
      // Popular Tab
      if (selectedRegion === 'Popular' && !v.popular) return false;
      // Region Tab / FilterBar Region
      if (selectedRegion !== 'All' && selectedRegion !== 'Popular' && v.region !== selectedRegion) return false;
      if (filters.region !== 'All' && v.region !== filters.region) return false;

      // Delivery Time Filter
      if (filters.deliveryTime !== 'All' && v.deliveryTime !== filters.deliveryTime) return false;

      // Type Filter
      if (filters.type !== 'All' && v.type !== filters.type) return false;

      // Documents Filter
      if (filters.documents !== 'All' && v.documents !== filters.documents) return false;

      // Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        return (
          v.country.toLowerCase().includes(query) ||
          v.title.toLowerCase().includes(query) ||
          v.region.toLowerCase().includes(query)
        );
      }

      return true;
    });
  }, [selectedRegion, searchQuery, filters]);

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
          <div className="visas-search-wrapper">
            <HiMagnifyingGlass className="visas-search-icon" size={22} />
            <input
              type="text"
              className="visas-search-input"
              placeholder="Search by country or region (e.g. Dubai, Schengen, Thailand, Armenia...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                <HiXMark size={18} />
              </button>
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
