import { createContext } from 'react'
import type { Product } from '../types'

export interface ProductCatalogContextType {
  products: Product[]
  updateProductPrice: (id: string, newPrice: number) => void
  toggleProductStock: (id: string) => void
  updateProductStockQuantity: (id: string, newQuantity: number) => void
  resetToDefaultCatalog: () => void
}

export const ProductCatalogContext = createContext<ProductCatalogContextType | undefined>(undefined)
