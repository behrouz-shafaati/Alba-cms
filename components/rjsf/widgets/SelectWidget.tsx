'use client'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export function SelectWidget({ id, value, onChange, options }: any) {
  return (
    <Select value={value} onValueChange={(val) => onChange(val)}>
      <SelectTrigger id={id}>
        <SelectValue placeholder="انتخاب کنید..." />
      </SelectTrigger>
      <SelectContent>
        {options.enumOptions?.map((opt: any) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
