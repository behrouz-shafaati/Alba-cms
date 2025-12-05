'use server'
const jsdom = require('jsdom')
const { JSDOM } = jsdom
// let jsdom: typeof import('jsdom') | null = null

// if (typeof window === 'undefined') {
//   jsdom = require('jsdom')
// }

import { getTextFromNode } from '@/components/tiptap-editor/utils'
import { Schema, DOMSerializer, Node as ProseNode } from 'prosemirror-model'
import { slugify } from './utils'

const accordionNodes = {
  accordion: {
    group: 'block',
    content: 'accordionItems',
    parseDOM: [{ tag: 'div[data-type="accordion"]' }],
    toDOM: () => ['div', { 'data-type': 'accordion', class: 'accordion' }, 0],
  },

  accordionItems: {
    content: 'accordionItem+',
    parseDOM: [{ tag: 'div[data-type="accordion-items"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-items', class: 'accordion-items' },
      0,
    ],
  },

  accordionItem: {
    content: 'accordionItemTitle accordionItemContent',
    parseDOM: [{ tag: 'div[data-type="accordion-item"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-item', class: 'accordion-item' },
      0,
    ],
  },

  accordionItemTitle: {
    content: 'inline*',
    parseDOM: [{ tag: 'div[data-type="accordion-item-title"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-item-title', class: 'accordion-title' },
      0,
    ],
  },

  accordionItemContent: {
    content: 'block+',
    parseDOM: [{ tag: 'div[data-type="accordion-item-content"]' }],
    toDOM: () => [
      'div',
      { 'data-type': 'accordion-item-content', class: 'accordion-content' },
      0,
    ],
  },
}
const faqNodes = {
  faq: {
    group: 'block',
    content: 'accordionItems',
    parseDOM: [{ tag: 'div[data-type="faq"]' }],
    toDOM: () => ['div', { 'data-type': 'faq', class: 'accordion' }, 0],
  },
}

// 1. تعریف schema ساده بر اساس Tiptap StarterKit + image + link
const nodes = {
  doc: { content: 'block+' },
  undefined: {},
  paragraph: {
    content: 'inline*',
    group: 'block',
    parseDOM: [{ tag: 'p' }],
    toDOM: () => ['p', 0],
  },

  text: {
    group: 'inline',
  },
  blockquote: {
    content: 'block+',
    group: 'block',
    defining: true,
    attrs: {
      dir: { default: null },
      textAlign: { default: null },
      cite: { default: null },
    },
    parseDOM: [
      {
        tag: 'blockquote',
        getAttrs: (el: any) => ({
          dir: el.getAttribute('dir'),
          textAlign: el.style.textAlign || null,
          cite: el.getAttribute('cite'),
        }),
      },
    ],
    toDOM: (node: any) => {
      const attrs: Record<string, string> = {}
      if (node.attrs.dir) attrs.dir = node.attrs.dir
      if (node.attrs.textAlign)
        attrs.style = `text-align: ${node.attrs.textAlign};`
      if (node.attrs.cite) attrs.cite = node.attrs.cite

      return [
        'blockquote',
        {
          ...attrs,
          class:
            'border-l-4 border-gray-400 pl-4 italic text-gray-700 dark:text-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-800 rounded-md my-4 p-4',
        },
        0,
      ]
    },
  },

  listItem: {
    content: 'paragraph block*', // یک پاراگراف و بعد بلوک‌های دیگر
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM: () => ['li', 0],
  },
  list_item: {
    content: 'paragraph block*', // یک پاراگراف و بعد بلوک‌های دیگر
    defining: true,
    parseDOM: [{ tag: 'li' }],
    toDOM: () => ['li', 0],
  },

  bulletList: {
    content: 'list_item+',
    group: 'block',
    parseDOM: [{ tag: 'ul' }],
    toDOM: () => ['ul', 0],
  },

  orderedList: {
    content: 'list_item+',
    group: 'block',
    attrs: { order: { default: 1 } },
    parseDOM: [
      {
        tag: 'ol',
        getAttrs(dom: any) {
          return {
            order: dom.hasAttribute('start') ? +dom.getAttribute('start') : 1,
          }
        },
      },
    ],
    toDOM(node: any) {
      return node.attrs.order === 1
        ? ['ol', 0]
        : ['ol', { start: node.attrs.order }, 0]
    },
  },
  image: {
    inline: true,

    attrs: {
      src: { default: null },
      id: { default: null },
      translations: { default: null },
      srcSmall: { default: null },
      srcMedium: { default: null },
      srcLarge: { default: null },
      width: { default: null },
      height: { default: null },
      patchSmall: { default: null },
      patchMedium: { default: null },
      patchLarge: { default: null },
      href: { default: null },
      target: { default: null },
      previewPath: { default: null },
      mimeType: { default: null },
      main: { default: null },
      user: { default: null },
      attachedTo: { default: null },
      createdAt: { default: null },
      updatedAt: { default: null },
      extension: { default: null },
      blurDataURL: { default: null },
    },
    group: 'inline',
    draggable: true,
    parseDOM: [
      {
        tag: 'img[src]',
        getAttrs: (dom: any) => ({
          src: '/image-placeholder-Medium.webp',
        }),
      },
    ],
    toDOM: (node: any) => {
      const {
        id,
        translations,
        srcSmall,
        srcMedium,
        srcLarge,
        width,
        height,
        blurDataURL,
      } = node.attrs
      const src =
        srcMedium || srcSmall || srcLarge || '/image-placeholder-Medium.webp'
      return [
        'img',
        {
          srcSmall,
          srcMedium,
          srcLarge,
          src,
          id: id,
          translations: translations ? JSON.stringify(translations) : null,
          width,
          height,
          blurDataURL,
        },
      ]
    },
  },
  hardBreak: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'br' }],
    toDOM: () => ['br'],
  },
  horizontalRule: {
    inline: true,
    group: 'inline',
    selectable: false,
    parseDOM: [{ tag: 'hr' }],
    toDOM: () => ['hr', { style: 'padding-bottom: 16px' }],
  },
  // 👇 تعریف adSlot برای رندر سمت سرور
  adSlot: {
    group: 'block',
    atom: true,
    attrs: {
      slotId: { default: null },
      linkedCampaign: { default: null },
      countOfBanners: { default: null },
      direction: { default: null },
      aspect: { default: null },
      fallbackBehavior: { default: null },
    },
    parseDOM: [
      {
        tag: 'ad-slot',
        getAttrs: (dom: any) => ({
          slotId: dom.getAttribute('data-slot-id'),
        }),
      },
    ],
    toDOM: (node: any) => {
      const {
        slotId,
        linkedCampaign,
        countOfBanners,
        direction,
        aspect,
        fallbackBehavior,
      } = node.attrs
      return [
        'ad-slot',
        {
          slotId,
          linkedCampaign,
          countOfBanners,
          direction,
          aspect,
          fallbackBehavior,
        },
      ]
    },
    // toDOM: (node) => [
    //   'ad-slot',
    //   node.attrs.slotId ? { 'data-slot-id': node.attrs.slotId } : {},
    // ],
  },
  heading: {
    content: 'inline*',
    group: 'block',
    defining: true,
    attrs: {
      level: { default: 1 }, // h1 تا h6
      dir: { default: null }, // راست‌چین یا چپ‌چین
      textAlign: { default: null }, // تراز متن
    },
    parseDOM: [
      { tag: 'h1', attrs: { level: 1 } },
      { tag: 'h2', attrs: { level: 2 } },
      { tag: 'h3', attrs: { level: 3 } },
      { tag: 'h4', attrs: { level: 4 } },
      { tag: 'h5', attrs: { level: 5 } },
      { tag: 'h6', attrs: { level: 6 } },
    ],
    toDOM(node) {
      const attrs: any = {}

      if (node.attrs.dir) attrs.dir = node.attrs.dir
      if (node.attrs.textAlign)
        attrs.style = `text-align: ${node.attrs.textAlign}`

      // استخراج متن heading به صورت recursive
      const textContent = getTextFromNode(node)

      // اضافه کردن id
      if (textContent) attrs.id = slugify(textContent)

      return ['h' + node.attrs.level, attrs, 0]
    },
  },

  // ---------- 📌 نودهای جدول ----------
  table: {
    content: 'tableRow+',
    tableRole: 'table',
    isolating: true,
    group: 'block',
    parseDOM: [{ tag: 'table' }],
    toDOM: () => ['table', ['tbody', 0]],
  },

  tableRow: {
    content: '(tableCell | tableHeader)+',
    tableRole: 'row',
    parseDOM: [{ tag: 'tr' }],
    toDOM: () => ['tr', 0],
  },

  tableCell: {
    content: 'block+',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    tableRole: 'cell',
    isolating: true,
    parseDOM: [
      {
        tag: 'td',
        getAttrs: (dom: any) => ({
          colspan: Number(dom.getAttribute('colspan') || 1),
          rowspan: Number(dom.getAttribute('rowspan') || 1),
          colwidth: dom.getAttribute('colwidth')
            ? dom
                .getAttribute('colwidth')
                .split(',')
                .map((n: string) => Number(n))
            : null,
        }),
      },
    ],
    toDOM: (node) => [
      'td',
      {
        colspan: node.attrs.colspan,
        rowspan: node.attrs.rowspan,
        colwidth: node.attrs.colwidth ? node.attrs.colwidth.join(',') : null,
        class:
          'border border-gray-300 dark:border-gray-700 px-3 py-2 text-gray-800 dark:text-gray-200',
      },
      0,
    ],
  },

  tableHeader: {
    content: 'block+',
    attrs: {
      colspan: { default: 1 },
      rowspan: { default: 1 },
      colwidth: { default: null },
    },
    tableRole: 'header_cell',
    isolating: true,
    parseDOM: [
      {
        tag: 'th',
        getAttrs: (dom: any) => ({
          colspan: Number(dom.getAttribute('colspan') || 1),
          rowspan: Number(dom.getAttribute('rowspan') || 1),
          colwidth: dom.getAttribute('colwidth')
            ? dom
                .getAttribute('colwidth')
                .split(',')
                .map((n: string) => Number(n))
            : null,
        }),
      },
    ],
    toDOM: (node) => [
      'th',
      {
        colspan: node.attrs.colspan,
        rowspan: node.attrs.rowspan,
        colwidth: node.attrs.colwidth ? node.attrs.colwidth.join(',') : null,
        class:
          'border border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 px-3 py-2 font-semibold text-gray-900 dark:text-gray-100',
      },
      0,
    ],
  },
  ...accordionNodes,
  ...faqNodes,
  videoEmbed: {
    group: 'block',
    atom: true, // چون داخلش محتوای دیگری نمیاد

    attrs: {
      src: { default: null },
      title: { default: null },
    },

    parseDOM: [
      {
        tag: 'iframe[src]',
        getAttrs: (dom: any) => {
          const el = dom as HTMLIFrameElement
          return {
            src: el.getAttribute('src'),
            title: el.getAttribute('title'),
          }
        },
      },
    ],

    toDOM: (node: any) => [
      'iframe',
      {
        src: node.attrs.src,
        title: node.attrs.title || 'Embedded Video',
        width: '560',
        height: '315',
        allowfullscreen: 'true',
        loading: 'lazy',
        'data-type': 'videoEmbed',
      },
    ],
  },
  mention: {
    group: 'inline',
    inline: true,
    atom: true, // نود اتمی → یک واحد جدا
    selectable: false,

    attrs: {
      id: { default: null },
      label: { default: '' },
      mentionSuggestionChar: { default: '@' },
    },

    parseDOM: [
      {
        tag: 'span[data-mention]',
        getAttrs: (dom: HTMLElement) => ({
          id: dom.getAttribute('data-id'),
          label: dom.getAttribute('data-label'),
          mentionSuggestionChar: dom.getAttribute('data-char') || '@',
        }),
      },
    ],

    toDOM: (node) => [
      'span',
      {
        'data-mention': '',
        'data-id': node.attrs.id,
        'data-label': node.attrs.label,
        'data-char': node.attrs.mentionSuggestionChar,
        class: 'mention',
      },
      `${node.attrs.mentionSuggestionChar}${node.attrs.label}`,
    ],
  },
}

const marks = {
  bold: {
    parseDOM: [{ tag: 'strong' }, { tag: 'b' }],
    toDOM: () => ['strong', 0],
  },
  italic: {
    parseDOM: [{ tag: 'em' }, { tag: 'i' }],
    toDOM: () => ['em', 0],
  },
  link: {
    attrs: {
      href: {},
      target: { default: '_blank' },
      rel: { default: 'noopener noreferrer' },
    },
    inclusive: false,
    parseDOM: [
      {
        tag: 'a[href]',
        getAttrs: (dom: any) => ({
          href: dom.getAttribute('href'),
          target: dom.getAttribute('target'),
          rel: dom.getAttribute('rel'),
        }),
      },
    ],
    toDOM: (mark) => ['a', mark.attrs, 0],
  },
  strike: {
    parseDOM: [
      { tag: 's' },
      { tag: 'del' },
      { tag: 'strike' },
      {
        style: 'text-decoration',
        getAttrs: (value) => {
          // value ممکنه چیزی مثل "line-through" یا "underline" باشه
          if (typeof value === 'string' && value.includes('line-through')) {
            return null // قبولش کن، بدون attrs
          }
          return false // رد کن
        },
      },
    ],
    toDOM() {
      // شبیه رفتار پیش‌فرض Tiptap Strike: از <s> استفاده می‌کنه
      return ['s', 0]
    },
  },
}

const schema = new Schema({ nodes, marks })
// if (!jsdom) {
//   throw new Error('parseHtml must be called on the server only!')
// }

// const { JSDOM } = jsdom
// 2. تابع نهایی تبدیل JSON → HTML
export async function renderTiptapJsonToHtml(json: any): string {
  const dom = new JSDOM(`<!DOCTYPE html><body></body>`)
  const document = dom.window.document

  const node = ProseNode.fromJSON(schema, json)
  const fragment = DOMSerializer.fromSchema(schema).serializeFragment(
    node.content,
    {
      document,
    }
  )

  const container = document.createElement('div')
  container.appendChild(fragment)
  return container.innerHTML
}
