'use client'

import { Check } from 'lucide-react'
import type { AdminFormStep } from '@/types/blog'

const STEPS = [
  { num: 1 as AdminFormStep, label: 'Basic Info' },
  { num: 2 as AdminFormStep, label: 'Content' },
  { num: 3 as AdminFormStep, label: 'Review & Publish' },
]

interface Props {
  current: AdminFormStep
  onSaveDraft?: () => void
  saving?: boolean
}

export default function StepIndicator({ current, onSaveDraft, saving }: Props) {
  return (
    <div className="flex items-center justify-between border-b border-stone-200 pb-4 mb-6">
      {/* steps */}
      <div className="flex items-center gap-0">
        {STEPS.map((step, i) => {
          const done = step.num < current
          const active = step.num === current
          return (
            <div key={step.num} className="flex items-center">
              <div className="flex items-center gap-2">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold border-2 transition-colors ${
                    done
                      ? 'bg-green-600 border-green-600 text-white'
                      : active
                      ? 'bg-[#230532] border-[#230532] text-white'
                      : 'bg-white border-stone-300 text-gray-400'
                  }`}
                >
                  {done ? <Check className="w-3.5 h-3.5" /> : step.num}
                </div>
                <span
                  className={`text-sm font-medium hidden sm:block ${
                    active ? 'text-[#230532]' : done ? 'text-green-700' : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px mx-2 ${done ? 'bg-green-400' : 'bg-stone-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      {/* save draft */}
      {onSaveDraft && (
        <button
          type="button"
          onClick={onSaveDraft}
          disabled={saving}
          className="text-sm px-3 py-1.5 border border-stone-300 text-gray-600 hover:border-stone-500 disabled:opacity-50 transition-colors"
        >
          {saving ? 'Saving…' : 'Save Draft'}
        </button>
      )}
    </div>
  )
}
