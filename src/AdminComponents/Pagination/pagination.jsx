import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useTheme } from '../../Contexts/ThemeContext';

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  setTake, 
  setSkip, 
  take, 
  totalCount 
}) => {
  const { theme } = useTheme();
  const getPageNumbers = () => {
    const delta = 2; 
    const range = [];
    const rangeWithDots = [];

    // Always include first page
    range.push(1);

    // Add pages around current page
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }

    // Always include last page if more than 1 page
    if (totalPages > 1) {
      range.push(totalPages);
    }

    // Remove duplicates and sort
    const uniqueRange = [...new Set(range)].sort((a, b) => a - b);

    // Add dots where there are gaps
    let prev = 0;
    uniqueRange.forEach(page => {
      if (page - prev > 1) {
        rangeWithDots.push('...');
      }
      rangeWithDots.push(page);
      prev = page;
    });

    return rangeWithDots;
  };

  const pageNumbers = getPageNumbers();

  const handlePageSizeChange = (newTake) => {
    setTake(newTake);
    setSkip(0); // Reset to first page
    onPageChange(1);
  };

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  const startItem = Math.min((currentPage - 1) * take + 1, totalCount);
  const endItem = Math.min(currentPage * take, totalCount);

  if (totalPages <= 1) return null;

  // Determine dark mode classes
  const isDark = theme === 'dark';
  const textClass = isDark ? 'text-gray-300' : 'text-gray-600';
  const buttonClass = isDark 
    ? 'text-gray-200 bg-gray-700 border-gray-600 hover:bg-gray-600' 
    : 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50';
  const currentButtonClass = isDark
    ? 'bg-blue-600 text-white border-blue-600'
    : 'bg-blue-500 text-white border-blue-500';
  const disabledButtonClass = isDark 
    ? 'text-gray-500 bg-gray-700 border-gray-600' 
    : 'text-gray-500 bg-white border-gray-300';
  const selectClass = isDark
    ? 'bg-gray-700 border-gray-600 text-white'
    : 'bg-white border-gray-300';

  return (
    <div className={`mt-6 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 px-4 py-3 ${isDark ? 'bg-gray-800' : ''}`}>
      {/* Results info - Left side */}
      <div className={`flex items-center text-sm ${textClass}`}>
        <span>Showing {startItem} to {endItem} of {totalCount}</span>
      </div>

      {/* Pagination controls - Center */}
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-1">
          {/* Previous button */}
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex items-center justify-center w-8 h-8 border rounded transition-colors ${
              currentPage === 1 
                ? `${disabledButtonClass} opacity-50 cursor-not-allowed` 
                : buttonClass
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Page numbers */}
          {pageNumbers.map((page, index) => (
            page === '...' ? (
              <span key={`dots-${index}`} className={`px-2 py-1 ${isDark ? 'text-gray-500' : 'text-gray-400'}`}>
                ...
              </span>
            ) : (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`flex items-center justify-center w-8 h-8 text-sm font-medium rounded transition-colors border ${
                  currentPage === page
                    ? currentButtonClass
                    : buttonClass
                }`}
              >
                {page}
              </button>
            )
          ))}

          {/* Next button */}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`flex items-center justify-center w-8 h-8 border rounded transition-colors ${
              currentPage === totalPages 
                ? `${disabledButtonClass} opacity-50 cursor-not-allowed` 
                : buttonClass
            }`}
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Page size selector - Right side */}
      <div className={`flex items-center gap-2 text-sm ${textClass}`}>
        <span>Show</span>
        <select
          value={take}
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          className={`border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${selectClass}`}
        >
          <option value={5}>5</option>
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
        <span>entries</span>
      </div>
    </div>
  );
};

export default Pagination;