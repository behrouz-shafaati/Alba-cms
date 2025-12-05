'use client'

import ColorPicker from '@/components/form-fields/ColorPicker'

export function ColorWidget({ value, onChange }: any) {
  return <ColorPicker value={value} onChange={(c: string) => onChange(c)} />
}
