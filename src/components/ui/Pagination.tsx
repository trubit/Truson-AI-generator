import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;

  return (
    <div className="d-flex align-items-center justify-content-center gap-2 mt-4">
      <button
        className="btn btn-sm btn-outline-secondary text-light rounded-3"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        <ChevronLeft size={16} />
      </button>
      <span className="text-secondary small fw-semibold px-2">
        Page {currentPage} of {totalPages}
      </span>
      <button
        className="btn btn-sm btn-outline-secondary text-light rounded-3"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
      >
        <ChevronRight size={16} />
      </button>
    </div>
  );
};
