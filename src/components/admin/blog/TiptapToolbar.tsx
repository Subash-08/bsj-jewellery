'use client'

import type { Editor } from '@tiptap/react'
import { Bold, Italic, Underline, Link, Unlink, Undo, Redo } from 'lucide-react'
import { useState } from 'react'

interface Props {
  editor: Editor | null
}

function ToolbarBtn({
  onClick,
  active,
  title,
  children,
}: {
  onClick: () => void
  active?: boolean
  title: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`w-7 h-7 flex items-center justify-center rounded text-sm transition-colors ${
        active
          ? 'bg-[#230532] text-white'
          : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {children}
    </button>
  )
}

export default function TiptapToolbar({ editor }: Props) {
  const [showLinkInput, setShowLinkInput] = useState(false)
  const [linkUrl, setLinkUrl] = useState('')

  if (!editor) return null

  function applyLink() {
    if (!linkUrl.trim()) return
    editor?.chain().focus().setLink({ href: linkUrl }).run()
    setLinkUrl('')
    setShowLinkInput(false)
  }

  return (
    <div className="border-b border-stone-200 bg-stone-50 px-2 py-1.5 flex flex-wrap items-center gap-0.5">
      <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold">
        <Bold className="w-3.5 h-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic">
        <Italic className="w-3.5 h-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline">
        <Underline className="w-3.5 h-3.5" />
      </ToolbarBtn>
      <div className="w-px h-4 bg-stone-300 mx-1" />
      <ToolbarBtn
        onClick={() => {
          if (editor.isActive('link')) {
            editor.chain().focus().unsetLink().run()
          } else {
            const existing = editor.getAttributes('link').href as string | undefined
            setLinkUrl(existing ?? 'https://')
            setShowLinkInput(true)
          }
        }}
        active={editor.isActive('link')}
        title={editor.isActive('link') ? 'Remove link' : 'Add link'}
      >
        {editor.isActive('link') ? <Unlink className="w-3.5 h-3.5" /> : <Link className="w-3.5 h-3.5" />}
      </ToolbarBtn>
      <div className="w-px h-4 bg-stone-300 mx-1" />
      <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} title="Undo">
        <Undo className="w-3.5 h-3.5" />
      </ToolbarBtn>
      <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} title="Redo">
        <Redo className="w-3.5 h-3.5" />
      </ToolbarBtn>

      {showLinkInput && (
        <div className="w-full mt-1.5 flex gap-1">
          <input
            type="url"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyLink()
              if (e.key === 'Escape') setShowLinkInput(false)
            }}
            placeholder="https://example.com"
            className="flex-1 text-xs px-2 py-1 border border-stone-300 focus:outline-none focus:border-[#230532]"
            autoFocus
          />
          <button
            type="button"
            onClick={applyLink}
            className="text-xs px-2 py-1 bg-[#230532] text-white hover:bg-purple-900"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={() => setShowLinkInput(false)}
            className="text-xs px-2 py-1 border border-stone-300 text-gray-600"
          >
            Cancel
          </button>
        </div>
      )}
    </div>
  )
}
