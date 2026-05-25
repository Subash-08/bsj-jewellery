'use client'

import { useState, useEffect } from 'react'
import { Plus, X } from 'lucide-react'

interface ListData {
  ordered: boolean
  items: string[]
}

interface Props {
  content: string
  onChange: (content: string) => void
}

function parseContent(content: string): ListData {
  try {
    return JSON.parse(content) as ListData
  } catch {
    return { ordered: false, items: content ? [content] : [''] }
  }
}

export default function ListBlock({ content, onChange }: Props) {
  const [data, setData] = useState<ListData>(() => parseContent(content))

  useEffect(() => {
    setData(parseContent(content))
  }, [content])

  function update(newData: ListData) {
    setData(newData)
    onChange(JSON.stringify(newData))
  }

  function setItem(i: number, val: string) {
    const items = [...data.items]
    items[i] = val
    update({ ...data, items })
  }

  function addItem() {
    update({ ...data, items: [...data.items, ''] })
  }

  function removeItem(i: number) {
    const items = data.items.filter((_, idx) => idx !== i)
    update({ ...data, items: items.length > 0 ? items : [''] })
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3 mb-3">
        <span className="text-xs text-gray-500">Type:</span>
        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={!data.ordered}
            onChange={() => update({ ...data, ordered: false })}
          />
          Bullet list
        </label>
        <label className="flex items-center gap-1.5 text-sm cursor-pointer">
          <input
            type="radio"
            checked={data.ordered}
            onChange={() => update({ ...data, ordered: true })}
          />
          Numbered list
        </label>
      </div>

      <div className="space-y-1.5">
        {data.items.map((item, i) => (
          <div key={i} className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-5 shrink-0">
              {data.ordered ? `${i + 1}.` : '•'}
            </span>
            <input
              type="text"
              value={item}
              onChange={(e) => setItem(i, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') { e.preventDefault(); addItem() }
                if (e.key === 'Backspace' && !item && data.items.length > 1) {
                  e.preventDefault(); removeItem(i)
                }
              }}
              className="flex-1 text-sm px-2 py-1.5 border border-stone-200 focus:outline-none focus:border-[#230532]"
              placeholder={`List item ${i + 1}`}
            />
            {data.items.length > 1 && (
              <button type="button" onClick={() => removeItem(i)} className="text-gray-400 hover:text-red-500">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={addItem}
        className="flex items-center gap-1 text-xs text-[#230532] hover:underline mt-1"
      >
        <Plus className="w-3 h-3" />
        Add item
      </button>
    </div>
  )
}
