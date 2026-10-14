import type { CustomerDetails, CartItem } from '../types'
import { STORE_INFO } from '../data/products'

export interface WhatsAppOrderPayload {
  orderId: string
  customer: CustomerDetails
  items: CartItem[]
  subtotal: number
  deliveryFee: number
  totalAmount: number
  isFreeDelivery: boolean
}

/**
 * Builds a structured, beautifully formatted WhatsApp order message in English & Urdu.
 */
export function buildWhatsAppOrderMessage(payload: WhatsAppOrderPayload): string {
  const { orderId, customer, items, subtotal, deliveryFee, totalAmount, isFreeDelivery } = payload

  const now = new Date()
  const dateFormatted = now.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
  const timeFormatted = now.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })

  const deliveryMethodLabel =
    customer.deliveryMethod === 'pickup'
      ? '🏬 Store Pickup (دکان سے وصولی - G Civil Bazaar, K-152)'
      : '🚚 Home Delivery (گھر پر ترسیل)'

  const paymentMethodLabel = {
    cod: '💵 Cash on Delivery (نقدی کی ادائیگی)',
    jazzcash: '📱 JazzCash Mobile Account',
    easypaisa: '📲 EasyPaisa Mobile Account',
    bank_transfer: '🏦 Direct Bank Transfer',
  }[customer.paymentMethod]

  // Item lines
  const itemsText = items
    .map((item, index) => {
      const lineTotal = item.product.price * item.quantity
      const urduPart = item.product.urduName ? ` (${item.product.urduName})` : ''
      return `${index + 1}. *${item.product.name}*${urduPart}\n   ${item.quantity} × ${item.product.unit} @ Rs. ${item.product.price} = *Rs. ${lineTotal.toLocaleString()}*`
    })
    .join('\n\n')

  const deliveryFeeText =
    customer.deliveryMethod === 'pickup'
      ? 'Rs. 0 (Store Pickup)'
      : isFreeDelivery
        ? 'FREE (🎉 Local Delivery Over Rs. 1,000)'
        : `Rs. ${deliveryFee}`

  const messageLines = [
    `🛒 *${STORE_INFO.name.toUpperCase()} - NEW ORDER*`,
    `📍 *Store Location:* ${STORE_INFO.address}`,
    `📞 *Hotline:* ${STORE_INFO.phone}`,
    `━━━━━━━━━━━━━━━━━━`,
    `🔖 *Order Reference:* *${orderId}*`,
    `📅 *Order Time:* ${dateFormatted}, ${timeFormatted}`,
    ``,
    `👤 *CUSTOMER DETAILS (گاہک کی معلومات):*`,
    `• *Full Name:* ${customer.fullName}`,
    `• *Mobile:* ${customer.phoneNumber}`,
    `• *Fulfillment:* ${deliveryMethodLabel}`,
  ]

  if (customer.deliveryMethod === 'delivery') {
    messageLines.push(`• *Area:* ${customer.area}`)
    messageLines.push(`• *Delivery Address:* ${customer.address}`)
  }

  if (customer.notes && customer.notes.trim()) {
    messageLines.push(`• *Special Instructions:* ${customer.notes.trim()}`)
  }

  messageLines.push(`• *Payment Method:* ${paymentMethodLabel}`)
  messageLines.push(``)
  messageLines.push(`📦 *ORDERED ITEMS (${items.length} commodities / ${items.reduce((s, i) => s + i.quantity, 0)} units):*`)
  messageLines.push(itemsText)
  messageLines.push(``)
  messageLines.push(`━━━━━━━━━━━━━━━━━━`)
  messageLines.push(`💰 *PAYMENT SUMMARY (حساب کتاب):*`)
  messageLines.push(`• Items Subtotal: Rs. ${subtotal.toLocaleString()}`)
  messageLines.push(`• Delivery Charge: ${deliveryFeeText}`)
  messageLines.push(`• *TOTAL PAYABLE: Rs. ${totalAmount.toLocaleString()}*`)
  messageLines.push(``)
  messageLines.push(`ℹ️ *Rate Verification Note:*`)
  messageLines.push(`All retail rates are sample estimates in PKR based on local mandi rates. The store owner will confirm the final verified bill upon order preparation.`)
  messageLines.push(`━━━━━━━━━━━━━━━━━━`)
  messageLines.push(`السلام علیکم حافظ جی! برائے مہربانی میرا یہ آرڈر کنفرم فرما دیں۔ شکریہ!`)

  return messageLines.join('\n')
}

/**
 * Builds the WhatsApp Web / App direct URL with URL-encoded order message.
 */
export function buildWhatsAppUrl(payload: WhatsAppOrderPayload): string {
  const message = buildWhatsAppOrderMessage(payload)
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${STORE_INFO.whatsapp}?text=${encoded}`
}
