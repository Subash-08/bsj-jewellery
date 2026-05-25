'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface Props {
  content: string
  onChange: (content: string) => void
}

function parseContent(content: string): FAQItem[] {
  try {
    const parsed = JSON.parse(content)
    return Array.isArray(parsed) ? parsed : [{ q: '', a: '' }]
  } catch {
    return [{ q: '', a: '' }]
  }
}

export default function FAQBlock({ content, onChange }: Props) {
  const [items, setItems] = useState<FAQItem[]>(() => parseContent(content))

  useEffect(() => {
    setItems(parseContent(content))
  }, [content])

  function update(newItems: FAQItem[]) {
    setItems(newItems)
    onChange(JSON.stringify(newItems))
  }

  function setItem(i: number, field: 'q' | 'a', val: string) {
    const updated = items.map((item, idx) => (idx === i ? { ...item, [field]: val } : item))
    update(updated)
  }

  function addItem() {
    update([...items, { q: '', a: '' }])
  }

  function removeItem(i: number) {
    const filtered = items.filter((_, idx) => idx !== i)
    update(filtered.length > 0 ? filtered : [{ q: '', a: '' }])
  }

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="bg-stone-50 border border-stone-200 p-3 space-y-2 relative">
          <button
            type="button"
            onClick={() => removeItem(i)}
            className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Question {i + 1}</label>
            <input
              type="text"
              value={item.q}
              onChange={(e) => setItem(i, 'q', e.target.value)}
              className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532]"
              placeholder="Frequently asked question?"
            />
          </div>
          <div>
            <label className="text-xs text-gray-500 mb-1 block">Answer</label>
            <textarea
              value={item.a}
              onChange={(e) => setItem(i, 'a', e.target.value)}
              rows={3}
              className="w-full text-sm px-2 py-1.5 border border-stone-300 focus:outline-none focus:border-[#230532] resize-y"
              placeholder="Provide a clear, helpful answer..."
            />
          </div>
        </div>
      ))}
      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1 text-xs text-[#230532] hover:underline"
      >
        <Plus className="w-3 h-3" />
        Add FAQ item
      </button>
    </div>
  )
}
