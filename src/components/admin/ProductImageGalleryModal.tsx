import React, { useState, useMemo, useRef } from 'react'
import {
  X,
  Search,
  Check,
  Image as ImageIcon,
  Camera,
} from 'lucide-react'
import { Button } from '../ui/Button'

export interface GalleryItem {
  id: string
  name: string
  urduName: string
  category: string
  path: string
}

export const STORE_GALLERY_IMAGES: GalleryItem[] = [
  // 1. Staples & Flours (آٹا و اناج)
  {
    id: 'staples-sunridge-atta',
    name: 'Sunridge Chakki Atta (10kg)',
    urduName: 'سن رج خالص چکی آٹا (10 کلو)',
    category: 'staples',
    path: '/images/products/staples-sunridge-atta-10kg.jpg',
  },
  {
    id: 'staples-desi-atta',
    name: 'Desi Whole Wheat Chakki Atta (20kg)',
    urduName: 'خالص دیسی چکی آٹا بوری (20 کلو)',
    category: 'staples',
    path: '/images/products/staples-desi-chakki-atta-20kg.jpg',
  },
  {
    id: 'staples-fine-maida',
    name: 'Fine Maida Super Patent (1kg)',
    urduName: 'فائن میدہ سپر کوالٹی',
    category: 'staples',
    path: '/images/products/staples-fine-maida-1kg.jpg',
  },
  {
    id: 'staples-pure-suji',
    name: 'Pure Semolina / Suji (1kg)',
    urduName: 'خالص دیسی سوجی موٹا دانہ',
    category: 'staples',
    path: '/images/products/staples-pure-suji-1kg.jpg',
  },
  {
    id: 'staples-wheat-dalia',
    name: 'Special Whole Wheat Dalia (1kg)',
    urduName: 'خالص چکی گندم دلیہ',
    category: 'staples',
    path: '/images/products/staples-wheat-dalia-1kg.jpg',
  },

  // 2. Pulses & Rice (دالیں و چاول)
  {
    id: 'pulses-super-basmati',
    name: 'Super Basmati Kernel Rice (1kg)',
    urduName: 'سپر کائنات باسمتی چاول (پرانا مال)',
    category: 'pulses',
    path: '/images/products/pulses-super-basmati-rice-1kg.jpg',
  },
  {
    id: 'pulses-kainat-saila',
    name: 'Kainat 1121 Golden Sela Rice (1kg)',
    urduName: 'کائنات 1121 گولڈن سیلہ چاول',
    category: 'pulses',
    path: '/images/products/pulses-kainat-saila-rice-1kg.jpg',
  },
  {
    id: 'pulses-daal-chana',
    name: 'Daal Chana Special Desi (1kg)',
    urduName: 'دال چنا موٹی دیسی دال',
    category: 'pulses',
    path: '/images/products/pulses-daal-chana-special-1kg.jpg',
  },
  {
    id: 'pulses-daal-masoor',
    name: 'Daal Masoor Whole Sabut (1kg)',
    urduName: 'دال مسور ثابت کالی مسور',
    category: 'pulses',
    path: '/images/products/pulses-daal-masoor-whole-1kg.jpg',
  },
  {
    id: 'pulses-daal-moong',
    name: 'Daal Moong Washed Dhuli (1kg)',
    urduName: 'دال مونگ دھلی ہوئی صاف شدہ',
    category: 'pulses',
    path: '/images/products/pulses-daal-moong-dhuli-1kg.jpg',
  },
  {
    id: 'pulses-daal-mash',
    name: 'Daal Mash Washed Super (1kg)',
    urduName: 'دال ماش دھلی ہوئی اول نمبر',
    category: 'pulses',
    path: '/images/products/pulses-daal-mash-washed-1kg.jpg',
  },

  // 3. Ghee & Cooking Oil (گھی و کوکنگ آئل)
  {
    id: 'cooking-dalda-ghee',
    name: 'Dalda Banaspati VTF Ghee (1kg)',
    urduName: 'ڈالڈا بناسپتی گھی اصلی',
    category: 'cooking',
    path: '/images/products/cooking-dalda-banaspati-ghee-1kg.jpg',
  },
  {
    id: 'cooking-habib-oil',
    name: 'Habib Pure Cooking Oil (5L Canister)',
    urduName: 'حبیب خالص کوکنگ آئل کنستر (5 لیٹر)',
    category: 'cooking',
    path: '/images/products/cooking-habib-oil-canister-5l.jpg',
  },
  {
    id: 'cooking-mehran-sarson',
    name: 'Pure Desi Mustard Oil / Sarson (1L)',
    urduName: 'خالص کوہلو سرسوں کا تیل',
    category: 'cooking',
    path: '/images/products/cooking-mehran-desi-sarson-oil-1l.jpg',
  },
  {
    id: 'cooking-sufi-sunflower',
    name: 'Sufi Canola / Sunflower Oil (1L)',
    urduName: 'صوفی کینولا / سن فلاور آئل',
    category: 'cooking',
    path: '/images/products/cooking-sufi-sunflower-oil-1l.jpg',
  },

  // 4. Spices & Salts (مصالحہ جات و نمک)
  {
    id: 'spices-national-red-chilli',
    name: 'National Red Chilli Powder (200g)',
    urduName: 'سرخ مرچ پاؤڈر دیسی',
    category: 'spices',
    path: '/images/products/spices-national-red-chilli-200g.jpg',
  },
  {
    id: 'spices-mehran-turmeric',
    name: 'Mehran Turmeric / Haldi (200g)',
    urduName: 'مہران خالص ہلدی پاؤڈر',
    category: 'spices',
    path: '/images/products/spices-mehran-turmeric-haldi-200g.jpg',
  },
  {
    id: 'spices-whole-cumin',
    name: 'Pure White Cumin / Safaid Zeera (100g)',
    urduName: 'خالص ثابت سفید زیرہ دیسی',
    category: 'spices',
    path: '/images/products/spices-whole-cumin-safaid-zeera-100g.jpg',
  },
  {
    id: 'spices-national-salt',
    name: 'National Iodized Table Salt (800g)',
    urduName: 'نیشنل آیوڈائزڈ نمک',
    category: 'spices',
    path: '/images/products/spices-national-iodized-salt-800g.jpg',
  },

  // 5. Tea, Sugar & Dairy (چائے، چینی و دودھ)
  {
    id: 'beverages-tapal-danedar',
    name: 'Tapal Danedar Tea (430g)',
    urduName: 'ٹپال دانے دار چائے',
    category: 'beverages',
    path: '/images/products/beverages-tapal-danedar-tea-430g.jpg',
  },
  {
    id: 'beverages-white-sugar',
    name: 'Refined White Sugar / Cheeni (1kg)',
    urduName: 'خالص سفید چینی موٹا دانہ',
    category: 'beverages',
    path: '/images/products/beverages-refined-white-sugar-1kg.jpg',
  },
  {
    id: 'beverages-olpers-milk',
    name: 'Olpers Full Cream Milk (1L)',
    urduName: 'اولپرز خالص فل کریم دودھ (1 لیٹر)',
    category: 'beverages',
    path: '/images/products/beverages-olpers-full-cream-milk-1l.jpg',
  },
]

export interface ProductImageGalleryModalProps {
  isOpen: boolean
  onClose: () => void
  onSelectImage: (imagePathOrDataUrl: string) => void
  currentImage?: string
}

export const ProductImageGalleryModal: React.FC<ProductImageGalleryModalProps> = ({
  isOpen,
  onClose,
  onSelectImage,
  currentImage,
}) => {
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const categories = [
    { id: 'all', label: 'All Photos (تمام تصاویر)' },
    { id: 'staples', label: 'Flour & Grains (آٹا)' },
    { id: 'pulses', label: 'Rice & Pulses (دالیں و چاول)' },
    { id: 'cooking', label: 'Ghee & Oil (گھی و تیل)' },
    { id: 'spices', label: 'Spices & Salt (مصالحہ جات)' },
    { id: 'beverages', label: 'Tea, Sugar & Dairy (چائے و دودھ)' },
  ]

  const filteredImages = useMemo(() => {
    return STORE_GALLERY_IMAGES.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory
      const q = search.toLowerCase().trim()
      const matchSearch =
        !q ||
        item.name.toLowerCase().includes(q) ||
        item.urduName.includes(q) ||
        item.category.includes(q)
      return matchCat && matchSearch
    })
  }, [search, selectedCategory])

  const handleDeviceFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      alert('براہ کرم تصویر والی فائل منتخب کریں (Please select an image file).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        onSelectImage(reader.result)
        onClose()
      }
    }
    reader.readAsDataURL(file)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-3 sm:p-4 bg-forest-950/80 backdrop-blur-xs animate-fade-in">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-6 shadow-forest-xl border border-cream-300 space-y-4 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-cream-200 pb-3 shrink-0">
          <div>
            <h3 className="font-black text-lg text-forest-950 flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-lime-brand" />
              <span>Select Product Image (پروڈکٹ کی تصویر منتخب کریں)</span>
            </h3>
            <p className="text-xs text-forest-700/80">
              Pick from the ready store catalog gallery or upload a picture directly from your mobile/PC.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl text-forest-700 hover:bg-cream-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Bar: Upload from Device or Search */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 shrink-0">
          {/* Upload Button */}
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleDeviceFileUpload}
            />
            <Button
              variant="forest"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              iconLeft={<Camera className="w-4 h-4 text-lime-brand" />}
              className="w-full sm:w-auto"
            >
              📷 موبائل یا کمپیوٹر گیلری سے فوٹو لگائیں (Upload from Device)
            </Button>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 sm:max-w-xs">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search photo by name or urdu..."
              className="w-full pl-8 pr-3 py-2 text-xs bg-cream-50 border border-cream-300 rounded-xl text-forest-950 focus:outline-none focus:ring-2 focus:ring-forest-600/20"
            />
            <Search className="w-3.5 h-3.5 text-forest-700/60 absolute left-2.5 top-2.5" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-1.5 border-b border-cream-200 pb-2.5 shrink-0 overflow-x-auto">
          {categories.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                selectedCategory === c.id
                  ? 'bg-forest-950 text-white shadow-2xs'
                  : 'bg-cream-100 hover:bg-cream-200 text-forest-800'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* Images Grid */}
        <div className="overflow-y-auto flex-1 pr-1">
          {filteredImages.length === 0 ? (
            <div className="text-center py-12 text-forest-700/60 space-y-2">
              <ImageIcon className="w-12 h-12 mx-auto stroke-1" />
              <p className="text-xs font-bold">No images match your search criteria</p>
              <button
                type="button"
                onClick={() => {
                  setSearch('')
                  setSelectedCategory('all')
                }}
                className="text-xs text-forest-900 underline font-semibold cursor-pointer"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredImages.map((item) => {
                const isSelected = currentImage === item.path

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onSelectImage(item.path)
                      onClose()
                    }}
                    className={`group relative text-left rounded-2xl overflow-hidden border-2 p-2 bg-white transition-all cursor-pointer hover:shadow-forest-sm ${
                      isSelected
                        ? 'border-forest-800 ring-2 ring-forest-700/30 bg-forest-50/50'
                        : 'border-cream-300 hover:border-forest-600'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="aspect-square w-full rounded-xl overflow-hidden bg-cream-100 mb-2 relative">
                      <img
                        src={item.path}
                        alt={item.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        loading="lazy"
                      />
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 bg-forest-950 text-lime-brand p-1 rounded-full shadow-2xs">
                          <Check className="w-3.5 h-3.5 stroke-3" />
                        </div>
                      )}
                    </div>

                    {/* Metadata */}
                    <div className="space-y-0.5">
                      <h5 className="font-extrabold text-[11px] text-forest-950 line-clamp-1 leading-tight">
                        {item.name}
                      </h5>
                      <p className="font-urdu text-[11px] font-bold text-forest-700 line-clamp-1">
                        {item.urduName}
                      </p>
                      <span className="text-[9px] uppercase font-bold text-forest-700/60">
                        {item.category}
                      </span>
                    </div>
                  </button>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-cream-200 flex items-center justify-between shrink-0">
          <span className="text-xs text-forest-700/70">
            Showing {filteredImages.length} ready store photos
          </span>
          <Button variant="outline" size="sm" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  )
}
