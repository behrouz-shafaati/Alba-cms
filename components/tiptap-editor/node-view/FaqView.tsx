'use client'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils'

export function FaqView({ editor, node, getPos }: NodeViewProps) {
  const addItem = () => {
    if (!editor) return

    const pos = getPos() // موقعیت آکاردئون در داکیومنت
    // اینجا محتوای پیش‌فرض یک آیتم جدید:
    const newItem = {
      type: 'accordionItem',
      content: [
        {
          type: 'accordionItemTitle',
          content: [
            {
              type: 'paragraph',
              attrs: { dir: 'rtl', textAlign: null },
              content: [{ type: 'text', text: 'سوال' }],
            },
          ],
        },
        {
          type: 'accordionItemContent',
          content: [
            {
              type: 'paragraph',
              attrs: { dir: 'rtl', textAlign: null },
              content: [{ type: 'text', text: 'پاسخ سوال' }],
            },
          ],
        },
      ],
    }

    // این دستور یک آیتم جدید در آخر آکاردئون اضافه می‌کند
    editor
      .chain()
      .insertContentAt(pos + node.nodeSize - 1, newItem) // -1 یعنی قبل از بسته شدن آکاردئون
      .focus()
      .run()
  }

  return (
    <NodeViewWrapper
      className={cn(
        'border rounded-lg p-2 space-y-2 bg-gray-50 dark:bg-gray-900'
      )}
    >
      {/* محتوای موجود آکاردئون */}
      <NodeViewContent className="space-y-2" />

      {/* دکمه افزودن آیتم جدید */}
      <button
        type="button"
        onClick={addItem}
        className="w-full rounded-lg bg-green-500 text-white py-2 hover:bg-green-600 transition-colors"
      >
        + افزودن سوال جدید
      </button>
    </NodeViewWrapper>
  )
}
