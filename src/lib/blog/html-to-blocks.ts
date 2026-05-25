import type { ContentBlock } from '@/types/blog'

function generateId(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Math.random().toString(36).slice(2) + Date.now().toString(36)
}

function toAnchorId(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

// Removed unwrapContainers as we now use a recursive walk

function elementToBlock(el: Element): ContentBlock | null {
  const tag = el.tagName.toLowerCase()
  const id = generateId()

  if (tag === 'h1' || tag === 'h2') {
    const text = el.textContent?.trim() ?? ''
    if (!text) return null
    return { id, type: 'h2', content: el.textContent?.trim() ?? '', anchorId: toAnchorId(text) }
  }
  if (tag === 'h3') {
    const text = el.textContent?.trim() ?? ''
    if (!text) return null
    return { id, type: 'h3', content: text, anchorId: toAnchorId(text) }
  }
  if (tag === 'h4' || tag === 'h5' || tag === 'h6') {
    const text = el.textContent?.trim() ?? ''
    if (!text) return null
    return { id, type: 'h4', content: text }
  }
  if (tag === 'blockquote') {
    // Could be nested — get inner HTML
    const inner = el.innerHTML.trim()
    if (!inner) return null
    // If inner only has a <p>, strip the <p>
    const stripped = inner.replace(/^<p>([\s\S]*?)<\/p>$/i, '$1').trim()
    return { id, type: 'quote', content: `<p>${stripped}</p>` }
  }
  if (tag === 'hr') {
    return { id, type: 'divider', content: '' }
  }
  if (tag === 'img') {
    const img = el as HTMLImageElement
    const src = img.getAttribute('src') ?? ''
    if (!src) return null
    return { id, type: 'image', content: src, altText: img.getAttribute('alt') ?? '' }
  }
  // figure with img
  if (tag === 'figure') {
    const img = el.querySelector('img')
    if (img) {
      const src = img.getAttribute('src') ?? ''
      const caption = el.querySelector('figcaption')?.textContent?.trim() ?? ''
      if (!src) return null
      return { id, type: 'image', content: src, altText: img.getAttribute('alt') ?? '', caption }
    }
    return null
  }
  if (tag === 'pre') {
    const codeEl = el.querySelector('code')
    const langClass = codeEl?.className ?? ''
    const lang = langClass.replace('language-', '').replace('lang-', '').trim()
    return {
      id,
      type: 'code',
      content: codeEl?.textContent ?? el.textContent ?? '',
      language: lang || 'text',
    }
  }
  if (tag === 'ul' || tag === 'ol') {
    const items = Array.from(el.querySelectorAll(':scope > li')).map((li) => li.textContent?.trim() ?? '')
    if (items.length === 0) return null
    return {
      id,
      type: 'list',
      content: JSON.stringify({ ordered: tag === 'ol', items }),
    }
  }
  if (tag === 'p') {
    const html = el.innerHTML.trim()
    if (!html) return null
    // Check if it contains only an img
    const imgOnly = el.children.length === 1 && el.children[0].tagName.toLowerCase() === 'img'
    if (imgOnly) return elementToBlock(el.children[0])
    return { id, type: 'paragraph', content: `<p>${html}</p>` }
  }
  if (tag === 'table') {
    // Serialize table as a paragraph with the HTML
    const rawHtml = el.outerHTML.trim()
    if (!rawHtml) return null
    return { id, type: 'paragraph', content: rawHtml }
  }
  // Fallback shouldn't be hit for wrappers anymore, but just in case
  const html = el.innerHTML.trim()
  if (!html) return null
  return { id, type: 'paragraph', content: `<p>${html}</p>` }
}

export function parseHtmlToBlocks(html: string): ContentBlock[] {
  // Client-side only — uses DOMParser
  if (typeof document === 'undefined') return []

  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  // Remove script/style tags
  doc.querySelectorAll('script, style, meta, link').forEach((el) => el.remove())

  const blocks: ContentBlock[] = []
  let inlineBuffer: Node[] = []

  function flushInlineBuffer() {
    if (inlineBuffer.length === 0) return
    const container = document.createElement('div')
    inlineBuffer.forEach((n) => container.appendChild(n.cloneNode(true)))
    const content = container.innerHTML.trim()
    if (content) {
      blocks.push({ id: generateId(), type: 'paragraph', content: `<p>${content}</p>` })
    }
    inlineBuffer = []
  }

  function walk(node: Node) {
    if (node.nodeType === 3) {
      // Text node
      const text = node.textContent ?? ''
      if (text.trim() !== '') {
        inlineBuffer.push(node)
      } else if (text.includes(' ') || text.includes('\\n')) {
        // Keep spacing if there's an active buffer
        if (inlineBuffer.length > 0) inlineBuffer.push(node)
      }
      return
    }

    if (node.nodeType === 1) {
      const el = node as Element
      const tag = el.tagName.toLowerCase()

      // Known block tags
      if (
        tag === 'h1' || tag === 'h2' || tag === 'h3' || tag === 'h4' ||
        tag === 'h5' || tag === 'h6' || tag === 'ul' || tag === 'ol' ||
        tag === 'pre' || tag === 'blockquote' || tag === 'hr' ||
        tag === 'img' || tag === 'figure' || tag === 'table' || tag === 'p'
      ) {
        flushInlineBuffer()
        const block = elementToBlock(el)
        if (block) blocks.push(block)
        return
      }

      // Known wrapper tags to traverse into
      if (['div', 'section', 'article', 'main', 'aside', 'header', 'footer'].includes(tag)) {
        flushInlineBuffer()
        Array.from(el.childNodes).forEach(walk)
        flushInlineBuffer()
        return
      }

      // Anything else is treated as an inline tag (span, a, strong, br, etc.)
      inlineBuffer.push(el)
    }
  }

  Array.from(doc.body.childNodes).forEach(walk)
  flushInlineBuffer()

  return blocks
}
