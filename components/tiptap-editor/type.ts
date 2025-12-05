// متن عمومی Tiptap
interface TextNode {
  type: 'text'
  text: string
}

// پاراگراف
interface ParagraphNode {
  type: 'paragraph'
  attrs: {
    dir: 'rtl' | 'ltr'
    textAlign: 'left' | 'right' | 'center' | null
  }
  content: TextNode[]
}

// عنوان آیتم
interface AccordionItemTitleNode {
  type: 'accordionItemTitle'
  content: ParagraphNode[]
}

// محتوای آیتم
interface AccordionItemContentNode {
  type: 'accordionItemContent'
  content: ParagraphNode[]
}

// یک آیتم آکاردئون
interface AccordionItemNode {
  type: 'accordionItem'
  content: [AccordionItemTitleNode, AccordionItemContentNode]
}

// خود آکاردئون
export interface AccordionNode {
  type: 'accordion'
  content: AccordionItemNode[]
}

export type TNode = {
  type: string
  attrs?: Record<string, any>
  content?: TNode[]
  text?: string
}
