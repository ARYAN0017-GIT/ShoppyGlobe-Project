import React from 'react'
import ProductList from '../components/ProductList'
import { useSelector } from 'react-redux'
import { selectSearchTerm } from '../store/productsSlice'

const Home = () => {
  const searchTerm = useSelector(selectSearchTerm)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      {!searchTerm && (
        <section className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">ShoppyGlobe</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              Your one-stop destination for amazing products at unbeatable prices
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <div className="flex items-center bg-white/10 rounded-lg px-6 py-3">
                <svg className="h-6 w-6 mr-2 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span>Free Shipping Over $50</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-lg px-6 py-3">
                <svg className="h-6 w-6 mr-2 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center bg-white/10 rounded-lg px-6 py-3">
                <svg className="h-6 w-6 mr-2 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m9-9a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Best Price Guarantee</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Search Results Header */}
      {searchTerm && (
        <section className="bg-white border-b border-gray-200 py-6">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-900">
              Search Results for: <span className="text-blue-600">"{searchTerm}"</span>
            </h1>
          </div>
        </section>
      )}

      {/* Features Section */}
      {!searchTerm && (
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose ShoppyGlobe?</h2>
              <p className="text-xl text-gray-600">We make online shopping easy, safe, and enjoyable</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Lightning Fast</h3>
                <p className="text-gray-600">Experience blazing fast page loads and smooth shopping</p>
              </div>

              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Secure Shopping</h3>
                <p className="text-gray-600">Your data and payments are protected with bank-level security</p>
              </div>

              <div className="text-center p-6 rounded-lg hover:shadow-lg transition-shadow">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="h-8 w-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Customer Love</h3>
                <p className="text-gray-600">Rated #1 for customer service and satisfaction</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Product List */}
      <ProductList />

      {/* Newsletter Section */}
      {!searchTerm && (
        <section className="bg-gray-900 text-white py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
            <p className="text-xl text-gray-300 mb-8">
              Get the latest deals and new product announcements delivered to your inbox
            </p>
            <div className="max-w-md mx-auto flex">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-l-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-r-lg font-semibold transition-colors">
                Subscribe
              </button>
            </div>
            <p className="text-sm text-gray-400 mt-4">
              We respect your privacy. Unsubscribe at any time.
            </p>
          </div>
        </section>
      )}
    </div>
  )
}

export default Home