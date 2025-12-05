const jalaali = require('jalaali-js')
import readingTime from 'reading-time'
import { Category } from '../category/interface'
import { Post, PostTranslationSchema } from './interface'
import { FileDetails } from '@/lib/entity/file/interface'
import { addIfExists, getTranslation } from '@/lib/utils'

export const postUrl = 'api/dashboard/posts'

/**
 * تولید اسلاگ یکتا با بررسی دیتابیس
 */

export function generateExcerpt(content: string, wordCount = 20): string {
  return content.split(' ').slice(0, wordCount).join(' ') + '...'
}

export function extractExcerptFromContentJson(
  contentJson: string,
  wordCount = 20
): string {
  try {
    const content = JSON.parse(contentJson)

    if (!content || !Array.isArray(content.content)) return ''

    // بازگشتی متن‌ها رو از همه‌ی نودها می‌کشه بیرون
    function extractText(nodes: any[]): string[] {
      let texts: string[] = []

      for (const node of nodes) {
        if (node.type === 'text' && node.text) {
          texts.push(node.text)
        }
        if (Array.isArray(node.content)) {
          texts = texts.concat(extractText(node.content))
        }
      }

      return texts
    }

    const allTexts = extractText(content.content)
    const fullText = allTexts.join(' ').trim()
    const words = fullText.split(/\s+/).slice(0, wordCount).join(' ')

    return words + (fullText.split(/\s+/).length > wordCount ? '...' : '')
  } catch (err) {
    console.error('خطا در پردازش contentJson:', err)
    return ''
  }
}

export function formatToJalali(dateString: string): string {
  const date = new Date(dateString)
  const { jy, jm, jd } = jalaali.toJalaali(date)
  const pad = (n: number) => n.toString().padStart(2, '0')
  return `${jy}/${pad(jm)}/${pad(jd)}`
}

export function getReadingTime(text: string): number {
  const stats = readingTime(text)
  return msToMinutes(stats.time)
}

function msToMinutes(ms: number): number {
  return Math.ceil(ms / 60000)
}

export function createPostHref(post: Post) {
  if (!post?.mainCategory) return `/_nocategory_/${post?.slug}`
  const categorySection: string = buildCategoryHref(
    post.mainCategory as Category
  )
  return `/${categorySection}${post.slug}`
}

export function buildCategoryHref(category: Category, href: string = '') {
  if (!category) return href
  return buildCategoryHref(
    category?.parent,
    (href = `${category.slug}/${href}`)
  )
}

export function updateFileDetailsInContentJson({
  post,
  fileDetails,
}: {
  post: Post
  fileDetails: FileDetails
}): Post {
  const translation = post.translations.find(
    (t) => t.lang == fileDetails.locale
  )
  const parsedContent = JSON.parse(translation.contentJson)
  const content = parsedContent?.content || []
  const contentJsonSetedFileData = content.map((block: any) => {
    if (block.type === 'image') {
      const image = block.attrs
      if (fileDetails.id == image.id)
        return { type: 'image', attrs: fileDetails }
    }
    return block
  })
  const updatedContentJson = {
    type: 'doc',
    content: contentJsonSetedFileData,
  }
  const newTranslations = post.translations.filter(
    (t) => t.lang != fileDetails.locale
  )
  return {
    ...post,
    translations: [
      ...newTranslations,
      { ...translation, contentJson: JSON.stringify(updatedContentJson) },
    ],
  }
}

/**
 * Generate JSON-LD schema.org data for a blog post.
 *
 * This function builds an `Post` structured data object
 * based on the given post and locale. It is intended to be used
 * for SEO and rich results in search engines.
 *
 * @param {Object} params
 * @param {Post} params.post - The post document fetched from the database.
 * @param {string} [params.locale='fa'] - Desired locale for selecting the correct translation.
 *
 * @returns {Record<string, any>} A JSON-LD compliant object ready to be injected
 *                                into a <script type="application/ld+json"> tag.
 *
 * @example
 * const schema = generatePostSchemaData({ post, locale: 'en' });
 * <script
 *   type="application/ld+json"
 *   dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
 * />
 */
export function generatePostSchema({
  post,
  locale = 'fa',
}: {
  post: Post
  locale?: string
}) {
  // Get translation based on locale or fallback
  const translation = getTranslation({
    translations: post.translations,
    locale,
  })

  const schemaData = {
    '@context': 'https://schema.org',
    '@type': 'Article',

    ...addIfExists('headline', translation?.title),
    ...addIfExists('description', translation?.excerpt),

    author: post?.user?.name
      ? {
          '@type': 'Person',
          name: post.user.name,
        }
      : undefined,

    ...addIfExists('image', post?.image?.src),

    ...addIfExists(
      'datePublished',
      post.createdAt ? new Date(post.createdAt).toISOString() : undefined
    ),
    ...addIfExists(
      'dateModified',
      post.updatedAt ? new Date(post.updatedAt).toISOString() : undefined
    ),
  }

  return schemaData
}

/**
 * Generate FAQPage JSON-LD schema from Tiptap JSON content.
 *
 * It expects a Tiptap document that contains a node of type "faq"
 * with children "accordionItem" which each have
 * "accordionItemTitle" and "accordionItemContent".
 *
 * @param {any} doc - Tiptap JSON document (usually translation.content)
 * @returns {Record<string, any> | null} FAQPage schema or null if no valid FAQ found.
 *
 * @example
 * const faqSchema = generateFAQSchema(tiptapDoc)
 * if (faqSchema) {
 *   <script
 *     type="application/ld+json"
 *     dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
 *   />
 * }
 */
export function generateFAQSchema(doc: any) {
  doc = JSON.parse(doc)
  if (!doc || !Array.isArray(doc.content)) return null

  // Find the top-level node with type "faq"
  const faqNode = doc.content.find((node) => node.type === 'faq')
  if (!faqNode || !Array.isArray(faqNode.content)) return null

  const faqs = faqNode.content
    .map((item) => {
      if (item.type !== 'accordionItem' || !Array.isArray(item.content)) {
        return null
      }

      // Extract question text
      const titleNode = item.content.find(
        (c) => c.type === 'accordionItemTitle'
      )
      const questionText = extractPlainText(titleNode)

      // Extract answer text
      const answerNode = item.content.find(
        (c) => c.type === 'accordionItemContent'
      )
      const answerText = extractPlainText(answerNode)

      if (!questionText || !answerText) return null

      return {
        '@type': 'Question',
        name: questionText,
        acceptedAnswer: {
          '@type': 'Answer',
          text: answerText,
        },
      }
    })
    .filter(Boolean)

  if (faqs.length === 0) return null

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs,
  }
}

/**
 * Recursively extract plain text from a Tiptap node.
 * Handles nested content like paragraphs or text nodes.
 *
 * @param {any} node - A Tiptap node (or null)
 * @returns {string} Extracted text content.
 */
function extractPlainText(node: any): string {
  if (!node) return ''

  if (node.type === 'text' && node.text) {
    return node.text
  }

  if (Array.isArray(node.content)) {
    return node.content.map(extractPlainText).join(' ').trim()
  }

  return ''
}

/**
 * ساخت breadcrumb برای مطلب به صورت بازگشتی
 * @param post مطلب‌ای که باید breadcrumb برایش ساخته شود
 * @param lang زبان انتخابی برای نمایش عنوان‌ها (پیش‌فرض: fa)
 */
export function buildBreadcrumbsArray(post: any, lang: string = 'fa') {
  /**
   * تابع بازگشتی برای جمع‌آوری سلسله‌مراتب دسته‌ها
   */
  function collectCategories(
    category?: any | null
  ): { title: string; link: string }[] {
    if (!category) return []

    const parentBreadcrumbs = collectCategories(category.parent)
    const title =
      category.translations?.find((t: any) => t.lang === lang)?.title ||
      category.slug
    const link = `/archive/categories/${category.slug}`

    return [...parentBreadcrumbs, { title, link }]
  }

  /**
   * انتخاب mainCategory (در اولویت)، در صورت نبود، اولین دسته از categories
   */
  const baseCategory = post.mainCategory || post.categories?.[0] || null
  const breadcrumbs = baseCategory ? collectCategories(baseCategory) : []

  // افزودن خود مطلب به انتها
  const postTitle =
    post.translations?.find((t: any) => t.lang === lang)?.title || post.slug

  breadcrumbs.push({
    title: postTitle,
    link: createPostHref(post),
  })

  return breadcrumbs
}
