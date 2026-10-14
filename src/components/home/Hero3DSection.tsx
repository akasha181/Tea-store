import React from 'react'
import { GroceryCanvas3D } from './GroceryCanvas3D'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import {
  MessageCircle,
  Phone,
  Sparkles,
  MapPin,
  Clock,
  Truck,
  ShieldCheck,
  ArrowDown,
} from 'lucide-react'
import { STORE_INFO } from '../../data/products'

interface Hero3DSectionProps {
  onExploreClick?: () => void
}

export const Hero3DSection: React.FC<Hero3DSectionProps> = ({ onExploreClick }) => {
  const handleScrollToCategories = () => {
    if (onExploreClick) {
      onExploreClick()
      return
    }
    const el = document.getElementById('categories-section')
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <section className="relative overflow-hidden rounded-3xl bg-radial from-forest-800 via-forest-900 to-forest-950 text-cream-50 border border-forest-700/80 shadow-forest-xl">
      {/* Ambient background glows */}
      <div className="absolute -top-32 -left-32 w-96 h-96 rounded-full bg-forest-600/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 -right-32 w-96 h-96 rounded-full bg-lime-brand/10 blur-3xl pointer-events-none" />

      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-6 items-center p-6 sm:p-10 lg:p-12">
        {/* Left Column: Premium Content & CTAs */}
        <div className="lg:col-span-7 space-y-5 sm:space-y-6">
          {/* Top badges */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="lime" size="md" dot>
              خالص اور معیاری اشیاء
            </Badge>

            <span className="inline-flex items-center gap-1.5 bg-forest-800/80 text-cream-100 text-xs px-3 py-1 rounded-full border border-forest-700">
              <MapPin className="w-3.5 h-3.5 text-lime-brand" />
              <span>{STORE_INFO.address}</span>
            </span>
          </div>

          {/* Heading */}
          <div className="space-y-2">
            <h1 className="text-2xl sm:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight text-white leading-[1.18]">
              آپ کے گھر کا مکمل کریانہ <br />
              <span className="text-lime-brand">تھوک منڈی کے نرخوں پر</span>
            </h1>
            <p className="text-base sm:text-lg lg:text-xl font-bold text-cream-200 font-urdu pt-1">
              حافظ جی کریانہ سٹور — خالص چکی آٹا، دالیں، چاول اور گھی
            </p>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm lg:text-base text-cream-200/85 leading-relaxed max-w-xl">
            Serving our neighborhood with 100% unadulterated kitchen essentials. Cleaned pulses, aged basmati rice, freshly ground whole wheat, and brand ghee delivered to your doorstep within 30–45 minutes.
          </p>

          {/* Call to Actions */}
          <div className="flex flex-col sm:flex-row flex-wrap items-stretch sm:items-center gap-3 pt-2">
            <a
              href={`https://wa.me/${STORE_INFO.whatsapp}?text=Assalam-o-Alaikum%20Hafiz%20Jee,%20I%20want%20to%20order%20groceries%20from%20G%20Civil%20Bazaar,%20K-152`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-lime-brand hover:bg-lime-accent active:bg-lime-dark text-forest-950 font-bold px-5 py-3.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all cursor-pointer motion-reduce:transition-none"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Order on WhatsApp (واٹس ایپ آرڈر)</span>
            </a>

            <Button
              variant="white"
              size="lg"
              onClick={handleScrollToCategories}
              iconRight={<ArrowDown className="w-4 h-4 text-forest-700" />}
              className="w-full sm:w-auto text-xs sm:text-sm font-bold"
            >
              Explore Aisles (شعبہ جات دیکھیں)
            </Button>

            <a
              href={`tel:${STORE_INFO.phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 text-xs text-cream-100 hover:text-lime-brand bg-forest-800/80 hover:bg-forest-800 px-3.5 py-3 rounded-xl border border-forest-700/80 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-lime-brand" />
              <span>Call: {STORE_INFO.phone}</span>
            </a>
          </div>

          {/* Service Guarantee Chips */}
          <div className="pt-4 border-t border-forest-800/80 grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-cream-200">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-lime-brand shrink-0" />
              <span>Free Delivery &gt; Rs. 1,000</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-lime-brand shrink-0" />
              <span>100% Khális Purity Guarantee</span>
            </div>
            <div className="flex items-center gap-2 col-span-2 sm:col-span-1">
              <Clock className="w-4 h-4 text-lime-brand shrink-0" />
              <span>Open 8 AM – 11 PM Daily</span>
            </div>
          </div>
        </div>

        {/* Right Column: 3D Interactive Canvas & Floating Elements */}
        <div className="lg:col-span-5 relative flex items-center justify-center">
          {/* Floating Pill Tag 1 */}
          <div className="absolute top-2 left-2 z-20 bg-forest-950/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl border border-forest-700/70 shadow-forest-md flex items-center gap-2 pointer-events-none">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="font-semibold">Desi Chakki Atta</span>
          </div>

          {/* Floating Pill Tag 2 */}
          <div className="absolute bottom-6 left-4 z-20 bg-forest-950/85 backdrop-blur-md text-white text-xs px-3 py-1.5 rounded-xl border border-forest-700/70 shadow-forest-md flex items-center gap-2 pointer-events-none">
            <span className="text-lime-brand font-bold">✓</span>
            <span className="font-semibold">Mandi Rate Dalda Ghee</span>
          </div>

          {/* Interactive 3D Canvas */}
          <GroceryCanvas3D className="w-full" />
        </div>
      </div>
    </section>
  )
}
