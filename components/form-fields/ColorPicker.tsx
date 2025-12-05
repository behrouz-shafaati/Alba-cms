'use client'

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'

export default function ColorPicker({ value, onChange }: any) {
  const [color, setColor] = useState(value || '#000000')

  const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setColor(newColor)
    onChange(newColor)
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="w-full justify-start"
          style={{ backgroundColor: color }}
          variant="outline"
        >
          {color}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-4">
        <Input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="w-20 h-10 p-0"
        />
        <Input
          value={color}
          onChange={handleColorChange}
          className="mt-2 text-sm"
          placeholder="#000000"
        />
      </PopoverContent>
    </Popover>
  )
}
