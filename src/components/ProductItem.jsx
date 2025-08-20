import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addToCart } from '../store/cartSlice'

const ProductItem = ({ product, index = 0 }) => {
  const dispatch = useDispatch()
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef(null)

  const handleAddToCart = async (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (product.stock === 0) return

    setIsAddingToCart(true)

    // Add haptic feedback for mobile
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }

    // Add to cart with a delay for better UX
    setTimeout(() => {
      dispatch(addToCart(product))
      setIsAddingToCart(false)

      // Show success animation
      if (cardRef.current) {
        cardRef.current.classList.add('animate-success')
        setTimeout(() => {
          cardRef.current?.classList.remove('animate-success')
        }, 300)
      }
    }, 200)
  }

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage / 100)
  }

  const getStockStatus = () => {
    if (product.stock === 0) return { status: 'out-of-stock', text: 'Out of Stock', color: 'red' }
    if (product.stock < 5) return { status: 'low-stock', text: `Only ${product.stock} left!`, color: 'orange' }
    if (product.stock < 20) return { status: 'limited', text: `${product.stock} available`, color: 'yellow' }
    return { status: 'in-stock', text: 'In Stock', color: 'green' }
  }

  const stockInfo = getStockStatus()

  return (
    <div 
      ref={cardRef}
      className={`group relative card overflow-hidden product-hover transition-all duration-300 ease-in-out ${
        isHovered ? 'shadow-lg -translate-y-1 scale-[1.02]' : 'shadow-sm'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{ 
        animationDelay: `${index * 50}ms`,
        animationFillMode: 'both'
      }}
    >
      <Link to={`/product/${product.id}`} className="block">
        {/* Product Image Container */}
        <div className="relative h-56 bg-gradient-to-br from-gray-100 to-gray-200 overflow-hidden flex items-center justify-center">
          {/* Loading skeleton */}
          {!imageLoaded && !imageError && (
            <div className="absolute inset-0 skeleton animate-pulse"></div>
          )}

          {/* Product Image */}
          {!imageError ? (
            <img
              src={product.thumbnail}
              alt={product.title}
              className={`w-full h-full object-contain transition-transform duration-300 ease-in-out ${
                imageLoaded 
                  ? 'opacity-100 scale-100 group-hover:scale-105' 
                  : 'opacity-0 scale-95'
              }`}
              style={{
                padding: '0.5rem',
                maxHeight: '100%',
                maxWidth: '100%'
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => {
                setImageError(true)
                setImageLoaded(true)
              }}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300">
              <div className="text-center text-gray-500">
                <svg className="h-16 w-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">Image unavailable</span>
              </div>
            </div>
          )}

          {/* Overlay for better text visibility */}
          <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all duration-300"></div>

          {/* Badges Container */}
          <div className="absolute top-3 left-3 right-3 flex justify-between">
            {/* Discount Badge */}
            {product.discountPercentage > 0 && (
              <div className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg price-badge transform -rotate-2">
                -{Math.round(product.discountPercentage)}% OFF
              </div>
            )}

            {/* Stock Badge */}
            <div className={`px-3 py-1 rounded-full text-xs font-semibold shadow-lg ml-auto transform rotate-1 ${
              stockInfo.status === 'out-of-stock' ? 'bg-red-500 text-white' :
              stockInfo.status === 'low-stock' ? 'bg-orange-500 text-white' :
              stockInfo.status === 'limited' ? 'bg-yellow-500 text-black' :
              'bg-green-500 text-white'
            }`}>
              {stockInfo.text}
            </div>
          </div>

          {/* Quick View Overlay */}
          <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <div className="bg-white bg-opacity-90 rounded-full p-3 transform transition-all duration-300 hover:scale-110 shadow-xl">
              <svg className="h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </div>
          </div>

          {/* Wishlist Button (Future enhancement) */}
          <button className="absolute top-3 right-3 p-2 bg-white bg-opacity-80 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:scale-110">
            <svg className="h-4 w-4 text-gray-600 hover:text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </button>
        </div>

        {/* Product Info */}
        <div className="p-5">
          {/* Category */}
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider bg-blue-50 px-2 py-1 rounded-md">
              {product.category}
            </span>
            {product.brand && (
              <span className="text-xs text-gray-500 font-medium">
                {product.brand}
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
            {product.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-4 w-4 transition-colors duration-200 ${
                    i < Math.floor(product.rating) 
                      ? 'text-yellow-400' 
                      : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="ml-2 text-sm font-medium text-gray-700">
              ({product.rating.toFixed(1)})
            </span>
            <div className="ml-auto">
              <div className="flex">
                {[...Array(Math.floor(product.rating))].map((_, i) => (
                  <div key={i} className="w-1 h-1 bg-yellow-400 rounded-full mr-1"></div>
                ))}
              </div>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-baseline space-x-2">
              {product.discountPercentage > 0 ? (
                <>
                  <span className="text-2xl font-bold text-green-600 tracking-tight">
                    {formatPrice(calculateDiscountedPrice(product.price, product.discountPercentage))}
                  </span>
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-gray-900 tracking-tight">
                  {formatPrice(product.price)}
                </span>
              )}
            </div>

            {/* Savings indicator */}
            {product.discountPercentage > 0 && (
              <div className="text-right">
                <div className="text-xs text-green-600 font-semibold">
                  Save {formatPrice(product.price * product.discountPercentage / 100)}
                </div>
              </div>
            )}
          </div>

          {/* Description Preview */}
          {product.description && (
            <p className="text-sm text-gray-600 line-clamp-2 mb-4 leading-relaxed">
              {product.description}
            </p>
          )}
        </div>
      </Link>

      {/* Add to Cart Button */}
      <div className="px-5 pb-5">
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0 || isAddingToCart}
          className={`w-full py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 transform relative overflow-hidden ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : isAddingToCart
              ? 'bg-green-500 text-white scale-95'
              : 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white hover:shadow-xl hover:scale-105 active:scale-95'
          } ${!product.stock === 0 && !isAddingToCart ? 'btn-loading' : ''}`}
        >
          {product.stock === 0 ? (
            <span className="flex items-center justify-center">
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728L5.636 5.636m12.728 12.728L18.364 5.636M5.636 18.364l12.728-12.728" />
              </svg>
              Out of Stock
            </span>
          ) : isAddingToCart ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Adding...
            </span>
          ) : (
            <span className="flex items-center justify-center">
              <svg className="h-5 w-5 mr-2 transition-transform group-hover:scale-110" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 6H4m3 7v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
              </svg>
              Add to Cart
            </span>
          )}
        </button>
      </div>

      {/* Additional product details on hover */}
      {isHovered && (
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-white via-white to-transparent p-2 opacity-0 group-hover:opacity-100 transition-all duration-500">
          <div className="text-xs text-gray-600 text-center">
            Click to view full details →
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductItem