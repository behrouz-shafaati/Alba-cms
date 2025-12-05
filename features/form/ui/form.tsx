'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import roleCtrl from '@/features/role/controller'
import { createForm, deleteFormAction, updateForm } from '../actions'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import BuilderForm from '@/components/builder-form'
import { FormTranslationSchema, Form as FormType } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

export const IMG_MAX_LIMIT = 3
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type FormValues = z.infer<typeof formSchema>

interface FormProps {
  initialData: FormType | null
}

export const Form: React.FC<FormProps> = ({ initialData: form }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'form.create')
  const canEdit = can(
    userRoles,
    form?.user !== user?.id ? 'form.edit.any' : 'form.edit.own'
  )
  const translation: FormTranslationSchema =
    form?.translations?.find((t: FormTranslationSchema) => t.lang === locale) ||
    form?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...form, translation },
  }
  const actionHandler = form
    ? updateForm.bind(null, String(form.id))
    : createForm
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const roleOptions: Option[] = roleCtrl.getRoles().map((role) => ({
    label: role.title,
    value: role.slug,
  }))

  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = form ? 'ویرایش فرم' : 'افزودن فرم'
  const description = form ? 'ویرایش فرم' : 'افزودن فرم'
  const toastMessage = form ? 'فرم بروزرسانی شد' : 'فرم اضافه شد'
  const action = form ? 'ذخیره تغییرات' : 'ذخیره'

  const defaultInitialValue = {
    title: '',
    type: 'form',
    status: 'active',
    templateFor: ['form'],
    successMessage: 'پیام شما با موفقیت ارسال شد',
    rows: [],
  }

  console.log('#299 form:', form?.content?.rows)
  const onDelete = async () => {
    try {
      setLoading(true)
      deleteFormAction([String(form?.id)])
      router.replace('/dashboard/forms')
    } catch (error: any) {}
  }

  useEffect(() => {
    if (state?.message && state.message !== null)
      toast({
        variant: state?.success ? 'default' : 'destructive',
        title: '',
        description: state.message,
      })
    if (state?.success && state?.isCreatedJustNow) {
      router.replace(`/dashboard/forms/${state?.values?.id}`)
    }
  }, [state])
  if (!canCreate && !canEdit) return <AccessDenied />
  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <BuilderForm
        title="فرم ساز"
        name="contentJson"
        submitFormHandler={dispatch}
        {...(form || state?.values?.content
          ? {
              initialContent: {
                ...state?.values?.content,
              },
            }
          : {
              initialContent: { type: 'form', templateFor: ['form'], rows: [] },
            })}
      />
    </>
  )
}
