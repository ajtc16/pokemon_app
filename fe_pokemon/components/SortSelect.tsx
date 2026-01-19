"use client";

import { Hash, ArrowDownAZ, ArrowUpAZ, ArrowDown01, ArrowUp01 } from "lucide-react";
import { cn } from "@/lib/utils";
import type { SortOption } from "@/types";

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
  className?: string;
}

const sortOptions: { value: SortOption; label: string; icon: React.ReactNode }[] = [
  { value: "number_asc", label: "Number (Low to High)", icon: <ArrowDown01 className="h-4 w-4" /> },
  { value: "number_desc", label: "Number (High to Low)", icon: <ArrowUp01 className="h-4 w-4" /> },
  { value: "name_asc", label: "Name (A-Z)", icon: <ArrowDownAZ className="h-4 w-4" /> },
  { value: "name_desc", label: "Name (Z-A)", icon: <ArrowUpAZ className="h-4 w-4" /> },
];

export function SortSelect({ value, onChange, className }: SortSelectProps) {
  const handleSortToggle = () => {
    // Cycle through sort options
    const currentIndex = sortOptions.findIndex((opt) => opt.value === value);
    const nextIndex = (currentIndex + 1) % sortOptions.length;
    onChange(sortOptions[nextIndex].value);
  };

  const currentOption = sortOptions.find((opt) => opt.value === value) || sortOptions[0];

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={handleSortToggle}
        className="flex h-10 w-10 items-center justify-center rounded-pokemon bg-white shadow-drop-shadow-2dp hover:bg-grayscale-light transition-colors"
        aria-label={`Sort by: ${currentOption.label}. Click to change.`}
        title={currentOption.label}
      >
        {value.startsWith("number") ? (
          <Hash className="h-5 w-5 text-pokemon-red" />
        ) : (
          currentOption.icon
        )}
      </button>
    </div>
  );
}

// Alternative: Dropdown version
export function SortDropdown({ value, onChange, className }: SortSelectProps) {
  return (
    <div className={cn("relative", className)}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="h-10 appearance-none rounded-pokemon bg-white px-3 pr-8 font-poppins text-body-2 shadow-drop-shadow-2dp focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pokemon-red cursor-pointer"
        aria-label="Sort Pokemon by"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2">
        <Hash className="h-4 w-4 text-pokemon-red" />
      </div>
    </div>
  );
}
