import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { AccordionView } from '../node-view/AccordionView'
import AccordionItemView from '../node-view/AccordionItemView'
import AccordionItemTitleView from '../node-view/AccordionTitleView'
import AccordionItemContentView from '../node-view/AccordionContentView'

export const AccordionItemTitle = Node.create({
  name: 'accordionItemTitle',
  group: 'block',
  content: 'block*',
  isolating: true,
  parseHTML: () => [{ tag: 'div[data-type="accordion-item-title"]' }],
  renderHTML: ({ node }) => [
    'div',
    { 'data-type': 'accordion-item-title', class: 'font-medium' },
    0,
  ],
  addNodeView() {
    return ReactNodeViewRenderer(AccordionItemTitleView)
  },
})

// 2. Content Node
export const AccordionItemContent = Node.create({
  name: 'accordionItemContent',
  group: 'block',
  content: 'block*',
  isolating: true,
  parseHTML: () => [{ tag: 'div[data-type="accordion-item-content"]' }],
  renderHTML: ({ node }) => [
    'div',
    { 'data-type': 'accordion-item-content' },
    0,
  ],
  addNodeView() {
    return ReactNodeViewRenderer(AccordionItemContentView)
  },
})

// 3. AccordionItem Node
export const AccordionItem = Node.create({
  name: 'accordionItem',
  group: 'block',
  content: 'accordionItemTitle accordionItemContent',
  isolating: true,
  parseHTML: () => [{ tag: 'div[data-type="accordion-item"]' }],
  renderHTML: ({ node }) => [
    'div',
    { 'data-type': 'accordion-item', class: 'border rounded my-2' },
    0,
  ],
  addNodeView() {
    return ReactNodeViewRenderer(AccordionItemView)
  },
})

// 4. Accordion Node (والد نهایی)
export const Accordion = Node.create({
  name: 'accordion',
  group: 'block',
  content: 'accordionItem*',
  isolating: true,
  parseHTML: () => [{ tag: 'div[data-type="accordion"]' }],
  renderHTML: ({ node }) => [
    'div',
    { 'data-type': 'accordion', class: 'p-2 border rounded-lg' },
    0,
  ],
  addNodeView() {
    return ReactNodeViewRenderer(AccordionView)
  },
})
