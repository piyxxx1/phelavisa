import React from 'react';
import { CustomSelect, type SelectOption } from './CustomSelect';
import { HiBolt, HiDocumentText, HiGlobeAsiaAustralia } from 'react-icons/hi2';
import { FaPlaneDeparture } from 'react-icons/fa6';

export interface FilterState {
  deliveryTime: string;
  type: string;
  documents: string;
  region: string;
}

interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (key: keyof FilterState, value: string) => void;
  resultsCount?: number;
}

const DELIVERY_OPTIONS: SelectOption[] = [
  { label: 'Any Time', value: 'All' },
  { label: 'Within 48 Hrs', value: 'Within 48 Hrs', badge: '⚡ Express' },
  { label: 'This Week', value: 'This Week', badge: 'Fast' },
  { label: 'This Month', value: 'This Month' },
  { label: '2+ Months', value: '2+ Months' },
];

const TYPE_OPTIONS: SelectOption[] = [
  { label: 'All Visa Types', value: 'All' },
  { label: 'e-Visa', value: 'e-Visa', badge: 'Digital' },
  { label: 'Visa on Arrival', value: 'Visa on Arrival', badge: 'Instant' },
  { label: 'Sticker Visa', value: 'Sticker Visa', badge: 'Passport Sticker' },
];

const DOCUMENT_OPTIONS: SelectOption[] = [
  { label: 'Any Documents', value: 'All' },
  { label: 'Only Passport', value: 'Only Passport', badge: 'Easiest' },
  { label: 'Bank Statement Required', value: 'Bank Statement Required' },
  { label: 'Invitation Letter', value: 'Invitation Letter' },
];

const REGION_OPTIONS: SelectOption[] = [
  { label: 'All Regions', value: 'All' },
  { label: 'Asia', value: 'Asia' },
  { label: 'Europe', value: 'Europe' },
  { label: 'Middle East', value: 'Middle East' },
  { label: 'Americas', value: 'Americas' },
  { label: 'Africa', value: 'Africa' },
  { label: 'Oceania', value: 'Oceania' },
];

export const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
}) => {
  return (
    <div className="filter-bar-outer-wrapper">
      <div className="filter-bar-container">
        {/* Filter Item 1: Visa Delivery */}
        <CustomSelect
          label="Visa delivery"
          options={DELIVERY_OPTIONS}
          selectedValue={filters.deliveryTime}
          onChange={(val) => onFilterChange('deliveryTime', val)}
          iconCircleClass="green"
          iconSvg={<HiBolt size={18} />}
        />

        <div className="filter-divider"></div>

        {/* Filter Item 2: Type */}
        <CustomSelect
          label="Type"
          options={TYPE_OPTIONS}
          selectedValue={filters.type}
          onChange={(val) => onFilterChange('type', val)}
          iconCircleClass="blue"
          iconSvg={<FaPlaneDeparture size={16} />}
        />

        <div className="filter-divider"></div>

        {/* Filter Item 3: Documents */}
        <CustomSelect
          label="Documents"
          options={DOCUMENT_OPTIONS}
          selectedValue={filters.documents}
          onChange={(val) => onFilterChange('documents', val)}
          iconCircleClass="yellow"
          iconSvg={<HiDocumentText size={18} />}
        />

        <div className="filter-divider"></div>

        {/* Filter Item 4: Region */}
        <CustomSelect
          label="Region"
          options={REGION_OPTIONS}
          selectedValue={filters.region}
          onChange={(val) => onFilterChange('region', val)}
          iconCircleClass="purple"
          iconSvg={<HiGlobeAsiaAustralia size={18} />}
        />
      </div>
    </div>
  );
};
