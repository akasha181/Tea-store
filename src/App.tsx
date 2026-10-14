import { useState, useEffect, lazy, Suspense } from 'react'
import { ProductCatalogProvider } from './context/ProductCatalogContext'
import { CartProvider } from './context/CartContext'
import { useCart } from './context/useCart'
import { Layout } from './components/layout/Layout'
import { HomePage } from './pages/HomePage'

// Lazy-load secondary pages for code splitting & initial performance
const CheckoutPage = lazy(() =>
  import('./pages/CheckoutPage').then((m) => ({ default: m.CheckoutPage }))
)
const OrdersPage = lazy(() =>
  import('./pages/OrdersPage').then((m) => ({ default: m.OrdersPage }))
)

function PageLoadingFallback() {
  return (
    <div
      className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-4 text-forest-950"
      role="status"
      aria-live="polite"
    >
      <div className="w-14 h-14 rounded-2xl bg-forest-800 text-lime-brand flex items-center justify-center font-urdu text-2xl font-bold animate-pulse shadow-forest-md">
        ح
      </div>
      <div className="flex items-center gap-2 text-xs font-bold text-forest-800">
        <span className="w-2 h-2 rounded-full bg-lime-brand animate-ping" />
        <span>Loading Hafiz Jee Groceries (لوڈ ہو رہا ہے)...</span>
      </div>
    </div>
  )
}

function parseCurrentRoute(): {
  page: 'home' | 'checkout' | 'orders'
  orderId?: string
} {
  if (typeof window === 'undefined') return { page: 'home' }
  const hash = window.location.hash.toLowerCase()
  if (hash.startsWith('#checkout')) {
    return { page: 'checkout' }
  }
  if (hash.startsWith('#orders') || hash.startsWith('#tracking')) {
    const queryIndex = window.location.hash.indexOf('?')
    if (queryIndex !== -1) {
      const searchParams = new URLSearchParams(window.location.hash.slice(queryIndex))
      const id = searchParams.get('id') || undefined
      return { page: 'orders', orderId: id }
    }
    return { page: 'orders' }
  }
  return { page: 'home' }
}

function AppContent() {
  const { addToCart } = useCart()
  const [currentPage, setCurrentPage] = useState<'home' | 'checkout' | 'orders'>(() => {
    return parseCurrentRoute().page
  })
  const [activeOrderId, setActiveOrderId] = useState<string | undefined>(() => {
    return parseCurrentRoute().orderId
  })
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')

  // Listen to browser hash changes (support back button & deep linking)
  useEffect(() => {
    const handleHashChange = () => {
      const route = parseCurrentRoute()
      setCurrentPage(route.page)
      if (route.orderId) {
        setActiveOrderId(route.orderId)
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateToCheckout = () => {
    setCurrentPage('checkout')
    window.location.hash = 'checkout'
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToOrders = (orderId?: string) => {
    setCurrentPage('orders')
    if (orderId) {
      setActiveOrderId(orderId)
      window.location.hash = `orders?id=${orderId}`
    } else {
      window.location.hash = 'orders'
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateHome = () => {
    setCurrentPage('home')
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search)
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleCategorySelectFromOtherPage = (catId: string) => {
    setSelectedCategory(catId)
    navigateHome()
    setTimeout(() => {
      const el = document.getElementById('products-section')
      if (el) el.scrollIntoView({ behavior: 'smooth' })
    }, 150)
  }

  return (
    <Layout
      searchQuery={searchQuery}
      selectedCategory={selectedCategory}
      currentPage={currentPage}
      onSearchChange={(query) => setSearchQuery(query)}
      onCategorySelect={(categoryId) => setSelectedCategory(categoryId)}
      onNavigateHome={navigateHome}
      onNavigateToCheckout={navigateToCheckout}
      onNavigateToOrders={navigateToOrders}
    >
      <Suspense fallback={<PageLoadingFallback />}>
        {currentPage === 'checkout' ? (
          <CheckoutPage
            onNavigateHome={navigateHome}
            onNavigateToCategory={handleCategorySelectFromOtherPage}
            onNavigateToOrders={navigateToOrders}
          />
        ) : currentPage === 'orders' ? (
          <OrdersPage
            onNavigateHome={navigateHome}
            onNavigateToCheckout={navigateToCheckout}
            initialActiveOrderId={activeOrderId}
          />
        ) : (
          <HomePage
            onAddToCart={addToCart}
            searchQuery={searchQuery}
            selectedCategory={selectedCategory}
            onSearchChange={(query) => setSearchQuery(query)}
            onCategorySelect={(catId) => setSelectedCategory(catId)}
          />
        )}
      </Suspense>
    </Layout>
  )
}

function App() {
  return (
    <ProductCatalogProvider>
      <CartProvider>
        <AppContent />
      </CartProvider>
    </ProductCatalogProvider>
  )
}

export default App
