import React from 'react'
import { useCart } from '../../context/useCart'
import { CheckCircle2, AlertTriangle, AlertCircle, Info, X } from 'lucide-react'

export const CartToast: React.FC = () => {
  const { notification, dismissNotification } = useCart()

  if (!notification) return null

  const iconMap = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-forest-700 shrink-0" />,
  }

  const borderStyles = {
    success: 'border-emerald-300 bg-emerald-50 text-emerald-950',
    warning: 'border-amber-300 bg-amber-50 text-amber-950',
    error: 'border-rose-300 bg-rose-50 text-rose-950',
    info: 'border-forest-300 bg-cream-50 text-forest-950',
  }

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 right-4 sm:right-6 z-50 max-w-sm w-full animate-in fade-in slide-in-from-bottom-4 duration-200 motion-reduce:animate-none"
    >
      <div
        className={`p-3.5 rounded-2xl border shadow-forest-lg flex items-center justify-between gap-3 ${borderStyles[notification.type]}`}
      >
        <div className="flex items-center gap-2.5">
          {iconMap[notification.type]}
          <p className="text-xs sm:text-sm font-semibold leading-snug">
            {notification.message}
          </p>
        </div>

        <button
          type="button"
          onClick={dismissNotification}
          className="p-1 rounded-lg hover:bg-black/5 text-current opacity-70 hover:opacity-100 transition-opacity cursor-pointer shrink-0"
          aria-label="Dismiss notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
