import React, { Suspense } from 'react'
import { Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy loading components for performance optimization
const Home = React.lazy(() => import('./Pages/Home'))
const ProductDetailPage = React.lazy(() => import('./Pages/ProductDetailPage'))
const CartPage = React.lazy(() => import('./Pages/CartPage'))
const CheckoutPage = React.lazy(() => import('./Pages/CheckoutPage'))
const NotFound = React.lazy(() => import('./components/NotFound'))

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center">
    <LoadingSpinner />
  </div>
)

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header stays consistent across all pages */}
      <Header />

      {/* Main content area with routing */}
      <main className="pt-16"> {/* Account for fixed header */}
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetailPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
    </div>
  )
}

export default App