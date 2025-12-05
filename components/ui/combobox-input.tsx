'use client'

import * as React from 'react'
import { Check, ChevronsUpDown } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Option } from '../form-fields/combobox'
import Text from '../form-fields/text'

type CheckBoxInputProp = {
  name: string
  title?: string
  placeholder?: string
  value: string
  options?: Option[]
  disabled: boolean
  loading: boolean
  onChange?: (selectedOption: Option) => void
  setQuery?: (query: string) => void
  showClean?: boolean
}

/**
 * اولویت:
 * اگه options داری → همون لوکال رو فیلتر کن.
 * وگرنه → از fetchOptions (API) استفاده کن.
 *
 * @param param0
 * @returns
 */
export default function ComboboxInput({
  title,
  name,
  options = [],
  placeholder = 'یک گزینه را انتخاب کنید',
  value,
  disabled = false,
  loading = false,
  onChange,
  setQuery,
  showClean = false,
}: CheckBoxInputProp) {
  const [open, setOpen] = React.useState(false)

  const _options = showClean
    ? [{ label: 'همه', value: '' }, ...options]
    : options

  if (disabled)
    return (
      <Text
        title=""
        name={name}
        disabled
        value={
          value
            ? _options.find((option) => {
                return option.value === value
              })?.label
            : placeholder
        }
      />
    )
  return (
    <>
      <input
        name={name}
        type="text"
        value={value ?? ''}
        className="hidden"
        readOnly
      />
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-full justify-start "
          >
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            {value
              ? _options.find((option) => {
                  return option.value === value
                })?.label
              : placeholder}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <Command>
            <CommandInput
              placeholder={`${placeholder}...`}
              onValueChange={setQuery}
            />
            <CommandList>
              {loading && <CommandEmpty>در حال بارگذاری...</CommandEmpty>}
              {!loading && options.length === 0 && (
                <CommandEmpty>موردی یافت نشد</CommandEmpty>
              )}
              <CommandGroup>
                {_options.map((option) => {
                  return (
                    <CommandItem
                      key={option.value}
                      // اینجا value رو برابر label می‌ذاریم تا سرچ بر اساس label باشه
                      value={option.label}
                      onSelect={(currentValue) => {
                        onChange?.(option)
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          'ml-2 h-4 w-4',
                          value === option.value ? 'opacity-100' : 'opacity-0'
                        )}
                      />
                      {option.label}
                    </CommandItem>
                  )
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </>
  )
}
