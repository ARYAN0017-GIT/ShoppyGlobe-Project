import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import useProducts from '../hooks/useProducts'
import ProductItem from './ProductItem'
import LoadingSpinner from './LoadingSpinner'
import Pagination from './Pagination'
import FilterSidebar from './FilterSidebar'
import { clearError } from '../store/productsSlice'

const ProductList = () => {
  const {
    products,
    loading,
    error,
    searchTerm,
    selectedCategory,
    hasSearched,
    sortBy,
    priceRange,
    pagination,
    changePage,
    changeCategory,
    changeSortBy,
    changePriceRange,
    resetFilters,
    refetchProducts
  } = useProducts()

  const [animationClass, setAnimationClass] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  // Trigger animation when products change
  useEffect(() => {
    if (products.length > 0) {
      setAnimationClass('fade-in-up')
      const timer = setTimeout(() => setAnimationClass(''), 500)
      return () => clearTimeout(timer)
    }
  }, [products])

  // Loading skeleton component
  const ProductSkeleton = () => (
    <div className="card overflow-hidden animate-pulse">
      <div className="h-48 bg-gray-300"></div>
      <div className="p-4 space-y-3">
        <div className="h-4 bg-gray-300 rounded w-3/4"></div>
        <div className="h-4 bg-gray-300 rounded w-1/2"></div>
        <div className="h-4 bg-gray-300 rounded w-1/4"></div>
        <div className="h-8 bg-gray-300 rounded"></div>
      </div>
    </div>
  )

  // Empty state component
  const EmptyState = ({ type = 'no-products' }) => {
    const states = {
      'no-products': {
        icon: (
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        ),
        title: 'No products found',
        message: `We couldn't find any products matching your search.`,
        action: (
          <button onClick={resetFilters} className="btn-primary">
            Clear Filters
          </button>
        )
      },
      'search-results': {
        icon: (
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        ),
        title: `No results for "${searchTerm}"`,
        message: 'Try adjusting your search terms or filters.',
        action: (
          <div className="flex space-x-4">
            <button onClick={resetFilters} className="btn-primary">
              Clear Filters
            </button>
            <button onClick={() => window.location.reload()} className="btn-secondary">
              Browse All
            </button>
          </div>
        )
      }
    }

    const state = states[type] || states['no-products']

    return (
      <div className="text-center py-16 px-4">
        <div className="max-w-md mx-auto">
          {state.icon}
          <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-2">{state.title}</h3>
          <p className="text-gray-500 mb-8">{state.message}</p>
          {state.action}
        </div>
      </div>
    )
  }

  if (loading && products.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Skeleton */}
          <div className="w-full lg:w-64">
            <div className="bg-white rounded-lg shadow-md p-6 h-96 animate-pulse">
              <div className="h-6 bg-gray-300 rounded mb-4"></div>
              <div className="space-y-3">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-300 rounded"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Products Grid Skeleton */}
          <div className="flex-1">
            <div className="mb-6">
              <div className="h-8 bg-gray-300 rounded w-48 mb-2"></div>
              <div className="h-4 bg-gray-300 rounded w-32"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {[...Array(12)].map((_, i) => (
                <ProductSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-2xl mx-auto">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Oops! Something went wrong</h3>
          <p className="text-red-600 mb-6">{error}</p>
          <div className="flex justify-center space-x-4">
            <button onClick={refetchProducts} className="btn-primary">
              Try Again
            </button>
            <button onClick={() => window.location.reload()} className="btn-secondary">
              Refresh Page
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Sidebar */}
        <div className="w-full lg:w-64 lg:flex-shrink-0">
          <FilterSidebar
            selectedCategory={selectedCategory}
            onCategoryChange={changeCategory}
            sortBy={sortBy}
            onSortChange={changeSortBy}
            priceRange={priceRange}
            onPriceRangeChange={changePriceRange}
            onClearFilters={resetFilters}
          />
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {hasSearched && searchTerm ? (
                    <>Search Results for <span className="text-blue-600">"{searchTerm}"</span></>
                  ) : selectedCategory ? (
                    <>
                      {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1).replace(/-/g, ' ')} Products
                    </>
                  ) : (
                    'Our Products'
                  )}
                </h2>

                {pagination.totalProducts > 0 && (
                  <p className="text-gray-600">
                    {pagination.totalProducts.toLocaleString()} product{pagination.totalProducts !== 1 ? 's' : ''} found
                    {selectedCategory && (
                      <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium capitalize">
                        {selectedCategory.replace(/-/g, ' ')}
                      </span>
                    )}
                  </p>
                )}
              </div>

              {/* View Toggle - Future enhancement */}
              <div className="flex items-center space-x-2 mt-4 sm:mt-0">
                <span className="text-sm text-gray-500">View:</span>
                <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                  <button className="px-3 py-1 bg-blue-600 text-white text-sm">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button className="px-3 py-1 bg-white text-gray-600 text-sm hover:bg-gray-50">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Active Filters Display */}
            {(selectedCategory || searchTerm || sortBy !== 'relevance') && (
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm font-medium text-gray-700">Active filters:</span>
                {searchTerm && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    Search: {searchTerm}
                  </span>
                )}
                {selectedCategory && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
                    {selectedCategory.replace(/-/g, ' ')}
                    <button
                      onClick={() => changeCategory('')}
                      className="ml-1 text-green-600 hover:text-green-800"
                    >
                      <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </span>
                )}
                {sortBy !== 'relevance' && (
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                    Sort: {sortBy === 'price-low' ? 'Price Low-High' : 
                          sortBy === 'price-high' ? 'Price High-Low' : 
                          sortBy === 'rating' ? 'Highest Rated' : 'Newest'}
                  </span>
                )}
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 hover:bg-red-200 transition-colors"
                >
                  Clear All
                  <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {products.length === 0 ? (
            <EmptyState type={hasSearched ? 'search-results' : 'no-products'} />
          ) : (
            <>
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${animationClass}`}>
                {products.map((product, index) => (
                  <div
                    key={product.id}
                    className="transform transition-all duration-300 hover:scale-105"
                    style={{
                      animationDelay: `${index * 50}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <ProductItem product={product} />
                  </div>
                ))}
              </div>

              {/* Loading overlay for pagination */}
              {loading && (
                <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 shadow-xl">
                    <LoadingSpinner message="Loading more products..." />
                  </div>
                </div>
              )}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="mt-12 border-t border-gray-200 pt-8">
                  <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                    totalItems={pagination.totalProducts}
                    onPageChange={changePage}
                    className="justify-center"
                  />
                </div>
              )}

              {/* Load More Button for Mobile */}
              {pagination.hasNextPage && (
                <div className="mt-8 text-center lg:hidden">
                  <button
                    onClick={() => changePage(pagination.currentPage + 1)}
                    disabled={loading}
                    className="btn-primary px-8 py-3"
                  >
                    {loading ? 'Loading...' : 'Load More Products'}
                  </button>
                </div>
              )}
            </>
          )}

          {/* Results summary at bottom */}
          {products.length > 0 && pagination.totalPages > 1 && (
            <div className="mt-8 text-center text-sm text-gray-500">
              Showing {pagination.startItem} to {pagination.endItem} of {pagination.totalProducts.toLocaleString()} results
            </div>
          )}

          {/* Back to top button */}
          {pagination.currentPage > 1 && (
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="fixed bottom-8 right-8 bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors z-40"
              aria-label="Back to top"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ProductList