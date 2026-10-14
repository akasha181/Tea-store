import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { CATEGORIES } from '../../data/products'
import {
  Wheat,
  UtensilsCrossed,
  Droplet,
  Flame,
  Coffee,
  ShoppingBag,
  ArrowRight,
  Sparkles,
} from 'lucide-react'

interface CategoryCardsSectionProps {
  selectedCategory: string
  onSelectCategory: (categoryId: string) => void
}

const getCategoryIcon = (id: string) => {
  switch (id) {
    case 'staples':
      return <Wheat className="w-6 h-6 text-amber-700" />
    case 'pulses':
      return <UtensilsCrossed className="w-6 h-6 text-emerald-700" />
    case 'cooking':
      return <Droplet className="w-6 h-6 text-lime-dark" />
    case 'spices':
      return <Flame className="w-6 h-6 text-rose-700" />
    case 'beverages':
      return <Coffee className="w-6 h-6 text-teal-700" />
    default:
      return <ShoppingBag className="w-6 h-6 text-forest-700" />
  }
}

export const CategoryCardsSection: React.FC<CategoryCardsSectionProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const handleCardClick = (catId: string) => {
    onSelectCategory(catId)
    const productGrid = document.getElementById('products-section')
    if (productGrid) {
      productGrid.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section id="categories-section" className="space-y-5 scroll-mt-24">
      {/* Section Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-cream-300 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-lime-dark" />
            <span>Curated Sections • شعبہ جات</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-950 tracking-tight mt-1">
            Explore Store Aisles
          </h2>
          <p className="text-xs sm:text-sm text-forest-700/70">
            Click any aisle to view certified fresh stock and current mandi prices.
          </p>
        </div>

        <div className="text-xs text-forest-700/80 font-medium">
          Showing <strong>{CATEGORIES.length}</strong> core categories
        </div>
      </div>

      {/* Grid of 3D Animated Category Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CATEGORIES.map((category) => {
          const isSelected = selectedCategory === category.id

          return (
            <Card
              key={category.id}
              variant={isSelected ? 'cream' : 'white'}
              interactive
              onClick={() => handleCardClick(category.id)}
              className={`p-5 relative overflow-hidden transition-all duration-300 cursor-pointer group ${
                isSelected
                  ? 'ring-2 ring-forest-700 shadow-forest-lg border-forest-600'
                  : 'hover:border-forest-600/50'
              }`}
            >
              {/* Background Accent Sheen */}
              <div
                className={`absolute -right-8 -top-8 w-24 h-24 rounded-full transition-opacity duration-300 pointer-events-none blur-xl ${
                  isSelected
                    ? 'bg-lime-brand/25 opacity-100'
                    : 'bg-cream-300/40 opacity-50 group-hover:opacity-90'
                }`}
              />

              <div className="relative z-10 flex items-start justify-between gap-3">
                <div
                  className={`p-3 rounded-2xl transition-colors duration-200 ${
                    isSelected
                      ? 'bg-forest-700 text-white shadow-forest-sm'
                      : 'bg-cream-100 text-forest-800 group-hover:bg-forest-100'
                  }`}
                >
                  {getCategoryIcon(category.id)}
                </div>

                <Badge
                  variant={isSelected ? 'forest' : 'cream'}
                  size="sm"
                  className="font-bold"
                >
                  {category.itemCount} items
                </Badge>
              </div>

              {/* Title & Urdu */}
              <div className="mt-4 space-y-1 relative z-10">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-base sm:text-lg text-forest-950 group-hover:text-forest-700 transition-colors">
                    {category.name}
                  </h3>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-lime-brand ring-2 ring-forest-700" />
                  )}
                </div>

                <p className="font-urdu text-xs text-forest-800 font-semibold">
                  {category.urduName}
                </p>

                <p className="text-xs text-forest-700/75 leading-relaxed pt-1 line-clamp-2">
                  {category.descriptionEn}
                </p>
              </div>

              {/* Bottom Card Action */}
              <div className="mt-4 pt-3 border-t border-cream-200/80 flex items-center justify-between text-xs font-semibold text-forest-800 relative z-10">
                <span className="text-[11px] text-forest-600 group-hover:text-forest-900 transition-colors">
                  {isSelected ? 'Currently Viewing' : 'View Products'}
                </span>
                <span className="inline-flex items-center gap-1 text-forest-700 group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0 transition-transform">
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </Card>
          )
        })}
      </div>
    </section>
  )
}
