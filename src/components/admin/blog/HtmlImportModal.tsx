'use client'

import { useState } from 'react'
import { X, FileCode2 } from 'lucide-react'
import type { ContentBlock } from '@/types/blog'
import { parseHtmlToBlocks } from '@/lib/blog/html-to-blocks'

interface Props {
  onImport: (blocks: ContentBlock[]) => void
  onClose: () => void
}

export default function HtmlImportModal({ onImport, onClose }: Props) {
  const [html, setHtml] = useState('')
  const [preview, setPreview] = useState<ContentBlock[] | null>(null)
  const [error, setError] = useState('')

  function handleParse() {
    if (!html.trim()) { setError('Paste some HTML first.'); return }
    try {
      const blocks = parseHtmlToBlocks(html)
      if (blocks.length === 0) { setError('No recognisable blocks found in the HTML.'); return }
      setPreview(blocks)
      setError('')
    } catch {
      setError('Failed to parse HTML.')
    }
  }

  function handleConfirm() {
    if (!preview) return
    onImport(preview)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl">
        {/* header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <FileCode2 className="w-4 h-4 text-[#230532]" />
            <h2 className="text-sm font-semibold text-gray-800">Import from HTML</h2>
          </div>
          <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          <div>
            <label className="block text-xs text-gray-500 mb-1.5">Paste HTML content</label>
            <textarea
              value={html}
              onChange={(e) => { setHtml(e.target.value); setPreview(null); setError('') }}
              rows={12}
              placeholder="<h2>My Heading</h2><p>Some paragraph...</p>"
              className="w-full text-xs font-mono px-3 py-2 border border-stone-300 focus:outline-none focus:border-[#230532] resize-y bg-stone-50"
              spellCheck={false}
            />
          </div>

          {error && <p className="text-xs text-red-600">{error}</p>}

          {preview && (
            <div>
              <p className="text-xs text-green-700 mb-2 font-medium">
                ✓ Parsed {preview.length} block{preview.length !== 1 ? 's' : ''} — ready to import
              </p>
              <div className="space-y-1 border border-stone-200 p-3 bg-stone-50 max-h-48 overflow-y-auto">
                {preview.map((b, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <span className="font-mono text-gray-400 w-16 shrink-0">{b.type}</span>
                    <span className="text-gray-600 truncate">
                      {b.type === 'image'
                        ? b.content || '(image)'
                        : b.content.replace(/<[^>]+>/g, '').slice(0, 80) || '(empty)'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* footer */}
        <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-stone-200">
          <button
            type="button"
            onClick={onClose}
            className="text-sm px-4 py-1.5 border border-stone-300 text-gray-600 hover:border-stone-500"
          >
            Cancel
          </button>
          {!preview ? (
            <button
              type="button"
              onClick={handleParse}
              className="text-sm px-4 py-1.5 bg-[#230532] text-white hover:bg-[#3a0952] transition-colors"
            >
              Parse HTML
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="text-sm px-4 py-1.5 bg-green-700 text-white hover:bg-green-800 transition-colors"
            >
              Import {preview.length} block{preview.length !== 1 ? 's' : ''}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
