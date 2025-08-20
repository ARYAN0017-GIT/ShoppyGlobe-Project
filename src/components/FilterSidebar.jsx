import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { selectCategories, selectCategoriesLoading } from '../store/productsSlice'

const FilterSidebar = ({
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceRangeChange,
  onClearFilters,
  className = ""
}) => {
  const categories = useSelector(selectCategories)
  const categoriesLoading = useSelector(selectCategoriesLoading)
  const [localPriceRange, setLocalPriceRange] = useState(priceRange)
  const [isOpen, setIsOpen] = useState(false)

  // Sync local price range with props when they change (e.g., when cleared from parent)
  useEffect(() => {
    if (priceRange && Array.isArray(priceRange) && priceRange.length === 2) {
      setLocalPriceRange([
        Math.max(0, Math.min(200, priceRange[0] || 0)),
        Math.max(0, Math.min(200, priceRange[1] || 200))
      ])
    }
  }, [priceRange])

  const handlePriceChange = (index, value) => {
    const numValue = parseInt(value) || 0
    const clampedValue = Math.max(0, Math.min(200, numValue))
    const newRange = [...localPriceRange]
    newRange[index] = clampedValue
    setLocalPriceRange(newRange)
    onPriceRangeChange(newRange)
  }

  const handleClearAllFilters = () => {
    // Reset local price range state
    const defaultPriceRange = [0, 200]
    setLocalPriceRange(defaultPriceRange)
    
    // Call parent's clear filters function with the reset price range
    onClearFilters()
    onPriceRangeChange(defaultPriceRange)
  }

  const sortOptions = [
    { value: 'relevance', label: 'Most Relevant' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'rating', label: 'Highest Rated' },
    { value: 'newest', label: 'Newest First' }
  ]

  const quickPriceFilters = [
    { label: 'Under $25', range: [0, 25] },
    { label: '$25 - $50', range: [25, 50] },
    { label: '$50 - $100', range: [50, 100] },
    { label: '$100+', range: [100, 200] }
  ]

  const handleQuickPriceFilter = (range) => {
    setLocalPriceRange(range)
    onPriceRangeChange(range)
  }

  const resetPriceRange = () => {
    const defaultRange = [0, 200]
    setLocalPriceRange(defaultRange)
    onPriceRangeChange(defaultRange)
  }

  // Safe calculation for slider track positioning
  const getSliderTrackStyle = () => {
    const min = 0
    const max = 200
    const leftPercent = Math.max(0, Math.min(100, (localPriceRange[0] / max) * 100))
    const rightPercent = Math.max(0, Math.min(100, 100 - (localPriceRange[1] / max) * 100))
    
    return {
      left: `${leftPercent}%`,
      right: `${rightPercent}%`
    }
  }

  const handleMinPriceSliderChange = (value) => {
    const numValue = parseInt(value)
    if (numValue <= localPriceRange[1]) {
      handlePriceChange(0, numValue)
    }
  }

  const handleMaxPriceSliderChange = (value) => {
    const numValue = parseInt(value)
    if (numValue >= localPriceRange[0]) {
      handlePriceChange(1, numValue)
    }
  }

  return (
    <>
      {/* Mobile Filter Toggle */}
      <div className="lg:hidden mb-6">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center justify-between w-full p-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:shadow-md transition-shadow"
        >
          <span className="font-medium text-gray-900">Filters & Sort</span>
          <svg
            className={`h-5 w-5 text-gray-500 transform transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>

      {/* Filter Sidebar */}
      <div className={`${className} ${isOpen ? 'block' : 'hidden lg:block'} bg-white rounded-lg shadow-md p-6 h-fit sticky top-24`}>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
          <button
            onClick={handleClearAllFilters}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            Clear All
          </button>
        </div>

        <div className="space-y-6">
          {/* Sort By */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="font-medium text-gray-900 mb-3">Sort By</h4>
            <div className="space-y-2">
              {sortOptions.map((option) => (
                <label key={option.value} className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="sort"
                    value={option.value}
                    checked={sortBy === option.value}
                    onChange={(e) => onSortChange(e.target.value)}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Categories */}
          <div className="border-b border-gray-200 pb-6">
            <h4 className="font-medium text-gray-900 mb-3">Categories</h4>
            {categoriesLoading ? (
              <div className="animate-pulse space-y-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            ) : (
              <div className="space-y-2 max-h-48 overflow-y-auto">
                <label className="flex items-center cursor-pointer group">
                  <input
                    type="radio"
                    name="category"
                    value=""
                    checked={selectedCategory === ''}
                    onChange={() => onCategoryChange('')}
                    className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                  />
                  <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors font-medium">
                    All Categories
                  </span>
                </label>
                {categories && categories.slice(0, 15).map((category) => {
                  // Handle both string and object formats
                  const categoryValue = typeof category === 'string' ? category : category.slug
                  const categoryDisplay = typeof category === 'string' 
                    ? category.replace(/-/g, ' ') 
                    : category.name

                  return (
                    <label key={categoryValue} className="flex items-center cursor-pointer group">
                      <input
                        type="radio"
                        name="category"
                        value={categoryValue}
                        checked={selectedCategory === categoryValue}
                        onChange={() => onCategoryChange(categoryValue)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors capitalize">
                        {categoryDisplay}
                      </span>
                    </label>
                  )
                })}
              </div>
            )}
          </div>

          {/* Price Range */}
          <div className="pb-6">
            <h4 className="font-medium text-gray-900 mb-4">Price Range</h4>
            <div className="space-y-6">
              {/* Price Range Sliders */}
              <div className="px-2">
                <div className="relative h-1 bg-gray-200 rounded-lg">
                  {/* Price range track */}
                  <div 
                    className="absolute h-1 bg-blue-600 rounded-lg"
                    style={getSliderTrackStyle()}
                  />
                  
                  {/* Minimum price slider */}
                  <div className="absolute w-full">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={localPriceRange[0]}
                      onChange={(e) => handleMinPriceSliderChange(e.target.value)}
                      className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
                    />
                  </div>
                  
                  {/* Maximum price slider */}
                  <div className="absolute w-full">
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={localPriceRange[1]}
                      onChange={(e) => handleMaxPriceSliderChange(e.target.value)}
                      className="absolute w-full h-1 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-blue-600 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:transition-all hover:[&::-webkit-slider-thumb]:scale-110"
                    />
                  </div>
                </div>
              </div>

              {/* Price labels and inputs */}
              <div className="flex items-center justify-between px-2">
                <div className="w-24">
                  <label className="block text-xs text-gray-500 mb-1.5">Min Price</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={localPriceRange[0]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value) && value <= localPriceRange[1]) {
                          handlePriceChange(0, value)
                        }
                      }}
                      min="0"
                      max={localPriceRange[1]}
                      className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="w-24">
                  <label className="block text-xs text-gray-500 mb-1.5">Max Price</label>
                  <div className="relative">
                    <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      value={localPriceRange[1]}
                      onChange={(e) => {
                        const value = parseInt(e.target.value)
                        if (!isNaN(value) && value >= localPriceRange[0]) {
                          handlePriceChange(1, value)
                        }
                      }}
                      min={localPriceRange[0]}
                      max="200"
                      className="w-full pl-6 pr-2 py-1.5 border border-gray-300 rounded text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Quick Price Filters */}
              <div className="grid grid-cols-2 gap-2">
                {quickPriceFilters.map((option) => (
                  <button
                    key={option.label}
                    onClick={() => handleQuickPriceFilter(option.range)}
                    className={`px-3 py-1 text-xs rounded-md border transition-colors ${
                      localPriceRange[0] === option.range[0] && localPriceRange[1] === option.range[1]
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Filter Summary */}
          <div className="pt-4 border-t border-gray-200">
            <h4 className="font-medium text-gray-900 mb-2">Active Filters</h4>
            <div className="space-y-2">
              {selectedCategory && (
                <div className="flex items-center justify-between bg-blue-50 px-3 py-1 rounded-md">
                  <span className="text-sm text-blue-800 capitalize">
                    {selectedCategory.replace(/-/g, ' ')}
                  </span>
                  <button
                    onClick={() => onCategoryChange('')}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
              {(localPriceRange[0] > 0 || localPriceRange[1] < 200) && (
                <div className="flex items-center justify-between bg-green-50 px-3 py-1 rounded-md">
                  <span className="text-sm text-green-800">
                    ${localPriceRange[0]} - ${localPriceRange[1]}
                  </span>
                  <button
                    onClick={resetPriceRange}
                    className="text-green-600 hover:text-green-800"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default FilterSidebar