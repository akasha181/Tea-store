import React from 'react'
import { Home, Grid, MessageCircle, ShoppingBag } from 'lucide-react'
import { STORE_INFO } from '../../data/products'

export interface MobileNavProps {
  activeTab?: string
  cartCount?: number
  onTabChange?: (tab: string) => void
  onCartClick?: () => void
  onWhatsAppClick?: () => void
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeTab = 'home',
  cartCount = 0,
  onTabChange,
  onCartClick,
  onWhatsAppClick,
}) => {
  return (
    <nav
      aria-label="Mobile Navigation"
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-cream-300 px-3 py-2 sm:hidden shadow-forest-lg transition-transform motion-reduce:transition-none"
    >
      <div className="grid grid-cols-4 gap-1 items-center max-w-md mx-auto">
        <button
          type="button"
          onClick={() => onTabChange?.('home')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'home'
              ? 'text-forest-700 font-semibold'
              : 'text-forest-900/60 hover:text-forest-800'
          }`}
        >
          <Home className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Home</span>
        </button>

        <button
          type="button"
          onClick={() => onTabChange?.('categories')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'categories'
              ? 'text-forest-700 font-semibold'
              : 'text-forest-900/60 hover:text-forest-800'
          }`}
        >
          <Grid className="w-5 h-5" />
          <span className="text-[10px] mt-0.5">Aisles</span>
        </button>

        <button
          type="button"
          onClick={
            onWhatsAppClick ||
            (() =>
              window.open(
                `https://wa.me/${STORE_INFO.whatsapp}?text=Assalam-o-Alaikum%20Hafiz%20Jee`,
                '_blank'
              ))
          }
          className="flex flex-col items-center justify-center py-1 rounded-xl text-forest-900/70 hover:text-forest-900 transition-colors cursor-pointer"
        >
          <div className="relative">
            <MessageCircle className="w-5 h-5 text-emerald-600" />
            <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-lime-brand ring-2 ring-white" />
          </div>
          <span className="text-[10px] mt-0.5 text-forest-800">WhatsApp</span>
        </button>

        <button
          type="button"
          onClick={onCartClick}
          className={`relative flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            activeTab === 'cart'
              ? 'text-forest-700 font-semibold'
              : 'text-forest-900/60 hover:text-forest-800'
          }`}
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-lime-brand text-forest-950 text-[10px] font-bold px-1.5 py-0.2 rounded-full ring-2 ring-white shadow-2xs">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5">Basket</span>
        </button>
      </div>
    </nav>
  )
}
