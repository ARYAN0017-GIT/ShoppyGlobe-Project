import React from 'react'

const Pagination = ({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage = 20,
  className = "" 
}) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1
  const endItem = Math.min(currentPage * itemsPerPage, totalItems)

  // Generate page numbers to show
  const getPageNumbers = () => {
    const delta = 2 // Number of pages to show on each side of current page
    const pages = []
    const rangeStart = Math.max(2, currentPage - delta)
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta)

    // Always show first page
    if (totalPages > 1) {
      pages.push(1)
    }

    // Add dots if there's a gap
    if (rangeStart > 2) {
      pages.push('...')
    }

    // Add pages around current page
    for (let i = rangeStart; i <= rangeEnd; i++) {
      if (i !== 1 && i !== totalPages) {
        pages.push(i)
      }
    }

    // Add dots if there's a gap
    if (rangeEnd < totalPages - 1) {
      pages.push('...')
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages)
    }

    return pages
  }

  const pageNumbers = getPageNumbers()

  if (totalPages <= 1) {
    return null
  }

  return (
    <div className={`flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0 ${className}`}>
      {/* Results info */}
      <div className="text-sm text-gray-700">
        Showing <span className="font-medium">{startItem}</span> to{' '}
        <span className="font-medium">{endItem}</span> of{' '}
        <span className="font-medium">{totalItems}</span> results
      </div>

      {/* Pagination controls */}
      <nav className="flex items-center space-x-1" aria-label="Pagination">
        {/* Previous button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={`relative inline-flex items-center px-2 py-2 rounded-l-md border text-sm font-medium transition-colors duration-200 ${
            currentPage === 1
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          aria-label="Previous page"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Page numbers */}
        <div className="flex">
          {pageNumbers.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                  ...
                </span>
              ) : (
                <button
                  onClick={() => onPageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium transition-all duration-200 ${
                    currentPage === page
                      ? 'z-10 bg-blue-600 border-blue-600 text-white shadow-md transform scale-105'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700 hover:shadow-sm'
                  }`}
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </button>
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Next button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={`relative inline-flex items-center px-2 py-2 rounded-r-md border text-sm font-medium transition-colors duration-200 ${
            currentPage === totalPages
              ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50 hover:text-gray-700'
          }`}
          aria-label="Next page"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </nav>

      {/* Quick jump buttons for mobile */}
      <div className="flex sm:hidden space-x-2">
        <button
          onClick={() => onPageChange(1)}
          disabled={currentPage === 1}
          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          First
        </button>
        <button
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 text-xs bg-white border border-gray-300 rounded text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Last
        </button>
      </div>
    </div>
  )
}

export default Pagination