import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Textarea } from '../ui/textarea'

type TextArea = {
  title: string
  name: string
  id?: string
  defaultValue?: string
  placeholder?: string
  description?: string
  icon?: any
  state?: any
  value?: string
  display?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  rows?: number
  onChange?: (e: any) => void
}
export default function TextArea({
  title,
  name,
  id,
  defaultValue,
  placeholder,
  description,
  icon,
  state,
  value,
  display = true,
  disabled = false,
  readOnly = false,
  className = '',
  rows = 3,
  onChange,
  ...restProps
}: TextArea) {
  if (!display) return null
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const InputIcon = typeof icon === 'object' ? () => icon : icon
  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <div className="relative">
        <Textarea
          onChange={onChange}
          {...(value !== undefined ? { value } : {})}
          id={id || name}
          name={name}
          defaultValue={defaultValue}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          className="peer"
          rows={rows}
          {...restProps}
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
        <div id={`${name}-error`} aria-live="polite" aria-atomic="true">
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
