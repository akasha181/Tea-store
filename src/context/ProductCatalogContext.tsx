import React, { useState, useEffect } from 'react'
import { INITIAL_PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { ProductCatalogContext } from './catalogContext'

const CATALOG_STORAGE_KEY = 'hafiz_g_catalog_v6'

function loadSavedCatalog(): Product[] {
  if (typeof window === 'undefined') return INITIAL_PRODUCTS
  try {
    const raw = localStorage.getItem(CATALOG_STORAGE_KEY)
    if (!raw) return INITIAL_PRODUCTS
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((item: Product) => {
        const initialMatch = INITIAL_PRODUCTS.find((p) => p.id === item.id)
        if (initialMatch) {
          return { ...item, image: initialMatch.image }
        }
        return item
      })
    }
    return INITIAL_PRODUCTS
  } catch {
    return INITIAL_PRODUCTS
  }
}

export const ProductCatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(loadSavedCatalog)

  // Persist products to localStorage whenever they change
  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      localStorage.setItem(CATALOG_STORAGE_KEY, JSON.stringify(products))
    } catch {
      // Ignore quota exceeded errors
    }
  }, [products])

  const updateProductPrice = (id: string, newPrice: number) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, price: Math.max(0, newPrice) } : item
      )
    )
  }

  const toggleProductStock = (id: string) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextStock = !item.inStock
          return {
            ...item,
            inStock: nextStock,
            stockQuantity: nextStock ? (item.stockQuantity || 20) : 0,
          }
        }
        return item
      })
    )
  }

  const updateProductStockQuantity = (id: string, newQuantity: number) => {
    setProducts((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const validQty = Math.max(0, newQuantity)
          return {
            ...item,
            stockQuantity: validQty,
            inStock: validQty > 0,
          }
        }
        return item
      })
    )
  }

  const addProduct = (newProdData: Omit<Product, 'id'> & { id?: string }): Product => {
    const id = newProdData.id || `custom-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const product: Product = {
      ...newProdData,
      id,
      inStock: newProdData.inStock !== undefined ? newProdData.inStock : (newProdData.stockQuantity > 0),
    }
    setProducts((prev) => [product, ...prev])
    return product
  }

  const updateProduct = (id: string, updates: Partial<Product>) => {
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    )
  }

  const deleteProduct = (id: string) => {
    setProducts((prev) => prev.filter((item) => item.id !== id))
  }

  const resetToDefaultCatalog = () => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem(CATALOG_STORAGE_KEY)
      } catch {
        // Ignore
      }
    }
    setProducts(INITIAL_PRODUCTS)
  }

  return (
    <ProductCatalogContext.Provider
      value={{
        products,
        updateProductPrice,
        toggleProductStock,
        updateProductStockQuantity,
        addProduct,
        updateProduct,
        deleteProduct,
        resetToDefaultCatalog,
      }}
    >
      {children}
    </ProductCatalogContext.Provider>
  )
}
