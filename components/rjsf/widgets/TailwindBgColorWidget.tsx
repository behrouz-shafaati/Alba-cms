'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { RemoveColorButton } from '../component/RemoveColorButton'

type StateType = 'default' | 'hover' | 'focus' | 'active'

interface BackgroundColorPickerProps {
  value?: Record<StateType, string>
  onChange: (value: Record<StateType, string>) => void
}

const tailwindBaseColors = [
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

const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900]

export function TailwindBgColorWidget({
  value = { default: '' },
  onChange,
}: BackgroundColorPickerProps) {
  const [selectedState, setSelectedState] = React.useState<StateType>('default')
  const [open, setOpen] = React.useState(false)

  const handleSelectColor = (base: string, shade: number | null = null) => {
    const newColor = `bg-${base}-${shade} dark:bg-${base}-${1000 - shade}` // مثلاً text-gray-900 dark:text-gray-100
    onChange({
      ...value,
      [selectedState]:
        selectedState === 'default'
          ? newColor
          : `${selectedState}:bg-${base}-${shade} dark:${selectedState}:bg-${base}-${
              1000 - shade
            }`,
    })
    setOpen(false)
  }

  const handleRemoveColor = () => {
    onChange({
      ...value,
      [selectedState]:
        selectedState === 'default'
          ? 'bg-transparent'
          : `${selectedState}:bg-transparent dark:bg-transparent`,
    })
  }

  const currentValue = value[selectedState] || ''

  return (
    <div className="flex flex-col gap-3">
      {/* انتخاب حالت‌ها */}
      <Tabs
        defaultValue="default"
        value={selectedState}
        onValueChange={(v) => setSelectedState(v as StateType)}
      >
        <TabsList className="grid grid-cols-4 mb-2">
          <TabsTrigger value="default">Default</TabsTrigger>
          <TabsTrigger value="hover">Hover</TabsTrigger>
          {/* <TabsTrigger value="focus">Focus</TabsTrigger>
          <TabsTrigger value="active">Active</TabsTrigger> */}
        </TabsList>
      </Tabs>

      <RemoveColorButton onClick={handleRemoveColor} swatchClass="" />
      {/* دکمه باز کردن پاپ‌اور */}
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn('w-full justify-between', currentValue)}
          >
            {currentValue || 'انتخاب رنگ'}
            <div
              className={cn(
                'w-5 h-5 rounded-md border ml-2',
                currentValue || 'bg-gray-200'
              )}
            />
          </Button>
        </PopoverTrigger>

        <PopoverContent
          side="bottom"
          className="w-[320px] max-h-[350px] overflow-auto"
        >
          <div className="grid grid-cols-10 gap-2">
            {tailwindBaseColors.map((base) =>
              shades.map((shade) => {
                const color = `bg-${base}-${shade}`
                return (
                  <button
                    key={`${base}-${shade}`}
                    type="button"
                    onClick={() => handleSelectColor(base, shade)}
                    className={cn(
                      'w-6 h-6 rounded-full border',
                      color,
                      currentValue.includes(color)
                        ? 'border-primary scale-110'
                        : 'border-transparent'
                    )}
                  />
                )
              })
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
