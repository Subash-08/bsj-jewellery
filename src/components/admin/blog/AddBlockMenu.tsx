'use client'

import { useState, useRef, useEffect } from 'react'
import { Plus } from 'lucide-react'
import type { BlockType } from '@/types/blog'

const BLOCK_OPTIONS: { type: BlockType; label: string; desc: string; icon: string }[] = [
  { type: 'paragraph', label: 'Paragraph', desc: 'Rich text paragraph', icon: '¶' },
  { type: 'h2', label: 'Heading 2', desc: 'Section heading', icon: 'H2' },
  { type: 'h3', label: 'Heading 3', desc: 'Sub-section heading', icon: 'H3' },
  { type: 'h4', label: 'Heading 4', desc: 'Small heading', icon: 'H4' },
  { type: 'image', label: 'Image', desc: 'Upload or embed image', icon: '🖼' },
  { type: 'quote', label: 'Blockquote', desc: 'Pull quote or citation', icon: '❝' },
  { type: 'code', label: 'Code', desc: 'Syntax-highlighted code', icon: '</>' },
  { type: 'list', label: 'List', desc: 'Bullet or numbered list', icon: '☰' },
  { type: 'faq', label: 'FAQ', desc: 'Q&A accordion items', icon: '?' },
  { type: 'divider', label: 'Divider', desc: 'Horizontal rule separator', icon: '—' },
  { type: 'callout', label: 'Callout', desc: 'Info, warning, or tip box', icon: '!' },
]

interface Props {
  onAdd: (type: BlockType) => void
}

export default function AddBlockMenu({ onAdd }: Props) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  function handleAdd(type: BlockType) {
    onAdd(type)
    setOpen(false)
  }

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-dashed border-[#230532] text-[#230532] hover:bg-[#230532] hover:text-white transition-colors"
      >
        <Plus className="w-4 h-4" />
        Add Block
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-50 w-64 bg-white border border-stone-200 shadow-lg">
          <div className="p-1.5 text-[10px] text-gray-400 font-semibold uppercase tracking-wider px-3 pt-2">
            Content Blocks
          </div>
          {BLOCK_OPTIONS.map((opt) => (
            <button
              key={opt.type}
              type="button"
              onClick={() => handleAdd(opt.type)}
              className="w-full flex items-start gap-3 px-3 py-2 hover:bg-stone-50 transition-colors text-left"
            >
              <span className="text-sm font-mono w-6 text-center text-gray-500 shrink-0 mt-0.5">
                {opt.icon}
              </span>
              <div>
                <div className="text-sm font-medium text-gray-800">{opt.label}</div>
                <div className="text-xs text-gray-400">{opt.desc}</div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
