'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { GripVertical, Trash2, ChevronUp, ChevronDown } from 'lucide-react'
import type { ContentBlock } from '@/types/blog'
import ParagraphBlock from './blocks/ParagraphBlock'
import HeadingBlock from './blocks/HeadingBlock'
import ImageBlock from './blocks/ImageBlock'
import CodeBlock from './blocks/CodeBlock'
import QuoteBlock from './blocks/QuoteBlock'
import ListBlock from './blocks/ListBlock'
import FAQBlock from './blocks/FAQBlock'
import DividerBlock from './blocks/DividerBlock'
import CalloutBlock from './blocks/CalloutBlock'

const TYPE_LABELS: Record<ContentBlock['type'], string> = {
  paragraph: 'P',
  h2: 'H2',
  h3: 'H3',
  h4: 'H4',
  image: 'IMG',
  quote: '❝',
  code: '</>',
  list: '☰',
  faq: 'FAQ',
  divider: '—',
  callout: '!',
}

const TYPE_COLORS: Record<ContentBlock['type'], string> = {
  paragraph: 'bg-stone-100 text-stone-600',
  h2: 'bg-purple-100 text-purple-700',
  h3: 'bg-purple-50 text-purple-600',
  h4: 'bg-purple-50 text-purple-500',
  image: 'bg-blue-50 text-blue-600',
  quote: 'bg-amber-50 text-amber-700',
  code: 'bg-stone-800 text-green-400',
  list: 'bg-teal-50 text-teal-600',
  faq: 'bg-indigo-50 text-indigo-600',
  divider: 'bg-gray-50 text-gray-400',
  callout: 'bg-yellow-50 text-yellow-700',
}

interface Props {
  block: ContentBlock
  index: number
  total: number
  onChange: (updated: ContentBlock) => void
  onDelete: (id: string) => void
  onMove: (id: string, direction: 'up' | 'down') => void
}

export default function BlockItem({ block, index, total, onChange, onDelete, onMove }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  function patch(partial: Partial<ContentBlock>) {
    onChange({ ...block, ...partial })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group flex gap-2 items-start"
    >
      {/* drag handle + controls */}
      <div className="flex flex-col items-center gap-0.5 pt-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => onMove(block.id, 'up')}
          className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
        >
          <ChevronUp className="w-3.5 h-3.5" />
        </button>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-gray-600 touch-none"
        >
          <GripVertical className="w-4 h-4" />
        </div>
        <button
          type="button"
          disabled={index === total - 1}
          onClick={() => onMove(block.id, 'down')}
          className="text-gray-300 hover:text-gray-600 disabled:opacity-20"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* block card */}
      <div className="flex-1 border border-stone-200 bg-white hover:border-stone-300 transition-colors">
        {/* header */}
        <div className="flex items-center gap-2 px-3 py-1.5 border-b border-stone-100 bg-stone-50/60">
          <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded font-mono ${TYPE_COLORS[block.type]}`}>
            {TYPE_LABELS[block.type]}
          </span>
          <span className="text-xs text-gray-400 capitalize">{block.type}</span>
          <div className="ml-auto">
            <button
              type="button"
              onClick={() => onDelete(block.id)}
              className="text-gray-300 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* block content */}
        <div className="p-3">
          {block.type === 'paragraph' && (
            <ParagraphBlock
              content={block.content}
              onChange={(html) => patch({ content: html })}
            />
          )}
          {(block.type === 'h2' || block.type === 'h3' || block.type === 'h4') && (
            <HeadingBlock
              level={block.type}
              content={block.content}
              anchorId={block.anchorId}
              onChange={(content, anchorId) => patch({ content, anchorId })}
            />
          )}
          {block.type === 'image' && (
            <ImageBlock
              src={block.content}
              altText={block.altText ?? ''}
              caption={block.caption ?? ''}
              onChange={(src, altText, caption) => patch({ content: src, altText, caption })}
            />
          )}
          {block.type === 'code' && (
            <CodeBlock
              content={block.content}
              language={block.language ?? 'text'}
              onChange={(content, language) => patch({ content, language })}
            />
          )}
          {block.type === 'quote' && (
            <QuoteBlock
              content={block.content}
              onChange={(html) => patch({ content: html })}
            />
          )}
          {block.type === 'list' && (
            <ListBlock
              content={block.content}
              onChange={(json) => patch({ content: json })}
            />
          )}
          {block.type === 'faq' && (
            <FAQBlock
              content={block.content}
              onChange={(json) => patch({ content: json })}
            />
          )}
          {block.type === 'divider' && <DividerBlock />}
          {block.type === 'callout' && (
            <CalloutBlock
              content={block.content}
              calloutType={block.calloutType ?? 'info'}
              onChange={(html, calloutType) => patch({ content: html, calloutType })}
            />
          )}
        </div>
      </div>
    </div>
  )
}
