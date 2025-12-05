'use client'

import { useMenuStore } from '../store/useMenuStore'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverlay,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import SortableItem from './sortable-menu-item'
import { useEffect, useState } from 'react'
import { MenuItem } from '../types/menu'
import { Button } from '@/components/ui/button'

type props = {
  name: string
  maxDepth?: number
  initialMenu?: MenuItem[]
  className?: string
}

export default function MenuBuilder({
  name,
  initialMenu = [],
  maxDepth = 3,
  className = '',
}: props) {
  const { items, setItems, addItem, getJson, reorderItems } = useMenuStore()
  const [activeItem, setActiveItem] = useState<MenuItem | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const findItemById = (items: MenuItem[], id: string): MenuItem | null => {
    for (const item of items) {
      if (item.id === id) return item
      if (item.subMenu) {
        const found = findItemById(item.subMenu, id)
        if (found) return found
      }
    }
    return null
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setActiveItem(null)
    if (!over || active.id === over.id) return
    reorderItems(active.id as string, over.id as string)
  }

  useEffect(() => setItems(initialMenu), [initialMenu, setItems])

  return (
    <div className={`p-4 space-y-4 ${className}`}>
      <textarea readOnly name={name} value={getJson()} className="hidden" />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={(event) => {
          const item = findItemById(items, event.active.id as string)
          if (item) setActiveItem(item)
        }}
      >
        <SortableContext
          key={`SortableContext`}
          items={items.map((item) => item._id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-2 ">
            {items.map((item) => (
              <SortableItem
                key={item?._id || item?._id}
                item={item}
                depth={0}
                maxDepth={maxDepth}
              />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeItem ? (
            <div className="border p-2 bg-white shadow rounded">
              {activeItem.label}
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
      <Button type="button" onClick={addItem} className="w-full">
        + افزودن آیتم
      </Button>
      {/* <pre className=" ltr bg-slate-200 dark:bg-slate-800 p-4 mt-4">
        <code>{getJson()}</code>
      </pre> */}
    </div>
  )
}
