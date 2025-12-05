import { InputOTP, InputOTPGroup, InputOTPSlot } from '../ui/input-otp'
import { Label } from '../ui/label'

type Text = {
  title: string
  name: string
  id?: string
  placeholder?: string
  description?: any
  state?: any
  display?: boolean
  disabled?: boolean
  readOnly?: boolean
  className?: string
  length: number
  onChange?: (e: any) => void
}
export default function OTP({
  title,
  name,
  id,
  length,
  placeholder,
  description,
  state,
  display = true,
  disabled = false,
  readOnly = false,
  className = '',
  onChange,
}: Text) {
  if (!display) return null
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  return (
    <div className={`mb-4 ${className}`}>
      <Label htmlFor={name} className="mb-2 block text-sm font-medium">
        {title}
      </Label>
      <div className="py-4">
        <InputOTP
          id={id || name}
          maxLength={length}
          name={name}
          placeholder={placeholder}
          readOnly={readOnly}
          disabled={disabled}
          autoComplete="off"
          className="peer"
          onChange={onChange}
        >
          <InputOTPGroup>
            {Array.from({ length: length }).map((_, index) => (
              <InputOTPSlot key={index} index={index} />
            ))}
          </InputOTPGroup>
        </InputOTP>
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
