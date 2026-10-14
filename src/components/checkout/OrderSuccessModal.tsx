import React, { useState } from 'react'
import {
  CheckCircle2,
  Copy,
  Check,
  MessageCircle,
  ShoppingBag,
  MapPin,
  Clock,
  Phone,
  RotateCcw,
  Printer,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { STORE_INFO } from '../../data/products'
import type { OrderRecord } from '../../types'

export interface OrderSuccessModalProps {
  order: OrderRecord | null
  isOpen: boolean
  onClose: () => void
  onClearAndGoHome: () => void
  onKeepAndGoHome: () => void
  onViewReceipt?: () => void
}

export const OrderSuccessModal: React.FC<OrderSuccessModalProps> = ({
  order,
  isOpen,
  onClose,
  onClearAndGoHome,
  onKeepAndGoHome,
  onViewReceipt,
}) => {
  const [copied, setCopied] = useState(false)

  if (!isOpen || !order) return null

  const handleCopyOrderId = async () => {
    try {
      await navigator.clipboard.writeText(order.orderId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Ignore clipboard permission issues
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-xs animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="success-modal-title"
    >
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-forest-xl border border-cream-300 space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Celebration Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-3xl bg-lime-brand/20 border-2 border-lime-brand flex items-center justify-center text-forest-800 shadow-inner">
            <CheckCircle2 className="w-9 h-9 text-forest-700 animate-bounce motion-reduce:animate-none" />
          </div>

          <h2
            id="success-modal-title"
            className="text-xl sm:text-2xl font-black text-forest-950 tracking-tight"
          >
            Order Placed Successfully!
          </h2>
          <p className="text-sm font-urdu font-bold text-forest-700">
            آپ کا آرڈر واٹس ایپ کے لیے تیار ہو گیا ہے!
          </p>
          <p className="text-xs text-forest-700/80 max-w-sm mx-auto">
            {STORE_INFO.name} will review your order details, verify market mandi rates, and confirm packaging immediately.
          </p>
        </div>

        {/* Order Reference Box */}
        <div className="p-4 rounded-2xl bg-cream-50 border border-cream-300 flex items-center justify-between gap-3">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-forest-700/70 block">
              Order Reference ID
            </span>
            <span className="text-lg sm:text-xl font-mono font-black text-forest-950">
              {order.orderId}
            </span>
          </div>

          <button
            type="button"
            onClick={handleCopyOrderId}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-white hover:bg-cream-100 text-forest-800 border border-cream-300 rounded-xl transition-colors cursor-pointer shadow-2xs"
            title="Copy Order ID"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-forest-700" />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy ID</span>
              </>
            )}
          </button>
        </div>

        {/* Order Details Brief */}
        <div className="p-4 rounded-2xl bg-forest-950 text-white space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-forest-850">
            <span className="text-cream-200">Customer Name:</span>
            <span className="font-bold text-white">{order.customer.fullName}</span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-forest-850">
            <span className="text-cream-200">Fulfillment:</span>
            <span className="font-bold text-lime-brand">
              {order.customer.deliveryMethod === 'pickup'
                ? 'Store Pickup (Civil Bazar K-152, Attock City)'
                : 'Home Delivery'}
            </span>
          </div>
          <div className="flex items-center justify-between pb-2 border-b border-forest-850">
            <span className="text-cream-200">Selected Commodities:</span>
            <span className="font-bold text-white">
              {order.items.length} items ({order.items.reduce((s, i) => s + i.quantity, 0)} units)
            </span>
          </div>
          <div className="flex items-center justify-between pt-1 text-sm font-extrabold">
            <span className="text-lime-brand">Total Order Amount:</span>
            <span className="text-lg font-black text-white">
              Rs. {order.totalAmount.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Store Location Notice */}
        <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200/80 text-xs text-amber-950 space-y-1.5">
          <div className="flex items-center gap-2 font-bold text-amber-900">
            <MapPin className="w-4 h-4 text-forest-700 shrink-0" />
            <span>Store Location: {STORE_INFO.address}</span>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-amber-900/80">
            <Clock className="w-3.5 h-3.5 text-forest-700 shrink-0" />
            <span>Timings: {STORE_INFO.timing}</span>
          </div>
        </div>

        {/* WhatsApp Launch Action & Helpline */}
        <div className="space-y-3 pt-1">
          <a
            href={order.whatsappLink}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-lime-brand hover:bg-lime-accent text-forest-950 font-black py-3.5 rounded-2xl text-sm shadow-forest-md transition-colors"
          >
            <MessageCircle className="w-5 h-5" />
            <span>Open in WhatsApp (واٹس ایپ دوبارہ کھولیں)</span>
          </a>

          <div className="grid grid-cols-2 gap-2">
            <a
              href={`tel:${STORE_INFO.phone}`}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-forest-800 text-xs font-semibold transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-forest-700" />
              <span>Call Store Helpline</span>
            </a>

            <button
              type="button"
              onClick={onViewReceipt || onClose}
              className="inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-cream-300 bg-white hover:bg-cream-100 text-forest-800 text-xs font-semibold transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5 text-forest-700" />
              <span>Print Invoice (رسید)</span>
            </button>
          </div>

          {/* Action Buttons for Shopping Completion */}
          <div className="pt-2 border-t border-cream-200 flex flex-col sm:flex-row gap-2">
            <Button
              variant="forest"
              fullWidth
              size="md"
              onClick={onClearAndGoHome}
              iconLeft={<ShoppingBag className="w-4 h-4" />}
            >
              Clear Basket & Return to Store
            </Button>

            <Button
              variant="outline"
              fullWidth
              size="md"
              onClick={onKeepAndGoHome}
              iconLeft={<RotateCcw className="w-4 h-4" />}
            >
              Keep Items & Browse More
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
