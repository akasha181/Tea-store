import React from 'react'
import { Card } from '../ui/Card'
import { Badge } from '../ui/Badge'
import { STORE_PROMOTIONS, STORE_INFO } from '../../data/products'
import {
  Truck,
  PackageCheck,
  Wheat,
  MessageCircle,
  Phone,
  Sparkles,
  MapPin,
  CheckCircle,
} from 'lucide-react'

export const PromotionalSection: React.FC = () => {
  const getPromoIcon = (id: string) => {
    switch (id) {
      case 'promo-delivery':
        return <Truck className="w-6 h-6 text-lime-brand" />
      case 'promo-ration':
        return <PackageCheck className="w-6 h-6 text-amber-300" />
      case 'promo-atta':
        return <Wheat className="w-6 h-6 text-lime-accent" />
      default:
        return <Sparkles className="w-6 h-6 text-lime-brand" />
    }
  }

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-cream-300 pb-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-forest-700 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-lime-dark" />
            <span>Verified Store Services • سہولیات و پیکجز</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-forest-950 tracking-tight mt-1">
            Special Store Services &amp; Household Packages
          </h2>
          <p className="text-xs sm:text-sm text-forest-700/70">
            Real services and wholesale ration packages offered daily at {STORE_INFO.address}.
          </p>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-forest-700 font-medium">
          <MapPin className="w-3.5 h-3.5 text-lime-dark" />
          <span>Serving G Civil Bazaar, K-152</span>
        </div>
      </div>

      {/* Promotional Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {STORE_PROMOTIONS.map((promo) => (
          <Card
            key={promo.id}
            variant="forest"
            interactive
            className="p-6 flex flex-col justify-between relative overflow-hidden group border border-forest-700 shadow-forest-lg"
          >
            {/* Ambient Background Gradient Accent */}
            <div className="absolute -right-12 -top-12 w-36 h-36 rounded-full bg-forest-600/30 blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-300" />

            <div className="relative z-10 space-y-4">
              {/* Top Row: Icon & Tag */}
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-forest-900/80 border border-forest-700/70 text-lime-brand shadow-inner">
                  {getPromoIcon(promo.id)}
                </div>
                <Badge variant="lime" size="sm" dot>
                  {promo.tag}
                </Badge>
              </div>

              {/* Title & Urdu */}
              <div>
                <h3 className="text-lg font-black text-white group-hover:text-lime-accent transition-colors">
                  {promo.title}
                </h3>
                <p className="font-urdu text-xs text-cream-200 font-bold mt-0.5">
                  {promo.urduTitle}
                </p>
                <div className="mt-2 text-xs font-semibold text-lime-brand bg-forest-900/60 px-2.5 py-1 rounded-lg inline-block border border-forest-700">
                  {promo.highlight}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-cream-200/85 leading-relaxed">
                {promo.description}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-cream-300/80">
                <CheckCircle className="w-3.5 h-3.5 text-lime-brand shrink-0" />
                <span>{promo.tagline}</span>
              </div>
            </div>

            {/* Bottom Action */}
            <div className="mt-6 pt-4 border-t border-forest-700/80 flex items-center justify-between gap-2 relative z-10">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=${encodeURIComponent(
                  promo.whatsAppPrompt
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 bg-lime-brand hover:bg-lime-accent active:bg-lime-dark text-forest-950 font-bold py-2.5 px-3 rounded-xl text-xs transition-colors shadow-2xs cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Inquire on WhatsApp</span>
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="p-2.5 rounded-xl bg-forest-900/80 text-cream-100 hover:text-white hover:bg-forest-700 border border-forest-700 transition-colors"
                title="Call store directly"
              >
                <Phone className="w-4 h-4" />
              </a>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
