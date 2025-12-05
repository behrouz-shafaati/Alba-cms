'use client'
import { useBuilderStore } from '../store/useBuilderStore'
import { useRouter } from 'next/navigation'
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  pointerWithin,
} from '@dnd-kit/core'
import { useEffect, useRef } from 'react'
import { Content } from '../types'
import { blockRegistry } from '../registry/blockRegistry'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableRow from '../shared-blocks/row/SortableRow'
import ToolsSection from './toolsSection' // <==
import { Button } from '@/components/ui/button'
import SubmitButton from '@/components/form-fields/submit-button'
import { generateObjectId } from '@/lib/utils/generateObjectId'

type props = {
  name: string
  submitFormHandler: any
  initialContent?: Content
  settingsPanel: React.ReactNode
  newBlocks?: any
}

export default function Builder({
  initialContent,
  name,
  submitFormHandler,
  settingsPanel,
  newBlocks,
}: props) {
  const router = useRouter()
  const formRef = useRef<HTMLFormElement>(null)
  const {
    content,

    addRow,
    getJson,
    addElementToColumn,
    moveElementWithinColumn,
    moveElementBetweenColumns,
    setActiveElement,
    activeElement,
    reorderRows,
    deselectBlock,
    setContent,
    resetContent,
  } = useBuilderStore()

  const allBlocks = { ...blockRegistry, ...newBlocks }
  const findColumnContainingElement = (elementId: string) => {
    return content.rows
      .flatMap((row) => row.columns)
      .find((col) => col.blocks.some((el) => el.id === elementId))
  }

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event
    if (!active) return

    // set the dragged item in state
    const elementType = active.data.current?.type as 'text' | 'image'
    const id = active.id as string
    console.log('#000999 elementType: ', active.data.current)
    if (elementType) {
      setActiveElement({
        id,
        type: elementType,
        data: { content: elementType === 'text' ? 'بلوک متن' : undefined },
      })
    }
  }
  const handleDragEnd = (event: DragEndEvent) => {
    setActiveElement(null)
    console.log('#87 drag end')
    const { active, over } = event
    if (!over) return

    console.log('#88 active:', active, ' | #9 overId:', over)

    const activeId = active.id
    const overId = over.id

    const activeData = active.data.current as {
      type:
        | 'text'
        | 'image'
        | 'video'
        | 'gallery'
        | 'form'
        | 'product'
        | 'custom'
    }

    const sourceCol = findColumnContainingElement(activeId)
    // اگر جابجایی مربوط به ردیف بود
    if (content.rows.find((r) => r.id === activeId)) {
      reorderRows(activeId, overId)
      return
    }

    // حالت 1: کشیدن آیتم جدید از نوار ابزار (text-block)
    if (activeId?.endsWith('-block')) {
      const block = allBlocks[activeData.type]
      // اگر روی ستون خالی انداختیم
      const column = content.rows
        .flatMap((r) => r.columns)
        .find((c) => c.id === overId)
      console.log('#939 empty Col in new el:', column)
      if (column) {
        addElementToColumn(column.id, {
          id: generateObjectId(),
          type: activeData.type,
          ...block.defaultSettings,
        })
      }

      // یا روی یک آیتم درون ستون انداختیم
      const targetCol = findColumnContainingElement(overId)
      console.log('#939 full Col in new el:', targetCol)
      if (targetCol) {
        addElementToColumn(targetCol.id, {
          id: generateObjectId(),
          type: activeData.type,
          ...block.defaultSettings,
        })
      }
      return
    }

    // حالت 2: جابجایی آیتم بین ستون‌ها یا درون یک ستون
    const column =
      findColumnContainingElement(overId) ??
      content.rows.flatMap((r) => r.columns).find((col) => col.id === overId)
    console.log('@94 sourceCol:', sourceCol, ' | column:', column)
    if (!sourceCol || !column) return

    const oldIndex = sourceCol.blocks.findIndex((el) => el.id === activeId)
    const newIndex = column.blocks.findIndex((el) => el.id === overId)
    console.log('@94 oldIndex:', oldIndex, ' | newIndex:', newIndex)

    if (sourceCol.id === column.id) {
      // جابجایی در همان ستون
      if (oldIndex !== -1 && newIndex !== -1) {
        moveElementWithinColumn(sourceCol.id, oldIndex, newIndex)
      }
    } else {
      // جابجایی بین دو ستون
      moveElementBetweenColumns(
        sourceCol.id,
        column.id,
        activeId,
        newIndex === -1 ? column.blocks.length : newIndex
      )
    }
  }

  useEffect(() => {
    if (initialContent) setContent(initialContent)
    else resetContent()
  }, [setContent, resetContent, initialContent])

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }

  return (
    <>
      <DndContext
        onDragEnd={handleDragEnd}
        collisionDetection={pointerWithin}
        onDragStart={handleDragStart}
      >
        <div className="flex w-full h-screen ">
          {/* نوار ابزار */}
          <aside className="relative h-screen overflow-x-hidden overflow-y-auto w-80 shrink-0 bg-slate-50 dark:bg-slate-950 ">
            <ToolsSection
              settingsPanel={settingsPanel}
              savePage={submitManually}
              newBlocks={newBlocks}
            />
            <div className="sticky bottom-0 flex flex-row w-full gap-2 p-2 bg-slate-100 dark:bg-slate-900">
              <form action={submitFormHandler} ref={formRef}>
                <textarea readOnly name={name} value={getJson()} hidden />
                <SubmitButton />
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    deselectBlock()
                    router.back()
                  }}
                >
                  بازگشت
                </Button>
              </form>
            </div>
          </aside>
          {/* ناحیه ساخت صفحه */}
          <div className="w-0 h-screen -z-50 "></div>
          <div
            className="flex-1 h-screen py-8 overflow-y-auto p-4 rtl:pr-10 ltr:pl-10"
            onClick={() => {
              deselectBlock()
            }}
          >
            {content?.rows && (
              <SortableContext
                items={content?.rows?.map((row) => row.id)}
                strategy={verticalListSortingStrategy}
              >
                <div>
                  {content?.rows?.map((row) => (
                    <SortableRow key={row.id} row={row} newBlocks={newBlocks} />
                  ))}
                </div>
              </SortableContext>
            )}

            <Button
              type="button"
              onClick={addRow}
              className="w-full px-4 py-2 mt-10 text-white rounded"
            >
              افزودن ردیف
            </Button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="p-4 ltr bg-slate-300 mt-2 rounded">
                <code>{getJson()}</code>
              </pre>
            )}
          </div>
        </div>
      </DndContext>
    </>
  )
}
