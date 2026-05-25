'use client'

import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { restrictToVerticalAxis } from '@dnd-kit/modifiers'
import { FileCode2 } from 'lucide-react'
import type { ContentBlock, BlockType } from '@/types/blog'
import BlockItem from './BlockItem'
import AddBlockMenu from './AddBlockMenu'
import HtmlImportModal from './HtmlImportModal'

function newBlock(type: BlockType): ContentBlock {
  const id = `block_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`
  const defaults: Record<BlockType, Partial<ContentBlock>> = {
    paragraph: { content: '' },
    h2: { content: '', anchorId: '' },
    h3: { content: '', anchorId: '' },
    h4: { content: '' },
    image: { content: '', altText: '', caption: '' },
    quote: { content: '' },
    code: { content: '', language: 'text' },
    list: { content: JSON.stringify({ ordered: false, items: [''] }) },
    faq: { content: JSON.stringify([{ q: '', a: '' }]) },
    divider: { content: '' },
    callout: { content: '', calloutType: 'info' },
  }
  return { id, type, ...defaults[type] } as ContentBlock
}

interface Props {
  blocks: ContentBlock[]
  onChange: (blocks: ContentBlock[]) => void
}

export default function BlockEditor({ blocks, onChange }: Props) {
  const [importOpen, setImportOpen] = useState(false)

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = blocks.findIndex((b) => b.id === active.id)
    const newIndex = blocks.findIndex((b) => b.id === over.id)
    onChange(arrayMove(blocks, oldIndex, newIndex))
  }

  function handleAdd(type: BlockType) {
    onChange([...blocks, newBlock(type)])
  }

  function handleChange(updated: ContentBlock) {
    onChange(blocks.map((b) => (b.id === updated.id ? updated : b)))
  }

  function handleDelete(id: string) {
    onChange(blocks.filter((b) => b.id !== id))
  }

  function handleMove(id: string, direction: 'up' | 'down') {
    const idx = blocks.findIndex((b) => b.id === id)
    if (direction === 'up' && idx > 0) onChange(arrayMove(blocks, idx, idx - 1))
    if (direction === 'down' && idx < blocks.length - 1) onChange(arrayMove(blocks, idx, idx + 1))
  }

  function handleImport(imported: ContentBlock[]) {
    onChange([...blocks, ...imported])
  }

  return (
    <div className="space-y-3">
      {/* block count */}
      {blocks.length > 0 && (
        <div className="text-xs text-gray-400">
          {blocks.length} block{blocks.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* sortable list */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToVerticalAxis]}
      >
        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {blocks.map((block, i) => (
              <BlockItem
                key={block.id}
                block={block}
                index={i}
                total={blocks.length}
                onChange={handleChange}
                onDelete={handleDelete}
                onMove={handleMove}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* empty state */}
      {blocks.length === 0 && (
        <div className="border-2 border-dashed border-stone-200 rounded p-8 text-center text-gray-400">
          <p className="text-sm">No blocks yet.</p>
          <p className="text-xs mt-1">Add your first block or import from HTML below.</p>
        </div>
      )}

      {/* toolbar */}
      <div className="flex items-center gap-2 pt-1">
        <AddBlockMenu onAdd={handleAdd} />
        <button
          type="button"
          onClick={() => setImportOpen(true)}
          className="flex items-center gap-1.5 text-sm px-3 py-1.5 border border-stone-300 text-gray-600 hover:border-stone-500 hover:text-gray-800 transition-colors"
        >
          <FileCode2 className="w-4 h-4" />
          Import HTML
        </button>
      </div>

      {importOpen && (
        <HtmlImportModal
          onImport={handleImport}
          onClose={() => setImportOpen(false)}
        />
      )}
    </div>
  )
}
