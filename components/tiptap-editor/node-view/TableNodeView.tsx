'use client'

import React from 'react'
import { NodeViewWrapper, NodeViewContent } from '@tiptap/react'
import {
  ContextMenu,
  ContextMenuTrigger,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSubTrigger,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from '@/components/ui/context-menu'
import { Editor } from '@tiptap/core'
import {
  TableCellsMerge,
  TableCellsSplit,
  TableColumnsSplit,
  TableRowsSplit,
  Trash,
} from 'lucide-react'

type Props = {
  editor: Editor
  node: any
  getPos: () => number
}

export default function TableNodeView({ editor, node, getPos }: Props) {
  const handle = (action: string) => {
    switch (action) {
      case 'addRowBefore':
        editor.chain().focus().addRowBefore().run()
        break
      case 'addRowAfter':
        editor.chain().focus().addRowAfter().run()
        break
      case 'deleteRow':
        editor.chain().focus().deleteRow().run()
        break
      case 'addColBefore':
        editor.chain().focus().addColumnBefore().run()
        break
      case 'addColAfter':
        editor.chain().focus().addColumnAfter().run()
        break
      case 'deleteCol':
        editor.chain().focus().deleteColumn().run()
        break
      case 'deleteTable':
        editor.chain().focus().deleteTable().run()
        break
      case 'mergeOrSplit':
        editor.chain().focus().mergeOrSplit().run()
        break
      case 'splitCell':
        editor.chain().focus().splitCell().run()
        break
      case 'mergeCells':
        editor.chain().focus().mergeCells().run()
        break
      case 'toggleHeaderRow':
        editor.chain().focus().toggleHeaderRow().run()
        break
      case 'toggleHeaderColumn':
        editor.chain().focus().toggleHeaderColumn().run()
        break
      case 'toggleHeaderCell':
        editor.chain().focus().toggleHeaderCell().run()
        break
      default:
        break
    }
  }

  console.log('editor: ', editor)
  return (
    <NodeViewWrapper className="relative w-full overflow-x-auto">
      <ContextMenu>
        <ContextMenuTrigger asChild>
          <NodeViewContent as="table" className="" />
        </ContextMenuTrigger>

        <ContextMenuContent>
          <ContextMenuSub>
            <ContextMenuSubTrigger inset>افزودن</ContextMenuSubTrigger>
            <ContextMenuSubContent className="w-44">
              <ContextMenuItem onClick={() => handle('addColBefore')}>
                ستون به راست
                <ContextMenuShortcut>
                  <TableColumnsSplit className="w-8 h-8" />
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handle('addColAfter')}>
                ستون به چپ
                <ContextMenuShortcut>
                  <TableColumnsSplit className="w-8 h-8" />
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handle('addRowBefore')}>
                ردیف به بالا
                <ContextMenuShortcut>
                  <TableRowsSplit className="w-8 h-8" />
                </ContextMenuShortcut>
              </ContextMenuItem>
              <ContextMenuItem onClick={() => handle('addRowAfter')}>
                ردیف به پایین
                <ContextMenuShortcut>
                  <TableRowsSplit className="w-8 h-8" />
                </ContextMenuShortcut>
              </ContextMenuItem>
            </ContextMenuSubContent>
          </ContextMenuSub>
          <ContextMenuSeparator />

          <ContextMenuItem onClick={() => handle('toggleHeaderRow')}>
            فعال/غیرفعال کردن ردیف عنوان
            {/* <ContextMenuShortcut>
              <TableCellsSplit className="w-8 h-8" />
            </ContextMenuShortcut> */}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handle('toggleHeaderColumn')}>
            فعال/غیرفعال کردن ستون عنوان
            {/* <ContextMenuShortcut>
              <TableCellsMerge className="w-8 h-8" />
            </ContextMenuShortcut> */}
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handle('toggleHeaderCell')}>
            فعال/غیرفعال کردن سلول عنوان
            {/* <ContextMenuShortcut>
              <TableCellsSplit className="w-8 h-8" />
            </ContextMenuShortcut> */}
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => handle('mergeCells')}>
            ادغام سلول ها{' '}
            <ContextMenuShortcut>
              <TableCellsMerge className="w-8 h-8" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handle('splitCell')}>
            شکستن سلول{' '}
            <ContextMenuShortcut>
              <TableCellsSplit className="w-8 h-8" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuSeparator />
          <ContextMenuItem onClick={() => handle('deleteRow')}>
            حذف ردیف
            <ContextMenuShortcut>
              <TableRowsSplit className="w-8 h-8" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem onClick={() => handle('deleteCol')}>
            حذف ستون
            <ContextMenuShortcut>
              <TableColumnsSplit className="w-8 h-8" />
            </ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            variant="destructive"
            onClick={() => handle('deleteTable')}
          >
            حذف جدول
            <ContextMenuShortcut>
              <Trash className="w-8 h-8" />
            </ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuContent>
      </ContextMenu>
    </NodeViewWrapper>
  )
}
