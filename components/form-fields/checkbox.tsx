import clsx from 'clsx'
import { Label } from '../ui/label'
import { CheckboxInput } from '../ui/checkbox-input'

type RadioProps = {
  name: string
  id?: string
  className?: string
  icon?: any
  title: string
  checked?: boolean
  defaultChecked?: boolean
  disabled?: boolean
  state?: any
  onChange?: (value: boolean) => void
}

export default function Checkbox({
  title,
  name,
  id,
  className,
  icon,
  checked,
  defaultChecked,
  disabled,
  state,
  onChange,
}: RadioProps) {
  const errorMessages = state?.errors?.[name] ?? []
  const hasError = state?.errors?.[name]?.length > 0
  const Icon = icon
  return (
    <fieldset className={`mb-4 ${className}`}>
      {/* <legend className="mb-2 block text-sm font-medium">{title}</legend> */}
      <div className={clsx('flex gap-4', { 'text-gray-400': disabled })}>
        <div key={name} className={`flex items-center justify-center`}>
          <CheckboxInput
            id={id || name}
            name={name}
            {...(onChange ? { onCheckedChange: onChange } : { readOnly: true })}
            value="on"
            checked={checked}
            defaultChecked={defaultChecked}
            disabled={disabled}
            className={clsx(
              `h-4 w-4 cursor-pointer border-gray-300 bg-gray-100  focus:ring-2 `,
              { 'text-gray-400': disabled }
            )}
          />
          <Label
            htmlFor={id || name}
            className={` flex cursor-pointer items-center gap-1.5 rounded-full  px-3 text-xs font-medium `}
          >
            {title} {Icon && <Icon className="h-4 w-4" />}
          </Label>
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
    </fieldset>
  )
}
