import { slugify } from '@/lib/utils'

// types
export type TiptapNode = {
  type: string
  attrs?: { level?: number }
  content?: TiptapNode[]
  text?: string
}

export type HeadingItem = {
  level: number
  text: string
  id: string
  children: HeadingItem[]
}

// گرفتن متن از node
function extractText(node: TiptapNode): string {
  if (node.text) return node.text
  if (node.content) return node.content.map(extractText).join('')
  return ''
}

// استخراج headingها از JSON tiptap
function extractHeadings(nodes: TiptapNode[], result: any[] = []) {
  for (const node of nodes) {
    if (node.type === 'heading' && node.attrs?.level) {
      const text = extractText(node)
      result.push({
        level: node.attrs.level,
        text,
        id: slugify(text),
      })
    }
    if (node.content) {
      extractHeadings(node.content, result)
    }
  }
  return result
}

// ساخت درخت از headingهای فلت
function buildTree(
  headings: { level: number; text: string; id: string }[]
): HeadingItem[] {
  const root: HeadingItem[] = []
  const stack: HeadingItem[] = []

  for (const h of headings) {
    const item: HeadingItem = { ...h, children: [] }

    while (stack.length > 0 && stack[stack.length - 1].level >= h.level) {
      stack.pop()
    }

    if (stack.length === 0) {
      root.push(item)
      stack.push(item)
    } else {
      stack[stack.length - 1].children.push(item)
      stack.push(item)
    }
  }

  return root
}

// تابع نهایی
export function generateTableOfContents(json: { content: TiptapNode[] }) {
  const flat = extractHeadings(json.content)
  return buildTree(flat)
}

export function getEmbedUrl(url: string): string | null {
  // YouTube
  const youtubeRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/
  const aparatRegex = /aparat\.com\/v\/([a-zA-Z0-9_-]+)/

  if (youtubeRegex.test(url)) {
    const id = url.match(youtubeRegex)?.[1]
    return `https://www.youtube.com/embed/${id}`
  }

  if (aparatRegex.test(url)) {
    const id = url.match(aparatRegex)?.[1]
    return `https://www.aparat.com/video/video/embed/videohash/${id}/vt/frame`
  }

  return null
}

export function getTextFromNode(node: any): string {
  if (!node) return ''

  // اگر خود نود متن داره
  if (typeof node.text === 'string') return node.text

  // اگر نود محتوای داخلی داره (حتی mark یا node تو در تو)
  if (Array.isArray(node.content)) {
    return node.content.map(getTextFromNode).join('')
  }

  return ''
}
