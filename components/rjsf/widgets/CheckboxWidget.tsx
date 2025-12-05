'use client'

import { CheckboxInput } from '@/components/ui/checkbox-input'
import { Label } from '@/components/ui/label'

export function CheckboxWidget({ value, onChange, label }: any) {
  return (
    <div className="flex items-center space-x-2">
      <CheckboxInput id={label} checked={!!value} onCheckedChange={onChange} />
      <Label htmlFor={label}>{label}</Label>
    </div>
  )
}
