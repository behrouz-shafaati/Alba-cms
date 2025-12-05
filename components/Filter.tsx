'use client'

import * as React from 'react'
import { Input } from '@/components/ui/input'
import { CheckboxInput as Checkbox } from '@/components/ui/checkbox-input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import { Option } from '@/types'
import { Button } from './ui/button'

type SearchMultiSelectProps = {
  options?: Option[] // آیتم‌های ثابت
  onSearch?: (query: string) => Promise<Option[]> // جستجو در دیتابیس
  onChange?: (selected: Option[]) => void
  placeholder?: string
  className?: string
  /** مقدار(های) پیش‌فرض انتخاب‌شده */
  defaultValue?: Option[] | Option
  /** انتخاب چندتایی یا تکی */
  multiple?: boolean
  /** حداکثر تعداد انتخاب */
  maxSelected?: number
  approveChangeWithButton?: boolean
}

export function Filter({
  options = [],
  onSearch,
  onChange,
  placeholder = 'جستجو...',
  className,
  defaultValue,
  multiple = true,
  maxSelected,
  approveChangeWithButton = false,
}: SearchMultiSelectProps) {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState<Option[]>(options)
  const [selected, setSelected] = React.useState<Option[]>([])
  const [loading, setLoading] = React.useState(false)

  // --- تنظیم مقدار پیش‌فرض ---
  React.useEffect(() => {
    if (defaultValue) {
      const initial = Array.isArray(defaultValue)
        ? defaultValue
        : [defaultValue]
      setSelected(initial)
    }
  }, [defaultValue])

  // --- جستجو با debounce ---
  React.useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!query.trim()) {
        setResults(options)
        return
      }

      let merged: Option[] = []

      if (onSearch && options.length > 0) {
        setLoading(true)
        const dbResults = await onSearch(query)
        merged = [
          ...options.filter((opt) =>
            opt.label.toLowerCase().includes(query.toLowerCase())
          ),
          ...dbResults,
        ]
        setResults(merged)
        setLoading(false)
      } else if (onSearch) {
        setLoading(true)
        const dbResults = await onSearch(query)
        setResults(dbResults)
        setLoading(false)
      } else {
        const filtered = options.filter((opt) =>
          opt.label.toLowerCase().includes(query.toLowerCase())
        )
        setResults(filtered)
      }
    }, 300)
    return () => clearTimeout(timeout)
  }, [query, options, onSearch])

  // --- تغییر انتخاب ---
  const toggleSelect = (option: Option) => {
    const isSelected = selected.some((s) => s.value === option.value)
    let newSelected: Option[] = []

    if (multiple) {
      if (isSelected) {
        newSelected = selected.filter((s) => s.value !== option.value)
      } else {
        // بررسی محدودیت حداکثر
        if (maxSelected && selected.length >= maxSelected) return
        newSelected = [...selected, option]
      }
    } else {
      newSelected = isSelected ? [] : [option]
    }

    setSelected(newSelected)
    if (approveChangeWithButton != true) onChange?.(newSelected)
  }

  return (
    <div className={cn('w-full flex flex-col gap-3', className)}>
      <Input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full"
      />
      <ScrollArea className="max-h-64 rounded-md  p-2">
        {loading ? (
          <div className="text-sm text-muted-foreground p-2">
            در حال جستجو...
          </div>
        ) : results.length === 0 ? (
          <div className="text-sm text-muted-foreground p-2">
            موردی یافت نشد.
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {results.map((opt) => {
              const checked = selected.some((s) => s.value === opt.value)
              return (
                <label
                  key={opt.value}
                  className={cn(
                    'flex items-center gap-2 text-sm cursor-pointer rounded-md p-1 hover:bg-accent transition-colors'
                    // checked && 'bg-accent'
                  )}
                >
                  {multiple && (
                    <Checkbox
                      checked={checked}
                      onCheckedChange={() => toggleSelect(opt)}
                    />
                  )}
                  {!multiple && (
                    <input
                      type="radio"
                      checked={checked}
                      onChange={() => toggleSelect(opt)}
                      className="cursor-pointer"
                    />
                  )}
                  <span>{opt.label}</span>
                </label>
              )
            })}
          </div>
        )}
      </ScrollArea>
      {maxSelected && multiple && (
        <div className="text-xs text-muted-foreground mt-1 text-end">
          انتخاب شده {selected.length}/{maxSelected}
        </div>
      )}
      {approveChangeWithButton && (
        <Button
          onClick={() => {
            onChange?.(selected)
          }}
        >
          اعمال فیلتر
        </Button>
      )}
    </div>
  )
}
