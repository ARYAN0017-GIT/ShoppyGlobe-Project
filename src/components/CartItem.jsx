import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../store/cartSlice'
import { formatPrice } from '../utils/currency'

const CartItem = ({ item }) => {
  const dispatch = useDispatch()
  const [isRemoving, setIsRemoving] = useState(false)

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= item.stock) {
      dispatch(updateQuantity({ id: item.id, quantity: newQuantity }))
    }
  }

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      dispatch(removeFromCart(item.id))
    }, 300)
  }

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-white p-4 rounded-lg shadow mb-4 relative overflow-hidden">
      {/* Loading overlay */}
      {isRemoving && (
        <div className="absolute inset-0 bg-gray-200 bg-opacity-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
        </div>
      )}

      {/* Product image and title */}
      <div className="flex items-center flex-grow mb-4 sm:mb-0">
        <Link to={`/product/${item.id}`} className="flex items-center">
          <div className="w-20 h-20 flex-shrink-0">
            <img
              src={item.thumbnail}
              alt={item.title}
              className="w-full h-full object-cover rounded"
            />
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
            <p className="text-sm text-gray-500">{formatPrice(item.price)} each</p>
          </div>
        </Link>
      </div>

      {/* Quantity controls */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center border rounded-lg">
          <button
            onClick={() => handleQuantityChange(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M20 12H4"
              />
            </svg>
          </button>
          <span className="px-4 py-2 text-gray-900">{item.quantity}</span>
          <button
            onClick={() => handleQuantityChange(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className="w-4 h-4 text-gray-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>

        {/* Total price and remove button */}
        <div className="flex items-center space-x-4">
          <span className="text-lg font-semibold text-gray-900">
            {formatPrice(item.price * item.quantity)}
          </span>
          <button
            onClick={handleRemove}
            disabled={isRemoving}
            className="text-red-600 hover:text-red-800 transition-colors duration-200"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  )
}

export default CartItem