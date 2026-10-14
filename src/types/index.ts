export interface Category {
  id: string
  name: string
  urduName?: string
  description?: string
  icon?: string
}

export interface Product {
  id: string
  name: string
  urduName?: string
  category: string
  unit: string // e.g. "10 kg bag", "1 kg pack", "5 Liter can"
  price: number // Sample Price in PKR
  originalPrice?: number
  inStock: boolean
  stockQuantity: number
  isFeatured?: boolean
  image?: string
  badge?: string
  rating?: number
  reviewsCount?: number
  description?: string
  tags?: string[]
  isSamplePrice?: boolean // Marked as sample until verified by store owner
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface CartNotification {
  id: string
  message: string
  type: 'success' | 'warning' | 'info' | 'error'
  timestamp: number
}

export interface StoreInfo {
  name: string
  urduName: string
  tagline: string
  address: string
  phone: string
  whatsapp: string
  timing: string
  deliveryNotice: string
  samplePriceDisclaimer: string
}

export type StockFilter = 'all' | 'in-stock' | 'out-of-stock'
export type SortOption = 'default' | 'price-asc' | 'price-desc' | 'rating-desc' | 'name-asc'

export type DeliveryMethod = 'delivery' | 'pickup'
export type PaymentMethod = 'cod' | 'jazzcash' | 'easypaisa' | 'bank_transfer'

export interface CustomerDetails {
  fullName: string
  phoneNumber: string
  deliveryMethod: DeliveryMethod
  address: string
  area: string
  notes?: string
  paymentMethod: PaymentMethod
  saveDetails?: boolean
}

export interface PhoneValidationResult {
  isValid: boolean
  formatted: string
  normalized: string
  errorMessage?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled'

export interface OrderRecord {
  orderId: string
  date: string
  timestamp: number
  customer: CustomerDetails
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  totalAmount: number
  isFreeDelivery: boolean
  status: OrderStatus
  whatsappLink: string
  updatedAt?: number
  ownerNotes?: string
}


