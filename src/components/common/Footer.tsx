import React from 'react'
import {
  Phone,
  MapPin,
  Mail,
  ShieldCheck,
  Truck,
  Clock,
  MessageCircle,
  Banknote,
  Sparkles,
} from 'lucide-react'
import { STORE_INFO } from '../../data/products'

const CURRENT_YEAR = new Date().getFullYear()

export const Footer: React.FC = () => {
  return (
    <footer className="bg-forest-950 text-cream-100 border-t border-forest-900 relative">
      {/* 1. Trust & Value Highlights */}
      <div className="border-b border-forest-900/80 bg-forest-900/40">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-forest-900/60 border border-forest-800/80">
              <div className="p-3 bg-lime-brand/15 text-lime-brand rounded-xl shrink-0">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">30–45 Mins Express</h4>
                <p className="text-xs text-cream-200/80">Doorstep delivery in local area</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-forest-900/60 border border-forest-800/80">
              <div className="p-3 bg-lime-brand/15 text-lime-brand rounded-xl shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">100% Khális Guarantee</h4>
                <p className="text-xs text-cream-200/80">Pure chakki flour, ghee & pulses</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-forest-900/60 border border-forest-800/80">
              <div className="p-3 bg-lime-brand/15 text-lime-brand rounded-xl shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Open 7 Days a Week</h4>
                <p className="text-xs text-cream-200/80">8:00 AM – 11:00 PM without off</p>
              </div>
            </div>

            <div className="flex items-center gap-3.5 p-4 rounded-2xl bg-forest-900/60 border border-forest-800/80">
              <div className="p-3 bg-lime-brand/15 text-lime-brand rounded-xl shrink-0">
                <Banknote className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">Easy Payment Modes</h4>
                <p className="text-xs text-cream-200/80">Cash on Delivery, JazzCash, EasyPaisa</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Main Footer Directory */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-forest-700 flex items-center justify-center text-cream-100 font-bold text-xl border border-forest-600/50 shadow-forest-sm">
                <span className="font-urdu">ح</span>
              </div>
              <div>
                <h3 className="font-extrabold text-white text-lg tracking-tight">
                  Hafiz Jee Kiryana Store
                </h3>
                <p className="text-xs text-lime-brand font-medium">
                  حافظ جی کریانہ سٹور • خالص اور معیاری
                </p>
              </div>
            </div>

            <p className="text-xs sm:text-sm text-cream-200/80 leading-relaxed max-w-md">
              Serving our community with unadulterated essentials, wholesale mandi rates, and instant home deliveries. Your trust is our greatest asset.
            </p>

            <div className="pt-2 flex flex-wrap gap-2">
              <a
                href={`https://wa.me/${STORE_INFO.whatsapp}?text=Assalam-o-Alaikum%20Hafiz%20Jee`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-lime-brand hover:bg-lime-accent text-forest-950 font-bold px-3.5 py-2 rounded-xl text-xs transition-colors shadow-2xs"
              >
                <MessageCircle className="w-4 h-4" />
                WhatsApp Quick Order
              </a>

              <a
                href={`tel:${STORE_INFO.phone}`}
                className="inline-flex items-center gap-2 bg-forest-800 hover:bg-forest-700 text-cream-100 px-3.5 py-2 rounded-xl text-xs border border-forest-700 transition-colors"
              >
                <Phone className="w-4 h-4 text-lime-brand" />
                Direct Hotline
              </a>
            </div>
          </div>

          {/* Popular Aisles */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3.5 flex items-center gap-1.5">
              <span>Popular Aisles</span>
              <Sparkles className="w-3.5 h-3.5 text-lime-brand" />
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm text-cream-200/80">
              <li className="hover:text-lime-brand transition-colors cursor-pointer">
                Chakki Atta & Maida (آٹا و میدہ)
              </li>
              <li className="hover:text-lime-brand transition-colors cursor-pointer">
                Old Basmati Rice (باسمتی چاول)
              </li>
              <li className="hover:text-lime-brand transition-colors cursor-pointer">
                Pulses & Dals (دالیں اور چنے)
              </li>
              <li className="hover:text-lime-brand transition-colors cursor-pointer">
                Banaspati Ghee & Oil (گھی و تیل)
              </li>
              <li className="hover:text-lime-brand transition-colors cursor-pointer">
                Whole & Ground Spices (مصالحہ جات)
              </li>
              <li className="hover:text-lime-brand transition-colors cursor-pointer">
                Danedar Tea & Sugar (چائے و چینی)
              </li>
            </ul>
          </div>

          {/* Service Areas & Delivery */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3.5">
              Delivery Coverage
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-cream-200/80">
              <li>• Block A, B & C Housing Sector</li>
              <li>• Main Bazar Commercial Hub</li>
              <li>• Jamia Masjid & Surrounding Streets</li>
              <li>• Model Town & Satellite Enclave</li>
              <li className="pt-2 text-lime-brand text-xs font-semibold">
                ✓ Free delivery on orders above Rs. 1,000
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-bold text-white text-sm mb-3.5">Store Location</h4>
            <ul className="space-y-3 text-xs sm:text-sm text-cream-200/80">
              <li className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-lime-brand shrink-0 mt-0.5" />
                <span>{STORE_INFO.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-lime-brand shrink-0" />
                <span>{STORE_INFO.phone}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-lime-brand shrink-0" />
                <span>hafizjee.store@example.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* 3. Bottom Bar */}
        <div className="border-t border-forest-900 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-cream-300/60 pb-16 sm:pb-0">
          <div>
            © {CURRENT_YEAR} Hafiz Jee Kiryana Store. All rights reserved.
          </div>
          <div className="flex items-center gap-4 text-xs font-urdu text-lime-accent">
            <span>خالص اور باوقار سودا سلف ہر گھر کی دہلیز تک</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
