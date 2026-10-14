import type { CustomerDetails, OrderRecord, OrderStatus, StoreInfo } from '../types'
import { STORE_INFO } from '../data/products'

const CUSTOMER_INFO_STORAGE_KEY = 'hafiz_jee_customer_info_v1'
const ORDER_HISTORY_STORAGE_KEY = 'hafiz_jee_order_history_v1'
const STORE_SETTINGS_STORAGE_KEY = 'hafiz_g_store_settings_v3'

export const DEFAULT_CUSTOMER_DETAILS: CustomerDetails = {
  fullName: '',
  phoneNumber: '',
  deliveryMethod: 'delivery',
  address: '',
  area: 'Civil Bazar / K-152, Attock City',
  notes: '',
  paymentMethod: 'easypaisa',
  saveDetails: true,
}

/**
 * Safely loads customer information from localStorage
 */
export function loadSavedCustomerDetails(): CustomerDetails {
  if (typeof window === 'undefined') return DEFAULT_CUSTOMER_DETAILS
  try {
    const raw = localStorage.getItem(CUSTOMER_INFO_STORAGE_KEY)
    if (!raw) return DEFAULT_CUSTOMER_DETAILS
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return DEFAULT_CUSTOMER_DETAILS

    return {
      fullName: typeof parsed.fullName === 'string' ? parsed.fullName : '',
      phoneNumber: typeof parsed.phoneNumber === 'string' ? parsed.phoneNumber : '',
      deliveryMethod: parsed.deliveryMethod === 'pickup' ? 'pickup' : 'delivery',
      address: typeof parsed.address === 'string' ? parsed.address : '',
      area: typeof parsed.area === 'string' ? parsed.area : 'Civil Bazar / K-152, Attock City',
      notes: typeof parsed.notes === 'string' ? parsed.notes : '',
      paymentMethod:
        parsed.paymentMethod === 'jazzcash' ? 'jazzcash' : 'easypaisa',
      saveDetails: typeof parsed.saveDetails === 'boolean' ? parsed.saveDetails : true,
    }
  } catch {
    return DEFAULT_CUSTOMER_DETAILS
  }
}

/**
 * Safely saves customer information to localStorage
 */
export function saveCustomerDetails(details: CustomerDetails): void {
  if (typeof window === 'undefined') return
  try {
    if (details.saveDetails) {
      localStorage.setItem(CUSTOMER_INFO_STORAGE_KEY, JSON.stringify(details))
    } else {
      localStorage.removeItem(CUSTOMER_INFO_STORAGE_KEY)
    }
  } catch {
    // Gracefully ignore storage quota errors
  }
}

/**
 * Generates unique readable order ID (e.g. HJK-26-8492)
 */
export function generateOrderId(): string {
  const yearSuffix = new Date().getFullYear().toString().slice(-2)
  const randomNum = Math.floor(1000 + Math.random() * 9000)
  return `HJK-${yearSuffix}-${randomNum}`
}

/**
 * Normalizes an order record's status for safety
 */
function normalizeStatus(rawStatus: any): OrderStatus {
  if (rawStatus === 'confirmed') return 'confirmed'
  if (rawStatus === 'completed') return 'completed'
  if (rawStatus === 'cancelled') return 'cancelled'
  return 'pending'
}

/**
 * Loads all orders from local history (sorted newest first)
 */
export function loadOrderHistory(): OrderRecord[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(ORDER_HISTORY_STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []

    return parsed
      .map((item: any) => ({
        ...item,
        status: normalizeStatus(item.status),
      }))
      .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
  } catch {
    return []
  }
}

/**
 * Retrieves a single order by its ID
 */
export function getOrderById(orderId: string): OrderRecord | null {
  const orders = loadOrderHistory()
  return orders.find((o) => o.orderId.toLowerCase() === orderId.toLowerCase().trim()) || null
}

/**
 * Saves placed order to local history safely
 */
export function saveOrderToHistory(order: OrderRecord): void {
  if (typeof window === 'undefined') return
  try {
    const existing = loadOrderHistory()
    // Avoid duplicate insertions
    const filtered = existing.filter((o) => o.orderId !== order.orderId)
    const updated = [order, ...filtered].slice(0, 50) // Keep up to 50 recent orders
    localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('hafiz_new_order_placed', { detail: order }))
  } catch {
    // Ignore storage quota errors
  }
}

/**
 * Allows the store owner to update an order's status and optional notes
 */
export function updateOrderStatus(
  orderId: string,
  newStatus: OrderStatus,
  ownerNotes?: string
): boolean {
  if (typeof window === 'undefined') return false
  try {
    const orders = loadOrderHistory()
    const index = orders.findIndex((o) => o.orderId === orderId)
    if (index === -1) return false

    orders[index] = {
      ...orders[index],
      status: newStatus,
      updatedAt: Date.now(),
      ownerNotes: ownerNotes !== undefined ? ownerNotes : orders[index].ownerNotes,
    }

    localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(orders))
    window.dispatchEvent(
      new CustomEvent('hafiz_order_status_changed', {
        detail: { orderId, newStatus, ownerNotes },
      })
    )
    return true
  } catch {
    return false
  }
}

/**
 * Deletes an order from local storage
 */
export function deleteOrderFromHistory(orderId: string): boolean {
  if (typeof window === 'undefined') return false
  try {
    const orders = loadOrderHistory()
    const filtered = orders.filter((o) => o.orderId !== orderId)
    localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(filtered))
    return true
  } catch {
    return false
  }
}

/**
 * Clears all order history
 */
export function clearOrderHistory(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(ORDER_HISTORY_STORAGE_KEY)
  } catch {
    // Ignore
  }
}

/**
 * Seeds initial demo orders so store owners have immediate data to inspect
 */
export function seedSampleOrdersIfEmpty(): OrderRecord[] {
  const current = loadOrderHistory()
  if (current.length > 0) return current

  const sampleOrders: OrderRecord[] = [
    {
      orderId: 'HJK-26-8192',
      date: '14 Oct 2026',
      timestamp: Date.now() - 1000 * 60 * 25, // 25 mins ago
      customer: {
        fullName: 'Haji Muhammad Farooq',
        phoneNumber: '0300-5551234',
        deliveryMethod: 'delivery',
        address: 'House # 12, Street 3, Civil Bazar, Attock City',
        area: 'Civil Bazar / K-152, Attock City',
        notes: 'Please pack atta in strong bag. Payment ready.',
        paymentMethod: 'easypaisa',
      },
      items: [
        {
          product: {
            id: 'wheat-chakki-atta-10kg',
            name: 'Chakki Desi Atta (تازہ دیسی چکی آٹا)',
            urduName: 'دیسی چکی آٹا',
            category: 'staples',
            unit: '10 kg bag',
            price: 1450,
            inStock: true,
            stockQuantity: 25,
          },
          quantity: 2,
        },
        {
          product: {
            id: 'dal-daal-chana-1kg',
            name: 'Daal Chana Special (دال چنا)',
            urduName: 'دال چنا',
            category: 'pulses',
            unit: '1 kg pack',
            price: 260,
            inStock: true,
            stockQuantity: 18,
          },
          quantity: 1,
        },
      ],
      subtotal: 3160,
      deliveryFee: 200,
      totalAmount: 3360,
      isFreeDelivery: false,
      status: 'pending',
      whatsappLink: 'https://wa.me/923121971001',
      ownerNotes: 'Rider assigned: Imran',
    },
    {
      orderId: 'HJK-26-7450',
      date: '13 Oct 2026',
      timestamp: Date.now() - 1000 * 60 * 180, // 3 hours ago
      customer: {
        fullName: 'Zainab Bibi',
        phoneNumber: '0312-9876543',
        deliveryMethod: 'pickup',
        address: 'Civil Bazar K-152, Attock City Counter',
        area: 'Civil Bazar / K-152, Attock City',
        notes: 'Will pick up after Asr prayer.',
        paymentMethod: 'jazzcash',
      },
      items: [
        {
          product: {
            id: 'basmati-super-kernel-rice-5kg',
            name: 'Super Kernel Basmati Rice (سپر باسمتی چاول)',
            urduName: 'سپر باسمتی چاول',
            category: 'pulses',
            unit: '5 kg bag',
            price: 1850,
            inStock: true,
            stockQuantity: 15,
          },
          quantity: 1,
        },
        {
          product: {
            id: 'banaspati-ghee-dalda-5kg',
            name: 'Dalda Banaspati Ghee (ڈالڈا گھی)',
            urduName: 'ڈالڈا گھی',
            category: 'cooking',
            unit: '5 kg tin',
            price: 2750,
            inStock: true,
            stockQuantity: 10,
          },
          quantity: 1,
        },
      ],
      subtotal: 4600,
      deliveryFee: 0,
      totalAmount: 4600,
      isFreeDelivery: true,
      status: 'confirmed',
      whatsappLink: 'https://wa.me/923121971001',
      ownerNotes: 'Packed and kept at counter A-2',
    },
    {
      orderId: 'HJK-26-6211',
      date: '12 Oct 2026',
      timestamp: Date.now() - 1000 * 60 * 1440, // 1 day ago
      customer: {
        fullName: 'Chaudhry Kamran',
        phoneNumber: '0333-8884321',
        deliveryMethod: 'delivery',
        address: 'Plaza 4, Main Saddar Road, Rawalpindi',
        area: 'Saddar / Cantt',
        notes: 'Delivered successfully.',
        paymentMethod: 'easypaisa',
      },
      items: [
        {
          product: {
            id: 'tapal-danedar-tea-950g',
            name: 'Tapal Danedar Black Tea (تپال دانہ دار چائے)',
            urduName: 'تپال دانہ دار چائے',
            category: 'beverages',
            unit: '950g family pack',
            price: 1650,
            inStock: true,
            stockQuantity: 12,
          },
          quantity: 1,
        },
        {
          product: {
            id: 'fine-white-sugar-5kg',
            name: 'Refined White Sugar (خالص سفید چینی)',
            urduName: 'سفید چینی',
            category: 'beverages',
            unit: '5 kg pack',
            price: 750,
            inStock: true,
            stockQuantity: 20,
          },
          quantity: 2,
        },
      ],
      subtotal: 3150,
      deliveryFee: 200,
      totalAmount: 3350,
      isFreeDelivery: false,
      status: 'completed',
      whatsappLink: 'https://wa.me/923121971001',
      ownerNotes: 'Payment received in cash. Order closed.',
    },
  ]

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ORDER_HISTORY_STORAGE_KEY, JSON.stringify(sampleOrders))
    } catch {
      // Ignore
    }
  }

  return sampleOrders
}

/**
 * Loads editable store settings from localStorage, falling back to STORE_INFO
 */
export function loadStoreSettings(): StoreInfo {
  if (typeof window === 'undefined') return STORE_INFO
  try {
    const raw = localStorage.getItem(STORE_SETTINGS_STORAGE_KEY)
    if (!raw) return STORE_INFO
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return STORE_INFO
    const merged: StoreInfo = {
      ...STORE_INFO,
      ...parsed,
    }
    if (merged.whatsapp === '923001234567') {
      merged.whatsapp = STORE_INFO.whatsapp
    }
    if (merged.phone === '0300-1234567') {
      merged.phone = STORE_INFO.phone
    }
    if (!merged.address || merged.address.includes('G Civil Bazaar')) {
      merged.address = STORE_INFO.address
    }
    return merged
  } catch {
    return STORE_INFO
  }
}

/**
 * Saves store settings and dispatches notification event
 */
export function saveStoreSettings(settings: StoreInfo): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORE_SETTINGS_STORAGE_KEY, JSON.stringify(settings))
    window.dispatchEvent(
      new CustomEvent('hafiz_store_settings_updated', { detail: settings })
    )
  } catch {
    // Ignore quota errors
  }
}

/**
 * Resets store settings to original defaults
 */
export function resetStoreSettings(): StoreInfo {
  if (typeof window !== 'undefined') {
    try {
      localStorage.removeItem(STORE_SETTINGS_STORAGE_KEY)
      window.dispatchEvent(
        new CustomEvent('hafiz_store_settings_updated', { detail: STORE_INFO })
      )
    } catch {
      // Ignore
    }
  }
  return STORE_INFO
}
