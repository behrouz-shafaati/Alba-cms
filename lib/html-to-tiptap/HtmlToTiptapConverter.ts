// src/lib/migration/HtmlToTiptapConverter.ts

import { JSDOM } from 'jsdom'
import { WPImageMigrationHelper } from './helpers/ImageMigrationHelper'

/**
 * ═══════════════════════════════════════════════════════════════
 * 🔄 HTML to Tiptap Converter - Alba CMS
 * تبدیل HTML وردپرس به Tiptap JSON
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

interface TiptapMark {
  type: 'bold' | 'italic' | 'strike' | 'link'
  attrs?: { href?: string; target?: string | null; rel?: string | null }
}

interface TiptapNode {
  type: string
  attrs?: Record<string, any>
  content?: TiptapNode[]
  text?: string
  marks?: TiptapMark[]
}

interface ConversionResult {
  success: boolean
  document: TiptapNode | null
  warnings: string[]
}

interface ConverterOptions {
  uploadImages?: boolean
  imageUploadEndpoint?: string
  apiKey?: string
  defaultLang?: string
}

// ─────────────────────────────────────────────────────────────
// Main Class
// ─────────────────────────────────────────────────────────────

export class HtmlToTiptapConverter {
  private options: ConverterOptions
  private warnings: string[] = []
  private doc: Document | null = null

  constructor(options: ConverterOptions = {}) {
    this.options = {
      defaultLang: 'fa',
      uploadImages: true,
      ...options,
    }
  }

  /**
   * تبدیل HTML به Tiptap JSON
   */
  async convert(html: string): Promise<ConversionResult> {
    this.warnings = []

    if (!html || !html.trim()) {
      return {
        success: true,
        document: { type: 'doc', content: [] },
        warnings: [],
      }
    }

    try {
      // پاکسازی HTML
      const cleanHtml = this.cleanHtml(html)

      // پارس با JSDOM
      const dom = new JSDOM(`<body>${cleanHtml}</body>`)
      this.doc = dom.window.document
      const body = this.doc.body

      // تبدیل
      const content = await this.parseBlocks(body)

      return {
        success: true,
        document: {
          type: 'doc',
          content: content.length > 0 ? content : [],
        },
        warnings: this.warnings,
      }
    } catch (error) {
      return {
        success: false,
        document: null,
        warnings: [error instanceof Error ? error.message : 'Unknown error'],
      }
    }
  }

  // ─────────────────────────────────────────────────────────────
  // پاکسازی HTML
  // ─────────────────────────────────────────────────────────────

  private cleanHtml(html: string): string {
    return html
      .replace(/<!--[\s\S]*?-->/g, '')
      .replace(/<script[\s\S]*?<\/script>/gi, '')
      .replace(/<style[\s\S]*?<\/style>/gi, '')
      .replace(/&nbsp;/g, ' ')
      .replace(/<p>\s*<\/p>/gi, '')
      .replace(/<p><br\s*\/?>\s*<\/p>/gi, '')
      .trim()
  }

  // ─────────────────────────────────────────────────────────────
  // پارس بلاک‌ها
  // ─────────────────────────────────────────────────────────────

  private async parseBlocks(parent: Element): Promise<TiptapNode[]> {
    const nodes: TiptapNode[] = []
    const children = parent.childNodes

    for (let i = 0; i < children.length; i++) {
      const child = children[i]

      // Text node مستقیم → paragraph
      if (child?.nodeType === 3) {
        const text = child.textContent?.trim()
        if (text) {
          nodes.push({
            type: 'paragraph',
            content: [{ type: 'text', text }],
          })
        }
        continue
      }

      // Element node
      if (child?.nodeType === 1) {
        const el = child as Element
        const tag = el.tagName.toLowerCase()
        const node = await this.parseElement(el, tag)
        if (node) {
          if (Array.isArray(node)) {
            nodes.push(...node)
          } else {
            nodes.push(node)
          }
        }
      }
    }

    return nodes
  }

  // ─────────────────────────────────────────────────────────────
  // پارس المنت
  // ─────────────────────────────────────────────────────────────

  private async parseElement(
    el: Element,
    tag: string
  ): Promise<TiptapNode | TiptapNode[] | null> {
    // ═══════════ Heading ═══════════
    if (/^h([1-6])$/.test(tag)) {
      const level = parseInt(tag[1]) as 1 | 2 | 3 | 4 | 5 | 6
      return {
        type: 'heading',
        attrs: {
          level,
          dir: this.getDir(el),
          textAlign: this.getTextAlign(el),
        },
        content: await this.parseInline(el),
      }
    }

    // ═══════════ Paragraph ═══════════
    if (tag === 'p') {
      const content = await this.parseInline(el)
      if (content.length === 0) return null
      return {
        type: 'paragraph',
        attrs: {
          dir: this.getDir(el),
          textAlign: this.getTextAlign(el),
        },
        content,
      }
    }

    // ═══════════ Blockquote ═══════════
    if (tag === 'blockquote') {
      return {
        type: 'blockquote',
        attrs: {
          dir: this.getDir(el),
          textAlign: this.getTextAlign(el),
        },
        content: await this.parseBlocks(el),
      }
    }

    // ═══════════ Lists ═══════════
    if (tag === 'ul') {
      const items = await this.parseListItems(el)
      return {
        type: 'bulletList',
        content: items,
      }
    }

    if (tag === 'ol') {
      const items = await this.parseListItems(el)
      const start = el.getAttribute('start')
      return {
        type: 'orderedList',
        attrs: start ? { order: parseInt(start) } : undefined,
        content: items,
      }
    }

    // ═══════════ Table ═══════════
    if (tag === 'table') {
      return this.parseTable(el)
    }

    // ═══════════ Image ═══════════
    if (tag === 'img') {
      console.log('##image')
      return this.parseImage(el)
    }

    // ═══════════ Figure (معمولاً شامل img) ═══════════
    if (tag === 'figure') {
      const img = el.querySelector('img')
      if (img) {
        const imgNode = await this.parseImage(img)
        // caption
        const caption = el.querySelector('figcaption')
        if (caption && imgNode) {
          const captionText = caption.textContent?.trim()
          if (captionText && imgNode.attrs) {
            imgNode.attrs.translations = {
              [this.options.defaultLang!]: {
                alt: imgNode.attrs.translations?.[this.options.defaultLang!]
                  ?.alt,
                title: captionText,
              },
            }
          }
        }
        return imgNode
      }
      // اگر iframe داشت (embed)
      const iframe = el.querySelector('iframe')
      if (iframe) {
        return this.parseEmbed(iframe)
      }
      return null
    }

    // ═══════════ Iframe (Embed) ═══════════
    if (tag === 'iframe') {
      return this.parseEmbed(el)
    }

    // ═══════════ Video ═══════════
    if (tag === 'video') {
      const src =
        el.querySelector('source')?.getAttribute('src') ||
        el.getAttribute('src')
      if (src) {
        return {
          type: 'videoEmbed',
          attrs: { src, title: el.getAttribute('title') || null },
        }
      }
      return null
    }

    // ═══════════ HR ═══════════
    if (tag === 'hr') {
      return { type: 'horizontalRule' }
    }

    // ═══════════ BR ═══════════
    if (tag === 'br') {
      return { type: 'hardBreak' }
    }

    // ═══════════ Div (Container) ═══════════
    if (tag === 'div' || tag === 'section' || tag === 'article') {
      // بررسی accordion/faq
      const accordionNode = await this.tryParseAccordion(el)
      if (accordionNode) return accordionNode

      // بقیه: محتوای داخلش را پارس کن
      return await this.parseBlocks(el)
    }

    // ═══════════ Span و سایر inline‌ها ═══════════
    if (
      [
        'span',
        'strong',
        'b',
        'em',
        'i',
        'a',
        'u',
        's',
        'del',
        'mark',
        'code',
      ].includes(tag)
    ) {
      // اینا inline هستند، در paragraph بپیچ
      const content = await this.parseInline(el)
      if (content.length === 0) return null
      return {
        type: 'paragraph',
        content,
      }
    }

    // ═══════════ Unknown → warning و تلاش برای پارس ═══════════
    this.warnings.push(`Unknown tag: <${tag}>`)
    const innerContent = await this.parseBlocks(el)
    return innerContent.length > 0 ? innerContent : null
  }

  // ─────────────────────────────────────────────────────────────
  // پارس Inline (بازگشتی)
  // ─────────────────────────────────────────────────────────────

  private async parseInline(
    parent: Element,
    inheritedMarks: TiptapMark[] = []
  ): Promise<TiptapNode[]> {
    const nodes: TiptapNode[] = []
    const children = parent.childNodes

    for (let i = 0; i < children.length; i++) {
      const child = children[i]
      // Text
      if (child?.nodeType === 3) {
        const text = child.textContent || ''
        if (text) {
          const node: TiptapNode = { type: 'text', text }
          if (inheritedMarks.length > 0) {
            node.marks = [...inheritedMarks]
          }
          nodes.push(node)
        }
        continue
      }

      // Element
      if (child?.nodeType === 1) {
        const el = child as Element
        const tag = el.tagName.toLowerCase()

        // BR
        if (tag === 'br') {
          nodes.push({ type: 'hardBreak' })
          continue
        }

        // IMG (inline)
        if (tag === 'img') {
          console.log('Image tag detected')
          const imgNode = await this.parseImage(el)
          if (imgNode) nodes.push(imgNode)
          continue
        }

        // Mark tags
        const newMarks = [...inheritedMarks]

        if (tag === 'strong' || tag === 'b') {
          newMarks.push({ type: 'bold' })
        } else if (tag === 'em' || tag === 'i') {
          newMarks.push({ type: 'italic' })
        } else if (tag === 's' || tag === 'del' || tag === 'strike') {
          newMarks.push({ type: 'strike' })
        } else if (tag === 'a') {
          const href = el.getAttribute('href')
          if (href) {
            newMarks.push({
              type: 'link',
              attrs: {
                href,
                target: el.getAttribute('target') || null,
                rel: el.getAttribute('rel') || null,
              },
            })
          }
        }

        // بازگشت
        const innerNodes = await this.parseInline(el, newMarks)
        nodes.push(...innerNodes)
      }
    }

    return this.mergeTextNodes(nodes)
  }

  // ─────────────────────────────────────────────────────────────
  // پارس List Items
  // ─────────────────────────────────────────────────────────────

  private async parseListItems(list: Element): Promise<TiptapNode[]> {
    const items: TiptapNode[] = []
    const lis = list.querySelectorAll(':scope > li')

    for (const li of lis) {
      const content = await this.parseBlocks(li)

      // اگر محتوا خالی بود یا فقط متن داشت
      if (content.length === 0) {
        const text = li.textContent?.trim()
        if (text) {
          items.push({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: [{ type: 'text', text }],
              },
            ],
          })
        }
      } else {
        // اگر اولین آیتم paragraph نیست، بپیچش
        if (
          content[0].type !== 'paragraph' &&
          content[0].type !== 'bulletList' &&
          content[0].type !== 'orderedList'
        ) {
          items.push({
            type: 'listItem',
            content: [
              {
                type: 'paragraph',
                content: content as any,
              },
            ],
          })
        } else {
          items.push({
            type: 'listItem',
            content,
          })
        }
      }
    }

    return items
  }

  // ─────────────────────────────────────────────────────────────
  // پارس Table
  // ─────────────────────────────────────────────────────────────

  private async parseTable(table: Element): Promise<TiptapNode> {
    const rows: TiptapNode[] = []

    // ۱. ابتدا سطرهای thead را پردازش کن
    const theadRows = table.querySelectorAll('thead tr')
    for (const tr of Array.from(theadRows)) {
      const row = await this.parseTableRow(tr, true) // isHeader = true
      if (row) {
        rows.push(row)
      }
    }

    // ۲. سپس سطرهای tbody را پردازش کن
    const tbodyRows = table.querySelectorAll('tbody tr')
    for (const tr of Array.from(tbodyRows)) {
      const row = await this.parseTableRow(tr, false) // isHeader = false
      if (row) {
        rows.push(row)
      }
    }

    // ۳. اگر thead/tbody نداشت، مستقیم tr ها را بگیر
    if (rows.length === 0) {
      const allRows = table.querySelectorAll('tr')
      for (let i = 0; i < allRows.length; i++) {
        const tr = allRows[i]
        // سطر اول را هدر فرض کن اگر th داشت
        const hasThCells = tr.querySelectorAll('th').length > 0
        const row = await this.parseTableRow(tr, hasThCells)
        if (row) {
          rows.push(row)
        }
      }
    }

    return {
      type: 'table',
      content: rows.length > 0 ? rows : undefined,
    }
  }

  private async parseTableRow(
    tr: Element,
    forceHeader: boolean = false
  ): Promise<TiptapNode | null> {
    const cells: TiptapNode[] = []
    const cellElements = tr.querySelectorAll('th, td')

    for (const cell of Array.from(cellElements)) {
      const isHeader = forceHeader || cell.tagName.toLowerCase() === 'th'
      const colspan = cell.getAttribute('colspan')
      const rowspan = cell.getAttribute('rowspan')

      // پردازش محتوای سلول
      const cellContent = await this.parseInline(cell)

      // تشخیص جهت متن
      const dir = this.detectDirection(cell.textContent || '')

      cells.push({
        type: isHeader ? 'tableHeader' : 'tableCell',
        attrs: {
          colspan: colspan ? parseInt(colspan, 10) : 1,
          rowspan: rowspan ? parseInt(rowspan, 10) : 1,
          colwidth: null,
        },
        content: [
          {
            type: 'paragraph',
            attrs: {
              dir: dir,
              textAlign: null,
            },
            content: cellContent.length > 0 ? cellContent : undefined,
          },
        ],
      })
    }

    if (cells.length === 0) {
      return null
    }

    return {
      type: 'tableRow',
      content: cells,
    }
  }

  /**
   * تشخیص جهت متن (راست به چپ یا چپ به راست)
   */
  private detectDirection(text: string): 'rtl' | 'ltr' {
    // الگوی کاراکترهای فارسی/عربی
    const rtlPattern =
      /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF\uFB50-\uFDFF\uFE70-\uFEFF]/

    // اولین کاراکتر غیرفاصله را پیدا کن
    const trimmed = text.trim()
    if (!trimmed) return 'rtl' // پیش‌فرض برای محتوای فارسی

    return rtlPattern.test(trimmed.charAt(0)) ? 'rtl' : 'ltr'
  }

  // ─────────────────────────────────────────────────────────────
  // پارس Image (Async - با قابلیت آپلود)
  // ─────────────────────────────────────────────────────────────

  private async parseImage(img: Element): Promise<TiptapNode | null> {
    const src = img.getAttribute('src')
    console.log('# image src:', src)
    if (!src) return null

    const alt = img.getAttribute('alt') || ''
    const title = img.getAttribute('title') || ''
    const width = img.getAttribute('width')
    const height = img.getAttribute('height')

    let finalSrc = { src }

    // آپلود تصویر اگر فعال باشد
    if (this.options.uploadImages) {
      try {
        finalSrc = await this.uploadImage(src, { alt, title })
      } catch (error) {
        console.log(`Failed to upload image: ${src}`)
        this.warnings.push(`Failed to upload image: ${src}`)
        // از URL اصلی استفاده کن
      }
    }

    return {
      type: 'image',
      attrs: finalSrc,
    }
  }

  // ─────────────────────────────────────────────────────────────
  // آپلود تصویر به Alba CMS
  // ─────────────────────────────────────────────────────────────

  private imageCache = new Map<string, string>()

  private async uploadImage(
    originalUrl: string,
    details: { alt: string; title: string }
  ): Promise<string> {
    console.log('#234 in uploadImage before catche')
    // چک کش
    if (this.imageCache.has(originalUrl)) {
      return this.imageCache.get(originalUrl)!
    }

    try {
      const imageWPImageMigrationHelper = new WPImageMigrationHelper()
      return imageWPImageMigrationHelper.migrateImage(originalUrl, {
        alt: details.alt,
        title: details.alt || '',
      })
    } catch (error) {
      this.warnings.push(`Image upload error for ${originalUrl}: ${error}`)
      return originalUrl
    }
  }

  // ─────────────────────────────────────────────────────────────
  // پارس Embed (YouTube, Aparat, Vimeo, ...)
  // ─────────────────────────────────────────────────────────────

  private parseEmbed(iframe: Element): TiptapNode | null {
    const src = iframe.getAttribute('src') || ''
    if (!src) return null

    // YouTube
    const youtubeMatch = src.match(
      /(?:youtube\.com\/embed\/|youtu\.be\/)([a-zA-Z0-9_-]+)/
    )
    if (youtubeMatch) {
      return {
        type: 'videoEmbed',
        attrs: {
          src: `https://www.youtube.com/embed/${youtubeMatch[1]}`,
          title: iframe.getAttribute('title') || null,
        },
      }
    }

    // Aparat
    const aparatMatch =
      src.match(
        /aparat\.com\/video\/video\/embed\/videohash\/([a-zA-Z0-9]+)/i
      ) || src.match(/aparat\.com\/embed\/([a-zA-Z0-9]+)/i)
    if (aparatMatch) {
      return {
        type: 'videoEmbed',
        attrs: {
          src: `https://www.aparat.com/embed/${aparatMatch[1]}`,
          title: iframe.getAttribute('title') || null,
        },
      }
    }

    // Vimeo
    const vimeoMatch = src.match(/vimeo\.com\/(?:video\/)?(\d+)/)
    if (vimeoMatch) {
      return {
        type: 'videoEmbed',
        attrs: {
          src: `https://player.vimeo.com/video/${vimeoMatch[1]}`,
          title: iframe.getAttribute('title') || null,
        },
      }
    }

    // Generic iframe
    return {
      type: 'videoEmbed',
      attrs: {
        src,
        title: iframe.getAttribute('title') || null,
      },
    }
  }

  // ─────────────────────────────────────────────────────────────
  // تشخیص و پارس Accordion
  // ─────────────────────────────────────────────────────────────

  private async tryParseAccordion(el: Element): Promise<TiptapNode | null> {
    const classes = el.className.toLowerCase()

    // تشخیص accordion با کلاس‌های رایج
    const isAccordion =
      classes.includes('accordion') ||
      classes.includes('collapse') ||
      classes.includes('toggle') ||
      el.getAttribute('data-accordion') !== null

    if (!isAccordion) return null

    // پیدا کردن آیتم‌های accordion
    const items = await this.parseAccordionItems(el)

    if (items.length === 0) return null

    return {
      type: 'accordion',
      content: items,
    }
  }

  private async parseAccordionItems(container: Element): Promise<TiptapNode[]> {
    const items: TiptapNode[] = []

    // الگوهای مختلف accordion
    const itemSelectors = [
      '.accordion-item',
      '.accordion__item',
      '.toggle-item',
      '[data-accordion-item]',
      '.wp-block-jeraghe-accordion-item',
      '> div', // fallback
    ]

    let itemElements: Element[] = []

    for (const selector of itemSelectors) {
      const found = container.querySelectorAll(selector)
      if (found.length > 0) {
        itemElements = Array.from(found)
        break
      }
    }

    for (const item of itemElements) {
      // پیدا کردن title
      const titleEl = item.querySelector(
        '.accordion-title, .accordion__title, .toggle-title, ' +
          '[data-accordion-title], .accordion-header, h3, h4, summary, button'
      )

      // پیدا کردن content
      const contentEl = item.querySelector(
        '.accordion-content, .accordion__content, .toggle-content, ' +
          '[data-accordion-content], .accordion-body, .panel, details > div'
      )

      const title = titleEl?.textContent?.trim() || 'بدون عنوان'

      let content: TiptapNode[] = []
      if (contentEl) {
        const inlineContent = await this.parseInline(contentEl)
        if (inlineContent.length > 0) {
          content = [{ type: 'paragraph', content: inlineContent }]
        }
      }

      if (content.length === 0) {
        content = [{ type: 'paragraph', content: [] }]
      }

      items.push({
        type: 'accordionItem',
        attrs: { title },
        content,
      })
    }

    return items
  }

  // ─────────────────────────────────────────────────────────────
  // تشخیص و پارس FAQ (Schema.org)
  // ─────────────────────────────────────────────────────────────

  private tryParseFAQ(el: Element): TiptapNode | null {
    // بررسی itemtype برای FAQ
    const itemtype = el.getAttribute('itemtype') || ''
    const isFAQ =
      itemtype.includes('FAQPage') ||
      el.className.toLowerCase().includes('faq') ||
      el.getAttribute('data-faq') !== null

    if (!isFAQ) return null

    const items = this.parseFAQItems(el)

    if (items.length === 0) return null

    return {
      type: 'faq',
      content: items,
    }
  }

  private parseFAQItems(container: Element): TiptapNode[] {
    const items: TiptapNode[] = []

    // پیدا کردن سوالات با Schema.org
    const questions = container.querySelectorAll(
      '[itemprop="mainEntity"], .faq-item, .faq__item'
    )

    for (const q of questions) {
      const questionEl = q.querySelector(
        '[itemprop="name"], .faq-question, .question'
      )
      const answerEl = q.querySelector(
        '[itemprop="text"], .faq-answer, .answer'
      )

      const question = questionEl?.textContent?.trim() || ''
      const answerText = answerEl?.textContent?.trim() || ''

      if (question) {
        items.push({
          type: 'faqItem',
          attrs: { question },
          content: answerText
            ? [
                {
                  type: 'paragraph',
                  content: [{ type: 'text', text: answerText }],
                },
              ]
            : [{ type: 'paragraph', content: [] }],
        })
      }
    }

    return items
  }

  // ─────────────────────────────────────────────────────────────
  // Helpers: Direction & TextAlign
  // ─────────────────────────────────────────────────────────────

  private getDir(el: Element): 'rtl' | 'ltr' | null {
    // چک attribute مستقیم
    const dir = el.getAttribute('dir')
    if (dir === 'rtl' || dir === 'ltr') return dir

    // چک style
    const style = el.getAttribute('style') || ''
    if (style.includes('direction: rtl') || style.includes('direction:rtl'))
      return 'rtl'
    if (style.includes('direction: ltr') || style.includes('direction:ltr'))
      return 'ltr'

    // چک کلاس
    const classes = el.className.toLowerCase()
    if (classes.includes('rtl')) return 'rtl'
    if (classes.includes('ltr')) return 'ltr'

    // پیش‌فرض برای فارسی
    return this.options.defaultLang === 'fa' ? 'rtl' : null
  }

  private getTextAlign(
    el: Element
  ): 'left' | 'center' | 'right' | 'justify' | null {
    // چک style
    const style = el.getAttribute('style') || ''
    const alignMatch = style.match(/text-align:\s*(left|center|right|justify)/i)
    if (alignMatch) {
      return alignMatch[1].toLowerCase() as
        | 'left'
        | 'center'
        | 'right'
        | 'justify'
    }

    // چک attribute
    const align = el.getAttribute('align')
    if (
      align &&
      ['left', 'center', 'right', 'justify'].includes(align.toLowerCase())
    ) {
      return align.toLowerCase() as 'left' | 'center' | 'right' | 'justify'
    }

    // چک کلاس‌های رایج
    const classes = el.className.toLowerCase()
    if (
      classes.includes('text-center') ||
      classes.includes('has-text-align-center')
    )
      return 'center'
    if (
      classes.includes('text-right') ||
      classes.includes('has-text-align-right')
    )
      return 'right'
    if (
      classes.includes('text-left') ||
      classes.includes('has-text-align-left')
    )
      return 'left'
    if (classes.includes('text-justify')) return 'justify'

    return null
  }

  // ─────────────────────────────────────────────────────────────
  // ادغام Text Node های متوالی با marks یکسان
  // ─────────────────────────────────────────────────────────────

  private mergeTextNodes(nodes: TiptapNode[]): TiptapNode[] {
    if (nodes.length <= 1) return nodes

    const merged: TiptapNode[] = []

    for (const node of nodes) {
      const last = merged[merged.length - 1]

      // اگر هر دو text هستند و marks یکسان دارند
      if (
        last &&
        last.type === 'text' &&
        node.type === 'text' &&
        this.marksEqual(last.marks, node.marks)
      ) {
        last.text = (last.text || '') + (node.text || '')
      } else {
        merged.push(node)
      }
    }

    return merged
  }

  private marksEqual(a?: TiptapMark[], b?: TiptapMark[]): boolean {
    if (!a && !b) return true
    if (!a || !b) return false
    if (a.length !== b.length) return false

    const sortedA = [...a].sort((x, y) => x.type.localeCompare(y.type))
    const sortedB = [...b].sort((x, y) => x.type.localeCompare(y.type))

    return JSON.stringify(sortedA) === JSON.stringify(sortedB)
  }

  // ─────────────────────────────────────────────────────────────
  // پاکسازی کش
  // ─────────────────────────────────────
  public clearCache(): void {
    this.imageCache.clear()
    this.warnings = []
  }
}
