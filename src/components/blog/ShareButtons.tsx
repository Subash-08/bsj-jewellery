'use client'

import { useState } from 'react'
import { Link2, Check } from 'lucide-react'

interface Props {
  url: string
  title: string
}

export default function ShareButtons({ url, title }: Props) {
  const [copied, setCopied] = useState(false)
  const encoded = encodeURIComponent(url)
  const encodedTitle = encodeURIComponent(title)

  function copyLink() {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm text-gray-500 font-medium">Share:</span>
      <a
        href={`https://wa.me/?text=${encodedTitle}%20${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 border border-green-500 text-green-700 hover:bg-green-50 transition-colors"
      >
        WhatsApp
      </a>
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encoded}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs px-3 py-1.5 border border-blue-500 text-blue-700 hover:bg-blue-50 transition-colors"
      >
        Facebook
      </a>
      <button
        onClick={copyLink}
        className="flex items-center gap-1 text-xs px-3 py-1.5 border border-stone-300 text-gray-700 hover:border-[#230532] hover:text-[#230532] transition-colors"
      >
        {copied ? <Check className="w-3 h-3" /> : <Link2 className="w-3 h-3" />}
        {copied ? 'Copied!' : 'Copy link'}
      </button>
    </div>
  )
}
