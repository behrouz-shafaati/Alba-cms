'use client'

import { useState, useEffect } from 'react'
import ComboboxInput from '../ui/combobox-input'
import { useDebouncedCallback } from 'use-debounce'
import { Trash } from 'lucide-react'

export type Option = {
  value: string
  label: string
}

type ComboboxProps = {
  title?: string
  name: string
  defaultValue?: string
  options?: Option[]
  fetchOptions?: (query: string) => Promise<Option[]>
  placeholder?: string
  icon?: any
  state?: any
  disabled?: boolean
  onChange?: ({ target }: { target: Option }) => void
  showClean?: boolean
}
export default function Combobox({
  title,
  name,
  defaultValue,
  options,
  fetchOptions,
  placeholder,
  icon,
  state,
  disabled = false,
  onChange,
  showClean = false,
}: ComboboxProps) {
  const initialOptions = options ?? []
  const [_options, setOptions] = useState<Option[]>(initialOptions)
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon
  let defaultSelectedOption: Option = {
    value: '',
    label: '',
  }
  const [query, setQuery] = useState<string>('')
  const [selectedOption, setSelectedOption] = useState<Option | null>(null)
  useEffect(() => {
    if (defaultValue && _options)
      for (let j = 0; j < _options.length; j++) {
        if (defaultValue === _options[j].value) {
          setSelectedOption(_options[j])
        }
      }
  }, [defaultValue, _options])

  const [loading, setLoading] = useState(false)
  const debouncedFetchOptions = useDebouncedCallback((query) => {
    setLoading(true)
    fetchOptions?.(query).then((opts) => {
      setOptions(opts)
      setLoading(false)
    })
  }, 600)
  useEffect(() => {
    if (options && !fetchOptions) {
      const filteredOptions: Option[] = initialOptions.filter((opt) => {
        const label = opt.label || '' // اگر label وجود ندارد، مقدار خالی
        return label.toString().toLowerCase().includes(query.toLowerCase())
      })
      setOptions(filteredOptions)
    } else if (fetchOptions) {
      debouncedFetchOptions(query)
    } else {
      console.warn(`شما برای آیتم ${name} گزینه‌ای تنظیم نکرده‌اید`)
    }
  }, [query, options, fetchOptions, name])
  return (
    <div className="mb-4">
      {title ?? (
        <label htmlFor={name} className="mb-2 block text-sm font-medium">
          {title}
        </label>
      )}
      <div className="relative">
        <div className=" top-16">
          <ComboboxInput
            name={name}
            {...(title ? { title: title } : {})}
            placeholder={placeholder || 'انتخاب کنید'}
            options={_options}
            value={selectedOption?.value}
            // value={selectedOption.value}
            onChange={(option) => {
              setSelectedOption(option)
              if (onChange) onChange({ target: option })
            }}
            disabled={disabled}
            setQuery={setQuery}
            loading={loading}
            showClean={showClean}
          />
        </div>
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500">
            <InputIcon />
          </span>
        )}
      </div>
      {hasError && (
        <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
          {errorMessages.map((error: string) => (
            <p className="mt-2 text-sm text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
