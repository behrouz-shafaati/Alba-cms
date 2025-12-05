'use client'

import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { CheckboxInput as Checkbox } from '@/components/ui/checkbox-input'
import ColorPicker from '@/components/form-fields/ColorPicker'
import React from 'react'

type WidgetProps = {
  value: {
    color: string
    x: number
    y: number
    blur: number
    spread: number
    inset: boolean
  }
  onChange: (value: any) => void
}

export const ShadowWidget = ({ value, onChange }: WidgetProps) => {
  // مقدار اولیه
  const defaultValue = {
    color: '#000000',
    x: 0,
    y: 0,
    blur: 5,
    spread: 0,
    inset: false,
  }

  const shadow = { ...defaultValue, ...(value || {}) }

  const update = (key: string, val: any) => {
    const newShadow = { ...shadow, [key]: val }
    onChange(newShadow)
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Label className="w-24">رنگ</Label>
        <ColorPicker
          value={shadow.color}
          onChange={(c: string) => update('color', c)}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-24">X</Label>
        <Input
          type="number"
          value={shadow.x}
          onChange={(e) => update('x', parseInt(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-24">Y</Label>
        <Input
          type="number"
          value={shadow.y}
          onChange={(e) => update('y', parseInt(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-24">Blur</Label>
        <Input
          type="number"
          value={shadow.blur}
          onChange={(e) => update('blur', parseInt(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <Label className="w-24">Spread</Label>
        <Input
          type="number"
          value={shadow.spread}
          onChange={(e) => update('spread', parseInt(e.target.value))}
        />
      </div>
      <div className="flex items-center gap-2">
        <Checkbox
          id="inset"
          checked={shadow.inset}
          onCheckedChange={(c) => update('inset', !!c)}
        />
        <Label htmlFor="inset">سایه داخلی</Label>
      </div>
    </div>
  )
}
