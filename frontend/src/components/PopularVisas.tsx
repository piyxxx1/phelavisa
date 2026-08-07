import { useState } from 'react';

interface VisaItem {
  id: string;
  country: string;
  category: string;
  flagCode: string;
  coverImg: string;
  visaType: string;
  processingTime: string;
  validity: string;
  stayPeriod: string;
  price: string;
  express: boolean;
}

const VISAS_DATA: VisaItem[] = [
  {
    id: 'dubai',
    country: 'United Arab Emirates',
    category: 'Middle East',
    flagCode: 'ae',
    coverImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&auto=format&fit=crop&q=80',
    visaType: 'Dubai 30 Days Tourist Visa',
    processingTime: '24-48 Hours',
    validity: '60 Days',
    stayPeriod: '30 Days',
    price: '₹3,499',
    express: true,
  },
  {
    id: 'thailand',
    country: 'Thailand',
    category: 'Asia',
    flagCode: 'th',
    coverImg: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=600&auto=format&fit=crop&q=80',
    visaType: 'Thailand eVisa Express',
    processingTime: '24-72 Hours',
    validity: '90 Days',
    stayPeriod: '60 Days',
    price: '₹2,199',
    express: true,
  },
  {
    id: 'singapore',
    country: 'Singapore',
    category: 'Asia',
    flagCode: 'sg',
    coverImg: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&auto=format&fit=crop&q=80',
    visaType: 'Singapore Tourist e-Visa',
    processingTime: '3-4 Days',
    validity: '2 Years (Multiple)',
    stayPeriod: '30 Days',
    price: '₹2,899',
    express: false,
  },
  {
    id: 'vietnam',
    country: 'Vietnam',
    category: 'Asia',
    flagCode: 'vn',
    coverImg: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=600&auto=format&fit=crop&q=80',
    visaType: 'Vietnam 30 Days E-Visa',
    processingTime: '48 Hours',
    validity: '30 Days',
    stayPeriod: '30 Days',
    price: '₹1,899',
    express: true,
  },
  {
    id: 'malaysia',
    country: 'Malaysia',
    category: 'Asia',
    flagCode: 'my',
    coverImg: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=600&auto=format&fit=crop&q=80',
    visaType: 'Malaysia eVisa / MDAC',
    processingTime: '24-48 Hours',
    validity: '3 Months',
    stayPeriod: '30 Days',
    price: '₹1,499',
    express: true,
  },
  {
    id: 'schengen',
    country: 'France / Schengen',
    category: 'Europe',
    flagCode: 'eu',
    coverImg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=600&auto=format&fit=crop&q=80',
    visaType: 'Schengen Short Stay Visa',
    processingTime: '10-15 Days',
    validity: 'Up to 90 Days',
    stayPeriod: '90 Days',
    price: '₹7,499',
    express: false,
  },
  {
    id: 'usa',
    country: 'United States',
    category: 'Americas',
    flagCode: 'us',
    coverImg: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=600&auto=format&fit=crop&q=80',
    visaType: 'USA B1/B2 Visitor Visa',
    processingTime: 'Appointment Based',
    validity: '10 Years',
    stayPeriod: '6 Months',
    price: '₹14,999',
    express: false,
  },
  {
    id: 'uk',
    country: 'United Kingdom',
    category: 'Europe',
    flagCode: 'gb',
    coverImg: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=600&auto=format&fit=crop&q=80',
    visaType: 'UK Standard Visitor Visa',
    processingTime: '15 Days',
    validity: '6 Months',
    stayPeriod: '180 Days',
    price: '₹11,499',
    express: false,
  },
];

const CATEGORIES = ['All', 'Asia', 'Europe', 'Middle East', 'Americas'];

export const PopularVisas = () => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredVisas = activeCategory === 'All'
    ? VISAS_DATA
    : VISAS_DATA.filter((v) => v.category === activeCategory);

  return (
    <section id="visas" className="section-padding bg-white">
      <div className="section-container">
        <div className="section-header">
          <span className="section-subtitle-tag">Popular Destinations</span>
          <h2 className="section-main-title">Fast Track Visas for Top Countries</h2>
          <p className="section-desc">
            Select your travel destination and complete your application in under 5 minutes with our guided digital process.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="category-pills-bar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              className={`pill-tab ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Visas Grid */}
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
                  />
                  <span>{visa.country}</span>
                </div>
                {visa.express && <span className="express-tag">Express ⚡</span>}
              </div>

              <div className="visa-card-body">
                <h3 className="visa-title">{visa.visaType}</h3>

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

        <div className="view-all-bar">
          <button className="view-all-btn">
            Explore All 150+ Visas
            <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
};
