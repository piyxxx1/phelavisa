import { useState, useMemo } from 'react';
import { FilterBar, type FilterState } from './FilterBar';
import { CountryVisaCard } from './CountryVisaCard';
import { ALL_VISAS, type VisaDestination } from '../data/visasData';
import { HiArrowRight } from 'react-icons/hi2';

const REGIONS = ['All', 'Asia', 'Europe', 'Middle East', 'Americas'];

interface PopularVisasProps {
  onSelectVisa?: (visa: VisaDestination) => void;
}

export const PopularVisas = ({ onSelectVisa }: PopularVisasProps) => {
  const [filters, setFilters] = useState<FilterState>({
    deliveryTime: 'All',
    type: 'All',
    documents: 'All',
    region: 'All',
  });

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredVisas = useMemo(() => {
    return ALL_VISAS.filter((v: VisaDestination) => {
      // Region Filter
      if (filters.region !== 'All' && v.region !== filters.region) return false;

      // Delivery Time Filter
      if (filters.deliveryTime !== 'All' && v.deliveryTime !== filters.deliveryTime) return false;

      // Type Filter
      if (filters.type !== 'All' && v.type !== filters.type) return false;

      // Documents Filter
      if (filters.documents !== 'All' && v.documents !== filters.documents) return false;

      return true;
    });
  }, [filters]);

  return (
    <section id="visas" className="section-padding bg-gray-light">
      <div className="section-container">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
          <span className="section-subtitle-tag">99country Style Visa Finder</span>
          <h2 className="section-main-title">Fast Track Visas & Real-Time Filter</h2>
          <p className="section-desc">
            Filter travel destinations by delivery speed, visa type, documents, and region.
          </p>
        </div>

        {/* Region Category Pills synced with Region Filter */}
        <div className="category-pills-bar" style={{ marginBottom: '2rem' }}>
          {REGIONS.map((cat) => (
            <button
              key={cat}
              className={`pill-tab ${filters.region === cat ? 'active' : ''}`}
              onClick={() => handleFilterChange('region', cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 99country Floating Glass Filter Bar */}
        <FilterBar
          filters={filters}
          onFilterChange={handleFilterChange}
          resultsCount={filteredVisas.length}
        />

        {/* Results Summary Subtitle */}
        <div className="results-count-bar-99">
          Showing <strong>{filteredVisas.length}</strong> destinations
        </div>

        {/* 99country Style Visa Cards Grid */}
        <div className="grid-99country">
          {filteredVisas.map((visa) => (
            <CountryVisaCard key={visa.id} visa={visa} onSelect={onSelectVisa} />
          ))}
        </div>

        {filteredVisas.length === 0 && (
          <div className="no-results-box" style={{ margin: '2rem 0 3rem' }}>
            <h3>No Destinations Found</h3>
            <p>No visas match your selected filter criteria. Try resetting filters.</p>
            <button
              className="reset-search-btn"
              onClick={() => {
                setFilters({ deliveryTime: 'All', type: 'All', documents: 'All', region: 'All' });
              }}
            >
              Reset Filters
            </button>
          </div>
        )}

        <div className="view-all-bar">
          <button
            className="view-all-btn"
            onClick={() => {
              window.history.pushState(null, '', '/visas');
              window.dispatchEvent(new PopStateEvent('popstate'));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            Explore All 150+ Visas
            <HiArrowRight size={18} />
          </button>
        </div>
      </div>
    </section>
  );
};
