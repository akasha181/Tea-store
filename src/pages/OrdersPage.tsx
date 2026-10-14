import React, { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft,
  Search,
  Printer,
  MessageCircle,
  Phone,
  Clock,
  CheckCircle2,
  Clock3,
  PackageCheck,
  Trash2,
  RefreshCw,
  ShoppingBag,
  Truck,
  Store,
  CreditCard,
  FileText,
  UserCheck,
  PlusCircle,
  Copy,
  Check,
  Lock,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { PrintableOrderSummary } from '../components/orders/PrintableOrderSummary'
import { STORE_INFO } from '../data/products'
import { useAdminAuth } from '../context/AdminAuthContext'
import {
  loadOrderHistory,
  updateOrderStatus,
  deleteOrderFromHistory,
  seedSampleOrdersIfEmpty,
  clearOrderHistory,
} from '../utils/checkoutStorage'
import type { OrderRecord, OrderStatus } from '../types'

export interface OrdersPageProps {
  onNavigateHome: () => void
  onNavigateToCheckout?: () => void
  initialActiveOrderId?: string
}

export const OrdersPage: React.FC<OrdersPageProps> = ({
  onNavigateHome,
  onNavigateToCheckout,
  initialActiveOrderId,
}) => {
  const { logout } = useAdminAuth()
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const list = loadOrderHistory()
    if (list.length === 0) {
      return seedSampleOrdersIfEmpty()
    }
    return list
  })

  const [activeTab, setActiveTab] = useState<'owner' | 'tracker'>('owner')
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [activePrintOrder, setActivePrintOrder] = useState<OrderRecord | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Tracking tab state
  const [trackingIdInput, setTrackingIdInput] = useState(initialActiveOrderId || '')
  const [selectedTrackedOrder, setSelectedTrackedOrder] = useState<OrderRecord | null>(() => {
    if (initialActiveOrderId) {
      const match = loadOrderHistory().find(
        (o) => o.orderId.toLowerCase() === initialActiveOrderId.toLowerCase().trim()
      )
      return match || null
    }
    return null
  })

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  // Refresh orders from local storage
  const refreshOrders = () => {
    const current = loadOrderHistory()
    setOrders(current)
  }

  // Handle status update by store owner
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const success = updateOrderStatus(orderId, newStatus)
    if (success) {
      setOrders((prev) =>
        prev.map((o) =>
          o.orderId === orderId ? { ...o, status: newStatus, updatedAt: Date.now() } : o
        )
      )
      if (selectedTrackedOrder && selectedTrackedOrder.orderId === orderId) {
        setSelectedTrackedOrder((prev) =>
          prev ? { ...prev, status: newStatus, updatedAt: Date.now() } : null
        )
      }
    }
  }

  // Handle notes update by store owner
  const handleNotesChange = (orderId: string, notes: string) => {
    updateOrderStatus(orderId, orders.find((o) => o.orderId === orderId)?.status || 'pending', notes)
    setOrders((prev) =>
      prev.map((o) => (o.orderId === orderId ? { ...o, ownerNotes: notes } : o))
    )
  }

  // Handle delete
  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Are you sure you want to delete order ${orderId} from local records?`)) {
      deleteOrderFromHistory(orderId)
      setOrders((prev) => prev.filter((o) => o.orderId !== orderId))
      if (selectedTrackedOrder?.orderId === orderId) {
        setSelectedTrackedOrder(null)
      }
    }
  }

  // Seed sample data
  const handleSeedSamples = () => {
    const seeded = seedSampleOrdersIfEmpty()
    setOrders(seeded)
  }

  // Clear all orders
  const handleClearAll = () => {
    if (window.confirm('Are you sure you want to clear all local order history?')) {
      clearOrderHistory()
      setOrders([])
      setSelectedTrackedOrder(null)
    }
  }

  // Copy order ID
  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Ignore
    }
  }

  // KPI Calculations
  const stats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === 'pending').length
    const confirmed = orders.filter((o) => o.status === 'confirmed').length
    const completed = orders.filter((o) => o.status === 'completed').length
    const totalRevenue = orders
      .filter((o) => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return { total, pending, confirmed, completed, totalRevenue }
  }, [orders])

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    let result = [...orders]

    // Status filter
    if (selectedStatusFilter !== 'all') {
      result = result.filter((o) => o.status === selectedStatusFilter)
    }

    // Search query
    const q = searchQuery.toLowerCase().trim()
    if (q) {
      result = result.filter(
        (o) =>
          o.orderId.toLowerCase().includes(q) ||
          o.customer.fullName.toLowerCase().includes(q) ||
          o.customer.phoneNumber.includes(q) ||
          o.customer.address.toLowerCase().includes(q)
      )
    }

    return result
  }, [orders, selectedStatusFilter, searchQuery])

  // Track an order by ID from input
  const handleLookupOrder = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    const q = trackingIdInput.trim().toLowerCase()
    if (!q) return

    const match = orders.find(
      (o) => o.orderId.toLowerCase() === q || o.customer.phoneNumber.includes(q)
    )

    setSelectedTrackedOrder(match || null)
  }

  // WhatsApp quick response link generator
  const getCustomerWhatsAppUrl = (order: OrderRecord) => {
    const statusText =
      order.status === 'confirmed'
        ? 'has been CONFIRMED and is being packaged'
        : order.status === 'completed'
          ? 'has been COMPLETED and delivered'
          : order.status === 'cancelled'
            ? 'has been CANCELLED'
            : 'has been received and is under review'

    const cleanPhone = order.customer.phoneNumber.replace(/\D/g, '')
    const targetNumber = cleanPhone.startsWith('92')
      ? cleanPhone
      : cleanPhone.startsWith('0')
        ? '92' + cleanPhone.slice(1)
        : cleanPhone

    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customer.fullName}!\nRegarding your ${STORE_INFO.name} order *${order.orderId}*:\nYour order ${statusText}.\nTotal: Rs. ${order.totalAmount.toLocaleString()} (${order.customer.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'}).\nStore Address: ${STORE_INFO.address}\nHelpline: ${STORE_INFO.phone}. JazakAllah!`
    )

    return `https://wa.me/${targetNumber}?text=${text}`
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
            <span className="text-forest-950 font-bold">Orders Management</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black text-forest-950 tracking-tight flex items-center gap-2">
            <span>Orders &amp; Tracking Center</span>
            <span className="text-base sm:text-lg font-urdu font-bold text-forest-700">
              (آرڈرز کا انتظام و ترسیل)
            </span>
          </h1>
          <p className="text-xs text-forest-700/80">
            Store Counter: {STORE_INFO.address} • Real-time local order tracking &amp; printable receipts
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onNavigateHome}
            iconLeft={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Groceries (واپس جائیں)
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              logout()
              onNavigateHome()
            }}
            className="border-rose-300 text-rose-800 hover:bg-rose-50 hover:border-rose-400"
            iconLeft={<Lock className="w-4 h-4 text-rose-600" />}
          >
            Lock &amp; Logout (لاگ آؤٹ)
          </Button>

          {onNavigateToCheckout && (
            <Button
              variant="forest"
              size="sm"
              onClick={onNavigateToCheckout}
              iconLeft={<ShoppingBag className="w-4 h-4" />}
            >
              Go to Basket / Checkout
            </Button>
          )}
        </div>
      </div>

      {/* 2. Top View Switcher Tabs */}
      <div className="flex items-center justify-between border-b border-cream-300">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setActiveTab('owner')}
            className={`py-3 px-4 sm:px-6 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'owner'
                ? 'border-forest-700 text-forest-950 bg-cream-50 rounded-t-xl'
                : 'border-transparent text-forest-700/70 hover:text-forest-950'
            }`}
          >
            <UserCheck className="w-4 h-4 text-forest-700" />
            <span>Store Owner Dashboard (دکاندار کا ڈیش بورڈ)</span>
            <span className="bg-forest-950 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
              {stats.total}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tracker')}
            className={`py-3 px-4 sm:px-6 text-sm font-bold border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
              activeTab === 'tracker'
                ? 'border-forest-700 text-forest-950 bg-cream-50 rounded-t-xl'
                : 'border-transparent text-forest-700/70 hover:text-forest-950'
            }`}
          >
            <Truck className="w-4 h-4 text-lime-dark" />
            <span>Customer Order Tracker (گاہک کے آرڈر کی ٹریکنگ)</span>
          </button>
        </div>

        <button
          type="button"
          onClick={refreshOrders}
          className="p-2 text-forest-700 hover:text-forest-950 hover:bg-cream-100 rounded-xl transition-colors cursor-pointer text-xs flex items-center gap-1 font-semibold"
          title="Refresh orders from local storage"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* LocalStorage & Security Architecture Notice */}
      <div className="bg-cream-100/80 border border-cream-300 rounded-2xl p-3 sm:p-4 text-xs text-forest-800 flex items-start gap-2.5">
        <FileText className="w-4 h-4 text-forest-700 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <p className="font-bold text-forest-950">
            Browser-Local Storage Notice (آن ڈیوائس لوکل ریکارڈ):
          </p>
          <p className="text-forest-700/80 leading-relaxed text-[11px]">
            Hafiz Jee operates without a remote backend server. Order histories and status updates are saved safely in your device&apos;s browser (LocalStorage) and do not automatically sync across separate computers or mobile phones. Final order confirmation and billing are coordinated directly via WhatsApp or at the store counter ({STORE_INFO.address}).
          </p>
        </div>
      </div>

      {/* 3. STORE OWNER DASHBOARD VIEW */}
      {activeTab === 'owner' && (
        <div className="space-y-6">
          {/* KPI Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
            <Card className="p-4 bg-white space-y-1 shadow-2xs">
              <span className="text-xs font-semibold text-forest-700/70 uppercase tracking-wider block">
                Total Orders
              </span>
              <span className="text-2xl font-black text-forest-950">{stats.total}</span>
              <p className="text-[11px] text-forest-700/60 font-urdu font-medium">کل موصول شدہ آرڈرز</p>
            </Card>

            <Card className="p-4 bg-amber-50/70 border-amber-200 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block flex items-center gap-1">
                <Clock3 className="w-3.5 h-3.5 text-amber-600" />
                <span>Pending</span>
              </span>
              <span className="text-2xl font-black text-amber-950">{stats.pending}</span>
              <p className="text-[11px] text-amber-800/80 font-urdu font-medium">زیر التواء آرڈرز</p>
            </Card>

            <Card className="p-4 bg-lime-50/70 border-lime-200 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-lime-900 uppercase tracking-wider block flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-lime-dark" />
                <span>Confirmed</span>
              </span>
              <span className="text-2xl font-black text-lime-950">{stats.confirmed}</span>
              <p className="text-[11px] text-lime-800/80 font-urdu font-medium">تصدیق شدہ آرڈرز</p>
            </Card>

            <Card className="p-4 bg-emerald-50/70 border-emerald-200 space-y-1 shadow-2xs">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block flex items-center gap-1">
                <PackageCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Completed</span>
              </span>
              <span className="text-2xl font-black text-emerald-950">{stats.completed}</span>
              <p className="text-[11px] text-emerald-800/80 font-urdu font-medium">مکمل و ترسیل شدہ</p>
            </Card>

            <Card className="p-4 bg-forest-950 text-white space-y-1 shadow-forest-md col-span-2 sm:col-span-1">
              <span className="text-xs font-bold text-lime-brand uppercase tracking-wider block">
                Total Local Sales
              </span>
              <span className="text-xl sm:text-2xl font-black text-white font-mono">
                Rs. {stats.totalRevenue.toLocaleString()}
              </span>
              <p className="text-[11px] text-cream-200/80">Active business volume</p>
            </Card>
          </div>

          {/* Search & Filter Bar */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-cream-300 shadow-2xs">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Order ID, Name, Phone..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl text-forest-950 placeholder:text-forest-900/40 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              />
              <Search className="w-3.5 h-3.5 text-forest-700/60 absolute left-3 top-2.5" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-2 text-forest-700/50 hover:text-forest-900 text-xs p-0.5"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Status Filter Tabs */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              {[
                { id: 'all' as const, label: 'All', count: stats.total },
                { id: 'pending' as const, label: 'Pending', count: stats.pending },
                { id: 'confirmed' as const, label: 'Confirmed', count: stats.confirmed },
                { id: 'completed' as const, label: 'Completed', count: stats.completed },
              ].map((filter) => (
                <button
                  key={filter.id}
                  type="button"
                  onClick={() => setSelectedStatusFilter(filter.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                    selectedStatusFilter === filter.id
                      ? 'bg-forest-950 text-white shadow-2xs'
                      : 'bg-cream-100 hover:bg-cream-200 text-forest-800'
                  }`}
                >
                  <span>{filter.label}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      selectedStatusFilter === filter.id
                        ? 'bg-lime-brand text-forest-950 font-black'
                        : 'bg-cream-300/80 text-forest-900'
                    }`}
                  >
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>

            {/* Admin Utility Actions */}
            <div className="flex items-center gap-2 shrink-0 self-end md:self-auto">
              <button
                type="button"
                onClick={handleSeedSamples}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-forest-800 hover:text-forest-950 bg-cream-100 hover:bg-cream-200 rounded-xl transition-colors cursor-pointer"
                title="Add sample orders for testing"
              >
                <PlusCircle className="w-3.5 h-3.5 text-lime-dark" />
                <span className="hidden sm:inline">Sample Data</span>
              </button>

              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors cursor-pointer"
                title="Clear all orders"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clear</span>
              </button>
            </div>
          </div>

          {/* Orders List */}
          {filteredOrders.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center space-y-4 bg-white">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-cream-100 flex items-center justify-center text-forest-700">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="text-base font-extrabold text-forest-950">
                  No orders match your filter criteria
                </h3>
                <p className="text-xs text-forest-700/70">
                  Try clearing your search query or load sample store orders.
                </p>
              </div>
              <Button variant="forest" size="sm" onClick={handleSeedSamples}>
                Load Sample Orders (نمونہ آرڈرز شامل کریں)
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => {
                const isPickup = order.customer.deliveryMethod === 'pickup'

                return (
                  <Card
                    key={order.orderId}
                    className="p-5 sm:p-6 bg-white border border-cream-300 shadow-2xs hover:shadow-forest-md transition-all space-y-4"
                  >
                    {/* Order Header Row */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cream-200 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-2xl bg-forest-100 text-forest-800">
                          <ShoppingBag className="w-5 h-5 text-forest-700" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-base font-black font-mono text-forest-950">
                              {order.orderId}
                            </span>
                            <button
                              type="button"
                              onClick={() => handleCopyId(order.orderId)}
                              className="text-forest-700/60 hover:text-forest-950 p-1 rounded-md"
                              title="Copy Order ID"
                            >
                              {copiedId === order.orderId ? (
                                <Check className="w-3.5 h-3.5 text-forest-700" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                            <span className="text-xs font-bold text-forest-700/60">
                              • {order.date}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-forest-800 mt-0.5">
                            <span className="font-bold">{order.customer.fullName}</span>
                            <span>•</span>
                            <a
                              href={`tel:${order.customer.phoneNumber}`}
                              className="text-forest-700 hover:underline flex items-center gap-1 font-mono"
                            >
                              <Phone className="w-3 h-3" />
                              <span>{order.customer.phoneNumber}</span>
                            </a>
                          </div>
                        </div>
                      </div>

                      {/* Status Badges & Quick Stepper Selector */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-forest-700/70 mr-1">
                          Status:
                        </span>
                        <div className="inline-flex rounded-xl p-1 bg-cream-100 border border-cream-300 gap-1">
                          {[
                            { id: 'pending' as const, label: 'Pending' },
                            { id: 'confirmed' as const, label: 'Confirmed' },
                            { id: 'completed' as const, label: 'Completed' },
                            { id: 'cancelled' as const, label: 'Cancelled' },
                          ].map((st) => (
                            <button
                              key={st.id}
                              type="button"
                              onClick={() => handleStatusChange(order.orderId, st.id)}
                              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                                order.status === st.id
                                  ? st.id === 'confirmed'
                                    ? 'bg-lime-brand text-forest-950 shadow-2xs'
                                    : st.id === 'completed'
                                      ? 'bg-forest-950 text-white shadow-2xs'
                                      : st.id === 'cancelled'
                                        ? 'bg-rose-600 text-white shadow-2xs'
                                        : 'bg-amber-400 text-amber-950 shadow-2xs'
                                  : 'text-forest-700 hover:text-forest-950 hover:bg-cream-200/60'
                              }`}
                            >
                              {st.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Middle Details Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 text-xs">
                      {/* Customer & Delivery Specs (5 cols) */}
                      <div className="md:col-span-5 space-y-1.5 p-3 rounded-2xl bg-cream-50 border border-cream-200">
                        <div className="flex items-center gap-1.5 font-bold text-forest-950">
                          {isPickup ? (
                            <>
                              <Store className="w-3.5 h-3.5 text-lime-dark" />
                              <span>Store Counter Pickup (Civil Bazar K-152, Attock City)</span>
                            </>
                          ) : (
                            <>
                              <Truck className="w-3.5 h-3.5 text-forest-700" />
                              <span>Home Delivery ({order.customer.area})</span>
                            </>
                          )}
                        </div>

                        {!isPickup && order.customer.address && (
                          <p className="text-forest-800 leading-snug">
                            <strong>Address:</strong> {order.customer.address}
                          </p>
                        )}

                        <div className="flex items-center gap-2 pt-1 text-[11px] text-forest-700/80">
                          <CreditCard className="w-3 h-3 text-forest-700" />
                          <span>
                            <strong>Payment:</strong>{' '}
                            {order.customer.paymentMethod === 'jazzcash'
                              ? 'JazzCash (جاز کیش)'
                              : order.customer.paymentMethod === 'easypaisa'
                                ? 'EasyPaisa (ایزی پیسہ)'
                                : order.customer.paymentMethod.toUpperCase()}
                          </span>
                        </div>

                        {order.customer.notes && (
                          <p className="text-[11px] text-forest-800 bg-white p-2 rounded-xl border border-cream-200 mt-1">
                            <strong>Customer Note:</strong> {order.customer.notes}
                          </p>
                        )}
                      </div>

                      {/* Items Overview (4 cols) */}
                      <div className="md:col-span-4 space-y-1.5 p-3 rounded-2xl bg-cream-50 border border-cream-200">
                        <div className="flex items-center justify-between font-bold text-forest-950 border-b border-cream-200 pb-1">
                          <span>Items ({order.items.length})</span>
                          <span>Subtotal</span>
                        </div>
                        <ul className="space-y-1 max-h-28 overflow-y-auto pr-1">
                          {order.items.map((it, idx) => (
                            <li key={idx} className="flex justify-between text-[11px] text-forest-800">
                              <span className="truncate max-w-44">
                                {it.quantity} × {it.product.name}
                              </span>
                              <span className="font-mono font-semibold">
                                Rs. {(it.product.price * it.quantity).toLocaleString()}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Order Value & Action Buttons (3 cols) */}
                      <div className="md:col-span-3 space-y-2 flex flex-col justify-between p-3 rounded-2xl bg-forest-950 text-white shadow-xs">
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-cream-200">
                            <span>Delivery:</span>
                            <span className="font-bold text-lime-brand">
                              {isPickup ? 'Rs. 0' : order.deliveryFee === 0 ? 'FREE' : `Rs. ${order.deliveryFee}`}
                            </span>
                          </div>
                          <div className="flex justify-between text-sm font-black pt-1 border-t border-forest-850">
                            <span>Total Bill:</span>
                            <span className="text-base text-lime-brand font-mono">
                              Rs. {order.totalAmount.toLocaleString()}
                            </span>
                          </div>
                        </div>

                        <div className="space-y-1.5 pt-1">
                          {/* Print Invoice Button */}
                          <Button
                            variant="lime"
                            fullWidth
                            size="sm"
                            onClick={() => setActivePrintOrder(order)}
                            iconLeft={<Printer className="w-3.5 h-3.5" />}
                          >
                            Print Receipt (پرنٹ)
                          </Button>

                          {/* WhatsApp Customer Button */}
                          <a
                            href={getCustomerWhatsAppUrl(order)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-full inline-flex items-center justify-center gap-1.5 py-1.5 px-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-cream-100 text-xs font-semibold transition-colors"
                          >
                            <MessageCircle className="w-3.5 h-3.5 text-lime-brand" />
                            <span>WhatsApp Customer</span>
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Owner Internal Notes Bar */}
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-cream-100">
                      <div className="flex items-center gap-2 w-full sm:w-auto flex-1">
                        <FileText className="w-3.5 h-3.5 text-forest-700/60 shrink-0" />
                        <input
                          type="text"
                          defaultValue={order.ownerNotes || ''}
                          onBlur={(e) => handleNotesChange(order.orderId, e.target.value)}
                          placeholder="Store Owner note (e.g. Rider assigned, packed at counter...)"
                          className="w-full text-xs bg-cream-50 hover:bg-white focus:bg-white px-2.5 py-1.5 rounded-xl border border-cream-300/80 focus:outline-none focus:ring-1 focus:ring-forest-600/30 text-forest-950 placeholder:text-forest-900/40"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => handleDeleteOrder(order.orderId)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 font-semibold flex items-center gap-1 cursor-pointer shrink-0 self-end sm:self-auto"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete Record</span>
                      </button>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. CUSTOMER ORDER TRACKER VIEW */}
      {activeTab === 'tracker' && (
        <div className="max-w-3xl mx-auto space-y-6">
          {/* Tracking Search Input */}
          <Card className="p-6 bg-white space-y-4 shadow-forest-md">
            <div className="space-y-1">
              <h2 className="text-lg font-black text-forest-950 tracking-tight">
                Track Your Grocery Order Status
              </h2>
              <p className="text-xs text-forest-700">
                Enter the Order Reference ID provided after checkout (e.g. <code>HJK-26-8192</code>) or your mobile number:
              </p>
            </div>

            <form onSubmit={handleLookupOrder} className="flex gap-2">
              <input
                type="text"
                value={trackingIdInput}
                onChange={(e) => setTrackingIdInput(e.target.value)}
                placeholder="Enter Order ID (e.g. HJK-26-XXXX) or Phone..."
                className="flex-1 px-4 py-2.5 rounded-xl border border-cream-300 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              />
              <Button
                variant="forest"
                size="md"
                onClick={handleLookupOrder}
                iconLeft={<Search className="w-4 h-4" />}
              >
                Track Status (معلوم کریں)
              </Button>
            </form>

            {/* Quick Order Selectors from Local Storage */}
            {orders.length > 0 && (
              <div className="pt-2 border-t border-cream-200">
                <span className="text-[11px] font-bold text-forest-700/70 uppercase tracking-wider block mb-2">
                  Recent Orders on this Device:
                </span>
                <div className="flex flex-wrap gap-2">
                  {orders.slice(0, 4).map((o) => (
                    <button
                      key={o.orderId}
                      type="button"
                      onClick={() => {
                        setTrackingIdInput(o.orderId)
                        setSelectedTrackedOrder(o)
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-cream-50 hover:bg-lime-brand hover:text-forest-950 text-forest-800 border border-cream-300 transition-colors cursor-pointer"
                    >
                      {o.orderId} ({o.customer.fullName.split(' ')[0]})
                    </button>
                  ))}
                </div>
              </div>
            )}
          </Card>

          {/* Active Tracked Order Details */}
          {selectedTrackedOrder ? (
            <Card className="p-6 sm:p-8 bg-white space-y-6 shadow-forest-lg">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cream-200 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700 block">
                    Order Reference
                  </span>
                  <span className="text-xl font-black font-mono text-forest-950">
                    {selectedTrackedOrder.orderId}
                  </span>
                  <p className="text-xs text-forest-700/80">
                    Placed on {selectedTrackedOrder.date} • {selectedTrackedOrder.customer.fullName}
                  </p>
                </div>

                <Button
                  variant="lime"
                  size="sm"
                  onClick={() => setActivePrintOrder(selectedTrackedOrder)}
                  iconLeft={<Printer className="w-4 h-4" />}
                >
                  Print Official Receipt (رسید)
                </Button>
              </div>

              {/* Progress Stepper Timeline */}
              <div className="space-y-3 p-5 rounded-2xl bg-cream-50 border border-cream-200">
                <h3 className="font-extrabold text-xs uppercase tracking-wider text-forest-700">
                  Live Dispatch Progress:
                </h3>

                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  {/* Step 1: Placed */}
                  <div className="space-y-1.5">
                    <div className="w-9 h-9 mx-auto rounded-full bg-forest-700 text-white flex items-center justify-center font-bold">
                      <Check className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-forest-950 block text-[11px]">
                      1. Placed
                    </span>
                    <span className="text-[10px] text-forest-700/70 block">
                      آرڈر موصول
                    </span>
                  </div>

                  {/* Step 2: Confirmed */}
                  <div className="space-y-1.5">
                    <div
                      className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold ${
                        selectedTrackedOrder.status === 'confirmed' ||
                        selectedTrackedOrder.status === 'completed'
                          ? 'bg-lime-brand text-forest-950'
                          : 'bg-cream-200 text-forest-700/60'
                      }`}
                    >
                      {selectedTrackedOrder.status === 'confirmed' ||
                      selectedTrackedOrder.status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        '2'
                      )}
                    </div>
                    <span className="font-bold text-forest-950 block text-[11px]">
                      2. Confirmed
                    </span>
                    <span className="text-[10px] text-forest-700/70 block">
                      تصدیق مکمل
                    </span>
                  </div>

                  {/* Step 3: Packing / Dispatch */}
                  <div className="space-y-1.5">
                    <div
                      className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold ${
                        selectedTrackedOrder.status === 'completed'
                          ? 'bg-lime-brand text-forest-950'
                          : selectedTrackedOrder.status === 'confirmed'
                            ? 'bg-forest-800 text-lime-brand'
                            : 'bg-cream-200 text-forest-700/60'
                      }`}
                    >
                      {selectedTrackedOrder.status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        '3'
                      )}
                    </div>
                    <span className="font-bold text-forest-950 block text-[11px]">
                      3. Dispatch
                    </span>
                    <span className="text-[10px] text-forest-700/70 block">
                      پیکنگ و ترسیل
                    </span>
                  </div>

                  {/* Step 4: Completed */}
                  <div className="space-y-1.5">
                    <div
                      className={`w-9 h-9 mx-auto rounded-full flex items-center justify-center font-bold ${
                        selectedTrackedOrder.status === 'completed'
                          ? 'bg-forest-950 text-white'
                          : 'bg-cream-200 text-forest-700/60'
                      }`}
                    >
                      {selectedTrackedOrder.status === 'completed' ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        '4'
                      )}
                    </div>
                    <span className="font-bold text-forest-950 block text-[11px]">
                      4. Completed
                    </span>
                    <span className="text-[10px] text-forest-700/70 block">
                      مکمل شدہ
                    </span>
                  </div>
                </div>

                {/* Status Notice Banner */}
                <div className="mt-3 p-3 rounded-xl bg-white border border-cream-300 text-xs text-forest-900 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-forest-700 shrink-0" />
                  <div>
                    <strong>Status Note:</strong>{' '}
                    {selectedTrackedOrder.status === 'completed'
                      ? `This order has been delivered and fulfilled. Thank you for choosing ${STORE_INFO.name}!`
                      : selectedTrackedOrder.status === 'confirmed'
                        ? `The store has verified your order. Your items are being packed at ${STORE_INFO.address}.`
                        : selectedTrackedOrder.status === 'cancelled'
                          ? 'This order is marked as cancelled.'
                          : `Order placed via WhatsApp. ${STORE_INFO.name} store owner is reviewing mandi rates and stock.`}
                  </div>
                </div>
              </div>

              {/* Order Receipt Summary */}
              <div className="space-y-3">
                <h4 className="font-extrabold text-sm text-forest-950">
                  Ordered Items ({selectedTrackedOrder.items.length})
                </h4>

                <div className="divide-y divide-cream-200 border border-cream-200 rounded-2xl overflow-hidden bg-cream-50/50">
                  {selectedTrackedOrder.items.map((it, idx) => (
                    <div key={idx} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-forest-950">{it.product.name}</span>
                        <span className="text-forest-700/70 text-[11px] block">
                          {it.quantity} × {it.product.unit} @ Rs. {it.product.price}
                        </span>
                      </div>
                      <span className="font-black text-forest-950 font-mono">
                        Rs. {(it.product.price * it.quantity).toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center p-4 rounded-2xl bg-forest-950 text-white text-sm font-black">
                  <span>Grand Total Payable:</span>
                  <span className="text-lg text-lime-brand font-mono">
                    Rs. {selectedTrackedOrder.totalAmount.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Helpline Contact */}
              <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-cream-200 text-xs">
                <a
                  href={`tel:${STORE_INFO.phone}`}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-cream-300 hover:bg-cream-100 text-forest-800 font-bold transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-forest-700" />
                  <span>Call Store Counter ({STORE_INFO.phone})</span>
                </a>

                <a
                  href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                    `Assalam-o-Alaikum Hafiz G, I am checking the status of my order ${selectedTrackedOrder.orderId}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl bg-lime-brand hover:bg-lime-accent text-forest-950 font-bold transition-colors"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Inquire on WhatsApp</span>
                </a>
              </div>
            </Card>
          ) : trackingIdInput ? (
            <Card className="p-6 text-center space-y-2 bg-white">
              <p className="font-bold text-forest-950 text-sm">
                No local order found for "{trackingIdInput}"
              </p>
              <p className="text-xs text-forest-700/70">
                Please check your order reference number or contact store helpline at {STORE_INFO.phone}.
              </p>
            </Card>
          ) : null}
        </div>
      )}

      {/* 5. Printable Summary Modal Dialog */}
      <PrintableOrderSummary
        order={activePrintOrder}
        isOpen={Boolean(activePrintOrder)}
        onClose={() => setActivePrintOrder(null)}
      />
    </div>
  )
}
