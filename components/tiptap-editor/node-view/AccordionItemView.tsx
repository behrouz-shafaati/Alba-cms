// src/editor/node-views/AccordionItemView.tsx
'use client'
import React from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'
import { cn } from '@/lib/utils' // اختیاری؛ اگر ندارید حذف کنید یا با template string جایگزین کنید

export default function AccordionItemView({
  editor,
  node,
  getPos,
  selected,
}: NodeViewProps) {
  const removeItem = () => {
    if (!editor) return
    const pos = (getPos as () => number)()
    const from = pos
    const to = pos + node.nodeSize
    const tr = editor.view.state.tr.delete(from, to)
    editor.view.dispatch(tr)
    editor.view.focus()
  }

  return (
    <NodeViewWrapper
      className={cn(
        'border rounded-lg overflow-hidden transition-colors duration-200',
        selected
          ? 'ring-2 ring-blue-300'
          : 'border-gray-300 dark:border-gray-700'
      )}
    >
      <div className="flex items-center justify-between bg-gray-100 dark:bg-gray-800 px-3 py-2">
        <div className="flex-1">
          {/* Title's NodeViewContent will be rendered as a child NodeView (via AccordionTitleView) */}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={removeItem}
            type="button"
            className="text-sm px-2 py-1 rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900 transition-colors"
            aria-label="حذف آیتم"
            title="حذف آیتم"
          >
            حذف
          </button>
        </div>
      </div>

      {/* اینجا محتوای title و content (child node views) رندر می‌شن */}
      <div className="px-2 py-2">
        <NodeViewContent className="space-y-2" />
      </div>
    </NodeViewWrapper>
  )
}
