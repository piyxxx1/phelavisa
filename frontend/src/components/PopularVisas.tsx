import { useState, useMemo, useEffect } from 'react';
import { FilterBar, type FilterState } from './FilterBar';
import { CountryVisaCard } from './CountryVisaCard';
import type { VisaDestination } from '../data/visasData';
import { HiArrowRight } from 'react-icons/hi2';
import { API_BASE_URL } from '../config/apiConfig';

const REGIONS = ['All', 'Asia', 'Europe', 'Middle East', 'Americas'];

interface PopularVisasProps {
  onSelectVisa?: (visa: VisaDestination) => void;
}

export const PopularVisas = ({ onSelectVisa }: PopularVisasProps) => {
  const [visas, setVisas] = useState<VisaDestination[]>([]);
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

  const handleFilterChange = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const filteredVisas = useMemo(() => {
    return visas.filter((v: VisaDestination) => {
      // Region Filter
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

      return true;
    });
  }, [visas, filters]);

  return (
    <section id="visas" className="section-padding bg-gray-light">
      <div className="section-container">
        <div className="section-header" style={{ marginBottom: '2.5rem' }}>
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
