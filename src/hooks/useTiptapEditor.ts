'use client'

import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import Underline from '@tiptap/extension-underline'
import Highlight from '@tiptap/extension-highlight'
import Typography from '@tiptap/extension-typography'

export function useTiptapEditor(content = '', placeholder = 'Write here...') {
  return useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        codeBlock: false,
        horizontalRule: false,
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
        linkOnPaste: true,
        HTMLAttributes: {
          rel: 'noopener noreferrer',
          // Use class (HTML attr) not className — ProseMirror sets this via setAttribute()
          class: 'text-[#230532] underline hover:text-amber-700',
        },
      }),
      Placeholder.configure({ placeholder }),
      Underline,
      Highlight.configure({ multicolor: false }),
      Typography,
    ],
    content,
    // No editorProps.attributes.class — causes React "Invalid DOM property" warning.
    // Styling is applied on the wrapper div in each block component instead.
    immediatelyRender: false,
  })
}
