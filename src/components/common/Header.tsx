import React, { useState } from 'react'
import {
  ShoppingBag,
  Phone,
  Clock,
  Search,
  MapPin,
  Menu,
  X,
  MessageCircle,
  Truck,
  Sparkles,
  FileText,
} from 'lucide-react'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import { STORE_INFO } from '../../data/products'

export interface HeaderProps {
  cartCount?: number
  searchQuery?: string
  selectedCategory?: string
  onSearchChange?: (query: string) => void
  onCategorySelect?: (categoryId: string) => void
  onCartClick?: () => void
  onLogoClick?: () => void
  onNavigateToOrders?: () => void
  currentPage?: 'home' | 'checkout' | 'orders'
}

const AISLE_LINKS = [
  { id: 'all', label: 'All Items', urdu: 'تمام اشیاء' },
  { id: 'staples', label: 'Atta & Flours', urdu: 'آٹا و اناج' },
  { id: 'pulses', label: 'Rice & Pulses', urdu: 'دالیں و چاول' },
  { id: 'cooking', label: 'Ghee & Cooking Oil', urdu: 'گھی و تیل' },
  { id: 'spices', label: 'Spices & Masalay', urdu: 'مصالحہ جات' },
  { id: 'beverages', label: 'Tea & Sugar', urdu: 'چائے و چینی' },
]

export const Header: React.FC<HeaderProps> = ({
  cartCount = 0,
  searchQuery = '',
  selectedCategory = 'all',
  onSearchChange,
  onCategorySelect,
  onCartClick,
  onLogoClick,
  onNavigateToOrders,
  currentPage = 'home',
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAisleClick = (id: string) => {
    if (currentPage !== 'home') {
      onLogoClick?.()
    }
    onCategorySelect?.(id)
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      const el = document.getElementById('products-section')
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <header className="sticky top-0 z-50 bg-cream-50/95 backdrop-blur-md border-b border-cream-300">
      {/* 1. Top Utility Info Bar */}
      <div className="bg-forest-950 text-cream-100 text-xs py-1.5 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap justify-between items-center gap-2">
          {/* Left: Timing & Delivery */}
          <div className="flex items-center gap-4 text-cream-200">
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-lime-brand" />
              <span>8:00 AM – 11:00 PM Daily (کھلا ہے)</span>
            </span>
            <span className="hidden md:flex items-center gap-1.5 border-l border-forest-800 pl-4">
              <Truck className="w-3.5 h-3.5 text-lime-brand" />
              <span>30–45 Mins Local Doorstep Delivery</span>
            </span>
          </div>

          {/* Right: Orders, Phone & Urdu Tagline */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              type="button"
              onClick={onNavigateToOrders}
              className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentPage === 'orders'
                  ? 'bg-lime-brand text-forest-950 shadow-2xs'
                  : 'text-cream-100 hover:text-lime-brand bg-forest-900 border border-forest-800 hover:border-forest-700'
              }`}
              title="Track orders and view store dashboard"
            >
              <FileText className="w-3.5 h-3.5 text-lime-brand" />
              <span>Orders &amp; Tracking (آرڈرز)</span>
            </button>

            <a
              href={`tel:${STORE_INFO.phone}`}
              className="hidden sm:inline-flex items-center gap-1.5 text-cream-100 hover:text-lime-accent font-medium transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-lime-brand" />
              <span>Call: {STORE_INFO.phone}</span>
            </a>
          </div>
        </div>
      </div>

      {/* 2. Main Brand & Search Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3 sm:gap-6">
          {/* Brand Logo & Urdu Title */}
          <div
            onClick={onLogoClick}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') onLogoClick?.()
            }}
            className="flex items-center gap-3 shrink-0 cursor-pointer select-none group"
            title="Return to Hafiz Jee Kiryana Store Homepage"
          >
            <div className="w-11 h-11 rounded-2xl bg-forest-700 group-hover:bg-forest-800 transition-colors flex items-center justify-center text-cream-100 font-bold text-2xl shadow-forest-md border border-forest-600/40 relative">
              <span className="font-urdu leading-none">ح</span>
              <span className="w-2.5 h-2.5 rounded-full bg-lime-brand absolute -top-0.5 -right-0.5 ring-2 ring-cream-50" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-extrabold text-forest-950 tracking-tight leading-tight group-hover:text-forest-800 transition-colors">
                  Hafiz Jee Kiryana Store
                </h1>
                <Badge variant="lime" size="sm" className="hidden sm:inline-flex">
                  خالص کوالٹی
                </Badge>
              </div>
              <p className="text-xs text-forest-700/70 font-medium">
                Fresh Groceries &amp; Household Essentials • حافظ جی کریانہ سٹور
              </p>
            </div>
          </div>

          {/* Search Input Bar (Desktop & Tablet) */}
          <div className="hidden md:flex flex-1 max-w-lg mx-2">
            <div className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                placeholder="Search flour, rice, pulses, ghee, spices (تلاش کریں)..."
                onChange={(e) => onSearchChange?.(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-cream-300 rounded-xl text-forest-950 placeholder:text-forest-900/40 focus:bg-white focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/20 shadow-2xs transition-all"
              />
              <Search className="w-4 h-4 text-forest-700/60 absolute left-3.5 top-3" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => onSearchChange?.('')}
                  className="absolute right-3 top-2.5 text-forest-700/50 hover:text-forest-900 text-xs p-1 rounded-md"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Actions: WhatsApp + Basket + Hamburger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Assalam-o-Alaikum%20Hafiz%20Jee,%20I%20want%20to%20place%20an%20order`}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 bg-lime-brand hover:bg-lime-accent text-forest-950 font-semibold px-3 py-2 rounded-xl text-xs shadow-2xs transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp Order</span>
            </a>

            <Button
              variant="forest"
              size="md"
              onClick={onCartClick}
              className="relative px-3.5 sm:px-4 py-2"
              aria-label={`Basket with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Basket</span>
              {cartCount > 0 && (
                <span className="ml-1 bg-lime-brand text-forest-950 text-xs font-bold px-1.5 py-0.5 rounded-full shadow-2xs">
                  {cartCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl border border-cream-300 text-forest-800 hover:bg-cream-100 lg:hidden cursor-pointer"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar (Below title on small phones) */}
        <div className="mt-2.5 md:hidden">
          <div className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              placeholder="Search atta, rice, pulses, spices..."
              onChange={(e) => onSearchChange?.(e.target.value)}
              className="w-full pl-9 pr-9 py-2 text-xs bg-white border border-cream-300 rounded-xl text-forest-950 placeholder:text-forest-900/40 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
            />
            <Search className="w-3.5 h-3.5 text-forest-700/60 absolute left-3 top-2.5" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange?.('')}
                className="absolute right-2.5 top-2 text-forest-700/50 p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 3. Secondary Aisle Navigation Bar (Desktop) */}
      <div className="hidden lg:block bg-forest-800 text-cream-100 border-t border-forest-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <nav className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-thin">
            {AISLE_LINKS.map((aisle) => {
              const isActive = selectedCategory === aisle.id
              return (
                <button
                  key={aisle.id}
                  type="button"
                  onClick={() => handleAisleClick(aisle.id)}
                  className={`px-3.5 py-2 rounded-lg text-xs font-medium transition-colors cursor-pointer flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-lime-brand text-forest-950 font-semibold shadow-2xs'
                      : 'text-cream-100/90 hover:text-white hover:bg-forest-700/70'
                  }`}
                >
                  <span>{aisle.label}</span>
                  <span className="text-[11px] opacity-75 font-urdu">
                    ({aisle.urdu})
                  </span>
                </button>
              )
            })}
          </nav>

          <div className="flex items-center gap-1.5 text-xs text-lime-glow font-medium shrink-0 pl-4">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Daily Wholesale Market Rates</span>
          </div>
        </div>
      </div>

      {/* 4. Mobile Menu Drawer / Sheet */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-forest-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative ml-auto w-full max-w-xs bg-cream-50 h-full p-5 shadow-forest-xl flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-cream-300">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-forest-700 flex items-center justify-center text-white font-bold font-urdu">
                    ح
                  </div>
                  <div>
                    <h2 className="font-bold text-forest-950 text-sm">
                      Hafiz Jee Kiryana
                    </h2>
                    <p className="text-[11px] text-forest-700">حافظ جی کریانہ سٹور</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-lg text-forest-700 hover:bg-cream-200 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Aisles Section */}
              <div className="mt-5 space-y-1">
                <h3 className="text-xs font-bold text-forest-900 uppercase tracking-wider mb-2">
                  Store Aisles (شعبہ جات)
                </h3>
                {AISLE_LINKS.map((aisle) => (
                  <button
                    key={aisle.id}
                    type="button"
                    onClick={() => handleAisleClick(aisle.id)}
                    className={`w-full text-left px-3 py-2.5 rounded-xl text-xs flex items-center justify-between transition-colors ${
                      selectedCategory === aisle.id
                        ? 'bg-forest-700 text-white font-semibold'
                        : 'text-forest-900 hover:bg-cream-200'
                    }`}
                  >
                    <span>{aisle.label}</span>
                    <span className="font-urdu text-[11px] opacity-80">
                      {aisle.urdu}
                    </span>
                  </button>
                ))}
              </div>

              {/* Quick Contact & Details */}
              <div className="mt-6 pt-5 border-t border-cream-300 space-y-3">
                <div className="flex items-center gap-2 text-xs text-forest-800">
                  <Clock className="w-4 h-4 text-forest-600" />
                  <span>8:00 AM – 11:00 PM (Daily)</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-forest-800">
                  <MapPin className="w-4 h-4 text-forest-600" />
                  <span>{STORE_INFO.address}</span>
                </div>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 space-y-2 border-t border-cream-300">
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false)
                  onNavigateToOrders?.()
                }}
                className="w-full inline-flex items-center justify-center gap-2 bg-cream-100 hover:bg-cream-200 text-forest-950 font-bold py-2.5 rounded-xl text-xs border border-cream-300 shadow-2xs"
              >
                <FileText className="w-4 h-4 text-forest-700" />
                <span>Orders &amp; Tracking (آرڈرز ریکارڈ)</span>
              </button>

              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=Assalam-o-Alaikum%20Hafiz%20Jee`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-lime-brand hover:bg-lime-accent text-forest-950 font-semibold py-2.5 rounded-xl text-xs shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                Order on WhatsApp
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="w-full inline-flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 text-white font-medium py-2.5 rounded-xl text-xs shadow-2xs"
              >
                <Phone className="w-4 h-4" />
                Call Hotline: {STORE_INFO.phone}
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
