import { useState, useEffect, useRef, useMemo } from 'react';
import { HiMagnifyingGlass, HiArrowRight } from 'react-icons/hi2';
import type { VisaDestination } from '../data/visasData';
import { API_BASE_URL } from '../config/apiConfig';

interface DestinationFlag {
  name: string;
  code: string;
  flagUrl: string;
  coverImg: string;
  turnaround: string;
}

interface HeroProps {
  onSelectVisa?: (visa: VisaDestination) => void;
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

export const Hero = ({ onSelectVisa }: HeroProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [visas, setVisas] = useState<VisaDestination[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function fetchVisas() {
      try {
        const res = await fetch(`${API_BASE_URL}/visas`);
        if (res.ok) {
          const data = await res.json();
          if (Array.isArray(data)) {
            setVisas(data);
          }
        }
      } catch (err) {
        console.warn('Hero live visas fetch error:', err);
      }
    }
    fetchVisas();
  }, []);

  const searchResults = useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') return [];
    const q = searchTerm.toLowerCase().trim();
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
  }, [searchTerm, visas]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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

        {/* Clean Single Bar with Green Circular Icon & Real-Time Database Autocomplete */}
        <div ref={wrapperRef} className="hero-search-box" style={{ position: 'relative' }}>
          <div className="search-input-inner">
            <div className="search-lens-box-green">
              <HiMagnifyingGlass size={18} />
            </div>
            <input
              type="text"
              placeholder="Search Dubai, France, Thailand, USA, Schengen..."
              className="hero-input-field"
              value={searchTerm}
              onFocus={() => setIsOpen(true)}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
              }}
            />
          </div>

          {/* Real-time Search Dropdown Menu from Database */}
          {isOpen && searchTerm.trim() !== '' && (
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
                <span>DATABASE VISA MATCHES FOR "{searchTerm.toUpperCase()}"</span>
                <span style={{ color: '#64748b' }}>{searchResults.length} Results</span>
              </div>

              {searchResults.length === 0 ? (
                <div style={{ padding: '1.25rem', textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                  No visa destinations found matching "{searchTerm}". Try searching "France", "Dubai", or "Thailand".
                </div>
              ) : (
                searchResults.map((visa) => (
                  <div
                    key={visa.id}
                    onClick={() => {
                      if (onSelectVisa) {
                        onSelectVisa(visa);
                      } else {
                        window.location.href = `/visa/${visa.id}`;
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
  );
};
