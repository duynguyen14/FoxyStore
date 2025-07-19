import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = startPage + maxVisiblePages - 1;

    if (endPage > totalPages) {
      endPage = totalPages;
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-wrap justify-center items-center gap-2 my-6 px-2">
      {/* First Page */}
      <button
        onClick={() => onPageChange(1)}
        className="px-3 py-2 text-sm md:text-base border rounded hover:bg-gray-100 transition disabled:opacity-50"
      >
        Trang đầu
      </button>

      {/* Prev */}
      <button
        onClick={() => onPageChange(currentPage > 1 ? currentPage - 1 : 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 text-sm md:text-base border rounded hover:bg-gray-100 transition disabled:opacity-50"
      >
        «
      </button>

      {/* Page Numbers */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide max-w-full">
        {pageNumbers.map(number => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-2 text-sm md:text-base border rounded transition 
              ${currentPage === number
                ? 'bg-black text-white'
                : 'hover:bg-gray-100'}`}
          >
            {number}
          </button>
        ))}
      </div>

      {/* Next */}
      <button
        onClick={() => onPageChange(currentPage < totalPages ? currentPage + 1 : totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 text-sm md:text-base border rounded hover:bg-gray-100 transition disabled:opacity-50"
      >
        »
      </button>

      {/* Last Page */}
      <button
        onClick={() => onPageChange(totalPages)}
        className="px-3 py-2 text-sm md:text-base border rounded hover:bg-gray-100 transition disabled:opacity-50"
      >
        Trang cuối
      </button>
    </div>
  );
};

export default Pagination;
