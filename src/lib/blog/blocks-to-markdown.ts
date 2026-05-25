import type { ContentBlock } from '@/types/blog'

export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

export function blockToMarkdown(block: ContentBlock): string {
  switch (block.type) {
    case 'h2': {
      const text = stripHtml(block.content)
      if (block.anchorId) return `<h2 id="${block.anchorId}">${text}</h2>`
      return `## ${text}`
    }
    case 'h3': {
      const text = stripHtml(block.content)
      if (block.anchorId) return `<h3 id="${block.anchorId}">${text}</h3>`
      return `### ${text}`
    }
    case 'h4':
      return `#### ${stripHtml(block.content)}`
    case 'paragraph':
      return block.content.replace(/class="/g, 'className="') // TipTap HTML — MDXRemote renders it
    case 'quote':
      return `> ${stripHtml(block.content)}`
    case 'divider':
      return '---'
    case 'code': {
      const lang = block.language ?? ''
      return `\`\`\`${lang}\n${block.content}\n\`\`\``
    }
    case 'image': {
      const alt = block.altText ?? ''
      const caption = block.caption ? `\n*${block.caption}*` : ''
      return `![${alt}](${block.content})${caption}`
    }
    case 'list': {
      try {
        const data = JSON.parse(block.content) as { ordered: boolean; items: string[] }
        return data.items
          .map((item, i) => (data.ordered ? `${i + 1}. ${item}` : `- ${item}`))
          .join('\n')
      } catch {
        return block.content
      }
    }
    case 'faq': {
      try {
        const items = JSON.parse(block.content) as Array<{ q: string; a: string }>
        return items.map((item) => `**${item.q}**\n\n${item.a}`).join('\n\n')
      } catch {
        return block.content
      }
    }
    case 'callout': {
      const type = block.calloutType ?? 'info'
      const icon = type === 'warning' ? '⚠️' : type === 'tip' ? '💡' : 'ℹ️'
      return `> ${icon} **${type.toUpperCase()}:** ${stripHtml(block.content)}`
    }
    default:
      return block.content
  }
}

export function serializeBlocksToMarkdown(blocks: ContentBlock[]): string {
  return blocks.map(blockToMarkdown).join('\n\n')
}

export function blocksToWordCount(blocks: ContentBlock[]): number {
  const text = blocks
    .map((b) => {
      if (b.type === 'list' || b.type === 'faq') {
        try {
          const parsed = JSON.parse(b.content)
          if (Array.isArray(parsed)) return parsed.map((i: { q?: string; a?: string } | string) => typeof i === 'string' ? i : `${i.q ?? ''} ${i.a ?? ''}`).join(' ')
          if (parsed.items) return parsed.items.join(' ')
        } catch { return '' }
      }
      return stripHtml(b.content)
    })
    .join(' ')
  return text.split(/\s+/).filter(Boolean).length
}
