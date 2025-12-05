'use client'
import {
  Form as FormType,
  FormTranslationSchema,
} from '@/features/form/interface'
import RendererRows from '../../../builder-canvas/pageRenderer/RenderRows'
import { useActionState } from 'react'
import { User } from '@/features/user/interface'
import { createFormSubmission } from '@/features/form-submission/actions'

interface MainFormProps {
  user: User | null
  blockData: {
    content: { formId: string }
    type: 'form'
    settings: {}
  }
  widgetName: string
  form: FormType
  formContent: any
}

function Form({
  user,
  blockData,
  widgetName,
  form,
  formContent,
  ...props
}: MainFormProps) {
  const [state, dispatch] = useActionState(createFormSubmission as any, {})
  if (!form) return null
  form.translations = form?.translations || []

  const userRoles = user?.roles || []

  const { settings } = blockData
  const { className, ...restProps } = props
  return (
    <form
      action={dispatch}
      {...restProps}
      className={`w-full z-50 ${className}`}
    >
      <input name="form" type="hidden" value={form.id} />
      {formContent}
    </form>
  )
}

Form.displayName = 'Form'
export default Form
