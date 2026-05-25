'use client'

import { Info, AlertTriangle, Lightbulb } from 'lucide-react'
import { EditorContent } from '@tiptap/react'
import { useTiptapEditor } from '@/hooks/useTiptapEditor'
import { useEffect } from 'react'

const CALLOUT_STYLES = {
  info: {
    border: 'border-blue-300',
    bg: 'bg-blue-50',
    icon: Info,
    iconClass: 'text-blue-500',
    label: 'Info',
  },
  warning: {
    border: 'border-amber-300',
    bg: 'bg-amber-50',
    icon: AlertTriangle,
    iconClass: 'text-amber-500',
    label: 'Warning',
  },
  tip: {
    border: 'border-green-300',
    bg: 'bg-green-50',
    icon: Lightbulb,
    iconClass: 'text-green-500',
    label: 'Tip',
  },
}

interface Props {
  content: string
  calloutType: 'info' | 'warning' | 'tip'
  onChange: (content: string, calloutType: 'info' | 'warning' | 'tip') => void
}

export default function CalloutBlock({ content, calloutType, onChange }: Props) {
  const editor = useTiptapEditor(content, 'Write callout text...')
  const style = CALLOUT_STYLES[calloutType]
  const Icon = style.icon

  useEffect(() => {
    if (!editor) return
    const handleUpdate = () => onChange(editor.getHTML(), calloutType)
    editor.on('update', handleUpdate)
    return () => { editor.off('update', handleUpdate) }
  }, [editor, onChange, calloutType])

  useEffect(() => {
    if (!editor || editor.getHTML() === content) return
    editor.commands.setContent(content, false)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        {(['info', 'warning', 'tip'] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => onChange(content, t)}
            className={`text-xs px-2.5 py-1 border font-medium capitalize transition-colors ${
              calloutType === t
                ? `${CALLOUT_STYLES[t].bg} ${CALLOUT_STYLES[t].border} ${CALLOUT_STYLES[t].iconClass}`
                : 'border-stone-200 text-gray-500 hover:border-stone-400'
            }`}
          >
            {CALLOUT_STYLES[t].label}
          </button>
        ))}
      </div>

      <div className={`border-l-4 ${style.border} ${style.bg} p-3 flex gap-2`}>
        <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${style.iconClass}`} />
        <div className="flex-1 min-w-0 prose prose-stone prose-sm max-w-none text-gray-800 [&_.ProseMirror]:outline-none [&_.ProseMirror]:min-h-[40px]">
          <EditorContent editor={editor} />
        </div>
      </div>
    </div>
  )
}
