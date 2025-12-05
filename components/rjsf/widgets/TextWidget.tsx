'use client'

import { Input } from '@/components/ui/input'

export function TextWidget({ value, onChange, id, placeholder }: any) {
  return (
    <Input
      id={id}
      placeholder={placeholder || ''}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
