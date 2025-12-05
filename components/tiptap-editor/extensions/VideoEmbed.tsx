import { Node, mergeAttributes } from '@tiptap/core'

export const VideoEmbed = Node.create({
  name: 'videoEmbed',

  group: 'block',
  atom: true,

  addAttributes() {
    return {
      src: { default: null },
      title: { default: 'Embedded Video' },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src]',
        getAttrs: (el) => ({
          src: el.getAttribute('src'),
          title: el.getAttribute('title'),
        }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      'iframe',
      mergeAttributes(HTMLAttributes, {
        frameborder: '0',
        allowfullscreen: 'true',
        loading: 'lazy',
        'data-type': 'videoEmbed', // 👈 اینجا اضافه شد
      }),
    ]
  },
})
