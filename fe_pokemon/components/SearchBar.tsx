"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/Input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  value,
  onChange,
  placeholder = "Search",
  className,
}: SearchBarProps) {
  return (
    <div className={className}>
      <Input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        leftIcon={<Search className="h-4 w-4" />}
        aria-label="Search Pokemon"
        className="shadow-inner bg-white"
      />
    </div>
  );
}
