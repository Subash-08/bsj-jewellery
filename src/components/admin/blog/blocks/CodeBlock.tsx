'use client'

const LANGUAGES = ['text', 'typescript', 'javascript', 'python', 'bash', 'json', 'html', 'css', 'sql', 'markdown', 'yaml']

interface Props {
  content: string
  language: string
  onChange: (content: string, language: string) => void
}

export default function CodeBlock({ content, language, onChange }: Props) {
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <label className="text-xs text-gray-500">Language:</label>
        <select
          value={language}
          onChange={(e) => onChange(content, e.target.value)}
          className="text-xs px-2 py-1 border border-stone-300 focus:outline-none focus:border-[#230532] bg-white"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang} value={lang}>{lang}</option>
          ))}
        </select>
      </div>
      <textarea
        value={content}
        onChange={(e) => onChange(e.target.value, language)}
        rows={8}
        placeholder={`// ${language} code here...`}
        className="w-full font-mono text-xs px-3 py-2.5 bg-stone-900 text-green-300 border border-stone-700 focus:outline-none focus:border-[#230532] resize-y"
        spellCheck={false}
      />
    </div>
  )
}
