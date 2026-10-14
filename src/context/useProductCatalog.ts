import { useContext } from 'react'
import { ProductCatalogContext } from './catalogContext'
import type { ProductCatalogContextType } from './catalogContext'

export const useProductCatalog = (): ProductCatalogContextType => {
  const context = useContext(ProductCatalogContext)
  if (!context) {
    throw new Error('useProductCatalog must be used within a ProductCatalogProvider')
  }
  return context
}
