import { useState, useMemo } from 'react';

interface VisaDestination {
  id: string;
  country: string;
  region: string;
  flagCode: string;
  coverImg: string;
  title: string;
  processingTime: string;
  stayPeriod: string;
  validity: string;
  entryType: string;
  price: string;
  popular: boolean;
  express: boolean;
}

const ALL_VISAS: VisaDestination[] = [
  {
    id: 'dubai-30',
    country: 'United Arab Emirates',
    region: 'Middle East',
    flagCode: 'ae',
    coverImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
    title: 'Dubai 30 Days Tourist Visa',
    processingTime: '24-48 Hours',
    stayPeriod: '30 Days',
    validity: '60 Days',
    entryType: 'Single Entry',
    price: '₹3,499',
    popular: true,
    express: true,
  },
  {
    id: 'thailand-evisa',
    country: 'Thailand',
    region: 'Asia',
    flagCode: 'th',
    coverImg: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop&q=80',
    title: 'Thailand eVisa Express',
    processingTime: '24-72 Hours',
    stayPeriod: '60 Days',
    validity: '90 Days',
    entryType: 'Single Entry',
    price: '₹2,199',
    popular: true,
    express: true,
  },
  {
    id: 'singapore-tourist',
    country: 'Singapore',
    region: 'Asia',
    flagCode: 'sg',
    coverImg: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80',
    title: 'Singapore Tourist e-Visa',
    processingTime: '3-4 Days',
    stayPeriod: '30 Days',
    validity: '2 Years',
    entryType: 'Multiple Entry',
    price: '₹2,899',
    popular: true,
    express: false,
  },
  {
    id: 'vietnam-30',
    country: 'Vietnam',
    region: 'Asia',
    flagCode: 'vn',
    coverImg: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80',
    title: 'Vietnam 30 Days E-Visa',
    processingTime: '48 Hours',
    stayPeriod: '30 Days',
    validity: '30 Days',
    entryType: 'Single Entry',
    price: '₹1,899',
    popular: true,
    express: true,
  },
  {
    id: 'malaysia-mdac',
    country: 'Malaysia',
    region: 'Asia',
    flagCode: 'my',
    coverImg: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format&fit=crop&q=80',
    title: 'Malaysia eVisa / MDAC',
    processingTime: '24-48 Hours',
    stayPeriod: '30 Days',
    validity: '3 Months',
    entryType: 'Multiple Entry',
    price: '₹1,499',
    popular: true,
    express: true,
  },
  {
    id: 'france-schengen',
    country: 'France / Schengen',
    region: 'Europe',
    flagCode: 'eu',
    coverImg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    title: 'Schengen Short Stay Visa',
    processingTime: '10-15 Days',
    stayPeriod: '90 Days',
    validity: 'Up to 90 Days',
    entryType: 'Single/Multiple',
    price: '₹7,499',
    popular: true,
    express: false,
  },
  {
    id: 'usa-b1b2',
    country: 'United States',
    region: 'Americas',
    flagCode: 'us',
    coverImg: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&auto=format&fit=crop&q=80',
    title: 'USA B1/B2 Visitor Visa',
    processingTime: 'Appointment Based',
    stayPeriod: '6 Months',
    validity: '10 Years',
    entryType: 'Multiple Entry',
    price: '₹14,999',
    popular: true,
    express: false,
  },
  {
    id: 'uk-visitor',
    country: 'United Kingdom',
    region: 'Europe',
    flagCode: 'gb',
    coverImg: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
    title: 'UK Standard Visitor Visa',
    processingTime: '15 Days',
    stayPeriod: '180 Days',
    validity: '6 Months',
    entryType: 'Multiple Entry',
    price: '₹11,499',
    popular: true,
    express: false,
  },
  {
    id: 'japan-tourist',
    country: 'Japan',
    region: 'Asia',
    flagCode: 'jp',
    coverImg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=600&auto=format&fit=crop&q=80',
    title: 'Japan e-Tourist Visa',
    processingTime: '4-5 Days',
    stayPeriod: '15 Days',
    validity: '90 Days',
    entryType: 'Single Entry',
    price: '₹3,299',
    popular: false,
    express: false,
  },
  {
    id: 'australia-visitor',
    country: 'Australia',
    region: 'Oceania',
    flagCode: 'au',
    coverImg: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=600&auto=format&fit=crop&q=80',
    title: 'Australia Subclass 600 Visa',
    processingTime: '15-20 Days',
    stayPeriod: '3 Months',
    validity: '1 Year',
    entryType: 'Multiple Entry',
    price: '₹9,899',
    popular: false,
    express: false,
  },
  {
    id: 'canada-visitor',
    country: 'Canada',
    region: 'Americas',
    flagCode: 'ca',
    coverImg: 'https://images.unsplash.com/photo-1517935703635-27c5696e2465?w=600&auto=format&fit=crop&q=80',
    title: 'Canada Temporary Resident Visa',
    processingTime: '20-30 Days',
    stayPeriod: '6 Months',
    validity: 'Passport Validity',
    entryType: 'Multiple Entry',
    price: '₹12,499',
    popular: false,
    express: false,
  },
  {
    id: 'turkey-evisa',
    country: 'Turkey',
    region: 'Europe',
    flagCode: 'tr',
    coverImg: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=600&auto=format&fit=crop&q=80',
    title: 'Turkey Tourist eVisa',
    processingTime: '24 Hours',
    stayPeriod: '30 Days',
    validity: '180 Days',
    entryType: 'Single Entry',
    price: '₹4,999',
    popular: false,
    express: true,
  },
  {
    id: 'indonesia-bali',
    country: 'Indonesia (Bali)',
    region: 'Asia',
    flagCode: 'id',
    coverImg: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80',
    title: 'Indonesia B213 Tourist eVisa',
    processingTime: '24-48 Hours',
    stayPeriod: '30 Days',
    validity: '90 Days',
    entryType: 'Single Entry',
    price: '₹3,199',
    popular: false,
    express: true,
  },
  {
    id: 'egypt-evisa',
    country: 'Egypt',
    region: 'Africa',
    flagCode: 'eg',
    coverImg: 'https://images.unsplash.com/photo-1572252821143-035a4d6934c9?w=600&auto=format&fit=crop&q=80',
    title: 'Egypt Tourist eVisa',
    processingTime: '3-5 Days',
    stayPeriod: '30 Days',
    validity: '90 Days',
    entryType: 'Single Entry',
    price: '₹2,699',
    popular: false,
    express: false,
  },
  {
    id: 'srilanka-eta',
    country: 'Sri Lanka',
    region: 'Asia',
    flagCode: 'lk',
    coverImg: 'https://images.unsplash.com/photo-1586861635167-e5223aadc9fe?w=600&auto=format&fit=crop&q=80',
    title: 'Sri Lanka Tourist ETA',
    processingTime: '24 Hours',
    stayPeriod: '30 Days',
    validity: '180 Days',
    entryType: 'Double Entry',
    price: '₹1,299',
    popular: false,
    express: true,
  },
  {
    id: 'philippines-visa',
    country: 'Philippines',
    region: 'Asia',
    flagCode: 'ph',
    coverImg: 'https://images.unsplash.com/photo-1518509562904-e7ef99cdcc86?w=600&auto=format&fit=crop&q=80',
    title: 'Philippines 9A Tourist Visa',
    processingTime: '5-7 Days',
    stayPeriod: '30 Days',
    validity: '3 Months',
    entryType: 'Single Entry',
    price: '₹3,799',
    popular: false,
    express: false,
  },
];

const REGIONS = ['All', 'Popular', 'Asia', 'Europe', 'Middle East', 'Americas', 'Africa', 'Oceania'];

export const VisasPage = () => {
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredVisas = useMemo(() => {
    return ALL_VISAS.filter((v) => {
      if (selectedRegion === 'Popular' && !v.popular) return false;
      if (selectedRegion !== 'All' && selectedRegion !== 'Popular' && v.region !== selectedRegion) return false;

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
  }, [selectedRegion, searchQuery]);

  return (
    <div className="visas-page-wrapper">
      {/* Header Banner */}
      <section className="visas-hero-section">
        <div className="visas-hero-container">
          <span className="visas-hero-badge">150+ Destinations Available</span>
          <h1 className="visas-hero-title">Explore Visa Destinations</h1>
          <p className="visas-hero-subtitle">
            Choose from 150+ countries and get your visa processed quickly and reliably with India's #1 agency.
          </p>

          {/* Search Input Box */}
          <div className="visas-search-wrapper">
            <svg className="visas-search-icon" width="22" height="22" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"></path>
            </svg>
            <input
              type="text"
              className="visas-search-input"
              placeholder="Search by country, title or region (e.g. Dubai, Schengen, Thailand...)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="clear-search-btn" onClick={() => setSearchQuery('')}>
                ✕
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <section className="section-padding bg-gray-light">
        <div className="section-container">
          {/* Region Tabs */}
          <div className="category-pills-bar">
            {REGIONS.map((region) => (
              <button
                key={region}
                className={`pill-tab ${selectedRegion === region ? 'active' : ''}`}
                onClick={() => setSelectedRegion(region)}
              >
                {region}
              </button>
            ))}
          </div>

          {/* Results Summary */}
          <div className="results-count-bar">
            <span>Showing <strong>{filteredVisas.length}</strong> visa options</span>
          </div>

          {/* Visas Card Grid */}
          <div className="visas-grid">
            {filteredVisas.map((visa) => (
              <div key={visa.id} className="visa-card">
                <div className="visa-card-cover">
                  <img
                    src={visa.coverImg}
                    alt={visa.country}
                    className="visa-cover-img"
                    loading="lazy"
                  />
                  <div className="visa-cover-gradient"></div>

                  <div className="visa-country-badge">
                    <img
                      src={`https://flagcdn.com/w40/${visa.flagCode === 'eu' ? 'eu' : visa.flagCode}.png`}
                      alt={visa.country}
                      className="visa-flag"
                      onError={(e) => {
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <span>{visa.country}</span>
                  </div>
                  {visa.express && <span className="express-tag">Express ⚡</span>}
                </div>

                <div className="visa-card-body">
                  <h3 className="visa-title">{visa.title}</h3>

                  <div className="visa-details-list">
                    <div className="detail-row">
                      <span className="detail-label">Processing Time:</span>
                      <span className="detail-value highlight">{visa.processingTime}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Stay Duration:</span>
                      <span className="detail-value">{visa.stayPeriod}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Validity:</span>
                      <span className="detail-value">{visa.validity}</span>
                    </div>
                    <div className="detail-row">
                      <span className="detail-label">Entry Type:</span>
                      <span className="detail-value">{visa.entryType}</span>
                    </div>
                  </div>

                  <div className="visa-card-footer">
                    <div className="price-block">
                      <span className="price-label">Starting from</span>
                      <span className="price-amount">{visa.price}</span>
                    </div>

                    <button className="apply-btn">
                      Apply Now
                      <svg width="16" height="16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredVisas.length === 0 && (
            <div className="no-results-box">
              <h3>No Visas Found</h3>
              <p>We couldn't find any visa matching "{searchQuery}". Try searching for another country or select "All".</p>
              <button className="reset-search-btn" onClick={() => { setSearchQuery(''); setSelectedRegion('All'); }}>
                Reset Filters
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
