import React, { useState, useMemo } from 'react'
import { useProductCatalog } from '../../context/useProductCatalog'
import { ProductCard } from '../catalog/ProductCard'
import { ProductFilterBar } from '../catalog/ProductFilterBar'
import { ProductDetailsModal } from '../catalog/ProductDetailsModal'
import type { Product, StockFilter, SortOption } from '../../types'

export interface FeaturedProductsSectionProps {
  onAddToCart: (product: Product) => void
  searchQuery: string
  selectedCategory: string
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
}

export const FeaturedProductsSection: React.FC<FeaturedProductsSectionProps> = ({
  onAddToCart,
  searchQuery,
  selectedCategory,
  onSearchChange,
  onCategoryChange,
}) => {
  const { products, updateProductPrice, toggleProductStock } = useProductCatalog()

  const [stockFilter, setStockFilter] = useState<StockFilter>('all')
  const [sortOption, setSortOption] = useState<SortOption>('default')
  const [isOwnerMode, setIsOwnerMode] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  // Functional multi-criteria search and filter engine
  const filteredAndSortedProducts = useMemo(() => {
    let result = [...products]

    // 1. Category Filter
    if (selectedCategory !== 'all') {
      result = result.filter((p) => p.category === selectedCategory)
    }

    // 2. Stock Filter
    if (stockFilter === 'in-stock') {
      result = result.filter((p) => p.inStock && p.stockQuantity > 0)
    } else if (stockFilter === 'out-of-stock') {
      result = result.filter((p) => !p.inStock || p.stockQuantity <= 0)
    }

    // 3. Search Query Filter across name, urduName, category, unit, tags, description
    const q = searchQuery.toLowerCase().trim()
    if (q) {
      result = result.filter((p) => {
        const matchName = p.name.toLowerCase().includes(q)
        const matchUrdu = Boolean(p.urduName && p.urduName.includes(q))
        const matchCategory = p.category.toLowerCase().includes(q)
        const matchUnit = p.unit.toLowerCase().includes(q)
        const matchDesc = Boolean(p.description && p.description.toLowerCase().includes(q))
        const matchTags = Boolean(p.tags && p.tags.some((tag) => tag.toLowerCase().includes(q)))

        return matchName || matchUrdu || matchCategory || matchUnit || matchDesc || matchTags
      })
    }

    // 4. Sorting Engine
    if (sortOption === 'price-asc') {
      result.sort((a, b) => a.price - b.price)
    } else if (sortOption === 'price-desc') {
      result.sort((a, b) => b.price - a.price)
    } else if (sortOption === 'rating-desc') {
      result.sort((a, b) => (b.rating || 0) - (a.rating || 0))
    } else if (sortOption === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name))
    }

    return result
  }, [products, selectedCategory, stockFilter, searchQuery, sortOption])

  const handleResetFilters = () => {
    onSearchChange('')
    onCategoryChange('all')
    setStockFilter('all')
    setSortOption('default')
  }

  return (
    <section id="products-section" className="space-y-6 scroll-mt-24">
      {/* Search, Category, Stock & Sorting Controls */}
      <ProductFilterBar
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        stockFilter={stockFilter}
        sortOption={sortOption}
        totalCount={products.length}
        filteredCount={filteredAndSortedProducts.length}
        isOwnerMode={isOwnerMode}
        onSearchChange={onSearchChange}
        onCategoryChange={onCategoryChange}
        onStockFilterChange={setStockFilter}
        onSortOptionChange={setSortOption}
        onResetFilters={handleResetFilters}
        onToggleOwnerMode={() => setIsOwnerMode(!isOwnerMode)}
      />

      {/* Responsive Products Grid */}
      {filteredAndSortedProducts.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-cream-300 space-y-3 shadow-forest-sm">
          <div className="w-16 h-16 rounded-2xl bg-cream-100 text-forest-700 flex items-center justify-center mx-auto text-2xl font-bold">
            🔍
          </div>
          <h3 className="font-extrabold text-forest-950 text-lg">No Products Found</h3>
          <p className="text-xs sm:text-sm text-forest-700/70 max-w-md mx-auto leading-relaxed">
            No items matched your search criteria. Try modifying your search keywords or resetting filters.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleResetFilters}
              className="px-4 py-2 bg-forest-700 hover:bg-forest-800 text-white rounded-xl text-xs font-semibold cursor-pointer shadow-2xs"
            >
              Reset All Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              onOpenDetails={setSelectedProduct}
              onUpdatePrice={updateProductPrice}
              onToggleStock={toggleProductStock}
              isOwnerMode={isOwnerMode}
            />
          ))}
        </div>
      )}

      {/* Product Details Modal Dialog */}
      <ProductDetailsModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={onAddToCart}
      />
    </section>
  )
}
