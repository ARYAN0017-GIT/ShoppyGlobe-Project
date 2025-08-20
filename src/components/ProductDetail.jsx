import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { 
  fetchProductById, 
  selectCurrentProduct, 
  selectProductLoading, 
  selectProductError,
  clearCurrentProduct 
} from '../store/productsSlice'
import { addToCart } from '../store/cartSlice'
import LoadingSpinner from './LoadingSpinner'
import { formatPrice } from '../utils/currency'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const product = useSelector(selectCurrentProduct)
  const loading = useSelector(selectProductLoading)
  const error = useSelector(selectProductError)

  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(fetchProductById(id))
    }
    return () => {
      dispatch(clearCurrentProduct())
    }
  }, [id, dispatch])

  // Reset selected image when product changes
  useEffect(() => {
    if (product && product?.images) {
      setSelectedImage(0)
      setQuantity(1) // Reset quantity when product changes
    }
  }, [product])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="large" message="Loading product details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
          <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Product</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Product Not Found</h3>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Return to Home
          </button>
        </div>
      </div>
    )
  }

  const handleAddToCart = () => {
    if (!product || quantity <= 0) return

    setIsAddingToCart(true)

    // Add to cart with quantity
    dispatch(addToCart({ ...product, quantity }))

    setTimeout(() => {
      setIsAddingToCart(false)
    }, 500)
  }

  const calculateDiscountedPrice = (price, discountPercentage) => {
    return price - (price * discountPercentage / 100)
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <LoadingSpinner size="large" message="Loading product details..." />
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-md mx-auto">
          <div className="text-red-600 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">Product Not Found</h3>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold text-gray-700 mb-4">Product not found</h3>
          <button
            onClick={() => navigate('/')}
            className="btn-primary"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  const images = product.images || [product.thumbnail]
  const discountedPrice = product.discountPercentage > 0 
    ? calculateDiscountedPrice(product.price, product.discountPercentage)
    : product.price

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Products
        </button>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
            <img
              src={images[selectedImage]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = product.thumbnail
              }}
            />
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.title} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Information */}
        <div className="space-y-6">
          {/* Category and Title */}
          <div>
            <p className="text-sm text-blue-600 font-medium uppercase tracking-wide mb-2">
              {product.category}
            </p>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.title}
            </h1>

            {/* Brand */}
            {product.brand && (
              <p className="text-lg text-gray-600 mb-2">
                Brand: <span className="font-medium">{product.brand}</span>
              </p>
            )}
          </div>

          {/* Rating and Reviews */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <svg
                  key={i}
                  className={`h-5 w-5 ${
                    i < Math.floor(product.rating) ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-lg font-medium text-gray-700">
              {product.rating} out of 5
            </span>
          </div>

          {/* Price */}
          <div className="space-y-2">
            <div className="flex items-center space-x-4">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(discountedPrice)}
              </span>
              {product.discountPercentage > 0 && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-1 rounded-md text-sm font-semibold">
                    {Math.round(product.discountPercentage)}% OFF
                  </span>
                </>
              )}
            </div>
            {product.discountPercentage > 0 && (
              <p className="text-green-600 font-medium">
                You save {formatPrice(product.price - discountedPrice)}!
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Description</h3>
            <p className="text-gray-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Stock Status */}
          <div className="flex items-center space-x-4">
            <div className={`flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              product.stock > 10 
                ? 'bg-green-100 text-green-800'
                : product.stock > 0
                ? 'bg-orange-100 text-orange-800'
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full mr-2 ${
                product.stock > 10 
                  ? 'bg-green-500'
                  : product.stock > 0
                  ? 'bg-orange-500'
                  : 'bg-red-500'
              }`}></div>
              {product.stock > 10 
                ? 'In Stock'
                : product.stock > 0
                ? `Only ${product.stock} left`
                : 'Out of Stock'
              }
            </div>
          </div>

          {/* Quantity Selector and Add to Cart */}
          <div className="space-y-4">
            {product.stock > 0 && (
              <div className="flex items-center space-x-4">
                <label htmlFor="quantity" className="text-lg font-medium text-gray-700">
                  Quantity:
                </label>
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    -
                  </button>
                  <input
                    id="quantity"
                    type="number"
                    min="1"
                    max={product.stock}
                    value={quantity}
                    onChange={(e) => setQuantity(Math.min(product.stock, Math.max(1, parseInt(e.target.value) || 1)))}
                    className="w-16 text-center py-2 border-0 focus:ring-0"
                  />
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-2 hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className={`w-full py-3 px-6 rounded-lg text-lg font-semibold transition-all duration-200 ${
                product.stock === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : isAddingToCart
                  ? 'bg-green-500 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white hover:shadow-lg'
              }`}
            >
              {product.stock === 0 
                ? 'Out of Stock'
                : isAddingToCart
                ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Adding to Cart...
                  </span>
                )
                : `Add ${quantity} to Cart - ${formatPrice(discountedPrice * quantity)}`
              }
            </button>
          </div>

          {/* Additional Info */}
          <div className="border-t pt-6 space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {product.weight && (
                <div>
                  <span className="font-medium text-gray-700">Weight:</span>
                  <span className="ml-2 text-gray-600">{product.weight}</span>
                </div>
              )}
              {product.dimensions && (
                <div>
                  <span className="font-medium text-gray-700">Dimensions:</span>
                  <span className="ml-2 text-gray-600">
                    {product.dimensions.width}×{product.dimensions.height}×{product.dimensions.depth}
                  </span>
                </div>
              )}
              {product.warrantyInformation && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Warranty:</span>
                  <span className="ml-2 text-gray-600">{product.warrantyInformation}</span>
                </div>
              )}
              {product.shippingInformation && (
                <div className="col-span-2">
                  <span className="font-medium text-gray-700">Shipping:</span>
                  <span className="ml-2 text-gray-600">{product.shippingInformation}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Product Info */}
      {product.reviews && product.reviews.length > 0 && (
        <div className="mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-6">Customer Reviews</h3>
          <div className="space-y-4">
            {product.reviews.slice(0, 3).map((review, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg">
                <div className="flex items-center mb-2">
                  <div className="flex">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="ml-2 font-medium text-gray-700">{review.reviewerName}</span>
                </div>
                <p className="text-gray-600">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail