// components/tiptap-renderers/AccordionRenderer.tsx
'use client'

import React from 'react'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion' // مسیر را متناسب پروژه‌ات تنظیم کن
import { AccordionNode, TNode } from '../type'

/** ساده‌ترین renderer JSON -> React برای استفاده داخل AccordionRenderer
    (می‌تونی آن را به فایل جدا منتقل کنی و کامل‌تر اش بکنی) */
function renderNodes(nodes?: TNode[] | null): React.ReactNode {
  if (!nodes) return null
  return nodes.map((n, i) => renderNode(n, i))
}

function renderNode(node: TNode, key: number): React.ReactNode {
  if (!node) return null
  if (node.type === 'text')
    return <React.Fragment key={key}>{node.text}</React.Fragment>

  switch (node.type) {
    case 'paragraph':
      return (
        <p key={key} className="mb-3 leading-7 text-start">
          {renderNodes(node.content)}
        </p>
      )
    case 'heading': {
      const level = node.attrs?.level || 1
      const Tag = `h${level}` as keyof JSX.IntrinsicElements
      return (
        <Tag key={key} className="mt-6 mb-2 font-semibold">
          {renderNodes(node.content)}
        </Tag>
      )
    }
    case 'image':
      return (
        <img
          key={key}
          src={node.attrs?.src}
          alt={node.attrs?.alt || ''}
          className="max-w-full rounded"
        />
      )
    // fallback: wrapper div
    default:
      return <div key={key}>{renderNodes(node.content)}</div>
  }
}

export default function AccordionRenderer({ node }: { node: AccordionNode }) {
  if (!node || (node.type !== 'accordion' && node.type !== 'faq')) return null

  const items = node.content ?? []

  return (
    <Accordion type="single" collapsible className="w-full">
      {items.map((item, idx) => {
        const titleNode = item.content?.find(
          (c) => c.type === 'accordionItemTitle'
        )
        const contentNode = item.content?.find(
          (c) => c.type === 'accordionItemContent'
        )

        return (
          <AccordionItem key={idx} value={`item-${idx}`}>
            <AccordionTrigger>
              {renderNodes(titleNode?.content)}
            </AccordionTrigger>

            <AccordionContent className="flex flex-col gap-4">
              {renderNodes(contentNode?.content)}
            </AccordionContent>
          </AccordionItem>
        )
      })}
    </Accordion>
  )
}
