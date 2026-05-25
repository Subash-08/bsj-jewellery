'use client'

import type { Product } from '@/types/shopify/product'
import { ProductCard } from '@/components/product/ProductCard'
import Image from 'next/image'
import { Playfair_Display, Montserrat } from 'next/font/google'
import { motion } from 'framer-motion'

const playfair = Playfair_Display({ subsets: ['latin'], weight: ['400', '600', '700'] })
const montserrat = Montserrat({ subsets: ['latin'], weight: ['300', '400', '500', '600'] })

export type EditorialBlockType = "large-image" | "featured-product" | "quote-block" | "collection-story" | "image-collage"

export interface EditorialBlock {
  position: number // Index in the grid to insert this block
  type: EditorialBlockType
  content: {
    title?: string
    description?: string
    imageUrl?: string
    imageUrl2?: string
    quote?: string
    author?: string
  }
}

interface ProductGridMixedLayoutProps {
  products: Product[]
  collectionHandle: string
  editorialBlocks: EditorialBlock[]
}

export function ProductGridMixedLayout({ products, collectionHandle, editorialBlocks }: ProductGridMixedLayoutProps) {
  // Merge products and editorial blocks into a single array for rendering
  const gridItems: ({ type: 'product', data: Product } | { type: 'editorial', data: EditorialBlock })[] = []
  
  let pIndex = 0
  let eIndex = 0
  let currentPos = 0

  const sortedBlocks = [...editorialBlocks].sort((a, b) => a.position - b.position)

  while (pIndex < products.length || eIndex < sortedBlocks.length) {
    const nextBlock = sortedBlocks[eIndex]
    if (nextBlock !== undefined && nextBlock.position === currentPos) {
      gridItems.push({ type: 'editorial', data: nextBlock })
      eIndex++
    } else if (pIndex < products.length) {
      const product = products[pIndex]!
      gridItems.push({ type: 'product', data: product })
      pIndex++
    } else if (eIndex < sortedBlocks.length) {
      const block = sortedBlocks[eIndex]!
      gridItems.push({ type: 'editorial', data: block })
      eIndex++
    }
    currentPos++
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6" style={{ gridAutoFlow: 'dense' }}>
      {gridItems.map((item, index) => {
        if (item.type === 'product') {
          return (
            <motion.div 
              key={`product-${item.data.id}-${index}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="col-span-1 row-span-1 flex flex-col h-full"
            >
              <ProductCard product={item.data} collectionHandle={collectionHandle} />
            </motion.div>
          )
        }

        // Editorial Block
        const block = item.data
        
        switch (block.type) {
          case 'large-image':
            return (
              <motion.div 
                key={`editorial-${index}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="col-span-2 row-span-2 relative rounded-[16px] overflow-hidden group shadow-sm flex flex-col min-h-[400px] md:min-h-[600px]"
              >
                <div className="absolute inset-0 bg-[#FAF8F5]" />
                {block.content.imageUrl && (
                  <Image
                    src={block.content.imageUrl}
                    alt={block.content.title || 'Editorial Image'}
                    fill
                    className="object-cover transition-transform duration-[1.5s] ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1C1510]/80 via-transparent to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-3 md:inset-4 rounded-[12px] border border-white/20 pointer-events-none" />
                <div className="relative z-10 mt-auto p-6 md:p-10 flex flex-col items-center text-center">
                  {block.content.title && (
                    <h3 className={`${playfair.className} text-white text-[24px] md:text-[36px] font-bold leading-tight mb-2 drop-shadow-md`}>
                      {block.content.title}
                    </h3>
                  )}
                  {block.content.description && (
                    <p className={`${montserrat.className} text-white/90 text-[12px] md:text-[14px] max-w-sm drop-shadow-md`}>
                      {block.content.description}
                    </p>
                  )}
                </div>
              </motion.div>
            )
            
          case 'collection-story':
            return (
              <motion.div 
                key={`editorial-${index}`}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col-span-2 row-span-1 rounded-[16px] bg-[#FAF8F5] border border-[#EDE8E0] p-6 md:p-10 flex flex-col items-center justify-center text-center shadow-sm min-h-[250px]"
              >
                {block.content.title && (
                  <h3 className={`${playfair.className} text-[#1C1510] text-[20px] md:text-[28px] font-bold leading-tight mb-3`}>
                    {block.content.title}
                  </h3>
                )}
                <div className="h-px w-12 bg-[#C9A96E]/50 mb-4" />
                {block.content.description && (
                  <p className={`${montserrat.className} text-[#4A3F35] text-[13px] md:text-[14px] leading-relaxed max-w-md`}>
                    {block.content.description}
                  </p>
                )}
              </motion.div>
            )
            
          case 'quote-block':
            return (
              <motion.div 
                key={`editorial-${index}`}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="col-span-2 row-span-1 rounded-[16px] bg-[#1C1510] p-8 md:p-12 flex flex-col items-center justify-center text-center shadow-lg relative overflow-hidden min-h-[250px]"
              >
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23C9A96E\' fill-opacity=\'1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }} />
                <span className={`${playfair.className} text-[#C9A96E] text-[60px] leading-none absolute top-4 left-6 opacity-30`}>&ldquo;</span>
                {block.content.quote && (
                  <p className={`${playfair.className} text-[#FAF6F0] text-[20px] md:text-[26px] font-medium leading-relaxed italic z-10 mb-4`}>
                    {block.content.quote}
                  </p>
                )}
                {block.content.author && (
                  <span className={`${montserrat.className} text-[#C9A96E] text-[11px] uppercase tracking-widest font-semibold z-10 block`}>
                    — {block.content.author}
                  </span>
                )}
              </motion.div>
            )
            
          case 'image-collage':
            return (
              <motion.div 
                key={`editorial-${index}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="col-span-2 row-span-2 relative grid grid-cols-2 grid-rows-2 gap-3 min-h-[400px] md:min-h-[600px]"
              >
                <div className="col-span-2 row-span-1 relative rounded-[16px] overflow-hidden shadow-sm">
                  {block.content.imageUrl && (
                    <Image src={block.content.imageUrl} alt="Editorial Top" fill className="object-cover" />
                  )}
                </div>
                <div className="col-span-1 row-span-1 relative rounded-[16px] overflow-hidden shadow-sm bg-[#FAF8F5]">
                  {block.content.imageUrl2 && (
                    <Image src={block.content.imageUrl2} alt="Editorial Bottom Left" fill className="object-cover" />
                  )}
                </div>
                <div className="col-span-1 row-span-1 rounded-[16px] bg-[#F3EFE8] border border-[#EDE8E0] flex flex-col items-center justify-center text-center p-4 shadow-sm">
                  <h3 className={`${playfair.className} text-[#1C1510] text-[18px] md:text-[22px] font-bold leading-tight mb-2`}>
                    {block.content.title}
                  </h3>
                  <p className={`${montserrat.className} text-[#4A3F35] text-[11px] leading-relaxed`}>
                    {block.content.description}
                  </p>
                </div>
              </motion.div>
            )

          case 'featured-product':
            return (
              <motion.div 
                key={`editorial-${index}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                className="col-span-1 row-span-2 md:col-span-2 md:row-span-2 relative rounded-[16px] overflow-hidden group shadow-sm flex flex-col bg-[#F3EFE8] min-h-[400px] md:min-h-[600px]"
              >
                {block.content.imageUrl && (
                  <Image
                    src={block.content.imageUrl}
                    alt={block.content.title || 'Featured Product'}
                    fill
                    className="object-contain p-8 transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-[#F3EFE8] via-[#F3EFE8]/20 to-transparent opacity-90" />
                <div className="relative z-10 mt-auto p-6 md:p-8 flex flex-col items-center text-center">
                  <span className={`${montserrat.className} text-[#B8882A] text-[10px] uppercase tracking-widest font-bold mb-2`}>
                    Featured Design
                  </span>
                  {block.content.title && (
                    <h3 className={`${playfair.className} text-[#1C1510] text-[22px] md:text-[28px] font-bold leading-tight mb-2`}>
                      {block.content.title}
                    </h3>
                  )}
                </div>
              </motion.div>
            )
            
          default:
            return null
        }
      })}
    </div>
  )
}
