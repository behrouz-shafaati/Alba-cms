// src/editor/node-views/AccordionTitleView.tsx
'use client'
import React from 'react'
import { NodeViewWrapper, NodeViewContent, NodeViewProps } from '@tiptap/react'

export default function TitleComponent({
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

    // insert a paragraph as the first child of this title node
    editor
      .chain()
      .focus()
      .insertContentAt(pos + 1, paragraph)
      .run()

    // focus editor (user can click into the inserted paragraph)
    // editor.commands.focus()
  }

  return (
    <NodeViewWrapper className="group">
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
          افزودن عنوان...
        </div>
      ) : (
        <NodeViewContent className="px-3 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 border border-dashed border-gray-200 dark:border-gray-700 rounded " />
      )}
    </NodeViewWrapper>
  )
}
