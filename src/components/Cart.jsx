import React from 'react'
import { Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { 
  selectCartItems, 
  selectCartTotalQuantity, 
  selectCartTotalAmount,
  clearCart 
} from '../store/cartSlice'
import CartItem from './CartItem'

const Cart = () => {
  const dispatch = useDispatch()
  const cartItems = useSelector(selectCartItems)
  const totalQuantity = useSelector(selectCartTotalQuantity)
  const totalAmount = useSelector(selectCartTotalAmount)

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price)
  }

  const handleClearCart = () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      dispatch(clearCart())
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg className="h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m2.6 8L6 6H4m3 7v2a2 2 0 002 2h10a2 2 0 002-2v-2" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
          <p className="text-gray-600 mb-8">
            Looks like you haven't added any items to your cart yet.
          </p>
          <Link to="/" className="btn-primary inline-block">
            Continue Shopping
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
            <p className="text-gray-600 mt-1">
              {totalQuantity} {totalQuantity === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>

          {cartItems.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 hover:text-red-800 font-medium flex items-center"
            >
              <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Clear Cart
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 p-6 border-b border-gray-200 text-sm font-medium text-gray-700">
                <div className="col-span-6">Product</div>
                <div className="col-span-2 text-center">Price</div>
                <div className="col-span-2 text-center">Quantity</div>
                <div className="col-span-2 text-center">Total</div>
              </div>

              {/* Cart Items List */}
              <div className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <CartItem key={item.id} item={item} />
                ))}
              </div>
            </div>

            {/* Continue Shopping */}
            <div className="mt-6">
              <Link
                to="/"
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
              >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Continue Shopping
              </Link>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal ({totalQuantity} items)</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Shipping</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>

                <div className="flex justify-between text-gray-600">
                  <span>Estimated Tax</span>
                  <span>{formatPrice(totalAmount * 0.08)}</span>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total</span>
                    <span>{formatPrice(totalAmount + (totalAmount * 0.08))}</span>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link
                to="/checkout"
                className="w-full mt-6 btn-primary block text-center"
              >
                Proceed to Checkout
              </Link>

              {/* Security Features */}
              <div className="mt-6 pt-4 border-t">
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.031 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  Secure checkout
                </div>
                <div className="flex items-center text-sm text-gray-600 mb-2">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free returns within 30 days
                </div>
                <div className="flex items-center text-sm text-gray-600">
                  <svg className="h-4 w-4 mr-2 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v2m0-2h2m-2 0H10m2-8a3 3 0 100-6 3 3 0 000 6z" />
                  </svg>
                  Price match guarantee
                </div>
              </div>

              {/* Savings Display */}
              {cartItems.some(item => item.originalPrice && item.originalPrice > item.price) && (
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center text-sm text-green-800">
                    <svg className="h-4 w-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    You're saving money on this order!
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart