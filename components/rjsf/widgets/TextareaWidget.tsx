'use client'

import { Textarea } from '@/components/ui/textarea'

export function TextareaWidget({ value, onChange, id, placeholder }: any) {
  return (
    <Textarea
      id={id}
      placeholder={placeholder || ''}
      value={value || ''}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}
