import React, { useState, useRef, useEffect } from 'react';
import { HiChevronDown, HiCheck } from 'react-icons/hi2';

export interface SelectOption {
  label: string;
  value: string;
  icon?: string;
  badge?: string;
}

interface CustomSelectProps {
  label: string;
  options: SelectOption[];
  selectedValue: string;
  onChange: (value: string) => void;
  iconCircleClass: string;
  iconSvg: React.ReactNode;
}

export const CustomSelect: React.FC<CustomSelectProps> = ({
  label,
  options,
  selectedValue,
  onChange,
  iconCircleClass,
  iconSvg,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const currentOption = options.find((opt) => opt.value === selectedValue) || options[0];

  return (
    <div className="custom-select-relative" ref={containerRef}>
      {/* Trigger Area */}
      <div
        className={`filter-item ${isOpen ? 'active-filter-item' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            setIsOpen(!isOpen);
          }
        }}
      >
        <div className={`filter-icon-circle ${iconCircleClass}`}>{iconSvg}</div>

        <div className="filter-input-group">
          <span className="filter-label">{label}</span>
          <div className="custom-select-trigger">
            <span className="trigger-selected-text">{currentOption.label}</span>
            <HiChevronDown
              className={`trigger-chevron ${isOpen ? 'chevron-rotated' : ''}`}
              size={16}
            />
          </div>
        </div>
      </div>

      {/* Floating Modern Popover Dropdown */}
      {isOpen && (
        <div className="custom-select-popover">
          <div className="popover-header">{label} Options</div>
          <div className="popover-options-list">
            {options.map((option) => {
              const isSelected = option.value === selectedValue;
              return (
                <div
                  key={option.value}
                  className={`popover-option-item ${isSelected ? 'selected' : ''}`}
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                >
                  <div className="option-text-group">
                    <span className="option-main-label">{option.label}</span>
                    {option.badge && <span className="option-badge">{option.badge}</span>}
                  </div>

                  {isSelected && (
                    <div className="checkmark-circle">
                      <HiCheck size={13} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
