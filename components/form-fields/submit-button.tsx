'use client'

import { useFormStatus } from 'react-dom'
import { LoadingButton } from '../ui/loading-button'

type SubmitButtonProps = {
  text?: string
  className?: string
  loading?: boolean
}
export default function SubmitButton({
  text = 'ذخیره',
  className = '',
  loading = false,
}: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <LoadingButton
      type="submit"
      loading={pending || loading}
      className={className}
    >
      {text}
    </LoadingButton>
  )
}
