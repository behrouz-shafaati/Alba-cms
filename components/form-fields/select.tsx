'use client'

import { Fragment, useState, useEffect } from 'react'

import {
  Select as SelectInput,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

export type Option = {
  value: string
  label: string
}

type SelectProps = {
  title: string
  name: string
  defaultValue?: string
  options: Option[]
  placeholder?: string
  icon?: any
  state?: any
  onChange?: (value: string) => void
}
export default function Select({
  title,
  name,
  defaultValue,
  options,
  placeholder,
  icon,
  state,
  onChange,
}: SelectProps) {
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon
  let defaultSelectedOption: Option = {
    value: '',
    label: '',
  }
  if (defaultValue)
    for (let j = 0; j < options.length; j++) {
      if (defaultValue === options[j].value) {
        defaultSelectedOption = options[j]
      }
    }
  const [selectedOption, setSelectedOption] = useState(defaultSelectedOption)
  const [value, setValue] = useState(defaultSelectedOption?.value)

  return (
    <div className="mb-4">
      <label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </label>
      <div className="relative">
        <input type="hidden" name={name} value={selectedOption.value} />
        <div className=" top-16">
          <SelectInput
            defaultValue={defaultValue}
            onValueChange={(value: string) => {
              if (onChange) onChange(value)
              setSelectedOption(
                options.find((option) => option.value === value) ||
                  defaultSelectedOption
              )
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue
                placeholder={placeholder || `یک ${title} انتخاب کنید`}
              />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </SelectInput>
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
