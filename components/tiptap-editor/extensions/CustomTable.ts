import { Table as BaseTable } from '@tiptap/extension-table'
import { ReactNodeViewRenderer } from '@tiptap/react'
import TableNodeView from '../node-view/TableNodeView'

export const CustomTable = BaseTable.extend({
  addNodeView() {
    return ReactNodeViewRenderer(TableNodeView)
  },
})
