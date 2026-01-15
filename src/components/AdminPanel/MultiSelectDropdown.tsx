"use client";

import { useState, useRef, useEffect } from 'react';
import { X, Check, ChevronDown } from 'lucide-react';

interface Option {
  id: string;
  name: string;
}

interface MultiSelectDropdownProps {
  options: Option[];
  selectedIds: string[];
  onChange: (selectedIds: string[]) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

export default function MultiSelectDropdown({
  options,
  selectedIds,
  onChange,
  placeholder = "Select items...",
  loading = false,
  disabled = false,
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleOption = (optionId: string) => {
    if (disabled) return;
    
    const isSelected = selectedIds.includes(optionId);
    if (isSelected) {
      onChange(selectedIds.filter(id => id !== optionId));
    } else {
      onChange([...selectedIds, optionId]);
    }
  };

  const removeOption = (optionId: string) => {
    if (disabled) return;
    onChange(selectedIds.filter(id => id !== optionId));
  };

  const getSelectedOptions = () => {
    return options.filter(option => selectedIds.includes(option.id));
  };

  const selectedOptions = getSelectedOptions();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Input Field with Dropdown Toggle */}
      <div
        onClick={() => !disabled && !loading && setIsOpen(!isOpen)}
        className={`
          w-full px-4 py-3 border border-gray-300 rounded-lg 
          cursor-pointer bg-white
          flex items-center justify-between
          transition-all
          ${disabled || loading ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'}
          ${isOpen ? 'ring-2 ring-[#E51A4B] border-[#E51A4B]' : ''}
        `}
      >
        <span className={`text-sm ${selectedIds.length === 0 ? 'text-gray-400' : 'text-gray-900'}`}>
          {loading ? 'Loading...' : selectedIds.length === 0 ? placeholder : `${selectedIds.length} item(s) selected`}
        </span>
        <ChevronDown 
          className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
        />
      </div>

      {/* Selected Items Chips */}
      {selectedOptions.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {selectedOptions.map((option) => (
            <div
              key={option.id}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#E51A4B]/10 border border-[#E51A4B]/30 rounded-lg text-sm text-gray-900"
            >
              <span>{option.name}</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeOption(option.id);
                }}
                className="hover:bg-[#E51A4B]/20 rounded-full p-0.5 transition-colors"
                disabled={disabled}
              >
                <X className="w-3 h-3 text-[#E51A4B]" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Dropdown Menu */}
      {isOpen && !loading && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
          {options.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500 text-center">
              No options available
            </div>
          ) : (
            <div className="py-1">
              {options.map((option) => {
                const isSelected = selectedIds.includes(option.id);
                return (
                  <div
                    key={option.id}
                    onClick={() => toggleOption(option.id)}
                    className={`
                      px-4 py-2 cursor-pointer flex items-center justify-between
                      transition-colors
                      ${isSelected ? 'bg-[#E51A4B]/10 hover:bg-[#E51A4B]/20' : 'hover:bg-gray-50'}
                    `}
                  >
                    <span className="text-sm text-gray-900">{option.name}</span>
                    {isSelected && (
                      <Check className="w-4 h-4 text-[#E51A4B]" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}


