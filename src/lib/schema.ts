import { SITE } from './seo.config'

export function organizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE.domain}/#organization`,
    name: SITE.fullName,
    url: SITE.domain,
    logo: {
      '@type': 'ImageObject',
      url: `${SITE.domain}/logo.png`,
      width: 300,
      height: 300,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: SITE.phone,
      contactType: 'customer service',
      areaServed: 'IN',
      availableLanguage: ['English', 'Tamil'],
    },
    sameAs: Object.values(SITE.social).filter((v): v is string => typeof v === 'string' && v.startsWith('http')),
    foundingDate: String(SITE.foundingYear),
    description:
      'Handcrafted BIS hallmarked silver jewellery from Tirunelveli since 1997',
  }
}

export function localBusinessSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'JewelryStore',
    '@id': `${SITE.domain}/#localbusiness`,
    name: SITE.fullName,
    url: SITE.domain,
    telephone: SITE.phone,
    email: SITE.email,
    priceRange: SITE.priceRange,
    currenciesAccepted: SITE.currenciesAccepted,
    paymentAccepted: SITE.paymentAccepted,
    openingHours: SITE.openingHours,
    address: {
      '@type': 'PostalAddress',
      streetAddress: SITE.address.street,
      addressLocality: SITE.address.city,
      addressRegion: SITE.address.state,
      postalCode: SITE.address.pincode,
      addressCountry: SITE.address.countryCode,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: SITE.geo.lat,
      longitude: SITE.geo.lng,
    },
    hasMap: `https://www.google.com/maps?q=${SITE.geo.lat},${SITE.geo.lng}`,
    image: `${SITE.domain}/storefront.jpg`,
    logo: `${SITE.domain}/logo.png`,
    parentOrganization: { '@id': `${SITE.domain}/#organization` },
  }
}

export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE.domain}/#website`,
    url: SITE.domain,
    name: SITE.name,
    description: SITE.tagline,
    publisher: { '@id': `${SITE.domain}/#organization` },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${SITE.domain}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
    inLanguage: 'en-IN',
  }
}

export function webPageSchema(opts: {
  type?:
    | 'WebPage'
    | 'AboutPage'
    | 'ContactPage'
    | 'CollectionPage'
    | 'ItemPage'
    | 'SearchResultsPage'
    | string[]
  name: string
  description: string
  url: string
  breadcrumbs?: Array<{ name: string; url: string }>
}) {
  const type = opts.type ?? 'WebPage'
  return {
    '@context': 'https://schema.org',
    '@type': type,
    '@id': `${opts.url}#webpage`,
    name: opts.name,
    description: opts.description,
    url: opts.url,
    isPartOf: { '@id': `${SITE.domain}/#website` },
    inLanguage: 'en-IN',
    ...(opts.breadcrumbs && opts.breadcrumbs.length > 0
      ? {
          breadcrumb: breadcrumbSchema(opts.breadcrumbs),
        }
      : {}),
  }
}

export function searchResultsPageSchema(query: string) {
  const url = `${SITE.domain}/search?q=${encodeURIComponent(query)}`
  return {
    '@context': 'https://schema.org',
    '@type': 'SearchResultsPage',
    '@id': `${url}#webpage`,
    name: `Search results for "${query}" — ${SITE.name}`,
    url,
    isPartOf: { '@id': `${SITE.domain}/#website` },
    inLanguage: 'en-IN',
  }
}

export function productSchema(product: {
  name: string
  description: string
  images: string[]
  price: string
  currency?: string
  sku: string
  mpn?: string
  gtin13?: string
  weightGrams?: number
  url: string
  category: string
  availability?: 'InStock' | 'OutOfStock'
  ratingValue?: number
  reviewCount?: number
  merchantReturnLink?: string
  reviews?: Array<{ author: string; datePublished: string; body: string; ratingValue: number }>
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description: product.description,
    image: product.images,
    sku: product.sku,
    ...(product.mpn ? { mpn: product.mpn } : {}),
    ...(product.gtin13 ? { gtin13: product.gtin13 } : {}),
    ...(product.weightGrams
      ? {
          weight: {
            '@type': 'QuantitativeValue',
            value: product.weightGrams,
            unitCode: 'GRM',
          },
        }
      : {}),
    brand: {
      '@type': 'Brand',
      name: SITE.name,
    },
    material: 'Sterling Silver',
    category: product.category,
    url: product.url,
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency ?? 'INR',
      availability: `https://schema.org/${product.availability ?? 'InStock'}`,
      url: product.url,
      seller: {
        '@type': 'Organization',
        name: SITE.fullName,
      },
      priceValidUntil: '2027-12-31',
      hasMerchantReturnPolicy: {
        '@type': 'MerchantReturnPolicy',
        returnPolicyCategory:
          'https://schema.org/MerchantReturnFiniteReturnWindow',
        merchantReturnDays: 7,
        returnMethod: 'https://schema.org/ReturnByMail',
        ...(product.merchantReturnLink
          ? { merchantReturnLink: product.merchantReturnLink }
          : { merchantReturnLink: `${SITE.domain}/return-refund-policy` }),
      },
      shippingDetails: {
        '@type': 'OfferShippingDetails',
        shippingRate: {
          '@type': 'MonetaryAmount',
          value: 0,
          currency: 'INR',
        },
        shippingDestination: {
          '@type': 'DefinedRegion',
          addressCountry: 'IN',
        },
        deliveryTime: {
          '@type': 'ShippingDeliveryTime',
          businessDays: {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: [
              'Monday',
              'Tuesday',
              'Wednesday',
              'Thursday',
              'Friday',
              'Saturday',
            ],
          },
          cutoffTime: '16:00:00+05:30',
          handlingTime: {
            '@type': 'QuantitativeValue',
            minValue: 1,
            maxValue: 2,
            unitCode: 'DAY',
          },
          transitTime: {
            '@type': 'QuantitativeValue',
            minValue: 2,
            maxValue: 5,
            unitCode: 'DAY',
          },
        },
      },
    },
    ...(product.ratingValue && product.reviewCount
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: product.ratingValue,
            reviewCount: product.reviewCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),
    ...(product.reviews && product.reviews.length > 0
      ? {
          review: product.reviews.map((r) => ({
            '@type': 'Review',
            author: { '@type': 'Person', name: r.author },
            datePublished: r.datePublished,
            reviewBody: r.body,
            reviewRating: {
              '@type': 'Rating',
              ratingValue: r.ratingValue,
              bestRating: 5,
              worstRating: 1,
            },
          })),
        }
      : {}),
  }
}

export function breadcrumbSchema(items: Array<{ name: string; url: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http')
        ? item.url
        : `${SITE.domain}${item.url}`,
    })),
  }
}

export function faqSchema(faqs: ReadonlyArray<{ q: string; a: string }>) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.a,
      },
    })),
  }
}

export function collectionPageSchema(opts: {
  name: string
  description: string
  url: string
  image?: string
  products: Array<{ name: string; url: string; image: string; price: string }>
  breadcrumbs?: Array<{ name: string; url: string }>
}) {
  const pageUrl = opts.url.startsWith('http') ? opts.url : `${SITE.domain}${opts.url}`
  const graph: object[] = [
    {
      '@type': 'CollectionPage',
      '@id': `${pageUrl}#webpage`,
      name: opts.name,
      description: opts.description,
      ...(opts.image ? { image: opts.image } : {}),
      url: pageUrl,
      publisher: { '@id': `${SITE.domain}/#organization` },
      inLanguage: 'en-IN',
      isPartOf: { '@id': `${SITE.domain}/#website` },
    },
    {
      '@type': 'ItemList',
      '@id': `${pageUrl}#itemlist`,
      name: opts.name,
      url: pageUrl,
      numberOfItems: opts.products.length,
      itemListElement: opts.products.map((p, i) => {
        const productUrl = p.url.startsWith('http') ? p.url : `${SITE.domain}${p.url}`
        return {
          '@type': 'ListItem',
          position: i + 1,
          name: p.name,
          url: productUrl,
          image: p.image,
          item: {
            '@type': 'Product',
            name: p.name,
            url: productUrl,
            image: p.image,
            offers: {
              '@type': 'Offer',
              price: p.price,
              priceCurrency: 'INR',
              availability: 'https://schema.org/InStock',
            },
          },
        }
      }),
    },
  ]

  if (opts.breadcrumbs && opts.breadcrumbs.length > 0) {
    graph.push(breadcrumbSchema(opts.breadcrumbs))
  }

  return {
    '@context': 'https://schema.org',
    '@graph': graph,
  }
}

export function blogListSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Blog',
    '@id': `${SITE.domain}/blog`,
    name: 'Bakya Journal',
    description:
      'Silver care guides, Tamil jewellery traditions, gifting ideas and craft stories from Bakya, Tirunelveli.',
    url: `${SITE.domain}/blog`,
    publisher: { '@id': `${SITE.domain}/#organization` },
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE.domain}/#website` },
  }
}

export function blogPostingSchema(post: {
  title: string
  description: string
  url: string
  image: string
  datePublished: string
  dateModified: string
  authorName: string
  authorUrl?: string
  tags?: string[]
  category?: string
  wordCount?: number
  readingTimeMinutes?: number
}) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    '@id': `${post.url}#article`,
    headline: post.title,
    description: post.description,
    image: {
      '@type': 'ImageObject',
      url: post.image,
      width: 1200,
      height: 630,
    },
    url: post.url,
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    ...(post.tags && post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {}),
    ...(post.category ? { articleSection: post.category } : {}),
    ...(post.wordCount ? { wordCount: post.wordCount } : {}),
    ...(post.readingTimeMinutes
      ? { timeRequired: `PT${post.readingTimeMinutes}M` }
      : {}),
    author: {
      '@type': 'Person',
      name: post.authorName,
      ...(post.authorUrl ? { url: post.authorUrl } : {}),
      worksFor: { '@id': `${SITE.domain}/#organization` },
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${SITE.domain}/#organization`,
      name: SITE.name,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE.domain}/logo.png`,
        width: 300,
        height: 300,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': post.url,
    },
    potentialAction: {
      '@type': 'ReadAction',
      target: [post.url],
    },
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE.domain}/#website` },
  }
}
