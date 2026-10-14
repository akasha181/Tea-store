import React, { useState } from 'react'
import { INITIAL_PRODUCTS } from '../data/products'
import type { Product } from '../types'
import { ProductCatalogContext } from './catalogContext'

export const ProductCatalogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS)

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

  const resetToDefaultCatalog = () => {
    setProducts(INITIAL_PRODUCTS)
  }

  return (
    <ProductCatalogContext.Provider
      value={{
        products,
        updateProductPrice,
        toggleProductStock,
        updateProductStockQuantity,
        resetToDefaultCatalog,
      }}
    >
      {children}
    </ProductCatalogContext.Provider>
  )
}
