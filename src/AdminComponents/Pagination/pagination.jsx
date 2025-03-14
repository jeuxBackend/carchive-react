import React from "react";
import { useTheme } from "../../Contexts/ThemeContext";


const Pagination = ({ currentPage, totalPages, onPageChange, setTake, take, setSkip }) => {
  const {theme} = useTheme()
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    const sideCount = 1;
   

    if (totalPages <= maxVisiblePages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const startEllipsis = currentPage > sideCount + 2;
    const endEllipsis = currentPage < totalPages - sideCount - 1;

    pages.push(1);

    if (startEllipsis) {
      pages.push("...");
    }

    const startPage = Math.max(2, currentPage - sideCount);
    const endPage = Math.min(totalPages - 1, currentPage + sideCount);
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    if (endEllipsis) {
      pages.push("...");
    }

    pages.push(totalPages);

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className="flex sm:flex-row flex-col-reverse gap-3 justify-between items-center mt-5 text-sm">
      <div className={`${theme==="dark"?"text-white":"text-gray-500"} `}>
        Showing {(currentPage - 1) * take + 1} to {Math.min(currentPage * take, totalPages * take)} of {totalPages * take}
      </div>

      <div className="flex items-center space-x-2">
        <button
          className={`${theme==="dark"?"text-white":"text-gray-500 hover:bg-gray-200"} px-3 py-1 border-2 rounded-lg  disabled:opacity-50`}
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
        >
          &lt;
        </button>

        {visiblePages.map((page, index) =>
          page === "..." ? (
            <span key={index} className="px-2">...</span>
          ) : (
            <button
              key={page}
              className={`px-3 py-1 rounded-lg ${
                currentPage === page ? "bg-[#2d9bff] text-white" : (`${theme==="dark"?"text-white":"text-gray-500 hover:bg-gray-200"} border`)
              }`}
              onClick={() => onPageChange(Number(page))}
            >
              {page}
            </button>
          )
        )}

        <button
          className={`${theme==="dark"?"text-white":"text-gray-500 hover:bg-gray-200"} px-3 py-1 border rounded-lg disabled:opacity-50`}
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          &gt;
        </button>
      </div>

      <div>
        <label className={`${theme==="dark"?"text-white":"text-gray-500"}  mr-2`}>Show</label>
        <select
          onChange={(e) => {setTake(Number(e.target.value)), setSkip(0)}}
          className={`${theme==="dark"?"text-white bg-[#1b1c1e]":"text-gray-500"} border rounded-lg px-3 py-1`}
          defaultValue={take}
        >
          <option value={10}>10 entries</option>
          <option value={20}>20 entries</option>
          <option value={50}>50 entries</option>
        </select>
      </div>
    </div>
  );
};

export default Pagination;
