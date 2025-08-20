import { configureStore } from '@reduxjs/toolkit'
import cartReducer from './cartSlice'
import productsReducer from './productsSlice'

const store = configureStore({
  reducer: {
    cart: cartReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
})

export default store
export const getState = store.getState
export const dispatch = store.dispatch