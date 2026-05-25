'use client'

import { EditorContent } from '@tiptap/react'
import { useTiptapEditor } from '@/hooks/useTiptapEditor'
import TiptapToolbar from '../TiptapToolbar'
import { useEffect } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function ParagraphBlock({ content, onChange }: Props) {
  const editor = useTiptapEditor(content, 'Write paragraph content...')

  useEffect(() => {
    if (!editor) return
    const handleUpdate = () => onChange(editor.getHTML())
    editor.on('update', handleUpdate)
    return () => { editor.off('update', handleUpdate) }
  }, [editor, onChange])

  // Sync external content changes (e.g. on block load)
  useEffect(() => {
    if (!editor || editor.getHTML() === content) return
    editor.commands.setContent(content, false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="border border-stone-200 focus-within:border-[#230532] transition-colors">
      <TiptapToolbar editor={editor} />
      <div className="prose prose-stone prose-sm max-w-none min-h-[100px] p-3 text-gray-800 [&_.ProseMirror]:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
