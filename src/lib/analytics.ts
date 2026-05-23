declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void
    fbq?: (...args: unknown[]) => void
  }
}

export function trackAddToCart(product: { name: string; price: string; sku: string }) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', 'add_to_cart', {
    currency: 'INR',
    value: parseFloat(product.price),
    items: [
      { item_id: product.sku, item_name: product.name, price: parseFloat(product.price), quantity: 1 },
    ],
  })
  window.fbq?.('track', 'AddToCart', {
    value: product.price,
    currency: 'INR',
    content_name: product.name,
  })
}

export function trackViewItem(product: {
  name: string
  price: string
  sku: string
  category: string
}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', 'view_item', {
    currency: 'INR',
    value: parseFloat(product.price),
    items: [
      {
        item_id: product.sku,
        item_name: product.name,
        item_category: product.category,
        price: parseFloat(product.price),
      },
    ],
  })
  window.fbq?.('track', 'ViewContent', {
    value: product.price,
    currency: 'INR',
    content_name: product.name,
  })
}

export function trackPurchase(order: {
  id: string
  total: string
  items: Array<{ item_id: string; item_name: string; price: number; quantity: number }>
}) {
  if (typeof window === 'undefined') return
  window.gtag?.('event', 'purchase', {
    transaction_id: order.id,
    value: parseFloat(order.total),
    currency: 'INR',
    items: order.items,
  })
  window.fbq?.('track', 'Purchase', { value: order.total, currency: 'INR' })
}
