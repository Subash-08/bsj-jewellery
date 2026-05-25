'use client'

import { useState } from 'react'
import { Blocks, Link2 } from 'lucide-react'
import type { ContentBlock } from '@/types/blog'
import BlockEditor from '../BlockEditor'
import LinkManagerPanel from '../LinkManagerPanel'
import { blocksToWordCount } from '@/lib/blog/blocks-to-markdown'

interface Props {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export default function ContentStep({ blocks, onChange }: Props) {
  const [tab, setTab] = useState<'blocks' | 'links'>('blocks')

  const wordCount = blocksToWordCount(blocks)
  const readingMin = Math.max(1, Math.round(wordCount / 200))

  return (
    <div className="space-y-4">
      {/* tab bar + stats */}
      <div className="flex items-center justify-between border-b border-stone-200">
        <div className="flex gap-0">
          <button
            type="button"
            onClick={() => setTab('blocks')}
            className={`flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 transition-colors ${
              tab === 'blocks'
                ? 'border-[#230532] text-[#230532] font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Blocks className="w-4 h-4" />
            Content Blocks
          </button>
          <button
            type="button"
            onClick={() => setTab('links')}
            className={`flex items-center gap-1.5 text-sm px-4 py-2.5 border-b-2 transition-colors ${
              tab === 'links'
                ? 'border-[#230532] text-[#230532] font-medium'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link2 className="w-4 h-4" />
            Link Manager
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-400 pr-1 pb-1">
          <span>{wordCount.toLocaleString()} words</span>
          <span>~{readingMin} min read</span>
          <span>{blocks.length} block{blocks.length !== 1 ? 's' : ''}</span>
        </div>
      </div>

      {/* tab content */}
      {tab === 'blocks' && <BlockEditor blocks={blocks} onChange={onChange} />}
      {tab === 'links' && <LinkManagerPanel blocks={blocks} />}
    </div>
  )
}
