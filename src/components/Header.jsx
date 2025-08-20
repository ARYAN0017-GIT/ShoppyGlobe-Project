import React, { useState, useRef, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { selectCartTotalQuantity } from '../store/cartSlice'
import { 
  selectSearchTerm, 
  selectCategories,
  setSearchTerm,
  clearFilters 
} from '../store/productsSlice'
import useProducts from '../hooks/useProducts'

const Header = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const cartQuantity = useSelector(selectCartTotalQuantity)
  const searchTerm = useSelector(selectSearchTerm)
  const categories = useSelector(selectCategories)

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm)
  const [searchSuggestions, setSearchSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [cartAnimation, setCartAnimation] = useState(false)

  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)

  // Popular search terms (in real app, this would come from analytics)
  const popularSearches = [
    'laptop', 'smartphone', 'headphones', 'watch', 'shoes', 
    'clothing', 'beauty', 'furniture', 'books', 'sports'
  ]

  // Trigger cart animation when quantity changes
  useEffect(() => {
    if (cartQuantity > 0) {
      setCartAnimation(true)
      const timer = setTimeout(() => setCartAnimation(false), 600)
      return () => clearTimeout(timer)
    }
  }, [cartQuantity])

  // Update local search term when global state changes
  useEffect(() => {
    setLocalSearchTerm(searchTerm)
  }, [searchTerm])

  // Generate search suggestions
  useEffect(() => {
    if (localSearchTerm.length > 0) {
      const suggestions = [
        ...popularSearches.filter(term => 
          term.toLowerCase().includes(localSearchTerm.toLowerCase())
        ).slice(0, 5),
        ...categories.filter(category => {
          const categoryText = typeof category === 'string' ? category : category.name || '';
          return categoryText.toLowerCase().includes(localSearchTerm.toLowerCase());
        }).map(category => typeof category === 'string' ? category : category.name || '')
        .slice(0, 3)
      ].slice(0, 6)

      setSearchSuggestions(suggestions)
    } else {
      setSearchSuggestions(popularSearches.slice(0, 6))
    }
  }, [localSearchTerm, categories])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target)) {
        setShowSuggestions(false)
        setIsSearchFocused(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    const term = localSearchTerm.trim()

    if (term) {
      dispatch(setSearchTerm(term))
      setShowSuggestions(false)
      setIsSearchFocused(false)

      if (location.pathname !== '/') {
        navigate('/')
      }
    }
  }

  const handleSuggestionClick = (suggestion) => {
    setLocalSearchTerm(suggestion)
    dispatch(setSearchTerm(suggestion))
    setShowSuggestions(false)
    setIsSearchFocused(false)

    if (location.pathname !== '/') {
      navigate('/')
    }
  }

  const handleClearSearch = () => {
    setLocalSearchTerm('')
    dispatch(clearFilters())
    setShowSuggestions(false)
    setIsSearchFocused(false)
    searchInputRef.current?.focus()
  }

  const handleSearchFocus = () => {
    setIsSearchFocused(true)
    setShowSuggestions(true)
  }

  const handleSearchChange = (e) => {
    setLocalSearchTerm(e.target.value)
  }

  const navItems = [
    { path: '/', label: 'Home', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
    { path: '/cart', label: 'Cart', icon: 'M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 6H4m3 7v2a2 2 0 002 2h10a2 2 0 002-2v-2' },
  ]

  return (
    <header className="bg-white shadow-lg fixed w-full top-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center group" onClick={() => dispatch(clearFilters())}>
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 via-purple-600 to-blue-800 rounded-xl flex items-center justify-center mr-3 transform group-hover:scale-105 transition-transform duration-200">
                <span className="text-white font-bold text-lg">SG</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  ShoppyGlobe
                </span>
                <div className="text-xs text-gray-500 -mt-1">Your Shopping Paradise</div>
              </div>
            </Link>
          </div>

          {/* Desktop Search and Navigation */}
          <div className="hidden md:flex items-center space-x-8 flex-1 justify-center max-w-2xl mx-8">
            {/* Enhanced Search Bar */}
            <div ref={searchContainerRef} className="relative flex-1 max-w-lg">
              <form onSubmit={handleSearch} className="relative">
                <div className={`relative transition-all duration-300 ${isSearchFocused ? 'transform scale-105' : ''}`}>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={localSearchTerm}
                    onChange={handleSearchChange}
                    onFocus={handleSearchFocus}
                    placeholder="Search products, categories..."
                    className={`w-full pl-12 pr-12 py-3 border-2 rounded-xl transition-all duration-300 ${
                      isSearchFocused 
                        ? 'border-blue-500 shadow-lg bg-blue-50/50' 
                        : 'border-gray-300 hover:border-gray-400'
                    } focus:outline-none`}
                  />

                  {/* Search Icon */}
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className={`h-5 w-5 transition-colors duration-300 ${isSearchFocused ? 'text-blue-500' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>

                  {/* Clear/Submit Button */}
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    {localSearchTerm ? (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </form>

              {/* Search Suggestions Dropdown */}
              {showSuggestions && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-xl z-50 max-h-80 overflow-y-auto">
                  <div className="p-4">
                    {localSearchTerm ? (
                      <div className="text-xs font-medium text-gray-500 mb-3">
                        Search suggestions for "{localSearchTerm}"
                      </div>
                    ) : (
                      <div className="text-xs font-medium text-gray-500 mb-3">
                        Popular searches
                      </div>
                    )}

                    <div className="space-y-1">
                      {searchSuggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSuggestionClick(suggestion)}
                          className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 rounded-md transition-colors duration-150 flex items-center"
                        >
                          <svg className="h-4 w-4 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                          </svg>
                          <span className="capitalize">{suggestion}</span>
                          {popularSearches.includes(suggestion) && (
                            <span className="ml-auto text-xs text-blue-500">🔥</span>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Desktop Navigation & Cart */}
          <div className="hidden md:flex items-center space-x-6">
            {/* Navigation Links */}
            <nav className="flex space-x-6">
              {navItems.slice(0, 1).map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`nav-link flex items-center space-x-1 ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() => item.path === '/' && dispatch(clearFilters())}
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>

            {/* Enhanced Cart Icon */}
            <Link to="/cart" className={`relative p-2 text-gray-700 hover:text-blue-600 transition-all duration-300 ${cartAnimation ? 'cart-bounce' : ''}`}>
              <div className="relative">
                <svg className="h-7 w-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 6H4m3 7v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
                </svg>
                {cartQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center animate-pulse font-bold shadow-lg">
                    {cartQuantity > 99 ? '99+' : cartQuantity}
                  </span>
                )}
              </div>
            </Link>
          </div>

          {/* Mobile Controls */}
          <div className="md:hidden flex items-center space-x-4">
            {/* Mobile Cart Icon */}
            <Link to="/cart" className={`relative p-2 text-gray-700 ${cartAnimation ? 'cart-bounce' : ''}`}>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 6H4m3 7v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
              </svg>
              {cartQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartQuantity > 99 ? '99+' : cartQuantity}
                </span>
              )}
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600 p-2 transition-colors"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 pb-4 bg-white">
            {/* Mobile Search */}
            <div className="px-4 py-4">
              <form onSubmit={handleSearch} className="relative">
                <input
                  type="text"
                  value={localSearchTerm}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <button
                  type="submit"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-blue-600 hover:text-blue-800"
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </button>
              </form>
            </div>

            {/* Mobile Navigation */}
            <nav className="px-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors ${
                    location.pathname === item.path
                      ? 'bg-blue-100 text-blue-600 font-semibold'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => {
                    setIsMobileMenuOpen(false)
                    if (item.path === '/') dispatch(clearFilters())
                  }}
                >
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span>{item.label}</span>
                  {item.path === '/cart' && cartQuantity > 0 && (
                    <span className="ml-auto bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartQuantity}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            {/* Quick actions */}
            {localSearchTerm && (
              <div className="px-4 py-2 border-t border-gray-200 mt-4">
                <button
                  onClick={handleClearSearch}
                  className="text-sm text-blue-600 hover:text-blue-800 flex items-center"
                >
                  <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Clear search
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

export default Header