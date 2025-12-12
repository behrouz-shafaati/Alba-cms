// src/lib/migration/types/tiptap-types.ts

/**
 * ═══════════════════════════════════════════════════════════════
 * 📝 Alba CMS - Tiptap JSON Type Definitions
 * ═══════════════════════════════════════════════════════════════
 */

// ─────────────────────────────────────────────────────────────
// Mark Types
// ─────────────────────────────────────────────────────────────

export interface BoldMark {
  type: 'bold'
}

export interface ItalicMark {
  type: 'italic'
}

export interface StrikeMark {
  type: 'strike'
}

export interface LinkMark {
  type: 'link'
  attrs: {
    href: string
    target?: string | null
    rel?: string | null
  }
}

export type TiptapMark = BoldMark | ItalicMark | StrikeMark | LinkMark

// ─────────────────────────────────────────────────────────────
// Node Attributes
// ─────────────────────────────────────────────────────────────

export interface HeadingAttrs {
  level: 1 | 2 | 3 | 4 | 5 | 6
  dir?: string | null
  textAlign?: string | null
}

export interface BlockquoteAttrs {
  dir?: string | null
  textAlign?: string | null
  cite?: string | null
}

export interface ImageAttrs {
  id?: string | null
  src?: string | null
  srcSmall?: string | null
  srcMedium?: string | null
  srcLarge?: string | null
  width?: number | null
  height?: number | null
  blurDataURL?: string | null
  translations?: Record<string, { alt?: string; title?: string }> | null
  href?: string | null
  target?: string | null
  previewPath?: string | null
  mimeType?: string | null
  main?: boolean | null
  user?: string | null
  attachedTo?: string | null
  createdAt?: string | null
  updatedAt?: string | null
  extension?: string | null
  patchSmall?: string | null
  patchMedium?: string | null
  patchLarge?: string | null
}

export interface OrderedListAttrs {
  order?: number
}

export interface TableCellAttrs {
  colspan?: number
  rowspan?: number
  colwidth?: number[] | null
}

export interface AdSlotAttrs {
  slotId?: string | null
  linkedCampaign?: string | null
  countOfBanners?: number | null
  direction?: string | null
  aspect?: string | null
  fallbackBehavior?: string | null
}

export interface VideoEmbedAttrs {
  src?: string | null
  title?: string | null
}

export interface MentionAttrs {
  id?: string | null
  label?: string
  mentionSuggestionChar?: string
}

// ─────────────────────────────────────────────────────────────
// Node Types
// ─────────────────────────────────────────────────────────────

export interface DocNode {
  type: 'doc'
  content: BlockNode[]
}

export interface TextNode {
  type: 'text'
  text: string
  marks?: TiptapMark[]
}

export interface ParagraphNode {
  type: 'paragraph'
  attrs?: {
    textAlign?: string | null
    dir?: string | null
  }
  content?: InlineNode[]
}

export interface HeadingNode {
  type: 'heading'
  attrs: HeadingAttrs
  content?: InlineNode[]
}

export interface BlockquoteNode {
  type: 'blockquote'
  attrs?: BlockquoteAttrs
  content: BlockNode[]
}

export interface BulletListNode {
  type: 'bulletList'
  content: ListItemNode[]
}

export interface OrderedListNode {
  type: 'orderedList'
  attrs?: OrderedListAttrs
  content: ListItemNode[]
}

export interface ListItemNode {
  type: 'listItem'
  content: BlockNode[]
}

export interface ImageNode {
  type: 'image'
  attrs: ImageAttrs
}

export interface HardBreakNode {
  type: 'hardBreak'
}

export interface HorizontalRuleNode {
  type: 'horizontalRule'
}

// ─────────────── Table Nodes ───────────────

export interface TableNode {
  type: 'table'
  content: TableRowNode[]
}

export interface TableRowNode {
  type: 'tableRow'
  content: (TableCellNode | TableHeaderNode)[]
}

export interface TableCellNode {
  type: 'tableCell'
  attrs?: TableCellAttrs
  content: BlockNode[]
}

export interface TableHeaderNode {
  type: 'tableHeader'
  attrs?: TableCellAttrs
  content: BlockNode[]
}

// ─────────────── Accordion Nodes ───────────────

export interface AccordionNode {
  type: 'accordion'
  content: [AccordionItemsNode]
}

export interface AccordionItemsNode {
  type: 'accordionItems'
  content: AccordionItemNode[]
}

export interface AccordionItemNode {
  type: 'accordionItem'
  content: [AccordionItemTitleNode, AccordionItemContentNode]
}

export interface AccordionItemTitleNode {
  type: 'accordionItemTitle'
  content?: InlineNode[]
}

export interface AccordionItemContentNode {
  type: 'accordionItemContent'
  content: BlockNode[]
}

// ─────────────── FAQ Node ───────────────

export interface FaqNode {
  type: 'faq'
  content: [AccordionItemsNode]
}

// ─────────────── Special Nodes ───────────────

export interface AdSlotNode {
  type: 'adSlot'
  attrs: AdSlotAttrs
}

export interface VideoEmbedNode {
  type: 'videoEmbed'
  attrs: VideoEmbedAttrs
}

export interface MentionNode {
  type: 'mention'
  attrs: MentionAttrs
}

// ─────────────────────────────────────────────────────────────
// Union Types
// ─────────────────────────────────────────────────────────────

export type InlineNode =
  | TextNode
  | ImageNode
  | HardBreakNode
  | HorizontalRuleNode
  | MentionNode

export type BlockNode =
  | ParagraphNode
  | HeadingNode
  | BlockquoteNode
  | BulletListNode
  | OrderedListNode
  | TableNode
  | AccordionNode
  | FaqNode
  | AdSlotNode
  | VideoEmbedNode

export type AnyTiptapNode =
  | DocNode
  | BlockNode
  | InlineNode
  | ListItemNode
  | TableRowNode
  | TableCellNode
  | TableHeaderNode
  | AccordionItemsNode
  | AccordionItemNode
  | AccordionItemTitleNode
  | AccordionItemContentNode

// ─────────────────────────────────────────────────────────────
// Migration Result Types
// ─────────────────────────────────────────────────────────────

export interface ConversionStats {
  totalNodes: number
  paragraphs: number
  headings: number
  images: number
  tables: number
  lists: number
  blockquotes: number
  links: number
  embeds: number
  accordions: number
  faqs: number
  unknownTags: string[]
  skippedElements: number
  processingTimeMs: number
}

export interface ConversionWarning {
  type:
    | 'empty_content'
    | 'unknown_tag'
    | 'image_failed'
    | 'embed_failed'
    | 'structure_issue'
  message: string
  element?: string
}

export interface ConversionResult {
  success: boolean
  document: DocNode | null
  stats: ConversionStats
  warnings: ConversionWarning[]
  errors: string[]
}

export interface ConverterOptions {
  /** آپلود تصاویر به Alba CMS */
  uploadImages?: boolean
  /** Endpoint آپلود تصاویر */
  imageUploadEndpoint?: string
  /** API Key */
  apiKey?: string
  /** حذف پاراگراف‌های خالی */
  removeEmptyParagraphs?: boolean
  /** تبدیل YouTube/Aparat به videoEmbed */
  convertEmbeds?: boolean
  /** زبان پیش‌فرض برای dir */
  defaultLanguage?: 'fa' | 'en' | 'ar'
  /** حداکثر سطح heading (برای جلوگیری از h1 تکراری) */
  maxHeadingLevel?: 1 | 2 | 3
}
