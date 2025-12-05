// src/editor/node-views/AccordionContentView.tsx
'use client'
import React from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'

export default function ContentComponent({
  editor,
  node,
  getPos,
}: NodeViewProps) {
  const isEmpty = node.content.size === 0

  const addParagraph = () => {
    if (!editor) return
    const pos = (getPos as () => number)()
    const paragraph = {
      type: 'paragraph',
      content: [{ type: 'text', text: '' }],
    }
    editor
      .chain()
      .focus()
      .insertContentAt(pos + 1, paragraph)
      .run()
    editor.commands.focus()
  }

  return (
    <NodeViewWrapper>
      {isEmpty ? (
        <div
          onClick={addParagraph}
          className="cursor-text px-3 py-2 text-sm text-gray-500 dark:text-gray-400 border border-dashed border-gray-200 dark:border-gray-700 rounded"
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              addParagraph()
            }
          }}
        >
          افزودن محتوا...
        </div>
      ) : (
        <NodeViewContent className="px-3 py-2 text-gray-700 dark:text-gray-300" />
      )}
    </NodeViewWrapper>
  )
}
