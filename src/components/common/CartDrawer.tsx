import React, { useEffect, useState, useRef } from 'react'
import { useCart } from '../../context/useCart'
import { STORE_INFO } from '../../data/products'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import {
  X,
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  MessageCircle,
  ArrowRight,
  Truck,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
} from 'lucide-react'

export interface CartDrawerProps {
  onNavigateToCheckout?: () => void
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ onNavigateToCheckout }) => {
  const {
    items,
    totalCount,
    uniqueCount,
    subtotal,
    deliveryFee,
    totalAmount,
    isCartOpen,
    closeCart,
    incrementQuantity,
    decrementQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const [showClearConfirm, setShowClearConfirm] = useState(false)
  const drawerRef = useRef<HTMLDivElement>(null)

  // Accessible Esc key listener to close drawer
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) {
        closeCart()
      }
    }

    if (isCartOpen) {
      window.addEventListener('keydown', handleKeyDown)
      // Prevent body scrolling while drawer is active
      document.body.style.overflow = 'hidden'
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'unset'
    }
  }, [isCartOpen, closeCart])

  if (!isCartOpen) return null

  // Pre-format WhatsApp order text
  const generateWhatsAppMessage = () => {
    let msg = `*Assalam-o-Alaikum ${STORE_INFO.name} (${STORE_INFO.address})*,\nI would like to place an order from my shopping basket:\n\n`
    items.forEach((item, index) => {
      msg += `${index + 1}. ${item.product.name} (${item.product.unit}) x ${item.quantity} = Rs. ${item.product.price * item.quantity}\n`
    })
    msg += `\n*Subtotal:* Rs. ${subtotal}`
    msg += `\n*Delivery Fee:* Rs. ${deliveryFee}`
    msg += `\n*Total Payable:* Rs. ${totalAmount}`
    msg += `\n*(Note: Prices listed are subject to daily verification by ${STORE_INFO.name} store owner)*`
    msg += `\n\nPlease confirm delivery to my address. JazakAllah!`
    return encodeURIComponent(msg)
  }

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Basket"
    >
      {/* 1. Backdrop Overlay */}
      <div
        className="fixed inset-0 bg-forest-950/70 backdrop-blur-xs transition-opacity duration-200"
        onClick={closeCart}
        aria-hidden="true"
      />

      {/* 2. Slide-Over Panel */}
      <div className="fixed inset-y-0 right-0 max-w-full flex pl-6 sm:pl-10">
        <div
          ref={drawerRef}
          className="w-screen max-w-md bg-cream-50 flex flex-col shadow-forest-xl border-l border-cream-300 animate-in slide-in-from-right duration-300 motion-reduce:animate-none"
        >
          {/* Header */}
          <div className="p-4 sm:p-5 bg-forest-950 text-white flex items-center justify-between border-b border-forest-900 shrink-0">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-forest-800 text-lime-brand rounded-2xl border border-forest-700/60 shadow-xs">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                    Shopping Basket
                  </h2>
                  <span className="text-xs bg-lime-brand text-forest-950 font-bold px-2 py-0.5 rounded-full">
                    {totalCount} {totalCount === 1 ? 'item' : 'items'}
                  </span>
                </div>
                <p className="text-xs text-cream-200/80">
                  {uniqueCount} unique commodities selected
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={closeCart}
              className="p-2 text-cream-200 hover:text-white rounded-xl hover:bg-forest-800 transition-colors cursor-pointer"
              aria-label="Close basket"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Delivery Fee Notice */}
          <div className="bg-white px-4 py-3 border-b border-cream-200 shrink-0 space-y-1 shadow-2xs">
            <div className="flex items-center justify-between text-xs">
              <span className="text-forest-900 font-bold flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-forest-700" />
                <span>Doorstep Delivery (ہوم ڈیلیوری)</span>
              </span>
              <Badge variant="cream" size="sm" className="font-bold text-forest-950">
                Rs. 200
              </Badge>
            </div>
            <p className="text-[11px] text-forest-700/80">
              Standard local delivery fee: Rs. 200 (Store pickup at counter is free).
            </p>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-3xl bg-cream-100 border-2 border-dashed border-forest-600/30 flex items-center justify-center text-forest-700">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-extrabold text-forest-950 text-base">
                    Your basket is currently empty
                  </h3>
                  <p className="text-xs font-urdu font-medium text-forest-700">
                    آپ کی ٹوکری خالی ہے
                  </p>
                  <p className="text-xs text-forest-700/70 max-w-xs">
                    Browse our fresh flour, fragrant rice, pulses, and spices to add everyday groceries to your basket.
                  </p>
                </div>
                <Button
                  variant="forest"
                  size="sm"
                  onClick={() => {
                    closeCart()
                    const el = document.getElementById('products-section')
                    if (el) el.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  Start Shopping (خریداری شروع کریں)
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {items.map((item) => {
                  const lineTotal = item.product.price * item.quantity
                  const isMaxStock = item.quantity >= item.product.stockQuantity

                  return (
                    <div
                      key={item.product.id}
                      className="p-3.5 bg-white rounded-2xl border border-cream-200 shadow-2xs hover:border-forest-600/30 transition-all flex items-start gap-3"
                    >
                      {/* Product Thumbnail / Icon Placeholder */}
                      <div className="w-14 h-14 rounded-xl bg-cream-100 border border-cream-300 flex items-center justify-center shrink-0 overflow-hidden text-forest-800">
                        {item.product.image ? (
                          <img
                            src={item.product.image}
                            alt={item.product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                        ) : (
                          <span className="text-xs font-black font-urdu text-forest-700">
                            {item.product.name.slice(0, 2)}
                          </span>
                        )}
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-1">
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-forest-950 truncate leading-snug">
                              {item.product.name}
                            </h4>
                            {item.product.urduName && (
                              <p className="text-xs font-urdu font-medium text-forest-700">
                                {item.product.urduName}
                              </p>
                            )}
                          </div>

                          {/* Quick Remove Button */}
                          <button
                            type="button"
                            onClick={() => removeFromCart(item.product.id)}
                            className="p-1 text-forest-700/60 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        {/* Unit & Sample Rate Tag */}
                        <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-forest-700/80">
                          <span className="font-medium bg-cream-100 px-1.5 py-0.5 rounded-md border border-cream-300/60">
                            {item.product.unit}
                          </span>
                          <span>•</span>
                          <span className="font-semibold text-forest-950">
                            Rs. {item.product.price}
                          </span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1 rounded">
                            Sample
                          </span>
                        </div>

                        {/* Stepper Controls & Line Subtotal */}
                        <div className="flex items-center justify-between mt-2.5 pt-2 border-t border-cream-100">
                          <div className="flex items-center border border-cream-300 rounded-xl bg-cream-50 overflow-hidden shadow-2xs">
                            <button
                              type="button"
                              onClick={() => decrementQuantity(item.product.id)}
                              className="p-1.5 hover:bg-cream-200 text-forest-800 transition-colors cursor-pointer disabled:opacity-40"
                              aria-label={`Decrease quantity of ${item.product.name}`}
                            >
                              <Minus className="w-3 h-3" />
                            </button>

                            <span className="px-3 text-xs font-extrabold text-forest-950 select-none min-w-7 text-center">
                              {item.quantity}
                            </span>

                            <button
                              type="button"
                              disabled={isMaxStock}
                              onClick={() => incrementQuantity(item.product.id)}
                              className="p-1.5 hover:bg-cream-200 text-forest-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                              title={
                                isMaxStock
                                  ? `Maximum available stock reached (${item.product.stockQuantity} units)`
                                  : `Add one more`
                              }
                              aria-label={`Increase quantity of ${item.product.name}`}
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          <div className="text-right">
                            <span className="text-xs sm:text-sm font-black text-forest-950">
                              Rs. {lineTotal}
                            </span>
                            {isMaxStock && (
                              <p className="text-[10px] text-amber-700 font-semibold">
                                Max stock ({item.product.stockQuantity})
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer Summary & Order CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-cream-300 shrink-0 space-y-3.5 shadow-forest-lg">
              {/* Sample Price Notice */}
              <div className="flex items-start gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-900 leading-tight">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  <strong>Sample Pricing:</strong> All prices are mandi estimates in PKR. Store owner confirms final price upon order packing.
                </span>
              </div>

              {/* Cost Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-forest-800">
                <div className="flex justify-between">
                  <span>Items Subtotal:</span>
                  <span className="font-bold text-forest-950">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between">
                  <span>Home Delivery (Standard):</span>
                  <span className="font-bold text-forest-950">
                    Rs. {deliveryFee}
                  </span>
                </div>
                <div className="flex justify-between text-sm sm:text-base font-black text-forest-950 pt-2 border-t border-cream-200">
                  <span>Total Payable:</span>
                  <span className="text-forest-700 text-lg">Rs. {totalAmount}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                {/* 1. Clear "Proceed to Checkout" Button */}
                <button
                  type="button"
                  onClick={() => {
                    closeCart()
                    onNavigateToCheckout?.()
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-forest-700 hover:bg-forest-800 active:bg-forest-900 text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-forest-md transition-all cursor-pointer motion-reduce:transition-none"
                  aria-label="Proceed to Checkout"
                >
                  <ShieldCheck className="w-4 h-4 text-lime-brand" />
                  <span>Proceed to Checkout (آرڈر کی تصدیق کریں)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* 2. Direct WhatsApp Order Alternative */}
                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${generateWhatsAppMessage()}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center gap-2 bg-lime-brand hover:bg-lime-accent active:bg-lime-dark text-forest-950 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-2xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Quick Order via WhatsApp</span>
                </a>

                {/* Bottom Clear & Note */}
                <div className="flex items-center justify-between pt-1 text-[11px] text-forest-700/70">
                  {showClearConfirm ? (
                    <div className="flex items-center gap-2 text-rose-700">
                      <span>Empty basket?</span>
                      <button
                        type="button"
                        onClick={() => {
                          clearCart()
                          setShowClearConfirm(false)
                        }}
                        className="font-bold underline text-rose-700 hover:text-rose-900 cursor-pointer"
                      >
                        Yes, Clear
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowClearConfirm(false)}
                        className="text-forest-700 hover:underline cursor-pointer"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setShowClearConfirm(true)}
                      className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
                    >
                      <RotateCcw className="w-3 h-3" />
                      <span>Clear Basket</span>
                    </button>
                  )}

                  <span className="font-medium text-forest-700">
                    Cash on Delivery / JazzCash / EasyPaisa
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
