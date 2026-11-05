export const SITE = {
  name: 'Bakya',
  fullName: 'Bakya by Bagyalakshmi Jewellers',
  tagline: 'Born from legacy. Built for generations.',
  domain: 'https://www.bakya.in',
  foundingYear: 1997,
  email: 'bagyalakshmijewellers97@gmail.com',
  phone: '+91-9025790527',
  address: {
    street: '57A/12 ERKP Building, Koolakadai Bazaar',
    city: 'Tirunelveli Town',
    state: 'Tamil Nadu',
    pincode: '627006',
    country: 'India',
    countryCode: 'IN',
  },
  geo: { lat: 8.7139, lng: 77.7567 },
  social: {
    instagram: 'https://www.instagram.com/bakya.jewels',
    facebook: '',
    pinterest: '',
    youtube: '',
    whatsapp: '+919025790527',
  },
  whatsappMessage: 'Hi Bakya! I want to enquire about your silver jewellery.',
  openingHours: 'Mo-Sa 09:30-20:00',
  priceRange: '₹₹',
  currenciesAccepted: 'INR',
  paymentAccepted: 'Cash, UPI, Credit Card, Debit Card',
} as const

const productDetailsNote =
  'See each product page for its available material, purity, size, weight and care information.'

export const COLLECTIONS = {
  anklets: {
    handle: 'silver-jewellery/anklets', title: 'Silver Anklets', h1: 'Silver Anklets (Kolusu)',
    metaTitle: 'Silver Anklets (Kolusu) Online | Bakya',
    metaDescription: 'Explore Bakya silver anklets and kolusu designs. Review product details, pricing and availability before purchase.',
    primaryKeyword: 'silver kolusu', keywords: ['silver kolusu', 'silver anklets', 'kolusu online', 'silver jewellery Tamil Nadu'],
    faqTitle: 'Silver Anklets - Common Questions',
    definition: `Explore Bakya's silver anklet and kolusu collection. ${productDetailsNote}`,
    description: `Silver kolusu, also called anklets, are a cherished part of Tamil jewellery tradition. Browse Bakya designs for everyday wear, gifting and special occasions. ${productDetailsNote} Shipping options and delivery estimates are shown at checkout.`,
  },
  bracelets: {
    handle: 'silver-jewellery/bracelets', title: 'Silver Bracelets', h1: 'Silver Bracelets',
    metaTitle: 'Silver Bracelets Online | Bakya',
    metaDescription: 'Explore Bakya silver bracelets for everyday wear and gifting. Review product details, pricing and availability before purchase.',
    primaryKeyword: 'silver bracelet', keywords: ['silver bracelet', 'silver bracelet gift', 'silver jewellery Tamil Nadu'],
    faqTitle: 'Silver Bracelets - Common Questions', definition: `Explore Bakya's silver bracelet collection. ${productDetailsNote}`,
    description: `Browse Bakya silver bracelets in a range of designs for everyday wear and gifting. ${productDetailsNote} Shipping options and delivery estimates are shown at checkout.`,
  },
  chains: {
    handle: 'silver-jewellery/chains', title: 'Silver Chains', h1: 'Silver Chains', metaTitle: 'Silver Chains Online | Bakya',
    metaDescription: 'Explore Bakya silver chains for women, men and children. Review product details, pricing and availability before purchase.',
    primaryKeyword: 'silver chain', keywords: ['silver chain', 'silver neck chain', 'silver jewellery Tamil Nadu'],
    faqTitle: 'Silver Chains - Common Questions', definition: `Explore Bakya's silver chain collection. ${productDetailsNote}`,
    description: `Browse Bakya silver chains in different designs and lengths. ${productDetailsNote} Shipping options and delivery estimates are shown at checkout.`,
  },
  pendants: {
    handle: 'silver-jewellery/pendants', title: 'Silver Pendants', h1: 'Silver Pendants', metaTitle: 'Silver Pendants Online | Bakya',
    metaDescription: 'Explore Bakya silver pendants for everyday wear, gifting and meaningful occasions. Review product details before purchase.',
    primaryKeyword: 'silver pendant', keywords: ['silver pendant', 'silver pendant gift', 'silver jewellery Tamil Nadu'],
    faqTitle: 'Silver Pendants - Common Questions', definition: `Explore Bakya's silver pendant collection. ${productDetailsNote}`,
    description: `Browse Bakya silver pendants for everyday wear, gifting and meaningful occasions. ${productDetailsNote} Shipping options and delivery estimates are shown at checkout.`,
  },
  rings: {
    handle: 'silver-jewellery/rings', title: 'Silver Rings', h1: 'Silver Rings', metaTitle: 'Silver Rings Online | Bakya',
    metaDescription: 'Explore Bakya silver rings for women, men and gifting. Review ring size, product details, pricing and availability before purchase.',
    primaryKeyword: 'silver rings', keywords: ['silver rings', 'silver ring women', 'silver ring men', 'silver jewellery Tamil Nadu'],
    faqTitle: 'Silver Rings - Common Questions', definition: `Explore Bakya's silver ring collection. ${productDetailsNote}`,
    description: `Browse Bakya silver rings for everyday wear, gifting and special occasions. Check the product page for ring size and other available details before purchase. Shipping options and delivery estimates are shown at checkout.`,
  },
} as const

const collectionFaqs = {
  'What details should I check before ordering?': productDetailsNote,
  'How can I confirm delivery options?': 'Available shipping options, charges and delivery estimates are shown at checkout. Please review the Shipping Policy for the current terms.',
  'What if I need help choosing a product?': 'Contact Bakya before purchase for help with a specific product, size or product detail.',
}

const standardFaqs = Object.entries(collectionFaqs).map(([q, a]) => ({ q, a }))

export const COLLECTION_FAQS = {
  anklets: [{ q: 'What is a kolusu?', a: 'Kolusu is a traditional Tamil word for an anklet.' }, ...standardFaqs],
  bracelets: standardFaqs,
  chains: standardFaqs,
  pendants: standardFaqs,
  rings: [{ q: 'How do I choose a ring size?', a: 'Check the size information on the product page and contact Bakya if you need help before ordering.' }, ...standardFaqs],
} as const

export const BLOG_CONFIG = {
  title: 'Bakya Journal - Silver Jewellery Guides & Tamil Culture',
  description: 'Guides on silver jewellery care, Tamil jewellery traditions, gifting ideas, and behind-the-craft stories from Bakya, Tirunelveli.',
  path: '/blog', perPage: 9, defaultAuthor: 'Bakya Team', defaultCoverImage: '/blog/images/placeholder.jpg',
} as const
