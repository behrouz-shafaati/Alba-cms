// import { Node, mergeAttributes } from '@tiptap/core'
// import { ReactNodeViewRenderer } from '@tiptap/react'
// import ImageNodeView from '../node-view/ImageNodeView'

// export const CustomImage = Node.create({
//   name: 'image',
//   group: 'inline',
//   inline: true,
//   selectable: true,
//   draggable: true,
//   atom: true, // این خیلی مهمه
//   addAttributes() {
//     return {
//       id: { default: null },
//       src: { default: null },
//       srcSmall: { default: null },
//       srcMedium: { default: null },
//       srcLarge: { default: null },
//       translations: { default: null },
//       alt: { default: '' },
//       title: { default: '' },
//     }
//   },
//   parseHTML() {
//     return [{ tag: 'img[src]' }]
//   },
//   renderHTML({ HTMLAttributes }) {
//     const { id, src, srcSmall, srcMedium, srcLarge, translations, alt, title } =
//       HTMLAttributes
//     return [
//       'img',
//       mergeAttributes({
//         id,
//         src:
//           src || srcMedium || srcLarge || srcSmall || '/placeholder-image.webp',
//         srcSmall,
//         srcMedium,
//         srcLarge,
//         translations,
//         alt,
//         title,
//       }),
//     ]
//   },
//   addNodeView() {
//     return ReactNodeViewRenderer(ImageNodeView)
//   },
// })

import { Node, mergeAttributes } from '@tiptap/core'
import { ReactNodeViewRenderer } from '@tiptap/react'
import ImageNodeView from '../node-view/ImageNodeView'

export const CustomImage = Node.create({
  name: 'image',
  group: 'block',
  atom: true, // یعنی خودش یک بلاک مستقل هست و محتوا نداره

  addAttributes() {
    return {
      id: { default: null },
      src: { default: null },
      srcSmall: { default: null },
      srcMedium: { default: null },
      srcLarge: { default: null },
    }
  },

  parseHTML() {
    return [{ tag: 'img[src]' }]
  },

  renderHTML({ HTMLAttributes }) {
    return ['img', mergeAttributes(HTMLAttributes)]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageNodeView)
  },
})
