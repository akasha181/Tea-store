import React, { useState, useEffect, useMemo } from 'react'
import {
  ShieldCheck,
  ShoppingBag,
  Package,
  Settings,
  BarChart3,
  Search,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Clock3,
  Truck,
  Phone,
  MessageCircle,
  Printer,
  RotateCcw,
  AlertTriangle,
  MapPin,
  Check,
  X,
  Copy,
  RefreshCw,
  Bell,
  Save,
  Lock,
} from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { useProductCatalog } from '../context/useProductCatalog'
import { useAdminAuth } from '../context/AdminAuthContext'
import { CATEGORIES } from '../data/products'
import {
  loadOrderHistory,
  updateOrderStatus,
  deleteOrderFromHistory,
  seedSampleOrdersIfEmpty,
  loadStoreSettings,
  saveStoreSettings,
  resetStoreSettings,
} from '../utils/checkoutStorage'
import { PrintableOrderSummary } from '../components/orders/PrintableOrderSummary'
import type { OrderRecord, OrderStatus, Product, StoreInfo } from '../types'

export interface AdminPageProps {
  onNavigateHome: () => void
  onNavigateToCheckout?: () => void
  onNavigateToOrders?: (orderId?: string) => void
}

export const AdminPage: React.FC<AdminPageProps> = ({ onNavigateHome, onNavigateToOrders }) => {
  const { logout } = useAdminAuth()
  const {
    products,
    updateProductPrice,
    updateProductStockQuantity,
    toggleProductStock,
    addProduct,
    updateProduct,
    deleteProduct,
    resetToDefaultCatalog,
  } = useProductCatalog()

  // Navigation tab
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'settings' | 'analytics'>('orders')

  // Orders State
  const [orders, setOrders] = useState<OrderRecord[]>(() => {
    const list = loadOrderHistory()
    return list.length === 0 ? seedSampleOrdersIfEmpty() : list
  })
  const [orderStatusFilter, setOrderStatusFilter] = useState<OrderStatus | 'all'>('all')
  const [orderSearchQuery, setOrderSearchQuery] = useState('')
  const [activePrintOrder, setActivePrintOrder] = useState<OrderRecord | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [newOrderNotice, setNewOrderNotice] = useState<string | null>(null)

  // Products State
  const [productSearch, setProductSearch] = useState('')
  const [selectedProductCategory, setSelectedProductCategory] = useState<string>('all')
  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // New product form state
  const [productForm, setProductForm] = useState<Omit<Product, 'id'>>({
    name: '',
    urduName: '',
    category: 'beverages',
    unit: '1 kg pack',
    price: 500,
    inStock: true,
    stockQuantity: 20,
    badge: 'Fresh',
    description: '',
    image: '',
  })

  // Store Settings State
  const [storeSettings, setStoreSettings] = useState<StoreInfo>(loadStoreSettings)
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false)

  // Listen to live customer order events
  useEffect(() => {
    const handleNewOrder = (e: any) => {
      const placedOrder = e.detail as OrderRecord
      setOrders(loadOrderHistory())
      setNewOrderNotice(`New Order #${placedOrder.orderId} received from ${placedOrder.customer.fullName}!`)
      setTimeout(() => setNewOrderNotice(null), 6000)
    }

    const handleOrderUpdate = () => {
      setOrders(loadOrderHistory())
    }

    const handleSettingsUpdate = (e: any) => {
      setStoreSettings(e.detail || loadStoreSettings())
    }

    window.addEventListener('hafiz_new_order_placed', handleNewOrder)
    window.addEventListener('hafiz_order_status_changed', handleOrderUpdate)
    window.addEventListener('hafiz_store_settings_updated', handleSettingsUpdate)

    return () => {
      window.removeEventListener('hafiz_new_order_placed', handleNewOrder)
      window.removeEventListener('hafiz_order_status_changed', handleOrderUpdate)
      window.removeEventListener('hafiz_store_settings_updated', handleSettingsUpdate)
    }
  }, [])

  // Refresh orders from local storage
  const handleRefreshOrders = () => {
    setOrders(loadOrderHistory())
  }

  // Handle Order Status Stepper Progression ("Proceed Order")
  const handleProceedOrder = (orderId: string, currentStatus: OrderStatus) => {
    let nextStatus: OrderStatus = 'confirmed'
    let note = ''

    if (currentStatus === 'pending') {
      nextStatus = 'confirmed'
      note = 'Order verified & accepted by store manager'
    } else if (currentStatus === 'confirmed') {
      nextStatus = 'packaging'
      note = 'Packaging in progress at store counter'
    } else if (currentStatus === 'packaging') {
      nextStatus = 'out_for_delivery'
      note = 'Rider dispatched with grocery package'
    } else if (currentStatus === 'out_for_delivery') {
      nextStatus = 'completed'
      note = 'Order fulfilled & payment received'
    }

    updateOrderStatus(orderId, nextStatus, note)
    setOrders(loadOrderHistory())
  }

  const handleManualStatusChange = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status)
    setOrders(loadOrderHistory())
  }

  const handleDeleteOrder = (orderId: string) => {
    if (window.confirm(`Delete order ${orderId} permanently from local records?`)) {
      deleteOrderFromHistory(orderId)
      setOrders(loadOrderHistory())
    }
  }

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 2000)
    } catch {
      // Ignore
    }
  }

  // Build WhatsApp update link to notify customer
  const buildCustomerWhatsAppNotice = (order: OrderRecord) => {
    const statusUrdu = {
      pending: 'زیر التواء ہے (Pending)',
      confirmed: 'تصدیق ہو چکا ہے اور جلد تیار کیا جا رہا ہے (Confirmed)',
      packaging: 'پیک کیا جا رہا ہے (In Packaging)',
      out_for_delivery: 'ترسیل کے لیے روانہ ہو چکا ہے (Out for Delivery)',
      completed: 'مکمل اور ڈیلیور ہو چکا ہے (Delivered)',
      cancelled: 'منسوخ ہو چکا ہے (Cancelled)',
    }[order.status]

    const text = encodeURIComponent(
      `Assalam-o-Alaikum ${order.customer.fullName}!\n` +
      `Regarding your order *${order.orderId}* at *${storeSettings.name}* (${storeSettings.address}):\n\n` +
      `📌 *Order Status:* ${statusUrdu}\n` +
      `💰 *Total Amount:* Rs. ${order.totalAmount.toLocaleString()} (${order.customer.deliveryMethod === 'pickup' ? 'Store Pickup' : 'Home Delivery'})\n` +
      `📞 *Counter Hotline:* ${storeSettings.phone}\n\n` +
      `Thank you for shopping with us! JazakAllah.`
    )

    const rawDigits = order.customer.phoneNumber.replace(/\D/g, '')
    const targetNumber = rawDigits.startsWith('92')
      ? rawDigits
      : rawDigits.startsWith('0')
        ? '92' + rawDigits.slice(1)
        : rawDigits

    return `https://wa.me/${targetNumber}?text=${text}`
  }

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchStatus = orderStatusFilter === 'all' || order.status === orderStatusFilter
      const q = orderSearchQuery.toLowerCase().trim()
      const matchSearch =
        !q ||
        order.orderId.toLowerCase().includes(q) ||
        order.customer.fullName.toLowerCase().includes(q) ||
        order.customer.phoneNumber.includes(q) ||
        order.customer.address.toLowerCase().includes(q)
      return matchStatus && matchSearch
    })
  }, [orders, orderStatusFilter, orderSearchQuery])

  // Orders KPI Stats
  const orderStats = useMemo(() => {
    const total = orders.length
    const pending = orders.filter((o) => o.status === 'pending').length
    const confirmed = orders.filter((o) => o.status === 'confirmed').length
    const packaging = orders.filter((o) => o.status === 'packaging').length
    const outForDelivery = orders.filter((o) => o.status === 'out_for_delivery').length
    const completed = orders.filter((o) => o.status === 'completed').length
    const totalRevenue = orders
      .filter((o) => o.status === 'completed')
      .reduce((sum, o) => sum + o.totalAmount, 0)

    return { total, pending, confirmed, packaging, outForDelivery, completed, totalRevenue }
  }, [orders])

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchCat = selectedProductCategory === 'all' || p.category === selectedProductCategory
      const q = productSearch.toLowerCase().trim()
      const matchSearch =
        !q ||
        p.name.toLowerCase().includes(q) ||
        (p.urduName && p.urduName.includes(q)) ||
        p.unit.toLowerCase().includes(q)
      return matchCat && matchSearch
    })
  }, [products, selectedProductCategory, productSearch])

  // Save new or edited product
  const handleSaveProductSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!productForm.name.trim()) return

    if (editingProduct) {
      updateProduct(editingProduct.id, {
        ...productForm,
        price: Number(productForm.price),
        stockQuantity: Number(productForm.stockQuantity),
        inStock: Number(productForm.stockQuantity) > 0,
      })
      setEditingProduct(null)
    } else {
      addProduct({
        ...productForm,
        price: Number(productForm.price),
        stockQuantity: Number(productForm.stockQuantity),
        inStock: Number(productForm.stockQuantity) > 0,
      })
    }

    setIsAddProductModalOpen(false)
    setProductForm({
      name: '',
      urduName: '',
      category: 'beverages',
      unit: '1 kg pack',
      price: 500,
      inStock: true,
      stockQuantity: 20,
      badge: 'Fresh',
      description: '',
      image: '',
    })
  }

  const handleOpenEditProduct = (prod: Product) => {
    setEditingProduct(prod)
    setProductForm({
      name: prod.name,
      urduName: prod.urduName || '',
      category: prod.category,
      unit: prod.unit,
      price: prod.price,
      inStock: prod.inStock,
      stockQuantity: prod.stockQuantity,
      badge: prod.badge || '',
      description: prod.description || '',
      image: prod.image || '',
    })
    setIsAddProductModalOpen(true)
  }

  // Save Store Settings
  const handleSaveStoreSettings = (e: React.FormEvent) => {
    e.preventDefault()
    saveStoreSettings(storeSettings)
    setSettingsSavedMessage(true)
    setTimeout(() => setSettingsSavedMessage(false), 3000)
  }

  const handleResetSettings = () => {
    if (window.confirm('Reset all store settings to default configuration?')) {
      const reset = resetStoreSettings()
      setStoreSettings(reset)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* 1. TOP ADMIN CONTROL HEADER */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 rounded-3xl p-5 sm:p-6 text-white border border-forest-800 shadow-forest-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-lime-brand text-forest-950 font-black text-xs flex items-center gap-1 shadow-2xs">
              <ShieldCheck className="w-4 h-4" />
              <span>STORE ADMIN PORTAL</span>
            </span>
            <span className="text-xs text-cream-200/80 font-mono">
              Live Operations Control
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-2">
            <span>{storeSettings.name}</span>
            <span className="text-sm sm:text-base font-urdu font-bold text-lime-brand">
              ({storeSettings.urduName})
            </span>
          </h1>
          <p className="text-xs text-cream-200/80 flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-lime-brand shrink-0" />
            <span>Store Counter: {storeSettings.address} • Hotline: {storeSettings.phone}</span>
          </p>
        </div>

        {/* Switch back to customer view */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={onNavigateHome}
            className="inline-flex items-center gap-2 bg-lime-brand hover:bg-lime-accent active:bg-lime-dark text-forest-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-forest-md transition-all cursor-pointer"
            title="Switch to Customer Store View"
          >
            <ShoppingBag className="w-4 h-4 text-forest-950" />
            <span>🛒 Customer Store View (گاہک کا منظر)</span>
          </button>

          <button
            type="button"
            onClick={() => {
              logout()
              onNavigateHome()
            }}
            className="inline-flex items-center gap-1.5 bg-rose-900/90 hover:bg-rose-800 text-rose-100 font-bold px-3.5 py-2.5 rounded-xl text-xs border border-rose-700/80 transition-colors cursor-pointer"
            title="Lock Portal & Log Out"
          >
            <Lock className="w-3.5 h-3.5 text-rose-300" />
            <span>Lock &amp; Logout (لاگ آؤٹ)</span>
          </button>

          {onNavigateToOrders && (
            <button
              type="button"
              onClick={() => onNavigateToOrders()}
              className="inline-flex items-center gap-1.5 bg-forest-900 hover:bg-forest-800 text-cream-100 font-bold px-3 py-2.5 rounded-xl text-xs border border-forest-700 transition-colors cursor-pointer"
              title="View Customer Tracking Portal"
            >
              <Truck className="w-3.5 h-3.5 text-lime-brand" />
              <span>Customer Tracking</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleRefreshOrders}
            className="inline-flex items-center gap-1.5 bg-forest-800 hover:bg-forest-700 text-cream-100 font-bold px-3 py-2.5 rounded-xl text-xs border border-forest-700 transition-colors cursor-pointer"
            title="Refresh records"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Refresh Data</span>
          </button>
        </div>
      </div>

      {/* Real-time Order Alert Toast if customer placed an order */}
      {newOrderNotice && (
        <div className="bg-lime-brand text-forest-950 p-4 rounded-2xl font-bold text-xs sm:text-sm flex items-center justify-between gap-3 shadow-forest-md border-2 border-forest-950 animate-bounce">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-forest-950 shrink-0" />
            <span>⚡ {newOrderNotice}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('orders')
              setNewOrderNotice(null)
            }}
            className="bg-forest-950 text-white px-3 py-1 rounded-xl text-xs font-bold hover:bg-forest-800 cursor-pointer"
          >
            View Incoming Order
          </button>
        </div>
      )}

      {/* 2. ADMIN PORTAL NAVIGATION TABS */}
      <div className="flex flex-wrap items-center gap-2 border-b border-cream-300 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-forest-950 text-white shadow-forest-sm'
              : 'bg-white hover:bg-cream-100 text-forest-800 border border-cream-300'
          }`}
        >
          <ShoppingBag className="w-4 h-4 text-lime-brand" />
          <span>Customer Orders &amp; Fulfillment</span>
          {orderStats.pending > 0 && (
            <span className="bg-amber-400 text-amber-950 text-[10px] font-black px-2 py-0.5 rounded-full animate-pulse">
              {orderStats.pending} New
            </span>
          )}
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('products')}
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'products'
              ? 'bg-forest-950 text-white shadow-forest-sm'
              : 'bg-white hover:bg-cream-100 text-forest-800 border border-cream-300'
          }`}
        >
          <Package className="w-4 h-4 text-lime-brand" />
          <span>Product Catalog &amp; Stock Control</span>
          <span className="bg-cream-200 text-forest-950 text-[10px] font-bold px-2 py-0.5 rounded-full">
            {products.length}
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('settings')}
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'settings'
              ? 'bg-forest-950 text-white shadow-forest-sm'
              : 'bg-white hover:bg-cream-100 text-forest-800 border border-cream-300'
          }`}
        >
          <Settings className="w-4 h-4 text-lime-brand" />
          <span>Store Settings &amp; Contacts</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'bg-forest-950 text-white shadow-forest-sm'
              : 'bg-white hover:bg-cream-100 text-forest-800 border border-cream-300'
          }`}
        >
          <BarChart3 className="w-4 h-4 text-lime-brand" />
          <span>Sales &amp; Business Stats</span>
        </button>
      </div>

      {/* 3. TAB 1: ORDER PROCESSING & FULFILLMENT */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            <Card className="p-3 bg-white space-y-1">
              <span className="text-[11px] font-bold text-forest-700/70 uppercase">Total Orders</span>
              <span className="text-xl font-black text-forest-950 block">{orderStats.total}</span>
            </Card>

            <Card className="p-3 bg-amber-50 border-amber-200 space-y-1">
              <span className="text-[11px] font-bold text-amber-800 uppercase flex items-center gap-1">
                <Clock3 className="w-3 h-3 text-amber-600" />
                <span>Pending</span>
              </span>
              <span className="text-xl font-black text-amber-950 block">{orderStats.pending}</span>
            </Card>

            <Card className="p-3 bg-lime-50 border-lime-200 space-y-1">
              <span className="text-[11px] font-bold text-lime-900 uppercase flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3 text-lime-dark" />
                <span>Confirmed</span>
              </span>
              <span className="text-xl font-black text-lime-950 block">{orderStats.confirmed}</span>
            </Card>

            <Card className="p-3 bg-blue-50 border-blue-200 space-y-1">
              <span className="text-[11px] font-bold text-blue-900 uppercase flex items-center gap-1">
                <Package className="w-3 h-3 text-blue-600" />
                <span>Packaging</span>
              </span>
              <span className="text-xl font-black text-blue-950 block">{orderStats.packaging}</span>
            </Card>

            <Card className="p-3 bg-purple-50 border-purple-200 space-y-1">
              <span className="text-[11px] font-bold text-purple-900 uppercase flex items-center gap-1">
                <Truck className="w-3 h-3 text-purple-600" />
                <span>On the Way</span>
              </span>
              <span className="text-xl font-black text-purple-950 block">{orderStats.outForDelivery}</span>
            </Card>

            <Card className="p-3 bg-forest-950 text-white space-y-1 shadow-forest-sm">
              <span className="text-[11px] font-bold text-lime-brand uppercase">Total Revenue</span>
              <span className="text-lg font-black text-white font-mono block">
                Rs. {orderStats.totalRevenue.toLocaleString()}
              </span>
            </Card>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-cream-300 shadow-2xs">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={orderSearchQuery}
                onChange={(e) => setOrderSearchQuery(e.target.value)}
                placeholder="Search Customer, Mobile, Order ID..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl text-forest-950 placeholder:text-forest-900/40 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              />
              <Search className="w-3.5 h-3.5 text-forest-700/60 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
              {[
                { id: 'all' as const, label: 'All Orders' },
                { id: 'pending' as const, label: 'Pending' },
                { id: 'confirmed' as const, label: 'Confirmed' },
                { id: 'packaging' as const, label: 'Packaging' },
                { id: 'out_for_delivery' as const, label: 'Out for Delivery' },
                { id: 'completed' as const, label: 'Completed' },
                { id: 'cancelled' as const, label: 'Cancelled' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setOrderStatusFilter(f.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    orderStatusFilter === f.id
                      ? 'bg-forest-950 text-white shadow-2xs'
                      : 'bg-cream-100 hover:bg-cream-200 text-forest-800'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Orders Listing */}
          {filteredOrders.length === 0 ? (
            <Card className="p-8 sm:p-12 text-center space-y-4 bg-white">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-cream-100 flex items-center justify-center text-forest-700">
                <ShoppingBag className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-forest-950">
                No orders match your filter criteria
              </h3>
              <p className="text-xs text-forest-700/70">
                When a customer orders via checkout or WhatsApp, it will appear here immediately.
              </p>
              <Button
                variant="forest"
                size="sm"
                onClick={() => {
                  seedSampleOrdersIfEmpty()
                  setOrders(loadOrderHistory())
                }}
              >
                Load Demo Orders for Testing
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
                    {/* Header: Order ID, Date, Status */}
                    <div className="flex flex-wrap items-start justify-between gap-3 border-b border-cream-200 pb-3">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-base font-black font-mono text-forest-950">
                            {order.orderId}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleCopyId(order.orderId)}
                            className="text-forest-700/60 hover:text-forest-950 p-0.5"
                            title="Copy Order ID"
                          >
                            {copiedId === order.orderId ? (
                              <Check className="w-3.5 h-3.5 text-forest-700" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                          <span className="text-xs font-bold text-forest-700/70">
                            • {order.date}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-forest-800">
                          <span className="font-bold text-forest-950">
                            👤 {order.customer.fullName}
                          </span>
                          <span>•</span>
                          <a
                            href={`tel:${order.customer.phoneNumber}`}
                            className="text-forest-700 hover:underline font-mono flex items-center gap-1"
                          >
                            <Phone className="w-3 h-3" />
                            <span>{order.customer.phoneNumber}</span>
                          </a>
                          <span>•</span>
                          <span className="bg-cream-100 px-2 py-0.5 rounded-md font-semibold text-forest-900">
                            {isPickup ? '🏬 Store Pickup' : `🚚 Delivery: ${order.customer.area}`}
                          </span>
                        </div>
                      </div>

                      {/* Status Badges & Manual Stepper */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-xs font-bold text-forest-700/70">Status:</span>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleManualStatusChange(order.orderId, e.target.value as OrderStatus)
                          }
                          className="text-xs font-bold py-1 px-2.5 rounded-xl border border-cream-300 bg-cream-50 text-forest-950 cursor-pointer focus:outline-none focus:ring-2 focus:ring-forest-600/30"
                        >
                          <option value="pending">⏳ Pending Review</option>
                          <option value="confirmed">✓ Confirmed</option>
                          <option value="packaging">📦 In Packaging</option>
                          <option value="out_for_delivery">🚚 Out for Delivery</option>
                          <option value="completed">✅ Completed / Delivered</option>
                          <option value="cancelled">✕ Cancelled</option>
                        </select>
                      </div>
                    </div>

                    {/* Customer Notes / Address */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-cream-50/70 p-3 rounded-2xl border border-cream-200">
                      <div>
                        <span className="font-bold text-forest-900 block mb-0.5">
                          Fulfillment Address &amp; Mode:
                        </span>
                        <p className="text-forest-800 leading-relaxed">
                          {isPickup
                            ? `Customer will pick up at store counter (${storeSettings.address})`
                            : `${order.customer.address} (${order.customer.area})`}
                        </p>
                        {order.customer.notes && (
                          <p className="mt-1 text-forest-700/90 italic">
                            Customer Note: &quot;{order.customer.notes}&quot;
                          </p>
                        )}
                      </div>

                      <div>
                        <span className="font-bold text-forest-900 block mb-0.5">
                          Payment Mode &amp; Amount:
                        </span>
                        <p className="font-semibold text-forest-950">
                          {order.customer.paymentMethod.toUpperCase()} • Grand Total:{' '}
                          <span className="text-forest-700 font-bold font-mono text-sm">
                            Rs. {order.totalAmount.toLocaleString()}
                          </span>
                        </p>
                        {order.ownerNotes && (
                          <p className="mt-1 text-amber-900 font-semibold bg-amber-50 p-1.5 rounded-lg border border-amber-200 text-[11px]">
                            Dispatcher Note: {order.ownerNotes}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Ordered Line Items Summary */}
                    <div className="space-y-1.5">
                      <span className="text-xs font-bold text-forest-900 uppercase tracking-wider block">
                        Ordered Items ({order.items.length}):
                      </span>
                      <div className="divide-y divide-cream-200 border border-cream-200 rounded-xl overflow-hidden bg-white text-xs">
                        {order.items.map((it, idx) => (
                          <div key={idx} className="p-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <span className="w-5 h-5 rounded-full bg-cream-100 flex items-center justify-center font-bold text-[10px] text-forest-700">
                                {idx + 1}
                              </span>
                              <div>
                                <span className="font-bold text-forest-950">{it.product.name}</span>
                                {it.product.urduName && (
                                  <span className="text-forest-700 font-urdu text-[11px] ml-1">
                                    ({it.product.urduName})
                                  </span>
                                )}
                                <span className="text-forest-700/70 text-[11px] block">
                                  {it.quantity} × {it.product.unit} @ Rs. {it.product.price}
                                </span>
                              </div>
                            </div>
                            <span className="font-bold text-forest-950 font-mono">
                              Rs. {(it.product.price * it.quantity).toLocaleString()}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* PROCEED ORDER WORKFLOW ACTIONS */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-cream-200">
                      {/* Workflow Stepper Proceed Button */}
                      <div className="flex items-center gap-2">
                        {order.status === 'pending' ? (
                          <button
                            type="button"
                            onClick={() => handleProceedOrder(order.orderId, 'pending')}
                            className="inline-flex items-center gap-1.5 bg-lime-brand hover:bg-lime-accent text-forest-950 font-black px-3.5 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <CheckCircle2 className="w-4 h-4 text-forest-950" />
                            <span>Accept &amp; Confirm Order (آرڈر منظور کریں)</span>
                          </button>
                        ) : order.status === 'confirmed' ? (
                          <button
                            type="button"
                            onClick={() => handleProceedOrder(order.orderId, 'confirmed')}
                            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <Package className="w-4 h-4" />
                            <span>Move to Packaging (پیکنگ شروع کریں)</span>
                          </button>
                        ) : order.status === 'packaging' ? (
                          <button
                            type="button"
                            onClick={() => handleProceedOrder(order.orderId, 'packaging')}
                            className="inline-flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <Truck className="w-4 h-4" />
                            <span>Dispatch / Out for Delivery (روانہ کریں)</span>
                          </button>
                        ) : order.status === 'out_for_delivery' ? (
                          <button
                            type="button"
                            onClick={() => handleProceedOrder(order.orderId, 'out_for_delivery')}
                            className="inline-flex items-center gap-1.5 bg-forest-800 hover:bg-forest-900 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
                          >
                            <Check className="w-4 h-4 text-lime-brand" />
                            <span>Mark Completed / Delivered (مکمل و وصول شدہ)</span>
                          </button>
                        ) : (
                          <Badge variant="forest" size="sm">
                            ✓ Fulfillment Finalized
                          </Badge>
                        )}
                      </div>

                      {/* Communications & Invoice Tools */}
                      <div className="flex items-center gap-2">
                        {/* Notify Customer on WhatsApp */}
                        <a
                          href={buildCustomerWhatsAppNotice(order)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-lime-brand/20 hover:bg-lime-brand text-forest-950 font-bold text-xs transition-colors"
                          title="Send Status Update to Customer via WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5 text-forest-700" />
                          <span>WhatsApp Update</span>
                        </a>

                        {/* Printable Invoice */}
                        <button
                          type="button"
                          onClick={() => setActivePrintOrder(order)}
                          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cream-100 hover:bg-cream-200 text-forest-900 font-bold text-xs transition-colors cursor-pointer"
                        >
                          <Printer className="w-3.5 h-3.5 text-forest-700" />
                          <span>Print Invoice</span>
                        </button>

                        {/* Delete Order */}
                        <button
                          type="button"
                          onClick={() => handleDeleteOrder(order.orderId)}
                          className="p-2 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete Order Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: PRODUCT CATALOG & INVENTORY CONTROL */}
      {activeTab === 'products' && (
        <div className="space-y-6">
          {/* Header toolbar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 bg-white p-4 rounded-3xl border border-cream-300 shadow-2xs">
            <div>
              <h2 className="text-lg font-black text-forest-950 flex items-center gap-2">
                <span>Product &amp; Inventory Management</span>
                <span className="text-xs bg-lime-brand text-forest-950 px-2 py-0.5 rounded-full font-bold">
                  {products.length} Items Total
                </span>
              </h2>
              <p className="text-xs text-forest-700/80">
                Add, edit, or adjust prices and stock quantities for any product in the store. Changes update customer views immediately.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="forest"
                size="sm"
                onClick={() => {
                  setEditingProduct(null)
                  setProductForm({
                    name: '',
                    urduName: '',
                    category: 'beverages',
                    unit: '1 kg pack',
                    price: 500,
                    inStock: true,
                    stockQuantity: 20,
                    badge: 'Fresh',
                    description: '',
                    image: '',
                  })
                  setIsAddProductModalOpen(true)
                }}
                iconLeft={<Plus className="w-4 h-4" />}
              >
                Add New Product (نئی چیز شامل کریں)
              </Button>

              <button
                type="button"
                onClick={resetToDefaultCatalog}
                className="p-2.5 rounded-xl border border-cream-300 text-forest-700 hover:bg-cream-100 transition-colors text-xs font-semibold cursor-pointer"
                title="Reset products to default catalog"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Search & Category Filter */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <input
                type="text"
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                placeholder="Search products by name or urdu..."
                className="w-full pl-9 pr-8 py-2 text-xs bg-white border border-cream-300 rounded-xl text-forest-950 placeholder:text-forest-900/40 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              />
              <Search className="w-3.5 h-3.5 text-forest-700/60 absolute left-3 top-2.5" />
            </div>

            <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedProductCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedProductCategory === cat.id
                      ? 'bg-forest-950 text-white'
                      : 'bg-white hover:bg-cream-100 text-forest-800 border border-cream-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Products Table */}
          <div className="bg-white rounded-3xl border border-cream-300 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-cream-100 border-b border-cream-200 text-forest-950 font-bold">
                    <th className="py-3 px-4">Item Name</th>
                    <th className="py-3 px-4">Category</th>
                    <th className="py-3 px-4">Unit</th>
                    <th className="py-3 px-4">Price (PKR)</th>
                    <th className="py-3 px-4">Stock Qty</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cream-200 text-forest-900">
                  {filteredProducts.map((p) => {
                    const isAvail = p.inStock && p.stockQuantity > 0

                    return (
                      <tr key={p.id} className="hover:bg-cream-50/60 transition-colors">
                        <td className="py-3 px-4">
                          <span className="font-bold text-forest-950 block">{p.name}</span>
                          {p.urduName && (
                            <span className="font-urdu text-forest-700 text-[11px] block">
                              {p.urduName}
                            </span>
                          )}
                          {p.badge && (
                            <span className="inline-block mt-0.5 text-[9px] bg-lime-brand/40 text-forest-950 font-bold px-1.5 py-0.2 rounded">
                              {p.badge}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 capitalize font-medium text-forest-700">
                          {p.category}
                        </td>
                        <td className="py-3 px-4 font-mono font-medium">{p.unit}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold font-mono">Rs.</span>
                            <input
                              type="number"
                              min={0}
                              value={p.price}
                              onChange={(e) => updateProductPrice(p.id, Number(e.target.value))}
                              className="w-20 px-2 py-1 bg-cream-50 border border-cream-300 rounded-lg font-mono font-black text-xs text-forest-950 focus:outline-none focus:ring-1 focus:ring-forest-600"
                            />
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1">
                            <input
                              type="number"
                              min={0}
                              value={p.stockQuantity}
                              onChange={(e) =>
                                updateProductStockQuantity(p.id, Number(e.target.value))
                              }
                              className="w-16 px-2 py-1 bg-cream-50 border border-cream-300 rounded-lg font-mono font-bold text-xs text-forest-950 focus:outline-none focus:ring-1 focus:ring-forest-600"
                            />
                            {p.stockQuantity <= 5 && p.stockQuantity > 0 && (
                              <span className="text-[10px] text-amber-700 font-bold bg-amber-100 px-1.5 py-0.5 rounded">
                                Low
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <button
                            type="button"
                            onClick={() => toggleProductStock(p.id)}
                            className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase cursor-pointer transition-colors ${
                              isAvail
                                ? 'bg-forest-100 text-forest-800 hover:bg-forest-200'
                                : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                            }`}
                          >
                            {isAvail ? 'In Stock' : 'Out of Stock'}
                          </button>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              type="button"
                              onClick={() => handleOpenEditProduct(p)}
                              className="p-1.5 rounded-lg text-forest-700 hover:bg-cream-200 cursor-pointer"
                              title="Edit Details"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                if (window.confirm(`Delete "${p.name}" from catalog?`)) {
                                  deleteProduct(p.id)
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB 3: STORE SETTINGS & CONTACT CONFIGURATION */}
      {activeTab === 'settings' && (
        <Card className="p-6 sm:p-8 bg-white border border-cream-300 shadow-2xs space-y-6">
          <div className="border-b border-cream-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-xl font-black text-forest-950">Store Profile &amp; Contact Settings</h2>
              <p className="text-xs text-forest-700/80">
                Update store branding, address, WhatsApp ordering number, and delivery fee thresholds.
              </p>
            </div>
            {settingsSavedMessage && (
              <span className="text-xs font-bold text-forest-800 bg-lime-brand/30 border border-lime-brand px-3 py-1.5 rounded-xl animate-fade-in">
                ✓ Settings saved successfully!
              </span>
            )}
          </div>

          <form onSubmit={handleSaveStoreSettings} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Store Name (انگریزی نام)
                </label>
                <input
                  type="text"
                  value={storeSettings.name}
                  onChange={(e) => setStoreSettings({ ...storeSettings, name: e.target.value })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Urdu Store Name (اردو نام)
                </label>
                <input
                  type="text"
                  value={storeSettings.urduName}
                  onChange={(e) => setStoreSettings({ ...storeSettings, urduName: e.target.value })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs font-urdu font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Store Counter Address (پتہ)
                </label>
                <input
                  type="text"
                  value={storeSettings.address}
                  onChange={(e) => setStoreSettings({ ...storeSettings, address: e.target.value })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Counter Hotline Phone (موبائل نمبر)
                </label>
                <input
                  type="text"
                  value={storeSettings.phone}
                  onChange={(e) => setStoreSettings({ ...storeSettings, phone: e.target.value })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs font-mono font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  WhatsApp Ordering Number (بین الاقوامی فارمیٹ e.g. 923121971001)
                </label>
                <input
                  type="text"
                  value={storeSettings.whatsapp}
                  onChange={(e) => setStoreSettings({ ...storeSettings, whatsapp: e.target.value })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs font-mono font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-forest-950 mb-1">
                  Store Timings (اوقات کار)
                </label>
                <input
                  type="text"
                  value={storeSettings.timing}
                  onChange={(e) => setStoreSettings({ ...storeSettings, timing: e.target.value })}
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-forest-950 mb-1">
                Store Hero Slogan / Tagline
              </label>
              <input
                type="text"
                value={storeSettings.tagline}
                onChange={(e) => setStoreSettings({ ...storeSettings, tagline: e.target.value })}
                className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl text-xs font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
              />
            </div>

            <div className="pt-4 border-t border-cream-200 flex items-center justify-between">
              <button
                type="button"
                onClick={handleResetSettings}
                className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
              >
                Reset to Factory Defaults
              </button>

              <Button variant="forest" size="md" iconLeft={<Save className="w-4 h-4" />}>
                Save Settings (ترتیبات محفوظ کریں)
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* 6. TAB 4: STORE ANALYTICS & OVERVIEW */}
      {activeTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="p-5 bg-white space-y-2 border-l-4 border-lime-brand">
              <span className="text-xs font-bold text-forest-700 uppercase">Total Revenue (Gross)</span>
              <span className="text-2xl sm:text-3xl font-black text-forest-950 font-mono block">
                Rs. {orderStats.totalRevenue.toLocaleString()}
              </span>
              <p className="text-[11px] text-forest-700/70">From fulfilled orders</p>
            </Card>

            <Card className="p-5 bg-white space-y-2 border-l-4 border-forest-800">
              <span className="text-xs font-bold text-forest-700 uppercase">Fulfilled Deliveries</span>
              <span className="text-2xl sm:text-3xl font-black text-forest-950 block">
                {orderStats.completed}
              </span>
              <p className="text-[11px] text-forest-700/70">Successfully completed orders</p>
            </Card>

            <Card className="p-5 bg-white space-y-2 border-l-4 border-amber-500">
              <span className="text-xs font-bold text-forest-700 uppercase">Active Orders in Queue</span>
              <span className="text-2xl sm:text-3xl font-black text-amber-950 block">
                {orderStats.pending + orderStats.confirmed + orderStats.packaging + orderStats.outForDelivery}
              </span>
              <p className="text-[11px] text-forest-700/70">Pending &amp; In-transit</p>
            </Card>

            <Card className="p-5 bg-white space-y-2 border-l-4 border-rose-500">
              <span className="text-xs font-bold text-forest-700 uppercase">Low Stock Alerts</span>
              <span className="text-2xl sm:text-3xl font-black text-rose-950 block">
                {products.filter((p) => p.stockQuantity <= 5).length}
              </span>
              <p className="text-[11px] text-forest-700/70">Items needing mandi restocking</p>
            </Card>
          </div>

          {/* Low Stock Warning Table */}
          <Card className="p-6 bg-white border border-cream-300 space-y-4">
            <h3 className="font-extrabold text-base text-forest-950 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" />
              <span>Low Stock &amp; Restocking Needs</span>
            </h3>

            <div className="divide-y divide-cream-200 border border-cream-200 rounded-2xl overflow-hidden text-xs">
              {products
                .filter((p) => p.stockQuantity <= 5)
                .map((p) => (
                  <div key={p.id} className="p-3 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-forest-950 block">{p.name}</span>
                      <span className="text-[11px] text-forest-700/70">{p.unit} • {p.category}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-rose-700">
                        Only {p.stockQuantity} unit(s) left
                      </span>
                      <button
                        type="button"
                        onClick={() => updateProductStockQuantity(p.id, p.stockQuantity + 20)}
                        className="px-2.5 py-1 bg-lime-brand/30 hover:bg-lime-brand text-forest-950 font-bold rounded-lg text-xs cursor-pointer"
                      >
                        +20 Restock
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </Card>
        </div>
      )}

      {/* 7. ADD / EDIT PRODUCT MODAL */}
      {isAddProductModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-forest-xl border border-cream-300 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-cream-200 pb-3">
              <h3 className="font-black text-lg text-forest-950">
                {editingProduct ? 'Edit Product Details' : 'Add New Product to Catalog'}
              </h3>
              <button
                type="button"
                onClick={() => setIsAddProductModalOpen(false)}
                className="p-1 rounded-xl text-forest-700 hover:bg-cream-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProductSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-forest-950 mb-1">Product Name (English)</label>
                  <input
                    type="text"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    placeholder="e.g. Tapal Danedar Tea"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-950 mb-1">Urdu Name (اردو نام)</label>
                  <input
                    type="text"
                    value={productForm.urduName}
                    onChange={(e) => setProductForm({ ...productForm, urduName: e.target.value })}
                    placeholder="e.g. تپال دانہ دار چائے"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-urdu font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-950 mb-1">Aisle Category</label>
                  <select
                    value={productForm.category}
                    onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20 cursor-pointer"
                  >
                    <option value="staples">Flour &amp; Grains (آٹا و اناج)</option>
                    <option value="pulses">Rice &amp; Pulses (دالیں و چاول)</option>
                    <option value="cooking">Ghee &amp; Oil (گھی و تیل)</option>
                    <option value="spices">Spices &amp; Masalay (مصالحہ جات)</option>
                    <option value="beverages">Tea, Sugar &amp; Dairy (چائے و چینی)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-forest-950 mb-1">Packaging Unit</label>
                  <input
                    type="text"
                    value={productForm.unit}
                    onChange={(e) => setProductForm({ ...productForm, unit: e.target.value })}
                    placeholder="e.g. 1 kg pack, 950g, 10 kg bag"
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-950 mb-1">Price in PKR (روپے)</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: Number(e.target.value) })}
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-mono font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-forest-950 mb-1">Stock Quantity</label>
                  <input
                    type="number"
                    min={0}
                    value={productForm.stockQuantity}
                    onChange={(e) =>
                      setProductForm({ ...productForm, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-mono font-bold text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-forest-950 mb-1">Special Badge (optional)</label>
                <input
                  type="text"
                  value={productForm.badge}
                  onChange={(e) => setProductForm({ ...productForm, badge: e.target.value })}
                  placeholder="e.g. Best Seller, Pure Desi, Fresh Stock"
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                />
              </div>

              <div>
                <label className="block font-bold text-forest-950 mb-1">Product Description</label>
                <textarea
                  rows={2}
                  value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Brief quality details about this item..."
                  className="w-full p-2.5 bg-cream-50 border border-cream-300 rounded-xl font-medium text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-cream-200">
                <Button variant="outline" size="sm" onClick={() => setIsAddProductModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="forest" size="sm">
                  {editingProduct ? 'Save Changes' : 'Add to Store'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 8. PRINTABLE ORDER SUMMARY MODAL */}
      <PrintableOrderSummary
        order={activePrintOrder}
        isOpen={Boolean(activePrintOrder)}
        onClose={() => setActivePrintOrder(null)}
      />
    </div>
  )
}
