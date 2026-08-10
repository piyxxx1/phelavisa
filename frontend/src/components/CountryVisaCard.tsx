import React from 'react';
import type { VisaDestination } from '../data/visasData';
import { HiArrowRight, HiBolt } from 'react-icons/hi2';
import { FiClock, FiCalendar } from 'react-icons/fi';

interface CountryVisaCardProps {
  visa: VisaDestination;
  onSelect?: (visa: VisaDestination) => void;
}

export const CountryVisaCard: React.FC<CountryVisaCardProps> = ({ visa, onSelect }) => {
  return (
    <div className="figma-visa-card" onClick={() => onSelect?.(visa)}>
      {/* Media Header */}
      <div className="figma-card-media">
        <img
          src={visa.coverImg}
          alt={visa.country}
          className="figma-card-img"
          loading="lazy"
        />
        <div className="figma-media-overlay"></div>

        {/* Top Badges Overlay */}
        <div className="figma-card-badges">
          <div className="figma-flag-pill">
            <img
              src={`https://flagcdn.com/w40/${visa.flagCode === 'eu' ? 'eu' : visa.flagCode}.png`}
              alt={visa.country}
              className="figma-flag-img"
              onError={(e) => {
                (e.target as HTMLElement).style.display = 'none';
              }}
            />
            <span>{visa.country}</span>
          </div>

          <div className="figma-delivery-pill">
            {visa.express && <HiBolt className="express-bolt" size={13} />}
            <span>{visa.deliveryTime}</span>
          </div>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="figma-card-body">
        <div className="figma-card-header">
          <span className="figma-category-tag">{visa.visaCategory} • {visa.badgeTag}</span>
          <h3 className="figma-visa-title">{visa.title}</h3>
        </div>

        {/* Figma-crafted Spec Chips Row */}
        <div className="figma-specs-chips-row">
          <div className="figma-spec-chip">
            <FiClock size={12} className="chip-icon" />
            <span>{visa.processingTime}</span>
          </div>
          <div className="figma-spec-chip">
            <FiCalendar size={12} className="chip-icon" />
            <span>{visa.validity}</span>
          </div>
        </div>

        {/* Card Footer: Price & Clean CTA */}
        <div className="figma-card-footer">
          <div className="figma-price-block">
            <span className="price-label">Starts from</span>
            <span className="price-amount">{visa.price}</span>
          </div>

          <button className="figma-apply-btn">
            <span>Apply</span>
            <HiArrowRight className="btn-arrow" size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
