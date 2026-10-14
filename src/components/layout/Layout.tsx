import React, { useState } from 'react'
import { Header } from '../common/Header'
import { Footer } from '../common/Footer'
import { MobileNav } from '../common/MobileNav'
import { CartDrawer } from '../common/CartDrawer'
import { CartToast } from '../common/CartToast'
import { useCart } from '../../context/useCart'
import type { CartItem } from '../../types'

export interface LayoutProps {
  children: React.ReactNode
  cartItems?: CartItem[]
  searchQuery: string
  selectedCategory: string
  currentPage?: 'home' | 'checkout' | 'orders' | 'admin'
  onSearchChange: (query: string) => void
  onCategorySelect: (categoryId: string) => void
  onNavigateHome?: () => void
  onNavigateToCheckout?: () => void
  onNavigateToOrders?: () => void
  onNavigateToAdmin?: () => void
  onUpdateQuantity?: (productId: string, newQuantity: number) => void
  onRemoveItem?: (productId: string) => void
  onClearCart?: () => void
}

export const Layout: React.FC<LayoutProps> = ({
  children,
  searchQuery,
  selectedCategory,
  currentPage = 'home',
  onSearchChange,
  onCategorySelect,
  onNavigateHome,
  onNavigateToCheckout,
  onNavigateToOrders,
  onNavigateToAdmin,
}) => {
  const { totalCount, openCart } = useCart()
  const [activeMobileTab, setActiveMobileTab] = useState('home')

  const handleMobileTabChange = (tab: string) => {
    setActiveMobileTab(tab)
    if (tab === 'cart') {
      openCart()
    } else if (tab === 'categories') {
      if (currentPage !== 'home') {
        onNavigateHome?.()
      }
      setTimeout(() => {
        const el = document.getElementById('categories-section')
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' })
        }
      }, 100)
    } else if (tab === 'home') {
      if (currentPage !== 'home') {
        onNavigateHome?.()
      }
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-cream-100 text-forest-950 font-sans selection:bg-lime-brand selection:text-forest-950">
      {/* Header & Sticky Nav */}
      <Header
        cartCount={totalCount}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        currentPage={currentPage}
        onSearchChange={onSearchChange}
        onCategorySelect={onCategorySelect}
        onCartClick={openCart}
        onLogoClick={onNavigateHome}
        onNavigateToOrders={onNavigateToOrders}
        onNavigateToAdmin={onNavigateToAdmin}
      />

      {/* Main Content Area with responsive padding */}
      <main className="flex-1 w-full pb-16 sm:pb-8">
        {children}
      </main>

      {/* Responsive Cart Drawer */}
      <CartDrawer onNavigateToCheckout={onNavigateToCheckout} />

      {/* Cart Toast Notification Banner */}
      <CartToast />

      {/* Mobile Bottom Navigation */}
      <MobileNav
        activeTab={activeMobileTab}
        cartCount={totalCount}
        onTabChange={handleMobileTabChange}
        onCartClick={openCart}
      />

      {/* Footer */}
      <Footer />
    </div>
  )
}
