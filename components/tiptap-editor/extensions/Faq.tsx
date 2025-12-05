import { Node } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import { FaqView } from '../node-view/FaqView'

// 4. Faq Node (والد نهایی)
export const Faq = Node.create({
  name: 'faq',
  group: 'block',
  content: 'accordionItem*',
  isolating: true,
  parseHTML: () => [{ tag: 'div[data-type="faq"]' }],
  renderHTML: ({ node }) => [
    'div',
    { 'data-type': 'faq', class: 'p-2 border rounded-lg' },
    0,
  ],
  addNodeView() {
    return ReactNodeViewRenderer(FaqView)
  },
})
