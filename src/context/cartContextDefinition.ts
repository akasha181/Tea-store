import { createContext } from 'react'
import type { CartItem, CartNotification, Product } from '../types'

export interface CartContextType {
  items: CartItem[]
  totalCount: number
  uniqueCount: number
  subtotal: number
  deliveryFee: number
  totalAmount: number
  isFreeDelivery: boolean
  amountNeededForFreeDelivery: number
  isCartOpen: boolean
  notification: CartNotification | null
  setIsCartOpen: (open: boolean) => void
  openCart: () => void
  closeCart: () => void
  addToCart: (product: Product, quantity?: number) => boolean
  incrementQuantity: (productId: string) => boolean
  decrementQuantity: (productId: string) => void
  setQuantity: (productId: string, quantity: number) => void
  removeFromCart: (productId: string) => void
  clearCart: () => void
  dismissNotification: () => void
}

export const CartContext = createContext<CartContextType | undefined>(undefined)
