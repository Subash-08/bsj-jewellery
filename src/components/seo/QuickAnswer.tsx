export function QuickAnswer({ answer }: { answer: string }) {
  return (
    <div
      className="my-6 rounded-lg border-l-4 border-amber-500 bg-amber-50 px-5 py-4"
      role="note"
      aria-label="Quick answer"
    >
      <p className="text-sm font-semibold uppercase tracking-wide text-amber-700">
        Quick Answer
      </p>
      <p className="mt-1 text-base text-gray-800">{answer}</p>
    </div>
  )
}
