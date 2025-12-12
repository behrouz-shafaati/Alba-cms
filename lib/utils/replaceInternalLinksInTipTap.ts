import { TiptapNode } from '../html-to-tiptap/tiptap-types'
import replaceInternalLinks, {
  LinkReplacerConfig,
} from './replaceInternalLinks'

/**
 * جایگزینی لینک‌ها در ساختار TipTap JSON
 */
function replaceLinksInTipTap(
  node: TiptapNode,
  config: LinkReplacerConfig
): TiptapNode {
  // کپی از node برای جلوگیری از mutation
  const newNode = { ...node }

  // بررسی marks برای لینک‌ها
  if (newNode.marks) {
    newNode.marks = newNode.marks.map((mark) => {
      if (mark.type === 'link' && mark.attrs?.href) {
        return {
          ...mark,
          attrs: {
            ...mark.attrs,
            href: replaceInternalLinks(mark.attrs.href, config),
          },
        }
      }
      return mark
    })
  }

  // بررسی attrs برای تصاویر
  if (newNode.type === 'image' && newNode.attrs?.src) {
    newNode.attrs = {
      ...newNode.attrs,
      src: replaceInternalLinks(newNode.attrs.src, config),
    }
  }

  // پردازش بازگشتی برای content
  if (newNode.content && Array.isArray(newNode.content)) {
    newNode.content = newNode.content.map((child) =>
      replaceLinksInTipTap(child, config)
    )
  }

  return newNode
}

/**
 * جایگزینی لینک‌ها در کل داکیومنت TipTap
 */
export default function replaceLinksInDocument(
  doc: any,
  config: LinkReplacerConfig
): any {
  console.log('#234897 change link config:', config)
  return {
    type: 'doc',
    content: doc.content.map((node) => replaceLinksInTipTap(node, config)),
  }
}
