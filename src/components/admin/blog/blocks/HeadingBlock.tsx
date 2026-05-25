'use client'

import { useState, useEffect } from 'react'
import type { BlockType } from '@/types/blog'

interface Props {
  type: Extract<BlockType, 'h2' | 'h3' | 'h4'>
  content: string
  anchorId?: string
  onChange: (content: string, anchorId: string) => void
}

function toAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/<[^>]*>/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export default function HeadingBlock({ type, content, anchorId, onChange }: Props) {
  const [text, setText] = useState(content.replace(/<[^>]*>/g, ''))

  useEffect(() => {
    setText(content.replace(/<[^>]*>/g, ''))
  }, [content])

  function handleChange(val: string) {
    setText(val)
    const computed = toAnchorId(val)
    onChange(`<${type}>${val}</${type}>`, computed)
  }

  const level = type === 'h2' ? 'text-xl font-bold' : type === 'h3' ? 'text-lg font-semibold' : 'text-base font-semibold'
  const placeholder = type === 'h2' ? 'H2 Section Heading' : type === 'h3' ? 'H3 Sub-heading' : 'H4 Minor heading'

  return (
    <div className="space-y-1.5">
      <input
        type="text"
        value={text}
        onChange={(e) => handleChange(e.target.value)}
        placeholder={placeholder}
        className={`w-full px-0 py-1 bg-transparent border-b border-stone-300 focus:outline-none focus:border-[#230532] ${level} text-gray-900 placeholder:text-gray-400`}
      />
      {(type === 'h2' || type === 'h3') && text && (
        <p className="text-[10px] text-gray-400 font-mono">
          anchor: #{anchorId || toAnchorId(text)}
        </p>
      )}
    </div>
  )
}
