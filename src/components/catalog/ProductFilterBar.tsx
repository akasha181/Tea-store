import React from 'react'
import { CATEGORIES, STORE_INFO } from '../../data/products'
import type { StockFilter, SortOption } from '../../types'
import {
  Search,
  X,
  ArrowUpDown,
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  SlidersHorizontal,
} from 'lucide-react'

export interface ProductFilterBarProps {
  searchQuery: string
  selectedCategory: string
  stockFilter: StockFilter
  sortOption: SortOption
  totalCount: number
  filteredCount: number
  isOwnerMode: boolean
  onSearchChange: (query: string) => void
  onCategoryChange: (category: string) => void
  onStockFilterChange: (filter: StockFilter) => void
  onSortOptionChange: (option: SortOption) => void
  onResetFilters: () => void
  onToggleOwnerMode: () => void
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchQuery,
  selectedCategory,
  stockFilter,
  sortOption,
  totalCount,
  filteredCount,
  isOwnerMode,
  onSearchChange,
  onCategoryChange,
  onStockFilterChange,
  onSortOptionChange,
  onResetFilters,
  onToggleOwnerMode,
}) => {
  const hasActiveFilters =
    Boolean(searchQuery) ||
    selectedCategory !== 'all' ||
    stockFilter !== 'all' ||
    sortOption !== 'default'

  return (
    <div className="space-y-4">
      {/* 1. Official Sample Price Disclaimer Banner */}
      <div className="bg-amber-50 border border-amber-200 rounded-2xl p-3.5 sm:p-4 text-xs text-amber-900 flex items-start gap-3 shadow-2xs">
        <div className="p-1.5 bg-amber-200 text-amber-900 rounded-lg shrink-0 mt-0.5">
          <AlertTriangle className="w-4 h-4" />
        </div>
        <div className="flex-1 space-y-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h4 className="font-bold text-amber-950 text-xs sm:text-sm">
              Sample Market Pricing Notice (عارضی اور تصدیقی نرخ)
            </h4>
            <span className="text-[11px] font-semibold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
              {STORE_INFO.address}
            </span>
          </div>
          <p className="text-amber-900/80 leading-relaxed text-[11px] sm:text-xs">
            {STORE_INFO.samplePriceDisclaimer}
          </p>
        </div>
      </div>

      {/* 2. Main Filter Header & Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-cream-300 shadow-forest-sm space-y-4">
        {/* Search Bar + Controls Top Row */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Functional Search Input */}
          <div className="relative flex-1 max-w-lg">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search by name, urdu, unit, or ingredient (آٹا، چاول، گھی)..."
              className="w-full pl-10 pr-10 py-2.5 text-xs sm:text-sm bg-cream-50/70 border border-cream-300 rounded-xl text-forest-950 placeholder:text-forest-900/40 focus:bg-white focus:border-forest-600 focus:outline-none focus:ring-2 focus:ring-forest-600/20 transition-all"
            />
            <Search className="w-4 h-4 text-forest-700/60 absolute left-3.5 top-3" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-2.5 text-forest-700/50 hover:text-forest-950 p-1 rounded-md"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Sort & Stock Filters */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 bg-cream-100 border border-cream-300 px-2.5 py-1.5 rounded-xl text-xs text-forest-900">
              <ArrowUpDown className="w-3.5 h-3.5 text-forest-700 shrink-0" />
              <select
                value={sortOption}
                onChange={(e) => onSortOptionChange(e.target.value as SortOption)}
                className="bg-transparent border-none text-xs font-semibold focus:outline-none cursor-pointer text-forest-900 pr-1"
              >
                <option value="default">Default Sort</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating-desc">Highest Rated</option>
                <option value="name-asc">Name: A to Z</option>
              </select>
            </div>

            {/* Owner Editable Mode Toggle */}
            <button
              type="button"
              onClick={onToggleOwnerMode}
              className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-xl border transition-colors cursor-pointer ${
                isOwnerMode
                  ? 'bg-forest-800 text-lime-brand border-forest-700 font-bold'
                  : 'bg-cream-100 text-forest-800 border-cream-300 hover:bg-cream-200'
              }`}
              title="Toggle Owner Quick-Edit Mode to adjust stock and prices"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>{isOwnerMode ? 'Edit Mode ON' : 'Owner Edit'}</span>
            </button>
          </div>
        </div>

        {/* Category Aisles Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onCategoryChange(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-forest-700 text-white shadow-2xs'
                    : 'bg-cream-100 text-forest-800 hover:bg-cream-200 border border-cream-300'
                }`}
              >
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-cream-200 text-forest-700'
                  }`}
                >
                  {cat.itemCount}
                </span>
              </button>
            )
          })}
        </div>

        {/* Stock Filter & Active Counts Bottom Strip */}
        <div className="pt-3 border-t border-cream-200 flex flex-wrap items-center justify-between gap-2 text-xs">
          {/* Stock Filter Pills */}
          <div className="flex items-center gap-1.5">
            <span className="text-forest-700 font-medium mr-1">Stock Status:</span>
            <button
              type="button"
              onClick={() => onStockFilterChange('all')}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'all'
                  ? 'bg-forest-700 text-white font-bold'
                  : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
              }`}
            >
              All Items
            </button>

            <button
              type="button"
              onClick={() => onStockFilterChange('in-stock')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'in-stock'
                  ? 'bg-forest-700 text-white font-bold'
                  : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
              }`}
            >
              <CheckCircle2 className="w-3 h-3 text-lime-dark" />
              <span>In Stock Only</span>
            </button>

            <button
              type="button"
              onClick={() => onStockFilterChange('out-of-stock')}
              className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                stockFilter === 'out-of-stock'
                  ? 'bg-rose-700 text-white font-bold'
                  : 'bg-cream-100 text-forest-800 hover:bg-cream-200'
              }`}
            >
              <XCircle className="w-3 h-3 text-rose-500" />
              <span>Out of Stock</span>
            </button>
          </div>

          {/* Results Counter & Reset */}
          <div className="flex items-center gap-3">
            <span className="text-forest-700/80">
              Showing <strong>{filteredCount}</strong> of {totalCount} items
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={onResetFilters}
                className="inline-flex items-center gap-1 text-forest-700 hover:text-rose-600 font-semibold cursor-pointer underline text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
