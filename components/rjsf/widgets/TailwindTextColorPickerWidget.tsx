'use client'

import * as React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { WidgetProps } from '@rjsf/utils'

// تمام رنگ‌های پایه Tailwind
const TAILWIND_COLORS = [
  'gray',
  'neutral',
  'zinc',
  'stone',
  'slate',
  'red',
  'orange',
  'amber',
  'yellow',
  'lime',
  'green',
  'emerald',
  'teal',
  'cyan',
  'sky',
  'blue',
  'indigo',
  'violet',
  'purple',
  'fuchsia',
  'pink',
  'rose',
]

// درجات Tailwind
const SHADES = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950]

export function TailwindTextColorPickerWidget({
  value,
  onChange,
}: WidgetProps) {
  const [open, setOpen] = React.useState(false)

  // رنگ انتخاب‌شده را به دو بخش تقسیم می‌کنیم: base + shade
  const [selected, setSelected] = React.useState<string | null>(value || null)
  const [selectedPreview, setSelectedPreview] = React.useState<string | null>(
    value ? value.replace('text', 'bg') : null
  )

  const handleSelect = (base: string, shade: number) => {
    const newColor = `text-${base}-${shade} dark:text-${base}-${1000 - shade}` // مثلاً text-gray-900 dark:text-gray-100
    const newColorPreview = `bg-${base}-${shade} dark:bg-${base}-${
      1000 - shade
    }` // مثلاً text-gray-900 dark:text-gray-100
    setSelected(newColor)
    setSelectedPreview(newColorPreview)
    onChange(newColor)
    setOpen(false)
  }

  return (
    <div className="flex flex-col gap-2">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="flex justify-between items-center w-full"
          >
            <span>انتخاب رنگ </span>
            {selected && (
              <span
                className={cn(
                  'w-6 h-6 rounded-full border ml-2',
                  selectedPreview.split(' ')[0] // فقط قسمت روشن رو برای دمو
                )}
              />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="max-h-[400px] overflow-y-auto w-[380px]">
          {TAILWIND_COLORS.map((color) => (
            <div key={color} className="mb-2">
              <div className="font-medium mb-1 capitalize">{color}</div>
              <div className="grid grid-cols-11 gap-1">
                {SHADES.map((shade) => {
                  const bg = `bg-${color}-${shade}`
                  const textClass = `text-${color}-${shade}`
                  return (
                    <button
                      key={shade}
                      type="button"
                      className={cn(
                        'w-6 h-6 rounded-md border',
                        bg,
                        value?.includes(textClass) && 'ring-2 ring-primary'
                      )}
                      onClick={() => handleSelect(color, shade)}
                      title={`${color}-${shade}`}
                    />
                  )
                })}
              </div>
            </div>
          ))}
        </PopoverContent>
      </Popover>
    </div>
  )
}
