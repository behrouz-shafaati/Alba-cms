'use client'

import { Slider } from '@/components/ui/slider'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function SliderWidget({ value, onChange, schema }: any) {
  const min = schema.minimum ?? 0
  const max = schema.maximum ?? 100
  const step = schema.multipleOf ?? 1

  const current = typeof value === 'number' ? value : min

  return (
    <div className="space-y-2">
      <Label className="block text-sm font-medium">
        {schema.title} ({current}%)
      </Label>

      <Slider
        min={min}
        max={max}
        step={step}
        value={[current]}
        onValueChange={([val]) => onChange(val)}
      />

      <Input
        type="number"
        value={current}
        onChange={(e) => {
          const val = Number(e.target.value)
          if (val >= min && val <= max) onChange(val)
        }}
        min={min}
        max={max}
        step={step}
      />
    </div>
  )
}
