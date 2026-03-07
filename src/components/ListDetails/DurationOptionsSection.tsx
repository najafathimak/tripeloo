"use client";

import { Calendar } from "lucide-react";

interface DurationOptionsSectionProps {
  options: string[];
  selectedOptions: string[];
  onSelectionChange: (selected: string[]) => void;
}

export function DurationOptionsSection({
  options,
  selectedOptions,
  onSelectionChange,
}: DurationOptionsSectionProps) {
  if (!options || options.length === 0) return null;

  const handleToggle = (option: string) => {
    const isSelected = selectedOptions.includes(option);
    // Single select only: select this option, or clear if clicking the same one
    const updated = isSelected ? [] : [option];
    onSelectionChange(updated);
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-2 border-b border-gray-200 pb-2">
        Choose your duration
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Optionally select one duration. Your selection will be included with your enquiry.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {options.map((opt) => {
          const isSelected = selectedOptions.includes(opt);
          return (
            <button
              key={opt}
              type="button"
              onClick={() => handleToggle(opt)}
              className={`flex items-center justify-between gap-2 rounded-xl border-2 p-4 text-left transition-all duration-200 hover:shadow-md ${
                isSelected
                  ? "border-[#E51A4B] bg-[#E51A4B]/5 ring-2 ring-[#E51A4B]/30 shadow-md"
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <span className="flex items-center gap-2">
                <Calendar className={`w-5 h-5 flex-shrink-0 ${isSelected ? "text-[#E51A4B]" : "text-gray-400"}`} />
                <span className={`font-semibold text-sm sm:text-base ${isSelected ? "text-[#E51A4B]" : "text-gray-800"}`}>
                  {opt}
                </span>
              </span>
              <div
                className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  isSelected ? "bg-[#E51A4B] border-[#E51A4B]" : "border-gray-300"
                }`}
              >
                {isSelected && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
