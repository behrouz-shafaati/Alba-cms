interface TipTapNode {
  type: string
  attrs?: Record<string, any>
  content?: TipTapNode[]
  marks?: any[]
  text?: string
}

interface TipTapDoc {
  type: 'doc'
  content: TipTapNode[]
}

/**
 *
 * @param doc تابع پاکسازی tiptapJson از محتوای ارور ده
 * @returns
 */
export function sanitizeTipTapContent(doc: TipTapDoc): TipTapDoc {
  if (!doc || doc.type !== 'doc' || !Array.isArray(doc.content)) {
    return { type: 'doc', content: [] }
  }

  const result: TipTapNode[] = []

  for (const node of doc.content) {
    const sanitized = sanitizeNode(node)
    if (sanitized) {
      if (Array.isArray(sanitized)) {
        result.push(...sanitized)
      } else {
        result.push(sanitized)
      }
    }
  }

  return {
    type: 'doc',
    content: result,
  }
}

function sanitizeNode(node: TipTapNode): TipTapNode | TipTapNode[] | null {
  if (!node || !node.type) return null

  // ۱. جدول خالی → حذف
  if (node.type === 'table') {
    if (!node.content || node.content.length === 0) {
      return null
    }
  }

  // ۲. پاراگراف حاوی فقط تصویر → تبدیل به image
  if (node.type === 'paragraph' && node.content) {
    const imageNodes = node.content.filter((c) => c.type === 'image')
    const otherNodes = node.content.filter((c) => c.type !== 'image')

    if (imageNodes.length > 0 && otherNodes.length === 0) {
      // فقط تصویر داریم
      return imageNodes.map((img) => ({
        type: 'image',
        attrs: img.attrs,
      }))
    }

    if (imageNodes.length > 0 && otherNodes.length > 0) {
      // مخلوط: تصاویر را جدا کن
      const result: TipTapNode[] = []

      // اول تصاویر
      imageNodes.forEach((img) => {
        result.push({ type: 'image', attrs: img.attrs })
      })

      // بعد پاراگراف بدون تصویر
      if (otherNodes.length > 0) {
        result.push({
          ...node,
          content: otherNodes,
        })
      }

      return result
    }
  }

  // ۳. پاراگراف خالی → حذف
  if (node.type === 'paragraph') {
    if (!node.content || node.content.length === 0) {
      // پاراگراف خالی را نگه دار (برای line break)
      return node
    }
  }

  // ۴. پردازش بازگشتی
  if (node.content && Array.isArray(node.content)) {
    const sanitizedChildren: TipTapNode[] = []

    for (const child of node.content) {
      const result = sanitizeNode(child)
      if (result) {
        if (Array.isArray(result)) {
          sanitizedChildren.push(...result)
        } else {
          sanitizedChildren.push(result)
        }
      }
    }

    return {
      ...node,
      content: sanitizedChildren,
    }
  }

  return node
}
