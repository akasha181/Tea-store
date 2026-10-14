import React, { useState, useMemo, useEffect } from 'react'
import {
  ArrowLeft,
  ShoppingBag,
  Truck,
  Store,
  User,
  Phone,
  MapPin,
  FileText,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Trash2,
  Plus,
  Minus,
  MessageCircle,
  ShieldCheck,
  Clock,
  Wheat,
  UtensilsCrossed,
  Droplet,
  Flame,
  Coffee,
} from 'lucide-react'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card } from '../components/ui/Card'
import { OrderSuccessModal } from '../components/checkout/OrderSuccessModal'
import { useCart } from '../context/useCart'
import { useProductCatalog } from '../context/useProductCatalog'
import { STORE_INFO } from '../data/products'
import { validatePakistaniPhone } from '../utils/phoneValidation'
import {
  loadSavedCustomerDetails,
  saveCustomerDetails,
  generateOrderId,
  saveOrderToHistory,
} from '../utils/checkoutStorage'
import { PrintableOrderSummary } from '../components/orders/PrintableOrderSummary'
import { buildWhatsAppUrl } from '../utils/whatsappMessage'
import type { CustomerDetails, OrderRecord, PaymentMethod } from '../types'

export interface CheckoutPageProps {
  onNavigateHome: () => void
  onNavigateToCategory?: (categoryId: string) => void
  onNavigateToOrders?: (orderId?: string) => void
}

const LOCAL_AREAS = [
  'Civil Bazaar / K-152 Vicinity',
  'Saddar / Cantt',
  'Raja Bazaar / City Area',
  'Murree Road / Committee Chowk',
  'Commercial Market / Satellite Town',
  'Westridge / Peshawar Road',
  'Adyala Road / Bahria Vicinity',
  'Other Rawalpindi Area',
]

const getCategoryArtwork = (category: string) => {
  switch (category) {
    case 'staples':
      return <Wheat className="w-4 h-4 text-amber-700" />
    case 'pulses':
      return <UtensilsCrossed className="w-4 h-4 text-emerald-700" />
    case 'cooking':
      return <Droplet className="w-4 h-4 text-lime-700" />
    case 'spices':
      return <Flame className="w-4 h-4 text-rose-700" />
    case 'beverages':
      return <Coffee className="w-4 h-4 text-teal-700" />
    default:
      return <ShoppingBag className="w-4 h-4 text-forest-700" />
  }
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onNavigateHome,
  onNavigateToCategory,
}) => {
  const {
    items,
    subtotal,
    deliveryFee: standardDeliveryFee,
    incrementQuantity,
    decrementQuantity,
    setQuantity,
    removeFromCart,
    clearCart,
  } = useCart()

  const { products } = useProductCatalog()

  // Form State
  const [formData, setFormData] = useState<CustomerDetails>(loadSavedCustomerDetails)
  const [touched, setTouched] = useState<{ [K in keyof CustomerDetails]?: boolean }>({})
  const [orderModalRecord, setOrderModalRecord] = useState<OrderRecord | null>(null)
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false)
  const [isPrintInvoiceOpen, setIsPrintInvoiceOpen] = useState(false)

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Validation rules
  const phoneValidation = useMemo(
    () => validatePakistaniPhone(formData.phoneNumber),
    [formData.phoneNumber]
  )

  const nameError = useMemo(() => {
    if (!touched.fullName && !formData.fullName) return undefined
    if (!formData.fullName.trim()) return 'Customer full name is required (خریدار کا نام درج کریں).'
    if (formData.fullName.trim().length < 3) return 'Please enter at least 3 characters.'
    return undefined
  }, [formData.fullName, touched.fullName])

  const phoneError = useMemo(() => {
    if (!touched.phoneNumber && !formData.phoneNumber) return undefined
    return phoneValidation.errorMessage
  }, [phoneValidation, touched.phoneNumber, formData.phoneNumber])

  const addressError = useMemo(() => {
    if (formData.deliveryMethod === 'pickup') return undefined
    if (!touched.address && !formData.address) return undefined
    if (!formData.address.trim()) return 'Delivery street address is required for doorstep delivery.'
    if (formData.address.trim().length < 8) return 'Please enter a complete address with house/street details.'
    return undefined
  }, [formData.deliveryMethod, formData.address, touched.address])

  // Live stock analysis of items in cart
  const stockIssues = useMemo(() => {
    const issues: {
      productId: string
      name: string
      cartQty: number
      stockQty: number
      type: 'out-of-stock' | 'exceeds-stock'
    }[] = []

    items.forEach((item) => {
      const fresh = products.find((p) => p.id === item.product.id)
      if (!fresh || !fresh.inStock || fresh.stockQuantity <= 0) {
        issues.push({
          productId: item.product.id,
          name: item.product.name,
          cartQty: item.quantity,
          stockQty: 0,
          type: 'out-of-stock',
        })
      } else if (item.quantity > fresh.stockQuantity) {
        issues.push({
          productId: item.product.id,
          name: item.product.name,
          cartQty: item.quantity,
          stockQty: fresh.stockQuantity,
          type: 'exceeds-stock',
        })
      }
    })

    return issues
  }, [items, products])

  // Auto-resolve stock limit helper
  const handleAutoResolveStock = () => {
    stockIssues.forEach((issue) => {
      if (issue.type === 'out-of-stock') {
        removeFromCart(issue.productId)
      } else {
        setQuantity(issue.productId, issue.stockQty)
      }
    })
  }

  // Delivery Calculations (Store pickup has free delivery)
  const isPickup = formData.deliveryMethod === 'pickup'
  const activeDeliveryFee = isPickup ? 0 : standardDeliveryFee
  const activeTotalAmount = subtotal + activeDeliveryFee

  // Form Validity
  const isFormValid =
    formData.fullName.trim().length >= 3 &&
    phoneValidation.isValid &&
    (isPickup || formData.address.trim().length >= 8) &&
    stockIssues.length === 0 &&
    items.length > 0

  // Field change handler
  const handleFieldChange = <K extends keyof CustomerDetails>(
    field: K,
    value: CustomerDetails[K]
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleBlur = (field: keyof CustomerDetails) => {
    setTouched((prev) => ({ ...prev, [field]: true }))
  }

  // Handle WhatsApp Order Trigger
  const handleWhatsAppOrderSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()

    // Mark all fields touched to trigger UI errors if any
    setTouched({
      fullName: true,
      phoneNumber: true,
      address: true,
    })

    if (!isFormValid) {
      if (stockIssues.length > 0) {
        const firstIssue = stockIssues[0]
        alert(
          `Stock Notice: "${firstIssue.name}" only has ${firstIssue.stockQty} unit(s) available. Please adjust quantity before placing order.`
        )
      }
      return
    }

    const sanitizedCustomer: CustomerDetails = {
      ...formData,
      fullName: formData.fullName.trim(),
      address: formData.address.trim(),
      notes: formData.notes ? formData.notes.trim() : undefined,
      phoneNumber: phoneValidation.formatted,
    }

    // Persist details if option selected
    saveCustomerDetails(sanitizedCustomer)

    const orderId = generateOrderId()
    const payload = {
      orderId,
      customer: sanitizedCustomer,
      items,
      subtotal,
      deliveryFee: activeDeliveryFee,
      totalAmount: activeTotalAmount,
      isFreeDelivery: isPickup,
    }

    const whatsappUrl = buildWhatsAppUrl(payload)

    const record: OrderRecord = {
      orderId,
      date: new Date().toLocaleDateString('en-GB'),
      timestamp: Date.now(),
      customer: sanitizedCustomer,
      items: [...items],
      subtotal,
      deliveryFee: activeDeliveryFee,
      totalAmount: activeTotalAmount,
      isFreeDelivery: isPickup,
      status: 'pending',
      whatsappLink: whatsappUrl,
    }

    // Save to local history
    saveOrderToHistory(record)
    setOrderModalRecord(record)
    setIsSuccessModalOpen(true)

    // Launch WhatsApp
    window.open(whatsappUrl, '_blank')
  }

  // Render Empty Cart Screen
  if (items.length === 0 && !isSuccessModalOpen) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-forest-md border border-cream-300 text-center space-y-6">
          <div className="w-20 h-20 mx-auto rounded-3xl bg-cream-100 border-2 border-dashed border-forest-600/30 flex items-center justify-center text-forest-700">
            <ShoppingBag className="w-10 h-10" />
          </div>

          <div className="space-y-2 max-w-md mx-auto">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-forest-950 tracking-tight">
              Your Basket is Empty
            </h2>
            <p className="text-sm font-urdu font-bold text-forest-700">
              آپ کی ٹوکری خالی ہے، براہ کرم پہلے اشیاء شامل کریں
            </p>
            <p className="text-xs text-forest-700/80">
              To proceed with checkout, please choose pure flours, pulses, ghee, spices, or tea from our fresh catalog.
            </p>
          </div>

          {/* Quick Categories */}
          <div className="pt-4 border-t border-cream-200">
            <p className="text-xs font-bold text-forest-800 uppercase tracking-wider mb-3">
              Explore Popular Aisles:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                { id: 'staples', label: 'Flour & Grains (آٹا و اناج)' },
                { id: 'pulses', label: 'Rice & Pulses (دالیں و چاول)' },
                { id: 'cooking', label: 'Ghee & Cooking Oil (گھی و تیل)' },
                { id: 'spices', label: 'Desi Spices (مصالحہ جات)' },
                { id: 'beverages', label: 'Tea & Sugar (چائے و چینی)' },
              ].map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => {
                    onNavigateHome()
                    onNavigateToCategory?.(cat.id)
                  }}
                  className="px-3.5 py-2 text-xs font-semibold bg-cream-50 hover:bg-lime-brand hover:text-forest-950 text-forest-800 rounded-xl border border-cream-300 transition-colors cursor-pointer"
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Button
              variant="forest"
              size="lg"
              onClick={onNavigateHome}
              iconLeft={<ArrowLeft className="w-4 h-4" />}
            >
              Return to Groceries &amp; Shop (خریداری جاری رکھیں)
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* 1. Header Navigation & Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-cream-300 pb-5">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-xs font-medium text-forest-700">
            <button
              type="button"
              onClick={onNavigateHome}
              className="hover:underline flex items-center gap-1 cursor-pointer"
            >
              <span>Home</span>
            </button>
            <span>/</span>
            <span>Shopping Basket</span>
            <span>/</span>
            <span className="text-forest-950 font-bold">Checkout</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight flex items-center gap-2">
            <span>Order Checkout</span>
            <span className="text-base sm:text-lg font-urdu font-bold text-forest-700">
              (آرڈر کی تصدیق و ترسیل)
            </span>
          </h1>
        </div>

        <button
          type="button"
          onClick={onNavigateHome}
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-forest-800 hover:text-forest-950 bg-white hover:bg-cream-100 border border-cream-300 px-4 py-2 rounded-xl shadow-2xs transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-forest-700" />
          <span>Back to Store (خریداری جاری رکھیں)</span>
        </button>
      </div>

      {/* 2. Stock Limit Notice (if any items exceed stock) */}
      {stockIssues.length > 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-rose-50 border-2 border-rose-300 text-rose-950 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="space-y-1 flex-1">
              <h3 className="font-extrabold text-sm sm:text-base">
                Inventory Stock Alert: Please Adjust Quantities
              </h3>
              <p className="text-xs text-rose-800">
                Some items in your basket exceed available store stock at {STORE_INFO.address}. Please auto-adjust or update quantities before ordering:
              </p>
              <ul className="text-xs list-disc list-inside space-y-0.5 pt-1 text-rose-900 font-medium">
                {stockIssues.map((issue) => (
                  <li key={issue.productId}>
                    <strong>{issue.name}</strong>:{' '}
                    {issue.type === 'out-of-stock'
                      ? 'Currently out of stock (0 available)'
                      : `You have ${issue.cartQty} in basket, but only ${issue.stockQty} unit(s) remain in stock`}
                  </li>
                ))}
              </ul>
            </div>
            <button
              type="button"
              onClick={handleAutoResolveStock}
              className="px-3.5 py-1.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer shrink-0 transition-colors"
            >
              Auto-Adjust Quantities
            </button>
          </div>
        </div>
      )}

      {/* 3. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column (7 cols): Customer Info, Fulfillment, Payment */}
        <div className="lg:col-span-7 space-y-6">
          <form onSubmit={handleWhatsAppOrderSubmit} className="space-y-6">
            {/* Step 1: Delivery Method Selection */}
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-forest-950 text-white flex items-center justify-center text-xs font-bold">
                    1
                  </span>
                  <h2 className="font-extrabold text-base sm:text-lg text-forest-950">
                    Fulfillment Method (ترسیل کا طریقہ)
                  </h2>
                </div>
                <Badge variant={isPickup ? 'forest' : 'lime'} size="sm">
                  {isPickup ? 'Store Pickup' : 'Home Delivery'}
                </Badge>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleFieldChange('deliveryMethod', 'delivery')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    !isPickup
                      ? 'border-forest-700 bg-forest-50/70 shadow-xs'
                      : 'border-cream-300 bg-white hover:border-cream-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-forest-100 text-forest-800">
                      <Truck className="w-5 h-5" />
                    </div>
                    {!isPickup && (
                      <CheckCircle2 className="w-5 h-5 text-forest-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-forest-950">
                      Home Doorstep Delivery
                    </h3>
                    <p className="text-xs font-urdu font-medium text-forest-700">
                      گھر پر فوری ڈیلیوری
                    </p>
                    <p className="text-[11px] text-forest-700 font-bold mt-1">
                      Rs. 200 Standard Delivery Fee
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => handleFieldChange('deliveryMethod', 'pickup')}
                  className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                    isPickup
                      ? 'border-forest-700 bg-forest-50/70 shadow-xs'
                      : 'border-cream-300 bg-white hover:border-cream-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-xl bg-lime-100 text-lime-800">
                      <Store className="w-5 h-5" />
                    </div>
                    {isPickup && (
                      <CheckCircle2 className="w-5 h-5 text-forest-700" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-forest-950">
                      Store Pickup
                    </h3>
                    <p className="text-xs font-urdu font-medium text-forest-700">
                      دکان سے خود وصول کریں
                    </p>
                    <p className="text-[11px] text-forest-700/80 mt-1">
                      Always Free • {STORE_INFO.address}
                    </p>
                  </div>
                </button>
              </div>

              {isPickup && (
                <div className="p-3.5 rounded-2xl bg-lime-50 border border-lime-200 text-xs text-lime-950 flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Pickup Counter Address:</p>
                    <p className="text-lime-900">
                      {STORE_INFO.name}, {STORE_INFO.address}, Rawalpindi.
                    </p>
                    <p className="text-[11px] text-lime-800/80 mt-0.5">
                      Your parcel will be packed and ready for quick collection within 20 minutes of WhatsApp confirmation.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Step 2: Customer Contact & Delivery Info */}
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-forest-950 text-white flex items-center justify-center text-xs font-bold">
                    2
                  </span>
                  <h2 className="font-extrabold text-base sm:text-lg text-forest-950">
                    Customer Details (گاہک کی معلومات)
                  </h2>
                </div>
                <span className="text-xs text-forest-700/70">
                  Required for Order Processing
                </span>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div>
                  <label
                    htmlFor="fullName"
                    className="block text-xs font-bold text-forest-950 mb-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-forest-700" />
                      <span>Full Name (مکمل نام) *</span>
                    </span>
                    {nameError && (
                      <span className="text-[11px] text-rose-600 font-semibold">
                        {nameError}
                      </span>
                    )}
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    required
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    onBlur={() => handleBlur('fullName')}
                    placeholder="e.g. Muhammad Tariq (محمد طارق)"
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white placeholder:text-forest-900/30 focus:outline-none focus:ring-2 transition-all ${
                      nameError
                        ? 'border-rose-400 focus:ring-rose-300'
                        : 'border-cream-300 focus:border-forest-600 focus:ring-forest-600/20'
                    }`}
                  />
                </div>

                {/* Mobile Phone Number */}
                <div>
                  <label
                    htmlFor="phoneNumber"
                    className="block text-xs font-bold text-forest-950 mb-1 flex items-center justify-between"
                  >
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-forest-700" />
                      <span>Pakistani Mobile Number (موبائل نمبر) *</span>
                    </span>
                    {formData.phoneNumber && phoneValidation.isValid ? (
                      <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        <span>Valid: {phoneValidation.formatted}</span>
                      </span>
                    ) : phoneError ? (
                      <span className="text-[11px] text-rose-600 font-semibold">
                        {phoneError}
                      </span>
                    ) : (
                      <span className="text-[11px] text-forest-700/60">
                        Format: 0300-1234567
                      </span>
                    )}
                  </label>

                  <div className="relative">
                    <input
                      id="phoneNumber"
                      type="tel"
                      required
                      value={formData.phoneNumber}
                      onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                      onBlur={() => handleBlur('phoneNumber')}
                      placeholder="0300-1234567 or +92 300 1234567"
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white placeholder:text-forest-900/30 focus:outline-none focus:ring-2 transition-all ${
                        phoneError
                          ? 'border-rose-400 focus:ring-rose-300'
                          : phoneValidation.isValid && formData.phoneNumber
                            ? 'border-emerald-500 focus:ring-emerald-200'
                            : 'border-cream-300 focus:border-forest-600 focus:ring-forest-600/20'
                      }`}
                    />
                  </div>
                  <p className="text-[11px] text-forest-700/70 mt-1">
                    Accepts Mobilink/Jazz (030x), Zong (031x), Warid (032x), Ufone (033x), Telenor (034x), or SCOM (035x).
                  </p>
                </div>

                {/* Delivery Address & Area (if Home Delivery) */}
                {!isPickup && (
                  <div className="space-y-3 pt-1">
                    {/* Area Selector */}
                    <div>
                      <label
                        htmlFor="area"
                        className="block text-xs font-bold text-forest-950 mb-1 flex items-center gap-1.5"
                      >
                        <MapPin className="w-3.5 h-3.5 text-forest-700" />
                        <span>Delivery Area / Vicinity (علاقہ) *</span>
                      </label>
                      <select
                        id="area"
                        value={formData.area}
                        onChange={(e) => handleFieldChange('area', e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm bg-white text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                      >
                        {LOCAL_AREAS.map((a) => (
                          <option key={a} value={a}>
                            {a}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Street Address */}
                    <div>
                      <label
                        htmlFor="address"
                        className="block text-xs font-bold text-forest-950 mb-1 flex items-center justify-between"
                      >
                        <span>Street Address &amp; House Number (گھر کا مکمل پتہ) *</span>
                        {addressError && (
                          <span className="text-[11px] text-rose-600 font-semibold">
                            {addressError}
                          </span>
                        )}
                      </label>
                      <textarea
                        id="address"
                        required={!isPickup}
                        rows={2}
                        value={formData.address}
                        onChange={(e) => handleFieldChange('address', e.target.value)}
                        onBlur={() => handleBlur('address')}
                        placeholder="House / Flat No., Street No., Nearest Landmark (e.g. Near Madina Masjid, Civil Bazaar)"
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white placeholder:text-forest-900/30 focus:outline-none focus:ring-2 transition-all ${
                          addressError
                            ? 'border-rose-400 focus:ring-rose-300'
                            : 'border-cream-300 focus:border-forest-600 focus:ring-forest-600/20'
                        }`}
                      />
                    </div>
                  </div>
                )}

                {/* Special Instructions / Notes */}
                <div>
                  <label
                    htmlFor="notes"
                    className="block text-xs font-bold text-forest-950 mb-1 flex items-center gap-1.5"
                  >
                    <FileText className="w-3.5 h-3.5 text-forest-700" />
                    <span>Special Packing / Delivery Notes (اضافی ہدایات - اختیاری)</span>
                  </label>
                  <input
                    id="notes"
                    type="text"
                    value={formData.notes || ''}
                    onChange={(e) => handleFieldChange('notes', e.target.value)}
                    placeholder="e.g. Call before arrival, double plastic bag for flour"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-cream-300 text-sm bg-white placeholder:text-forest-900/30 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  />
                </div>

                {/* Save details checkbox */}
                <div className="pt-1">
                  <label className="flex items-center gap-2 cursor-pointer select-none text-xs text-forest-800">
                    <input
                      type="checkbox"
                      checked={formData.saveDetails ?? true}
                      onChange={(e) => handleFieldChange('saveDetails', e.target.checked)}
                      className="w-4 h-4 rounded text-forest-700 border-cream-300 focus:ring-forest-600"
                    />
                    <span>
                      Save my name and address on this device for faster future orders (معلومات محفوظ کریں)
                    </span>
                  </label>
                </div>
              </div>
            </Card>

            {/* Step 3: Payment Method Selection */}
            <Card className="p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-cream-200 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-full bg-forest-950 text-white flex items-center justify-center text-xs font-bold">
                    3
                  </span>
                  <h2 className="font-extrabold text-base sm:text-lg text-forest-950">
                    Payment Method (ادائیگی کا طریقہ)
                  </h2>
                </div>
                <span className="text-xs text-emerald-800 font-bold">
                  EasyPaisa &amp; JazzCash Only (صرف ڈیجیٹل ادائیگی)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  {
                    id: 'easypaisa' as PaymentMethod,
                    title: 'EasyPaisa Mobile Account',
                    urdu: 'ایزی پیسہ اکاؤنٹ',
                    desc: `Direct payment to store counter: ${STORE_INFO.phone}`,
                    badge: 'EasyPaisa Verified',
                    accentColor: 'border-emerald-600 bg-emerald-50/70',
                  },
                  {
                    id: 'jazzcash' as PaymentMethod,
                    title: 'JazzCash Mobile Account',
                    urdu: 'جاز کیش اکاؤنٹ',
                    desc: `Direct payment to store counter: ${STORE_INFO.phone}`,
                    badge: 'JazzCash Verified',
                    accentColor: 'border-amber-600 bg-amber-50/70',
                  },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => handleFieldChange('paymentMethod', option.id)}
                    className={`p-4 rounded-2xl border-2 text-left transition-all cursor-pointer flex flex-col justify-between gap-3 ${
                      formData.paymentMethod === option.id
                        ? `${option.accentColor} shadow-forest-xs ring-2 ring-forest-700/20`
                        : 'border-cream-300 bg-white hover:border-cream-400'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-forest-800" />
                        <span className="text-xs font-bold text-forest-950">
                          {option.id === 'easypaisa' ? '🟢 EasyPaisa' : '🔴 JazzCash'}
                        </span>
                      </div>
                      <Badge variant={formData.paymentMethod === option.id ? 'forest' : 'cream'} size="sm">
                        {option.badge}
                      </Badge>
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-forest-950">
                        {option.title}
                      </h4>
                      <p className="text-xs font-urdu font-bold text-forest-700">
                        {option.urdu}
                      </p>
                      <p className="text-[11px] text-forest-700/80 mt-1 font-mono">
                        {option.desc}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </Card>

            {/* Store Trust Specs */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-center gap-2.5 text-xs text-forest-800">
                <ShieldCheck className="w-5 h-5 text-forest-700 shrink-0" />
                <div>
                  <p className="font-bold">100% Khális Purity</p>
                  <p className="text-[11px] text-forest-700/70">Unadulterated quality</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-center gap-2.5 text-xs text-forest-800">
                <Clock className="w-5 h-5 text-forest-700 shrink-0" />
                <div>
                  <p className="font-bold">Fast Packing</p>
                  <p className="text-[11px] text-forest-700/70">30–45 mins dispatch</p>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-center gap-2.5 text-xs text-forest-800">
                <MapPin className="w-5 h-5 text-forest-700 shrink-0" />
                <div>
                  <p className="font-bold">Physical Counter</p>
                  <p className="text-[11px] text-forest-700/70">G Civil Bazaar, K-152</p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Right Column (5 cols): Live Order Summary & WhatsApp CTA */}
        <div className="lg:col-span-5 space-y-6">
          <Card className="p-5 sm:p-6 space-y-5 sticky top-24 shadow-forest-lg">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-forest-700" />
                <h2 className="font-black text-lg text-forest-950">
                  Order Summary
                </h2>
              </div>
              <Badge variant="lime" size="sm">
                {items.length} {items.length === 1 ? 'item' : 'items'}
              </Badge>
            </div>

            {/* Delivery Fee Notice */}
            {!isPickup ? (
              <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-forest-800">
                  <Truck className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>Doorstep Home Delivery (ہوم ڈیلیوری):</span>
                </div>
                <span className="font-bold text-forest-950">Rs. {activeDeliveryFee}</span>
              </div>
            ) : (
              <div className="p-3 rounded-2xl bg-cream-50 border border-cream-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-forest-800">
                  <Store className="w-4 h-4 text-forest-700 shrink-0" />
                  <span>Store Counter Pickup (دکان سے وصولی):</span>
                </div>
                <span className="font-bold text-forest-700">Rs. 0 (Free)</span>
              </div>
            )}

            {/* Itemized Line Items List */}
            <div className="max-h-72 overflow-y-auto divide-y divide-cream-200 pr-1 space-y-3">
              {items.map((item) => {
                const fresh = products.find((p) => p.id === item.product.id)
                const isItemOutOfStock = !fresh || !fresh.inStock || fresh.stockQuantity <= 0
                const isItemOverStock = fresh && item.quantity > fresh.stockQuantity
                const maxStock = fresh ? fresh.stockQuantity : 0

                return (
                  <div key={item.product.id} className="pt-3 first:pt-0 flex items-start gap-3">
                    {/* Artwork / Icon */}
                    <div className="w-10 h-10 rounded-xl bg-cream-100 border border-cream-300 flex items-center justify-center shrink-0">
                      {getCategoryArtwork(item.product.category)}
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h4 className="text-xs font-bold text-forest-950 truncate">
                            {item.product.name}
                          </h4>
                          {item.product.urduName && (
                            <p className="text-[11px] font-urdu font-medium text-forest-700">
                              {item.product.urduName}
                            </p>
                          )}
                          <span className="text-[10px] text-forest-700/70">
                            {item.product.unit} • Rs. {item.product.price}
                          </span>
                        </div>

                        <span className="text-xs font-black text-forest-950 shrink-0">
                          Rs. {(item.product.price * item.quantity).toLocaleString()}
                        </span>
                      </div>

                      {/* Stock Warning Flag */}
                      {isItemOutOfStock ? (
                        <p className="text-[10px] text-rose-600 font-bold mt-1">
                          ⚠️ Out of stock! Please remove this item.
                        </p>
                      ) : isItemOverStock ? (
                        <p className="text-[10px] text-amber-600 font-bold mt-1">
                          ⚠️ Only {maxStock} in stock (you selected {item.quantity}).
                        </p>
                      ) : null}

                      {/* Steppers & Remove */}
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center border border-cream-300 rounded-lg bg-white overflow-hidden shadow-2xs">
                          <button
                            type="button"
                            onClick={() => decrementQuantity(item.product.id)}
                            className="p-1 hover:bg-cream-100 text-forest-800 transition-colors cursor-pointer"
                            aria-label={`Decrease ${item.product.name}`}
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2.5 text-xs font-bold text-forest-950 select-none">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            disabled={fresh ? item.quantity >= fresh.stockQuantity : true}
                            onClick={() => incrementQuantity(item.product.id)}
                            className="p-1 hover:bg-cream-100 text-forest-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors cursor-pointer"
                            aria-label={`Increase ${item.product.name}`}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFromCart(item.product.id)}
                          className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Calculations Breakdown */}
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2.5 text-xs">
              <div className="flex justify-between text-forest-800">
                <span>Commodities Subtotal:</span>
                <span className="font-bold text-forest-950">
                  Rs. {subtotal.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between text-forest-800">
                <span>Delivery Charge:</span>
                <span className="font-bold">
                  {isPickup ? (
                    <span className="text-forest-700">Rs. 0 (Store Pickup)</span>
                  ) : (
                    `Rs. ${activeDeliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t border-cream-300 text-sm font-black text-forest-950">
                <span>Estimated Total:</span>
                <span className="text-base text-forest-700">
                  Rs. {activeTotalAmount.toLocaleString()}
                </span>
              </div>
            </div>

            {/* Mandi Rate Disclaimer */}
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 leading-relaxed space-y-1">
              <div className="flex items-center gap-1.5 font-bold text-amber-900">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>Sample Mandi Price Notice (عارضی نرخ):</span>
              </div>
              <p className="text-amber-900/80">
                All prices are sample retail estimates in PKR based on local market rates. {STORE_INFO.name} owner verifies exact daily rates upon packing at {STORE_INFO.address}.
              </p>
            </div>

            {/* Primary Action Button: Send to WhatsApp */}
            <div className="space-y-2 pt-1">
              <button
                type="button"
                onClick={() => handleWhatsAppOrderSubmit()}
                disabled={stockIssues.length > 0}
                className="w-full inline-flex items-center justify-center gap-2.5 bg-lime-brand hover:bg-lime-accent active:scale-[0.99] disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed text-forest-950 font-black py-4 px-4 rounded-2xl text-sm shadow-forest-md transition-all cursor-pointer select-none"
              >
                <MessageCircle className="w-5 h-5 text-forest-950" />
                <span>Confirm Order via WhatsApp (واٹس ایپ پر آرڈر بھیجیں)</span>
              </button>

              {!isFormValid && (
                <p className="text-[11px] text-center text-forest-700/70">
                  {stockIssues.length > 0
                    ? '⚠️ Please resolve inventory limits before placing order'
                    : 'Please fill name, valid Pakistani phone number, and delivery address to proceed.'}
                </p>
              )}
            </div>

            {/* Clear Basket Option */}
            <div className="pt-2 border-t border-cream-200 flex justify-between items-center text-xs text-forest-700">
              <button
                type="button"
                onClick={clearCart}
                className="hover:text-rose-600 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Trash2 className="w-3 h-3" />
                <span>Clear Cart</span>
              </button>
              <span>EasyPaisa / JazzCash (ایزی پیسہ یا جاز کیش)</span>
            </div>
          </Card>

          {/* Privacy & Browser-Local Storage Architecture Notice */}
          <div className="bg-cream-100/70 border border-cream-300 rounded-2xl p-3.5 text-xs text-forest-800 space-y-1">
            <div className="flex items-center gap-1.5 font-bold text-forest-950">
              <ShieldCheck className="w-3.5 h-3.5 text-forest-700" />
              <span>Browser-Local Data Security Notice:</span>
            </div>
            <p className="text-[11px] text-forest-700/80 leading-relaxed">
              Your details are stored locally on your device (LocalStorage) and sent directly to {STORE_INFO.name} via WhatsApp. No remote database or third-party server tracks your basket. Final payment is made on delivery or collection.
            </p>
          </div>
        </div>
      </div>

      {/* 4. Order Confirmation Modal */}
      <OrderSuccessModal
        order={orderModalRecord}
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        onViewReceipt={() => setIsPrintInvoiceOpen(true)}
        onClearAndGoHome={() => {
          clearCart()
          setIsSuccessModalOpen(false)
          onNavigateHome()
        }}
        onKeepAndGoHome={() => {
          setIsSuccessModalOpen(false)
          onNavigateHome()
        }}
      />

      {/* 5. Printable Order Invoice Slip */}
      <PrintableOrderSummary
        order={orderModalRecord}
        isOpen={isPrintInvoiceOpen}
        onClose={() => setIsPrintInvoiceOpen(false)}
      />
    </div>
  )
}
