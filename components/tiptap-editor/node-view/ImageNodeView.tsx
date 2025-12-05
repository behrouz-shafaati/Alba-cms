'use client'
import { NodeViewWrapper } from '@tiptap/react'

export default function ImageNodeView({ node, selected }) {
  const { attrs } = node
  const { id, srcSmall, srcMedium, srcLarge, src, alt, title } = attrs

  const finalSrc =
    src || srcMedium || srcLarge || srcSmall || '/image-placeholder-Medium.webp'

  return (
    <NodeViewWrapper
      className={`relative inline-block ${
        selected ? 'ring-2 ring-blue-400' : ''
      }`}
    >
      <img
        src={finalSrc}
        id={id}
        alt={alt || ''}
        title={title || ''}
        draggable
        contentEditable={false}
        data-srcsmall={srcSmall || ''}
        data-srcmedium={srcMedium || ''}
        data-srclarge={srcLarge || ''}
      />
    </NodeViewWrapper>
  )
}
