import React from 'react'
import type { Product } from '../../types'
import { STORE_INFO } from '../../data/products'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import {
  X,
  Star,
  XCircle,
  MessageCircle,
  ShieldCheck,
  MapPin,
  AlertTriangle,
  ShoppingBag,
} from 'lucide-react'

export interface ProductDetailsModalProps {
  product: Product | null
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export const ProductDetailsModal: React.FC<ProductDetailsModalProps> = ({
  product,
  onClose,
  onAddToCart,
}) => {
  React.useEffect(() => {
    if (!product) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [product, onClose])

  if (!product) return null

  const isAvailable = product.inStock && product.stockQuantity > 0

  const handleAdd = () => {
    if (!isAvailable) return
    onAddToCart(product)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/70 backdrop-blur-xs animate-in fade-in duration-150"
      role="dialog"
      aria-modal="true"
      aria-labelledby="product-modal-title"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-forest-xl border border-cream-300 space-y-5 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="lime" size="sm">
                {product.unit}
              </Badge>
              {isAvailable ? (
                <Badge variant="forest" size="sm">
                  ✓ In Stock ({product.stockQuantity})
                </Badge>
              ) : (
                <Badge variant="danger" size="sm">
                  ✕ Out of Stock
                </Badge>
              )}
            </div>
            <h3 id="product-modal-title" className="font-black text-lg sm:text-xl text-forest-950 mt-1">
              {product.name}
            </h3>
            {product.urduName && (
              <p className="font-urdu text-sm text-forest-800 font-bold">
                {product.urduName}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-forest-700 hover:bg-cream-100 rounded-xl cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-2 text-xs text-amber-600 font-bold bg-amber-50/80 px-3 py-1.5 rounded-xl border border-amber-200">
            <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
            <span>Rating: {product.rating} / 5.0</span>
            {product.reviewsCount ? (
              <span className="text-forest-700/60 font-normal">
                ({product.reviewsCount} sample reviews)
              </span>
            ) : null}
          </div>
        )}

        {/* Description */}
        <div className="space-y-1.5 text-xs sm:text-sm text-forest-800 leading-relaxed">
          <h4 className="font-bold text-forest-950">Product Description:</h4>
          <p className="text-forest-700/80">{product.description}</p>
        </div>

        {/* Official Sample Price & Mandi Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="font-bold flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />
              Sample Retail Price (عارضی نرخ):
            </span>
            <span className="text-base font-black text-forest-950">
              Rs. {product.price}
            </span>
          </div>
          <p className="text-[11px] text-amber-900/80 leading-relaxed">
            Note: All prices are sample estimates in PKR based on local mandi rates. The store owner at {STORE_INFO.address} confirms the final verified price when processing your order.
          </p>
        </div>

        {/* Store Trust Specs */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-forest-700 shrink-0" />
            <span>100% Khális Purity</span>
          </div>
          <div className="p-2.5 rounded-xl bg-cream-50 border border-cream-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
            <span>{STORE_INFO.address}</span>
          </div>
        </div>

        {/* Actions: Disabled if out of stock */}
        <div className="flex items-center gap-2 pt-2 border-t border-cream-200">
          {isAvailable ? (
            <Button
              variant="forest"
              fullWidth
              onClick={handleAdd}
              iconLeft={<ShoppingBag className="w-4 h-4" />}
            >
              Add to Shopping Basket (ٹوکری میں شامل کریں)
            </Button>
          ) : (
            <button
              type="button"
              disabled
              className="w-full inline-flex items-center justify-center font-bold rounded-xl text-sm py-3 px-4 gap-2 bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed select-none"
              aria-disabled="true"
            >
              <XCircle className="w-4 h-4 text-slate-400" />
              <span>Currently Out of Stock (دستیاب نہیں)</span>
            </button>
          )}

          <a
            href={`https://wa.me/${STORE_INFO.whatsapp}?text=Assalam-o-Alaikum%20Hafiz%20Jee,%20inquiry%20regarding%20${encodeURIComponent(
              product.name
            )}%20(${product.unit})`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-3 bg-lime-brand hover:bg-lime-accent text-forest-950 rounded-xl transition-colors shrink-0 shadow-2xs"
            title="Inquire directly on WhatsApp"
          >
            <MessageCircle className="w-5 h-5" />
          </a>
        </div>
      </div>
    </div>
  )
}
