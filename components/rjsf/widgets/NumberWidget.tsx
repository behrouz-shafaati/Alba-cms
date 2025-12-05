'use client'

import { Input } from '@/components/ui/input'

export function NumberWidget({ value, onChange, id, placeholder }: any) {
  return (
    <Input
      id={id}
      type="number"
      placeholder={placeholder || ''}
      value={value ?? ''}
      onChange={(e) => {
        const val = e.target.value
        onChange(val === '' ? undefined : Number(val))
      }}
    />
  )
}
