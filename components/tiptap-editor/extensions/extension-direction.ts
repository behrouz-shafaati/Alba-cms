import { Extension } from '@tiptap/core'

export interface DirectionOptions {
  /**
   * The types where the directions attribute can be applied.
   * @default []
   * @example ['heading', 'paragraph']
   */
  types: string[]

  /**
   * The directions which are allowed.
   * @default ['ltr', 'rtl', 'auto']
   * @example ['ltr', 'rtl', 'auto']
   */
  directions: string[]

  /**
   * The default directions.
   * @default rtl
   * @example 'rtl'
   */
  defaultDirection: string | null
}

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    direction: {
      /**
       * Set the text direction attribute
       * @param dir The direction
       * @example editor.commands.setDirection('ltr')
       */
      setDirection: (dir: 'rtl' | 'ltr' | 'auto') => ReturnType
      /**
       * Unset the direction attribute
       * @example editor.commands.unsetDirection()
       */
      unsetDirection: () => ReturnType
    }
  }
}

const Direction = Extension.create<DirectionOptions>({
  name: 'direction',

  addOptions() {
    return {
      types: ['heading', 'paragraph'],
      directions: ['ltr', 'rtl', 'auto'],
      defaultDirection: 'rtl',
    }
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          dir: {
            default: this.options.defaultDirection,
            parseHTML: (element) => element.getAttribute('dir'),
            renderHTML: (attributes) => {
              return attributes.dir ? { dir: attributes.dir } : {}
            },
          },
        },
      },
    ]
  },
  addCommands() {
    return {
      setDirection:
        (dir: 'rtl' | 'ltr' | 'auto') =>
        ({ tr, state, dispatch }) => {
          if (!this.options.directions.includes(dir)) {
            return false
          }

          const { doc } = state
          let transaction = tr

          doc.descendants((node, pos) => {
            if (this.options.types.includes(node.type.name)) {
              transaction = transaction.setNodeMarkup(pos, undefined, {
                ...node.attrs,
                dir: dir,
              })
            }
          })

          if (transaction.docChanged) {
            dispatch?.(transaction)
            return true
          }

          return false
        },
      unsetDirection:
        () =>
        ({ commands }) => {
          return this.options.types
            .map((type: any) => commands.resetAttributes(type, 'dir'))
            .every((response: any) => response)
        },
    }
  },
})

export default Direction
