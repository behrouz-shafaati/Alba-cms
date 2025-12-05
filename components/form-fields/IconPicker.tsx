'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

import { Label } from '../ui/label'
import { ICON_NAMES } from '@/lib/icon/icon-names'
import DynamicIcon from '../builder-canvas/components/IconRenderer'
import cn from '@/lib/utils/client/cn'

type Props = {
  name: string
  title?: string
  defaultValue?: string
  onChange?: (value: string) => void
}

export default function IconPicker({
  name,
  title = '',
  defaultValue: value = '',
  onChange,
}: Props) {
  // const [value, setValue] = React.useState(defaultValue)
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    if (!search) return ICON_NAMES
    const q = search.toLowerCase()
    return ICON_NAMES.filter((name) => name.toLowerCase().includes(q))
  }, [search])

  return (
    <div className="flex flex-col gap-2">
      <input type="hidden" name={name} value={value || ''} />
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="w-full flex justify-between"
          >
            <span className="flex items-center gap-2">
              <DynamicIcon name={value || 'Circle'} size={20} />
              <span>{value || 'انتخاب آیکون'}</span>
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 h-96 p-2 overflow-y-auto">
          <Input
            placeholder="جستجوی آیکون..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mb-2"
          />
          <div className="h-72 overflow-y-auto">
            <div className="grid grid-cols-6 gap-2">
              {filtered.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange?.(name)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex items-center justify-center p-2 rounded-md border hover:bg-muted transition',
                    value === name && 'bg-muted border-primary'
                  )}
                  title={name}
                >
                  <DynamicIcon name={name} size={20} />
                </button>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
