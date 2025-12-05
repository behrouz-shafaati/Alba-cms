'use client'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

export default function DraggableWrapper({
  type,
  label,
}: {
  type: string
  label: string
}) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `${type}-block`,
    data: {
      type: type,
    },
  })

  const style = {
    transform: CSS.Translate.toString(transform),
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="cursor-grab rounded bg-blue-100 dark:bg-blue-950 p-2 text-center"
    >
      {label}
    </div>
  )
}
