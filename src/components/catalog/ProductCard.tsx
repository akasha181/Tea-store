import React, { useState, useEffect } from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'
import type { Product } from '../../types'
import { STORE_INFO } from '../../data/products'
import {
  Plus,
  Check,
  Star,
  CheckCircle2,
  XCircle,
  MessageCircle,
  Info,
  Wheat,
  UtensilsCrossed,
  Droplet,
  Flame,
  Coffee,
  ShoppingBag,
  Edit2,
  Save,
} from 'lucide-react'

export interface ProductCardProps {
  product: Product
  onAddToCart: (product: Product) => void
  onOpenDetails: (product: Product) => void
  onUpdatePrice?: (productId: string, newPrice: number) => void
  onToggleStock?: (productId: string) => void
  isOwnerMode?: boolean
}

const getCategoryArtwork = (category: string) => {
  switch (category) {
    case 'staples':
      return {
        bg: 'from-amber-100 to-amber-50 text-amber-800 border-amber-200',
        icon: <Wheat className="w-8 h-8" />,
        label: 'Grain & Flour',
      }
    case 'pulses':
      return {
        bg: 'from-emerald-100 to-emerald-50 text-emerald-800 border-emerald-200',
        icon: <UtensilsCrossed className="w-8 h-8" />,
        label: 'Rice & Pulses',
      }
    case 'cooking':
      return {
        bg: 'from-lime-100 to-lime-50 text-lime-800 border-lime-200',
        icon: <Droplet className="w-8 h-8" />,
        label: 'Ghee & Oils',
      }
    case 'spices':
      return {
        bg: 'from-rose-100 to-rose-50 text-rose-800 border-rose-200',
        icon: <Flame className="w-8 h-8" />,
        label: 'Desi Spices',
      }
    case 'beverages':
      return {
        bg: 'from-teal-100 to-teal-50 text-teal-800 border-teal-200',
        icon: <Coffee className="w-8 h-8" />,
        label: 'Tea & Sugar',
      }
    default:
      return {
        bg: 'from-forest-100 to-forest-50 text-forest-800 border-forest-200',
        icon: <ShoppingBag className="w-8 h-8" />,
        label: 'Grocery Item',
      }
  }
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onOpenDetails,
  onUpdatePrice,
  onToggleStock,
  isOwnerMode = false,
}) => {
  const [isJustAdded, setIsJustAdded] = useState(false)
  const [isEditingPrice, setIsEditingPrice] = useState(false)
  const [customPrice, setCustomPrice] = useState<string>(product.price.toString())
  const [imageError, setImageError] = useState(false)
  const [imgSrc, setImgSrc] = useState(product.image)

  useEffect(() => {
    setImgSrc(product.image)
    setImageError(false)
  }, [product.image])

  const isAvailable = product.inStock && product.stockQuantity > 0
  const artwork = getCategoryArtwork(product.category)

  const handleAddClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Explicitly prevent ordering if out of stock
    if (!isAvailable) return

    onAddToCart(product)
    setIsJustAdded(true)
    setTimeout(() => setIsJustAdded(false), 1200)
  }

  const handleSavePrice = () => {
    const parsed = parseInt(customPrice, 10)
    if (!isNaN(parsed) && parsed >= 0) {
      onUpdatePrice?.(product.id, parsed)
    }
    setIsEditingPrice(false)
  }

  return (
    <Card
      variant="white"
      interactive={isAvailable}
      onClick={() => onOpenDetails(product)}
      className={`p-4 flex flex-col justify-between group relative border transition-all duration-200 ${
        isAvailable
          ? 'border-cream-300 shadow-forest-sm hover:shadow-forest-md cursor-pointer'
          : 'border-slate-200 bg-slate-50/70 opacity-90'
      }`}
    >
      {/* 1. Visual Image Banner & Badge */}
      <div className="space-y-3">
        <div
          className={`h-36 rounded-xl bg-gradient-to-br ${artwork.bg} border flex flex-col items-center justify-center relative p-3 overflow-hidden transition-transform group-hover:scale-[1.02] motion-reduce:group-hover:scale-100`}
        >
          {imgSrc && !imageError ? (
            <img
              src={imgSrc}
              alt={product.name}
              loading="lazy"
              onError={() => {
                if (imgSrc.endsWith('.jpg')) {
                  setImgSrc(imgSrc.replace('.jpg', '.svg'))
                } else {
                  setImageError(true)
                }
              }}
              className="absolute inset-0 w-full h-full object-cover z-0 transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <>
              {/* Category Graphic Fallback / Base */}
              <div className="relative z-1 p-3 bg-white/80 backdrop-blur-xs rounded-2xl shadow-xs">
                {artwork.icon}
              </div>
              <span className="relative z-1 text-[10px] font-bold uppercase tracking-wider mt-1 opacity-70">
                {artwork.label}
              </span>
            </>
          )}

          {/* Top Unit Pill */}
          <span className="absolute top-2.5 left-2.5 text-[11px] font-bold text-forest-900 bg-white/90 backdrop-blur-xs border border-white/60 px-2.5 py-0.5 rounded-lg shadow-2xs z-2">
            {product.unit}
          </span>

          {/* Feature Badges */}
          <div className="absolute top-2.5 right-2.5 flex flex-col items-end gap-1 z-2">
            {product.badge && (
              <Badge variant="lime" size="sm">
                {product.badge}
              </Badge>
            )}
            {!isAvailable && (
              <Badge variant="danger" size="sm">
                Out of Stock
              </Badge>
            )}
          </div>
        </div>

        {/* 2. Titles & Rating */}
        <div>
          <h3 className="font-extrabold text-forest-950 text-sm sm:text-base group-hover:text-forest-700 transition-colors leading-snug">
            {product.name}
          </h3>
          {product.urduName && (
            <p className="text-xs text-forest-700/80 font-urdu font-bold mt-0.5">
              {product.urduName}
            </p>
          )}
        </div>

        {/* Rating and Reviews */}
        {product.rating && (
          <div className="flex items-center gap-1.5 text-xs text-amber-600 font-semibold">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{product.rating}</span>
            {product.reviewsCount ? (
              <span className="text-[11px] text-forest-700/50">
                ({product.reviewsCount} reviews)
              </span>
            ) : null}
          </div>
        )}

        {/* Short description */}
        {product.description && (
          <p className="text-xs text-forest-700/70 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        )}
      </div>

      {/* 3. Pricing, Stock Status, and Actions */}
      <div className="mt-4 pt-3.5 border-t border-cream-200 space-y-2.5">
        {/* Price & Sample Notice */}
        <div className="flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              {isEditingPrice ? (
                <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                  <span className="text-xs font-bold text-forest-950">Rs.</span>
                  <input
                    type="number"
                    value={customPrice}
                    onChange={(e) => setCustomPrice(e.target.value)}
                    className="w-20 px-1.5 py-0.5 text-xs border border-forest-600 rounded"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={handleSavePrice}
                    className="p-1 bg-forest-700 text-white rounded hover:bg-forest-800"
                  >
                    <Save className="w-3 h-3" />
                  </button>
                </div>
              ) : (
                <>
                  <span className="text-base sm:text-lg font-black text-forest-950">
                    Rs. {product.price}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xs line-through text-forest-700/40">
                      Rs. {product.originalPrice}
                    </span>
                  )}
                  {isOwnerMode && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setIsEditingPrice(true)
                      }}
                      className="p-0.5 text-forest-700 hover:text-forest-950"
                      title="Edit sample price"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Clear Sample Price Tag */}
            <span className="inline-block text-[10px] font-semibold text-amber-800 bg-amber-50 border border-amber-200 px-1.5 py-0.2 rounded mt-0.5">
              Sample Rate (عارضی نرخ)
            </span>
          </div>

          {/* Stock Indicator */}
          <div>
            {isAvailable ? (
              <div className="flex items-center gap-1 text-[11px] text-forest-700 font-semibold bg-forest-50 px-2 py-0.5 rounded-md border border-forest-200">
                <CheckCircle2 className="w-3 h-3 text-lime-dark" />
                <span>In Stock ({product.stockQuantity})</span>
              </div>
            ) : (
              <div className="flex items-center gap-1 text-[11px] text-rose-700 font-semibold bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                <XCircle className="w-3 h-3 text-rose-600" />
                <span>Out of Stock</span>
              </div>
            )}
          </div>
        </div>

        {/* Buttons Row */}
        <div className="flex items-center justify-between gap-2 pt-1" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onOpenDetails(product)}
              className="p-2 text-forest-700/70 hover:text-forest-950 hover:bg-cream-100 rounded-xl transition-colors cursor-pointer"
              title="View full item details"
            >
              <Info className="w-4 h-4" />
            </button>

            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Assalam-o-Alaikum%20Hafiz%20Jee,%20inquiry%20regarding%20${encodeURIComponent(
                product.name
              )}%20(${product.unit})`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-forest-700/70 hover:text-lime-dark hover:bg-cream-100 rounded-xl transition-colors"
              title="Inquire on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>

            {isOwnerMode && (
              <button
                type="button"
                onClick={() => onToggleStock?.(product.id)}
                className="text-[10px] text-forest-700 underline px-1 cursor-pointer"
                title="Toggle Stock Status"
              >
                {product.inStock ? 'Set Out' : 'Set In'}
              </button>
            )}
          </div>

          {/* Add to Basket Action: Strictly disabled if out of stock */}
          {isAvailable ? (
            <Button
              size="sm"
              variant={isJustAdded ? 'lime' : 'forest'}
              onClick={handleAddClick}
              className="px-3.5 py-1.5"
            >
              {isJustAdded ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </>
              )}
            </Button>
          ) : (
            <button
              type="button"
              disabled
              className="inline-flex items-center justify-center font-medium rounded-xl text-xs px-3.5 py-1.5 gap-1.5 bg-slate-200 text-slate-500 border border-slate-300 cursor-not-allowed select-none"
              title="This item is currently out of stock and cannot be added to basket"
              aria-disabled="true"
            >
              <XCircle className="w-3.5 h-3.5 text-slate-400" />
              <span>Out of Stock</span>
            </button>
          )}
        </div>
      </div>
    </Card>
  )
}
