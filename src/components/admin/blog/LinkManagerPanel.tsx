'use client'

import { useMemo, useState } from 'react'
import { ExternalLink, Link2, ShieldOff } from 'lucide-react'
import type { ContentBlock, ExtractedLink } from '@/types/blog'

function extractLinks(blocks: ContentBlock[]): ExtractedLink[] {
  const links: ExtractedLink[] = []
  const parser = typeof window !== 'undefined' ? new DOMParser() : null
  if (!parser) return links

  for (const block of blocks) {
    if (!block.content || ['divider', 'list', 'faq', 'code', 'image'].includes(block.type)) continue
    const doc = parser.parseFromString(block.content, 'text/html')
    doc.querySelectorAll('a[href]').forEach((el) => {
      const anchor = el as HTMLAnchorElement
      const href = anchor.getAttribute('href') ?? ''
      if (!href || href.startsWith('#')) return
      links.push({
        text: anchor.textContent?.trim() || href,
        href,
        blockId: block.id,
        isExternal: href.startsWith('http'),
        isNofollow: (anchor.getAttribute('rel') ?? '').includes('nofollow'),
      })
    })
  }
  return links
}

interface Props {
  blocks: ContentBlock[]
}

export default function LinkManagerPanel({ blocks }: Props) {
  const [filter, setFilter] = useState<'all' | 'internal' | 'external'>('all')
  const links = useMemo(() => extractLinks(blocks), [blocks])

  const filtered = links.filter((l) => {
    if (filter === 'internal') return !l.isExternal
    if (filter === 'external') return l.isExternal
    return true
  })

  if (links.length === 0) {
    return (
      <div className="text-center py-10 text-gray-400">
        <Link2 className="w-8 h-8 mx-auto mb-2 opacity-40" />
        <p className="text-sm">No links found in your content blocks.</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {/* stats + filter */}
      <div className="flex items-center gap-4">
        <div className="flex gap-1">
          {(['all', 'internal', 'external'] as const).map((f) => {
            const count = f === 'all' ? links.length : links.filter((l) => f === 'external' ? l.isExternal : !l.isExternal).length
            return (
              <button
                key={f}
                type="button"
                onClick={() => setFilter(f)}
                className={`text-xs px-2.5 py-1 border capitalize transition-colors ${
                  filter === f
                    ? 'bg-[#230532] text-white border-[#230532]'
                    : 'border-stone-300 text-gray-600 hover:border-stone-400'
                }`}
              >
                {f} ({count})
              </button>
            )
          })}
        </div>
        <span className="text-xs text-gray-400 ml-auto">{links.length} total link{links.length !== 1 ? 's' : ''}</span>
      </div>

      {/* table */}
      <div className="border border-stone-200 overflow-hidden">
        <table className="w-full text-xs">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              <th className="text-left px-3 py-2 text-gray-500 font-medium">Link Text</th>
              <th className="text-left px-3 py-2 text-gray-500 font-medium">URL</th>
              <th className="text-center px-3 py-2 text-gray-500 font-medium w-20">Type</th>
              <th className="text-center px-3 py-2 text-gray-500 font-medium w-20">Nofollow</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((link, i) => (
              <tr key={i} className="border-b border-stone-100 last:border-0 hover:bg-stone-50">
                <td className="px-3 py-2 text-gray-700 max-w-[180px]">
                  <span className="block truncate">{link.text}</span>
                </td>
                <td className="px-3 py-2 max-w-[220px]">
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[#230532] hover:underline flex items-center gap-1 truncate block"
                  >
                    <span className="truncate">{link.href}</span>
                    {link.isExternal && <ExternalLink className="w-3 h-3 shrink-0" />}
                  </a>
                </td>
                <td className="px-3 py-2 text-center">
                  <span
                    className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-medium ${
                      link.isExternal ? 'bg-blue-50 text-blue-600' : 'bg-stone-100 text-stone-600'
                    }`}
                  >
                    {link.isExternal ? 'ext' : 'int'}
                  </span>
                </td>
                <td className="px-3 py-2 text-center">
                  {link.isNofollow && (
                    <span title="nofollow">
                      <ShieldOff className="w-3 h-3 text-amber-500 mx-auto" />
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
