import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  items: [],
  totalQuantity: 0,
  totalAmount: 0,
  loading: false,
  error: null
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setLoading: (state, action) => {
      state.loading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
      state.loading = false
    },
    addToCart: (state, action) => {
      const newItem = action.payload
      const existingItem = state.items.find(item => item.id === newItem.id)
      
      // Convert price to number and fix to 2 decimal places
      const price = Number(parseFloat(newItem.price).toFixed(2))

      if (existingItem) {
        existingItem.quantity += 1
        existingItem.totalPrice = Number((price * existingItem.quantity).toFixed(2))
      } else {
        state.items.push({
          id: newItem.id,
          title: newItem.title,
          price: price,
          thumbnail: newItem.thumbnail,
          quantity: 1,
          totalPrice: price,
          stock: newItem.stock,
        })
      }

      // Update totals
      state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0)
      state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0)
      state.loading = false
      state.error = null
    },
    removeFromCart: (state, action) => {
      const id = action.payload
      const existingItem = state.items.find(item => item.id === id)
      
      if (existingItem) {
        state.items = state.items.filter(item => item.id !== id)
        
        // Update totals
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0)
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0)
      }
      state.loading = false
    },
    updateQuantity: (state, action) => {
      const { id, quantity } = action.payload
      const item = state.items.find(item => item.id === id)
      
      if (item) {
        item.quantity = quantity
        item.totalPrice = item.price * quantity
        
        // Update totals
        state.totalQuantity = state.items.reduce((total, item) => total + item.quantity, 0)
        state.totalAmount = state.items.reduce((total, item) => total + item.totalPrice, 0)
      }
      state.loading = false
    },
    clearCart: (state) => {
      state.items = []
      state.totalQuantity = 0
      state.totalAmount = 0
      state.loading = false
      state.error = null
    }
  }
})

export const {
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
  setLoading,
  setError
} = cartSlice.actions

// Selectors
export const selectCartItems = state => state.cart.items
export const selectCartTotalQuantity = state => state.cart.totalQuantity
export const selectCartTotalAmount = state => state.cart.totalAmount
export const selectCartLoading = state => state.cart.loading
export const selectCartError = state => state.cart.error

// Thunks
export const addToCartAsync = (product) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    dispatch(addToCart(product))
  } catch (error) {
    dispatch(setError(error.message))
  }
}

export const removeFromCartAsync = (id) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    dispatch(removeFromCart(id))
  } catch (error) {
    dispatch(setError(error.message))
  }
}

export const updateQuantityAsync = (id, quantity) => async (dispatch) => {
  try {
    dispatch(setLoading(true))
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 300))
    dispatch(updateQuantity({ id, quantity }))
  } catch (error) {
    dispatch(setError(error.message))
  }
}

export default cartSlice.reducer