import { useState } from 'react';

interface DestinationFlag {
  name: string;
  code: string;
  flagUrl: string;
  coverImg: string;
  turnaround: string;
}

const HERO_DESTINATIONS: DestinationFlag[] = [
  { 
    name: 'Dubai', 
    code: 'ae', 
    flagUrl: 'https://flagcdn.com/w160/ae.png', 
    coverImg: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&auto=format&fit=crop&q=80',
    turnaround: '24h Express ⚡'
  },
  { 
    name: 'Thailand', 
    code: 'th', 
    flagUrl: 'https://flagcdn.com/w160/th.png', 
    coverImg: 'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?w=400&auto=format&fit=crop&q=80',
    turnaround: '48h Approval'
  },
  { 
    name: 'Singapore', 
    code: 'sg', 
    flagUrl: 'https://flagcdn.com/w160/sg.png', 
    coverImg: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=400&auto=format&fit=crop&q=80',
    turnaround: '3 Days'
  },
  { 
    name: 'Vietnam', 
    code: 'vn', 
    flagUrl: 'https://flagcdn.com/w160/vn.png', 
    coverImg: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400&auto=format&fit=crop&q=80',
    turnaround: '24h Express ⚡'
  },
  { 
    name: 'Malaysia', 
    code: 'my', 
    flagUrl: 'https://flagcdn.com/w160/my.png', 
    coverImg: 'https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&auto=format&fit=crop&q=80',
    turnaround: '24h eVisa'
  },
  { 
    name: 'France / Schengen', 
    code: 'fr', 
    flagUrl: 'https://flagcdn.com/w160/eu.png', 
    coverImg: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=400&auto=format&fit=crop&q=80',
    turnaround: 'Guaranteed Slot'
  },
  { 
    name: 'USA', 
    code: 'us', 
    flagUrl: 'https://flagcdn.com/w160/us.png', 
    coverImg: 'https://images.unsplash.com/photo-1485871981521-5b1fd3805eee?w=400&auto=format&fit=crop&q=80',
    turnaround: '10 Years B1/B2'
  },
  { 
    name: 'United Kingdom', 
    code: 'gb', 
    flagUrl: 'https://flagcdn.com/w160/gb.png', 
    coverImg: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=400&auto=format&fit=crop&q=80',
    turnaround: 'Standard Visitor'
  },
  { 
    name: 'Japan', 
    code: 'jp', 
    flagUrl: 'https://flagcdn.com/w160/jp.png', 
    coverImg: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=400&auto=format&fit=crop&q=80',
    turnaround: '4 Days e-Tourist'
  },
  { 
    name: 'Australia', 
    code: 'au', 
    flagUrl: 'https://flagcdn.com/w160/au.png', 
    coverImg: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?w=400&auto=format&fit=crop&q=80',
    turnaround: 'Subclass 600'
  },
  { 
    name: 'Canada', 
    code: 'ca', 
    flagUrl: 'https://flagcdn.com/w160/ca.png', 
    coverImg: 'https://images.unsplash.com/photo-1517935703635-27c5696e2465?w=400&auto=format&fit=crop&q=80',
    turnaround: 'Visitor Visa'
  },
  { 
    name: 'Turkey', 
    code: 'tr', 
    flagUrl: 'https://flagcdn.com/w160/tr.png', 
    coverImg: 'https://images.unsplash.com/photo-1641128324972-af3212f0f6bd?w=400&auto=format&fit=crop&q=80',
    turnaround: '24h eVisa ⚡'
  },
];

export const Hero = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <section className="hero-section">
      {/* Dynamic 3D Flag Marquee Background Columns */}
      <div className="hero-flags-overlay">
        <div className="flags-col flags-col-1">
          <div className="scroll-up-animation">
            {[...HERO_DESTINATIONS, ...HERO_DESTINATIONS].map((dest, idx) => (
              <div key={idx} className="cool-flag-card-item">
                <img src={dest.coverImg} alt={dest.name} className="cool-flag-card-bg" loading="lazy" />
                <div className="cool-flag-card-overlay"></div>
                <div className="cool-flag-badge-box">
                  <img src={dest.flagUrl} alt={dest.name} className="cool-flag-img" />
                </div>
                <div className="cool-flag-card-info">
                  <span className="cool-flag-country-name">{dest.name}</span>
                  <span className="cool-flag-time-badge">{dest.turnaround}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flags-col flags-col-2">
          <div className="scroll-down-animation">
            {[...HERO_DESTINATIONS.slice().reverse(), ...HERO_DESTINATIONS.slice().reverse()].map((dest, idx) => (
              <div key={idx} className="cool-flag-card-item">
                <img src={dest.coverImg} alt={dest.name} className="cool-flag-card-bg" loading="lazy" />
                <div className="cool-flag-card-overlay"></div>
                <div className="cool-flag-badge-box">
                  <img src={dest.flagUrl} alt={dest.name} className="cool-flag-img" />
                </div>
                <div className="cool-flag-card-info">
                  <span className="cool-flag-country-name">{dest.name}</span>
                  <span className="cool-flag-time-badge">{dest.turnaround}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flags-col flags-col-3">
          <div className="scroll-up-animation" style={{ animationDuration: '48s' }}>
            {[...HERO_DESTINATIONS, ...HERO_DESTINATIONS].map((dest, idx) => (
              <div key={idx} className="cool-flag-card-item">
                <img src={dest.coverImg} alt={dest.name} className="cool-flag-card-bg" loading="lazy" />
                <div className="cool-flag-card-overlay"></div>
                <div className="cool-flag-badge-box">
                  <img src={dest.flagUrl} alt={dest.name} className="cool-flag-img" />
                </div>
                <div className="cool-flag-card-info">
                  <span className="cool-flag-country-name">{dest.name}</span>
                  <span className="cool-flag-time-badge">{dest.turnaround}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flags-col flags-col-4">
          <div className="scroll-down-animation" style={{ animationDuration: '52s' }}>
            {[...HERO_DESTINATIONS.slice().reverse(), ...HERO_DESTINATIONS.slice().reverse()].map((dest, idx) => (
              <div key={idx} className="cool-flag-card-item">
                <img src={dest.coverImg} alt={dest.name} className="cool-flag-card-bg" loading="lazy" />
                <div className="cool-flag-card-overlay"></div>
                <div className="cool-flag-badge-box">
                  <img src={dest.flagUrl} alt={dest.name} className="cool-flag-img" />
                </div>
                <div className="cool-flag-card-info">
                  <span className="cool-flag-country-name">{dest.name}</span>
                  <span className="cool-flag-time-badge">{dest.turnaround}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="hero-overlay-gradient"></div>

      {/* Hero Content */}
      <div className="hero-content">
        <div className="hero-pill-badge">
          <span className="pill-dot"></span>
          99.2% On-Time Visa Approvals
        </div>

        <h1 className="hero-main-title">
          Get Your Visa On Time with <span className="highlight-text">Pehla Visa</span>
        </h1>

        <p className="hero-subtitle-text" style={{ color: 'rgba(255,255,255,0.92)', fontSize: '1.15rem', maxWidth: '680px', marginBottom: '2.25rem' }}>
          Apply online for 150+ countries with India's most trusted visa platform — fast 24-48 hour turnaround.
        </p>

        {/* Clean Single Bar with Green Circular Icon */}
        <div className="hero-search-box">
          <div className="search-input-inner">
            <div className="search-lens-box-green">
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search Dubai, Thailand, USA, Schengen..."
              className="hero-input-field"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>
    </section>
  );
};
