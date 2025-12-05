'use client'

import { useState } from 'react'
import MultipleSelectorInput, {
  Option as O,
} from '../ui/multiple-selector-input'

export interface Option extends O {
  value: string
  label: string
}

type MultiSelect = {
  title: string
  name: string
  defaultValues?: Option[]
  defaultSuggestions?: Option[]
  maxSelected?: number
  placeholder?: string
  icon?: any
  state?: any
  onChange?: (values: Option[]) => void
  onSearch?: (query: string) => Promise<Option[]>
  disabled?: boolean
}
export default function MultiSelect({
  title,
  name,
  defaultValues,
  defaultSuggestions = [],
  maxSelected,
  placeholder,
  icon,
  state,
  onChange,
  onSearch,
  disabled = false,
}: MultiSelect) {
  const [values, setValues] = useState<Option[]>(defaultValues || [])
  const [defaultOptions, setDefaultOptions] = useState<Option[]>(
    defaultSuggestions || []
  )

  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon
  return (
    <div className="mb-4 w-full">
      <input
        type="hidden"
        readOnly
        name={name}
        value={JSON.stringify(values)}
      />
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </label>
      <div className="relative">
        <div className=" top-16">
          <MultipleSelectorInput
            placeholder={placeholder || 'انتخاب کنید'}
            defaultOptions={defaultOptions || []}
            value={values}
            hidePlaceholderWhenSelected
            onChange={(options) => {
              setValues(options)
              onChange?.(options)
            }}
            emptyIndicator={
              <p className="w-full text-center text-xs font-normal leading-10 text-gray-600 dark:text-gray-400 pt-4">
                چیزی پیدا نشد
              </p>
            }
            {...(onSearch ? { onSearch: onSearch } : {})}
            {...(maxSelected ? { maxSelected } : {})}
            disabled={disabled}
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
