import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { blockRegistry } from '../registry/blockRegistry'
import { Block } from '../types'
import { GripHorizontal, Settings, Trash } from 'lucide-react'
import { useBuilderStore } from '../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import { combineClassNames } from '../utils/styleUtils'

type SortableItemProp = {
  item: Block
  index: number
  colId: string
  newBlocks: any
}
export default function SortableItem({
  item,
  index,
  colId,
  newBlocks,
}: SortableItemProp) {
  const { selectBlock, deleteItem, selectedBlock } = useBuilderStore()
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({
      id: item.id,
      data: { type: item.type },
    })
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }
  const allBlocks = { ...blockRegistry, ...newBlocks }
  const block = allBlocks[item.type]
  const Component = block?.RendererInEditor || block?.Renderer

  let activeClass = ''
  if (selectedBlock?.id == item.id)
    activeClass = ' border-2 border-fuchsia-500 border-opacity-30'

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={` mb-2 relative group/item ${activeClass}`}
    >
      <div className="absolute z-10 flex flex-row p-1 transition-opacity -translate-x-1/2 opacity-0 -top-6 left-1/2 group-hover/item:opacity-100">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-4"
          onClick={(e: any) => {
            e.stopPropagation() // جلوگیری از propagate شدن به document
            selectBlock(item)
          }}
        >
          <Settings className="w-5 h-5 text-gray-500" />
        </Button>
        <div {...listeners}>
          <GripHorizontal className="w-5 h-5 ml-2 text-gray-400 cursor-grab" />
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-4"
          onClick={() => deleteItem(item.id)}
        >
          <Trash className="w-5 h-5 text-gray-500" />
        </Button>
      </div>
      <div className="block-wrapper [&_a]:pointer-events-none [&_a]:cursor-default [&_a]:text-muted-foreground">
        {block ? (
          <Component
            widgetName={block.label}
            blockData={item}
            onClick={(e: any) => {
              e.stopPropagation() // جلوگیری از propagate شدن به document
              selectBlock(item)
            }}
            className={`${combineClassNames(item.classNames || {})}`}
          />
        ) : (
          <span className="rounded bg-red-600 text-gray-50">
            این بلاک مشکل دارد
          </span>
        )}
      </div>
    </div>
  )
}
