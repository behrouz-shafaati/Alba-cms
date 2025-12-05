'use client'

import DatePicker, { DateObject } from 'react-multi-date-picker'
import persian from 'react-date-object/calendars/persian'
import persian_fa from 'react-date-object/locales/persian_fa'
import { useState } from 'react'
import { Label } from '../ui/label'

type Props = {
  lang: 'fa' | 'en'
  title: string
  id?: string
  fromFieldName: string
  toFieldName: string
  fromDefaultValue?: string
  toDefaultValue?: string
  placeholder?: string
  description?: string
  icon?: any
  state?: any
  display?: boolean
  disabled?: boolean
}
const DateRangePicker = ({
  lang,
  title,
  id,
  placeholder,
  description,
  fromFieldName,
  toFieldName,
  fromDefaultValue,
  toDefaultValue,
  icon,
  state,
  display = true,
  disabled = false,
}: Props) => {
  const errorMessages = state?.errors?.[fromFieldName] ?? []
  const hasError = state?.errors?.[fromFieldName]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon
  const initialData =
    fromDefaultValue && toDefaultValue
      ? [new DateObject(fromDefaultValue), new DateObject(toDefaultValue)]
      : []
  const [values, setValues] = useState(initialData)
  function handleChange(value: any) {
    //تغییرات روی تاریخ رو اینجا اعمال کنید
    setValues(value)
  }
  if (!display) return null
  return (
    <div className={`mb-4`}>
      <input
        type="hidden"
        name={fromFieldName}
        value={
          Array.isArray(values) && values[0]
            ? values[0].toDate().toISOString()
            : ''
        }
        readOnly
      />
      <input
        type="hidden"
        name={toFieldName}
        value={
          Array.isArray(values) && values[1]
            ? values[1].toDate().toISOString()
            : ''
        }
        readOnly
      />
      <Label htmlFor={fromFieldName} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <div className="relative">
        <DatePicker
          className="w-full"
          inputClass="peer flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 peer"
          id={id || fromFieldName}
          value={values}
          onChange={handleChange}
          numberOfMonths={2}
          range
          rangeHover
          calendar={persian}
          locale={persian_fa}
          calendarPosition="bottom-right"
          disabled={disabled}
          placeholder={placeholder}
        />
        {icon && (
          <span className="pointer-events-none absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2 text-gray-500">
            <InputIcon />
          </span>
        )}
      </div>
      {description && (
        <span className="text-xs text-gray-500">{description}</span>
      )}
      {hasError && (
        <div
          id={`${fromFieldName}-error`}
          aria-live="polite"
          aria-atomic="true"
        >
          {errorMessages.map((error: string) => (
            <p className="mt-2 text-xs text-red-500" key={error}>
              {error}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}

export default DateRangePicker
