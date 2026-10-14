import React, { useState, useEffect, useCallback, useMemo } from 'react'
import { CartContext } from './cartContextDefinition'
import { useProductCatalog } from './useProductCatalog'
import type { CartItem, CartNotification, Product } from '../types'

const CART_STORAGE_KEY = 'hafiz_jee_cart_storage_v1'
const STANDARD_DELIVERY_FEE = 200

interface RawCartEntry {
  productId: string
  quantity: number
}

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { products } = useProductCatalog()

  // Helper to load raw cart entries from localStorage safely
  const loadInitialRawCart = (): RawCartEntry[] => {
    if (typeof window === 'undefined') return []
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY)
      if (!stored) return []
      const parsed = JSON.parse(stored)
      if (!Array.isArray(parsed)) return []

      const result: RawCartEntry[] = []
      parsed.forEach((item: any) => {
        if (!item) return
        const productId =
          typeof item.productId === 'string'
            ? item.productId
            : item.product && typeof item.product.id === 'string'
              ? item.product.id
              : null

        if (!productId) return
        const qty = typeof item.quantity === 'number' && item.quantity > 0 ? item.quantity : 1
        result.push({ productId, quantity: qty })
      })
      return result
    } catch {
      return []
    }
  }

  const [rawEntries, setRawEntries] = useState<RawCartEntry[]>(loadInitialRawCart)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [notification, setNotification] = useState<CartNotification | null>(null)

  // Show user notification with auto-dismiss
  const showNotification = useCallback((message: string, type: CartNotification['type'] = 'info') => {
    const notif: CartNotification = {
      id: Date.now().toString(),
      message,
      type,
      timestamp: Date.now(),
    }
    setNotification(notif)
  }, [])

  const dismissNotification = useCallback(() => {
    setNotification(null)
  }, [])

  useEffect(() => {
    if (!notification) return
    const timer = setTimeout(() => {
      setNotification((curr) => (curr?.id === notification.id ? null : curr))
    }, 3500)
    return () => clearTimeout(timer)
  }, [notification])

  // Derive validated, active cart items directly from product catalog and rawEntries
  const items: CartItem[] = useMemo(() => {
    const result: CartItem[] = []
    rawEntries.forEach((entry) => {
      const catalogItem = products.find((p) => p.id === entry.productId)
      if (!catalogItem || !catalogItem.inStock || catalogItem.stockQuantity <= 0) {
        return // Ignore missing or out-of-stock items
      }
      const clampedQty = Math.min(entry.quantity, catalogItem.stockQuantity)
      if (clampedQty > 0) {
        result.push({
          product: catalogItem,
          quantity: clampedQty,
        })
      }
    })
    return result
  }, [rawEntries, products])

  // Persist raw entries to localStorage safely
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(rawEntries))
    } catch {
      // Ignore quota exceeded or private mode errors
    }
  }, [rawEntries])

  // Core Calculations
  const { totalCount, uniqueCount, subtotal } = useMemo(() => {
    let count = 0
    let sum = 0
    items.forEach((item) => {
      count += item.quantity
      sum += item.product.price * item.quantity
    })
    return {
      totalCount: count,
      uniqueCount: items.length,
      subtotal: sum,
    }
  }, [items])

  const isFreeDelivery = false
  const deliveryFee = subtotal === 0 ? 0 : STANDARD_DELIVERY_FEE
  const totalAmount = subtotal + deliveryFee
  const amountNeededForFreeDelivery = 0

  // Add Product to Cart with Strict Stock Validation
  const addToCart = useCallback(
    (product: Product, quantityToAdd = 1): boolean => {
      // 1. Strict guard: cannot add out-of-stock product
      if (!product.inStock || product.stockQuantity <= 0) {
        showNotification(
          `Cannot add "${product.name}": item is currently out of stock.`,
          'error'
        )
        return false
      }

      let success = true

      setRawEntries((prev) => {
        const existing = prev.find((entry) => entry.productId === product.id)
        const currentInCart = existing ? existing.quantity : 0
        const proposedTotal = currentInCart + quantityToAdd

        if (proposedTotal > product.stockQuantity) {
          const allowedAdd = product.stockQuantity - currentInCart
          if (allowedAdd <= 0) {
            showNotification(
              `Maximum stock reached: You already have all ${product.stockQuantity} available units of "${product.name}" in your basket.`,
              'warning'
            )
            success = false
            return prev
          }

          showNotification(
            `Added ${allowedAdd} unit(s). Stock limit reached for "${product.name}" (${product.stockQuantity} available).`,
            'warning'
          )
          return prev.map((entry) =>
            entry.productId === product.id
              ? { ...entry, quantity: product.stockQuantity }
              : entry
          )
        }

        showNotification(
          `Added "${product.name}" (${product.unit}) to basket!`,
          'success'
        )

        if (existing) {
          return prev.map((entry) =>
            entry.productId === product.id
              ? { ...entry, quantity: proposedTotal }
              : entry
          )
        }

        return [...prev, { productId: product.id, quantity: quantityToAdd }]
      })

      return success
    },
    [showNotification]
  )

  // Increment item quantity with stock limit check
  const incrementQuantity = useCallback(
    (productId: string): boolean => {
      const catalogItem = products.find((p) => p.id === productId)
      if (!catalogItem) return false
      let success = true

      setRawEntries((prev) =>
        prev.map((entry) => {
          if (entry.productId !== productId) return entry
          const maxAllowed = catalogItem.stockQuantity

          if (entry.quantity >= maxAllowed) {
            showNotification(
              `Cannot add more: only ${maxAllowed} units of "${catalogItem.name}" in stock.`,
              'warning'
            )
            success = false
            return entry
          }

          return { ...entry, quantity: entry.quantity + 1 }
        })
      )
      return success
    },
    [products, showNotification]
  )

  // Decrement item quantity (removes if reaches 0)
  const decrementQuantity = useCallback((productId: string) => {
    setRawEntries((prev) =>
      prev
        .map((entry) => {
          if (entry.productId !== productId) return entry
          return { ...entry, quantity: entry.quantity - 1 }
        })
        .filter((entry) => entry.quantity > 0)
    )
  }, [])

  // Set specific quantity with clamp
  const setQuantity = useCallback(
    (productId: string, rawQuantity: number) => {
      const catalogItem = products.find((p) => p.id === productId)
      if (!catalogItem) return

      if (rawQuantity <= 0) {
        setRawEntries((prev) => prev.filter((entry) => entry.productId !== productId))
        return
      }

      setRawEntries((prev) =>
        prev.map((entry) => {
          if (entry.productId !== productId) return entry
          const maxAllowed = catalogItem.stockQuantity
          const clamped = Math.min(rawQuantity, maxAllowed)

          if (rawQuantity > maxAllowed) {
            showNotification(
              `Adjusted to maximum available stock (${maxAllowed} units).`,
              'warning'
            )
          }

          return { ...entry, quantity: clamped }
        })
      )
    },
    [products, showNotification]
  )

  // Remove single product
  const removeFromCart = useCallback(
    (productId: string) => {
      const catalogItem = products.find((p) => p.id === productId)
      const itemName = catalogItem ? catalogItem.name : 'Item'

      setRawEntries((prev) => {
        const itemExists = prev.some((e) => e.productId === productId)
        if (itemExists) {
          showNotification(`Removed "${itemName}" from your basket.`, 'info')
        }
        return prev.filter((e) => e.productId !== productId)
      })
    },
    [products, showNotification]
  )

  // Clear entire cart
  const clearCart = useCallback(() => {
    setRawEntries([])
    showNotification('Shopping basket cleared.', 'info')
  }, [showNotification])

  const openCart = useCallback(() => setIsCartOpen(true), [])
  const closeCart = useCallback(() => setIsCartOpen(false), [])

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        uniqueCount,
        subtotal,
        deliveryFee,
        totalAmount,
        isFreeDelivery,
        amountNeededForFreeDelivery,
        isCartOpen,
        notification,
        setIsCartOpen,
        openCart,
        closeCart,
        addToCart,
        incrementQuantity,
        decrementQuantity,
        setQuantity,
        removeFromCart,
        clearCart,
        dismissNotification,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
