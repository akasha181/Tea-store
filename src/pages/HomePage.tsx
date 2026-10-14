import React from 'react'
import { Hero3DSection } from '../components/home/Hero3DSection'
import { CategoryCardsSection } from '../components/home/CategoryCardsSection'
import { FeaturedProductsSection } from '../components/home/FeaturedProductsSection'
import { PromotionalSection } from '../components/home/PromotionalSection'
import type { Product } from '../types'

export interface HomePageProps {
  onAddToCart: (product: Product) => void
  searchQuery?: string
  selectedCategory?: string
  onSearchChange?: (query: string) => void
  onCategorySelect?: (categoryId: string) => void
}

export const HomePage: React.FC<HomePageProps> = ({
  onAddToCart,
  searchQuery = '',
  selectedCategory = 'all',
  onSearchChange,
  onCategorySelect,
}) => {
  return (
    <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12 sm:space-y-16">
      {/* 1. 3D Grocery Hero Section */}
      <Hero3DSection
        onExploreClick={() => {
          const el = document.getElementById('categories-section')
          if (el) el.scrollIntoView({ behavior: 'smooth' })
        }}
      />

      {/* 2. Configurable Promotional & Household Packages */}
      <PromotionalSection />

      {/* 3. 3D Animated Category Cards Linked to Product Catalog */}
      <CategoryCardsSection
        selectedCategory={selectedCategory}
        onSelectCategory={(catId) => onCategorySelect?.(catId)}
      />

      {/* 4. Premium Featured Products Catalog */}
      <FeaturedProductsSection
        onAddToCart={onAddToCart}
        searchQuery={searchQuery}
        selectedCategory={selectedCategory}
        onSearchChange={onSearchChange || (() => {})}
        onCategoryChange={(catId) => onCategorySelect?.(catId)}
      />
    </div>
  )
}
