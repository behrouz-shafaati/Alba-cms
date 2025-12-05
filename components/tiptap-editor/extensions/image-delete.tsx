import { Extension } from '@tiptap/core'
import { NodeSelection, TextSelection } from 'prosemirror-state'
import { Fragment, Slice } from 'prosemirror-model'

declare module '@tiptap/core' {
  interface Commands<ReturnType> {
    deleteImageWithKey: {
      /**
       * حذف عکس وقتی انتخاب شده و کاربر کلید delete/backspace می‌زنه
       */
      deleteSelectedImage: () => ReturnType
    }
  }
}

const DeleteImageWithKey = Extension.create({
  name: 'deleteImageWithKey',
  addOptions() {
    return {
      deleteFileHandler: undefined,
    }
  },
  addKeyboardShortcuts() {
    return {
      Delete: () => this.editor.commands.deleteSelectedImage(),
      Backspace: () => this.editor.commands.deleteSelectedImage(),
      ' ': () => this.editor.commands.deleteSelectedImage(),
    }
  },

  addCommands() {
    return {
      deleteSelectedImage:
        () =>
        ({ state, dispatch }) => {
          const { selection } = state

          if (selection instanceof NodeSelection) {
            const selectedNode = selection.node

            if (selectedNode.type.name === 'image') {
              const imageSrc = selectedNode.attrs.srcSmall
              const imageId = selectedNode.attrs?.id || selectedNode.attrs.title

              if (this.options.deleteFileHandler) {
                this.options.deleteFileHandler(imageId)
              }

              dispatch(state.tr.deleteSelection())
              return true
            }
          }

          return false
        },
    }
  },
})

export default DeleteImageWithKey
