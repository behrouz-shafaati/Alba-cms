import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Link } from 'lucide-react'

interface FourSideBoxProps {
  value?: {
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  onChange?: (value: any) => void
  label?: string
}

export const FourSideBoxWidget = ({
  value = {},
  onChange,
  label,
}: FourSideBoxProps) => {
  const [linked, setLinked] = useState(true)
  const [values, setValues] = useState({
    top: value.top || '',
    right: value.right || '',
    bottom: value.bottom || '',
    left: value.left || '',
  })

  useEffect(() => {
    onChange?.(values)
  }, [values, onChange])

  const handleChange = (side: keyof typeof values, val: string) => {
    if (linked) {
      setValues({
        top: val,
        right: val,
        bottom: val,
        left: val,
      })
    } else {
      setValues((prev) => ({ ...prev, [side]: val }))
    }
  }

  return (
    <div className="space-y-2">
      {label && (
        <div className="font-medium text-sm text-muted-foreground">{label}</div>
      )}
      <div className="grid grid-cols-3 gap-2 items-center">
        <Input
          type="number"
          value={values.top}
          onChange={(e) => handleChange('top', e.target.value)}
          placeholder="Top"
        />
        <Button
          type="button"
          variant="ghost"
          className={linked ? 'text-blue-500' : 'text-gray-400'}
          onClick={() => setLinked(!linked)}
        >
          <Link
            size={18}
            className={linked ? 'rotate-45 transition-transform' : ''}
          />
        </Button>
        <Input
          type="number"
          value={values.right}
          onChange={(e) => handleChange('right', e.target.value)}
          placeholder="Right"
        />
        <Input
          type="number"
          value={values.left}
          onChange={(e) => handleChange('left', e.target.value)}
          placeholder="Left"
        />
        <div />
        <Input
          type="number"
          value={values.bottom}
          onChange={(e) => handleChange('bottom', e.target.value)}
          placeholder="Bottom"
        />
      </div>
    </div>
  )
}
