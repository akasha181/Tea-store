import React from 'react'
import {
  Printer,
  X,
  Phone,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  PackageCheck,
  CheckCircle2,
  Clock3,
  XCircle,
} from 'lucide-react'
import { Button } from '../ui/Button'
import { Badge } from '../ui/Badge'
import { STORE_INFO } from '../../data/products'
import type { OrderRecord, OrderStatus } from '../../types'

export interface PrintableOrderSummaryProps {
  order: OrderRecord | null
  isOpen: boolean
  onClose: () => void
}

const getStatusBadge = (status: OrderStatus) => {
  switch (status) {
    case 'confirmed':
      return (
        <Badge variant="lime" size="sm" className="gap-1 font-bold">
          <CheckCircle2 className="w-3 h-3" />
          <span>Confirmed (تصدیق شدہ)</span>
        </Badge>
      )
    case 'completed':
      return (
        <Badge variant="forest" size="sm" className="gap-1 font-bold">
          <PackageCheck className="w-3 h-3" />
          <span>Completed (مکمل)</span>
        </Badge>
      )
    case 'cancelled':
      return (
        <Badge variant="outline" size="sm" className="gap-1 text-rose-700 border-rose-300 font-bold">
          <XCircle className="w-3 h-3 text-rose-600" />
          <span>Cancelled (منسوخ)</span>
        </Badge>
      )
    case 'pending':
    default:
      return (
        <Badge variant="cream" size="sm" className="gap-1 text-amber-800 border-amber-300 font-bold">
          <Clock3 className="w-3 h-3 text-amber-600" />
          <span>Pending Review (زیر التواء)</span>
        </Badge>
      )
  }
}

export const PrintableOrderSummary: React.FC<PrintableOrderSummaryProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !order) return null

  const handlePrint = () => {
    window.print()
  }

  const isPickup = order.customer.deliveryMethod === 'pickup'

  return (
    <div
      className="fixed inset-0 z-60 overflow-y-auto bg-forest-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 print:p-0 print:bg-white print:static print:inset-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="printable-summary-title"
    >
      {/* Container */}
      <div className="bg-white rounded-3xl max-w-3xl w-full p-5 sm:p-8 shadow-forest-xl border border-cream-300 text-forest-950 space-y-6 my-auto print:shadow-none print:border-none print:p-0 print:max-w-none print:rounded-none">
        {/* Top Control Bar (Hidden on print) */}
        <div className="flex items-center justify-between gap-3 border-b border-cream-300 pb-4 print:hidden">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-forest-100 text-forest-800">
              <Printer className="w-5 h-5 text-forest-700" />
            </span>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg text-forest-950 leading-tight">
                Official Order Invoice &amp; Packaging Slip
              </h3>
              <p className="text-xs text-forest-700/70">
                Printable summary for customer receipt or store packing slip
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="lime"
              size="sm"
              onClick={handlePrint}
              iconLeft={<Printer className="w-4 h-4" />}
            >
              Print Invoice (رسید پرنٹ کریں)
            </Button>

            <button
              type="button"
              onClick={onClose}
              className="p-2 text-forest-700 hover:bg-cream-100 rounded-xl transition-colors cursor-pointer"
              aria-label="Close invoice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE RECEIPT CONTENT */}
        <div className="space-y-6 print:space-y-4 print:text-black">
          {/* 1. Official Store Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pb-4 border-b-2 border-forest-900/20">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 rounded-xl bg-forest-800 flex items-center justify-center text-white font-bold text-xl print:border print:border-black">
                  <span className="font-urdu leading-none">ح</span>
                </div>
                <div>
                  <h1
                    id="printable-summary-title"
                    className="text-xl sm:text-2xl font-black text-forest-950 tracking-tight leading-tight print:text-black"
                  >
                    {STORE_INFO.name}
                  </h1>
                  <p className="text-xs font-urdu font-bold text-forest-700 print:text-black">
                    {STORE_INFO.urduName} • خالص اشیاء کی ضمانت
                  </p>
                </div>
              </div>

              <div className="text-xs text-forest-700/90 space-y-0.5 pt-1 print:text-black">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-forest-700 shrink-0 print:hidden" />
                  <span>
                    <strong>Store Address:</strong> {STORE_INFO.address}, Rawalpindi
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-forest-700 shrink-0 print:hidden" />
                  <span>
                    <strong>Hotline:</strong> {STORE_INFO.phone} | <strong>WhatsApp:</strong> {STORE_INFO.phone}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-forest-700 shrink-0 print:hidden" />
                  <span>
                    <strong>Timings:</strong> {STORE_INFO.timing}
                  </span>
                </div>
              </div>
            </div>

            {/* Invoice Meta */}
            <div className="sm:text-right space-y-1 bg-cream-50 p-3 sm:p-4 rounded-2xl border border-cream-300 min-w-48 print:bg-transparent print:border print:border-black">
              <span className="text-[10px] font-bold uppercase tracking-wider text-forest-700/80 block">
                Official Receipt / Invoice
              </span>
              <span className="text-lg font-mono font-black text-forest-950 block print:text-black">
                {order.orderId}
              </span>

              <div className="pt-1 space-y-0.5 text-xs text-forest-800 print:text-black">
                <div className="flex items-center sm:justify-end gap-1">
                  <Calendar className="w-3 h-3 text-forest-700 print:hidden" />
                  <span>Date: {order.date}</span>
                </div>
                <div className="pt-1 flex items-center sm:justify-end">
                  {getStatusBadge(order.status)}
                </div>
              </div>
            </div>
          </div>

          {/* 2. Customer & Fulfillment Information Box */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-2xl bg-cream-50 border border-cream-300 text-xs text-forest-950 print:bg-white print:border print:border-black">
            {/* Customer Details */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-forest-700 print:text-black border-b border-cream-300 pb-1">
                Customer Details (گاہک کی معلومات)
              </h4>
              <p className="text-sm font-bold text-forest-950 print:text-black">
                {order.customer.fullName}
              </p>
              <p className="font-mono text-forest-800 print:text-black">
                📞 {order.customer.phoneNumber}
              </p>
              <p className="text-forest-700 print:text-black">
                <strong>Area:</strong> {order.customer.area}
              </p>
              {!isPickup && order.customer.address && (
                <p className="text-forest-800 print:text-black">
                  <strong>Delivery Address:</strong> {order.customer.address}
                </p>
              )}
            </div>

            {/* Fulfillment & Payment Details */}
            <div className="space-y-1.5">
              <h4 className="font-extrabold uppercase tracking-wider text-[11px] text-forest-700 print:text-black border-b border-cream-300 pb-1">
                Fulfillment &amp; Payment (ترسیل و ادائیگی)
              </h4>
              <p className="font-semibold text-forest-900 print:text-black">
                <strong>Fulfillment:</strong>{' '}
                {isPickup
                  ? '🏬 Store Counter Pickup (Civil Bazar K-152, Attock City)'
                  : '🚚 Home Doorstep Delivery'}
              </p>
              <p className="font-semibold text-forest-900 print:text-black">
                <strong>Payment Mode:</strong>{' '}
                {order.customer.paymentMethod === 'jazzcash'
                  ? 'JazzCash Mobile Account (جاز کیش)'
                  : order.customer.paymentMethod === 'easypaisa'
                    ? 'EasyPaisa Mobile Account (ایزی پیسہ)'
                    : order.customer.paymentMethod.toUpperCase()}
              </p>
              {order.customer.notes && (
                <p className="p-2 rounded-lg bg-white border border-cream-300 text-[11px] text-forest-800 print:border-black">
                  <strong>Special Instructions:</strong> {order.customer.notes}
                </p>
              )}
              {order.ownerNotes && (
                <p className="p-2 rounded-lg bg-amber-50/80 border border-amber-200 text-[11px] text-amber-900 print:border-black">
                  <strong>Store Dispatch Notes:</strong> {order.ownerNotes}
                </p>
              )}
            </div>
          </div>

          {/* 3. Itemized Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-forest-950 text-white print:bg-slate-100 print:text-black border-b border-forest-900 print:border-black">
                  <th className="py-2.5 px-3 font-bold w-10 text-center">#</th>
                  <th className="py-2.5 px-3 font-bold">Item Description (اشیاء)</th>
                  <th className="py-2.5 px-3 font-bold text-center">Unit / Packaging</th>
                  <th className="py-2.5 px-3 font-bold text-right">Rate (PKR)</th>
                  <th className="py-2.5 px-3 font-bold text-center">Qty</th>
                  <th className="py-2.5 px-3 font-bold text-right">Subtotal (PKR)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cream-200 print:divide-black text-forest-900 print:text-black">
                {order.items.map((item, index) => {
                  const lineTotal = item.product.price * item.quantity
                  return (
                    <tr
                      key={item.product.id || index}
                      className={index % 2 === 1 ? 'bg-cream-50/50 print:bg-white' : 'bg-white'}
                    >
                      <td className="py-2.5 px-3 text-center text-forest-700/80 font-mono">
                        {index + 1}
                      </td>
                      <td className="py-2.5 px-3">
                        <span className="font-bold text-forest-950 print:text-black block">
                          {item.product.name}
                        </span>
                        {item.product.urduName && (
                          <span className="text-[11px] font-urdu font-medium text-forest-700 print:text-black">
                            {item.product.urduName}
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 px-3 text-center font-medium">
                        {item.product.unit}
                      </td>
                      <td className="py-2.5 px-3 text-right font-mono">
                        Rs. {item.product.price.toLocaleString()}
                      </td>
                      <td className="py-2.5 px-3 text-center font-bold">
                        {item.quantity}
                      </td>
                      <td className="py-2.5 px-3 text-right font-black text-forest-950 print:text-black font-mono">
                        Rs. {lineTotal.toLocaleString()}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* 4. Financial Calculations Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            {/* Left: Store Disclaimers & Stamp */}
            <div className="text-xs text-forest-700 space-y-2 max-w-sm print:text-black">
              <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-[11px] text-amber-950 leading-relaxed print:bg-white print:border-black">
                <p className="font-bold">Mandi Rate Notice (عارضی نرخ):</p>
                <p className="text-[10px] text-amber-900/80 print:text-black">
                  All retail prices are estimates in PKR subject to daily verification by {STORE_INFO.name} owner upon delivery/collection at {STORE_INFO.address}.
                </p>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-forest-800 print:text-black">
                <ShieldCheck className="w-4 h-4 text-forest-700 print:hidden" />
                <span>100% Khális Quality • Thank you for shopping with {STORE_INFO.name}!</span>
              </div>
            </div>

            {/* Right: Calculations Totals Table */}
            <div className="w-full sm:w-72 bg-cream-50 p-4 rounded-2xl border border-cream-300 text-xs text-forest-950 space-y-2 print:bg-white print:border-black">
              <div className="flex justify-between">
                <span>Commodities Subtotal:</span>
                <span className="font-bold font-mono">Rs. {order.subtotal.toLocaleString()}</span>
              </div>

              <div className="flex justify-between">
                <span>Delivery Charge:</span>
                <span className="font-bold font-mono">
                  {isPickup ? (
                    'Rs. 0 (Pickup)'
                  ) : order.deliveryFee === 0 ? (
                    <span className="text-forest-700 print:text-black">FREE</span>
                  ) : (
                    `Rs. ${order.deliveryFee}`
                  )}
                </span>
              </div>

              <div className="flex justify-between pt-2 border-t-2 border-forest-900/20 text-sm font-black text-forest-950 print:text-black">
                <span>Total Payable:</span>
                <span className="text-base font-black text-forest-700 print:text-black font-mono">
                  Rs. {order.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* 5. Physical Signatures Block (for printed packaging & dispatch) */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-cream-300 print:pt-12 text-xs text-forest-800 print:text-black">
            <div className="space-y-8">
              <div className="border-b border-forest-900/40 w-44 print:border-black" />
              <p className="font-bold">Store Dispatcher / Packaged By</p>
            </div>
            <div className="space-y-8 text-right">
              <div className="border-b border-forest-900/40 w-44 ml-auto print:border-black" />
              <p className="font-bold">Customer Signature / Received By</p>
            </div>
          </div>
        </div>

        {/* Bottom Actions (Hidden on print) */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-cream-300 print:hidden">
          <Button variant="outline" size="sm" onClick={onClose}>
            Close Invoice (بند کریں)
          </Button>

          <Button
            variant="lime"
            size="sm"
            onClick={handlePrint}
            iconLeft={<Printer className="w-4 h-4" />}
          >
            Print Invoice (رسید پرنٹ کریں)
          </Button>
        </div>
      </div>
    </div>
  )
}
