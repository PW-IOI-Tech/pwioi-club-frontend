"use client";

import React from "react";
import { ChevronDown } from "lucide-react";

interface DropdownOption {
  id: string;
  label: string;
}

interface SubjectFilterDropdownProps {
  label: string;
  value: string;
  options: DropdownOption[];
  disabled: boolean;
  loading: boolean;
  placeholder: string;
  onChange: (value: string) => void;
}

export const SubjectFilterDropdown: React.FC<SubjectFilterDropdownProps> = ({
  label,
  value,
  options,
  disabled,
  loading,
  placeholder,
  onChange,
}) => {
  return (
    <div>
      <label className="block font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled || loading}
          className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-sm focus:ring-2 focus:ring-[#1B3A6A] focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed appearance-none bg-white cursor-pointer"
        >
          <option value="">
            {loading ? "Loading..." : placeholder}
          </option>
          {options.map((option) => (
            <option key={option.id} value={option.id}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none ${
            disabled || loading ? "text-gray-300" : "text-gray-400"
          }`}
        />
      </div>
    </div>
  );
};