'use client'

import { EditorContent } from '@tiptap/react'
import { useTiptapEditor } from '@/hooks/useTiptapEditor'
import { useEffect } from 'react'

interface Props {
  content: string
  onChange: (html: string) => void
}

export default function QuoteBlock({ content, onChange }: Props) {
  const editor = useTiptapEditor(content, 'Enter blockquote text...')

  useEffect(() => {
    if (!editor) return
    const handleUpdate = () => onChange(editor.getHTML())
    editor.on('update', handleUpdate)
    return () => { editor.off('update', handleUpdate) }
  }, [editor, onChange])

  useEffect(() => {
    if (!editor || editor.getHTML() === content) return
    editor.commands.setContent(content, false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="border-l-4 border-[#D4AF37] pl-4 bg-amber-50/40">
      <div className="prose prose-stone prose-sm max-w-none min-h-[60px] py-2 text-gray-800 [&_.ProseMirror]:outline-none">
        <EditorContent editor={editor} />
      </div>
    </div>
  )
}
