'use client'

export default function DividerBlock() {
  return (
    <div className="py-2 flex items-center gap-3">
      <div className="flex-1 border-t border-dashed border-stone-300" />
      <span className="text-xs text-gray-400 font-mono">— divider —</span>
      <div className="flex-1 border-t border-dashed border-stone-300" />
    </div>
  )
}
