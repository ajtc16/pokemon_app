"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";

interface PaginationProps {
  currentPage: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export function Pagination({
  currentPage,
  totalItems,
  itemsPerPage,
  onPageChange,
  className,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startItem = currentPage * itemsPerPage + 1;
  const endItem = Math.min((currentPage + 1) * itemsPerPage, totalItems);

  const canGoPrevious = currentPage > 0;
  const canGoNext = currentPage < totalPages - 1;

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-2 sm:justify-center sm:gap-4",
        className
      )}
    >
      {/* Previous Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!canGoPrevious}
        aria-label="Go to previous page"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden sm:inline ml-1">Previous</span>
      </Button>

      {/* Page Info */}
      <span className="font-poppins text-body-3 text-grayscale-medium sm:text-body-2">
        {startItem}–{endItem} of {totalItems.toLocaleString()}
      </span>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!canGoNext}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline mr-1">Next</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
