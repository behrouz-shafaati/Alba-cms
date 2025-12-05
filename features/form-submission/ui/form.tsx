'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import roleCtrl from '@/features/role/controller'
import {
  createFormSubmission,
  deleteFormSubmissionAction,
  updateFormSubmission,
} from '../actions'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import BuilderFormSubmission from '@/components/builder-formSubmission'
import {
  FormSubmissionTranslationSchema,
  FormSubmission as FormSubmissionType,
} from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

export const IMG_MAX_LIMIT = 3
const formSubmissionSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type FormSubmissionValues = z.infer<typeof formSubmissionSchema>

interface FormSubmissionProps {
  initialData: FormSubmissionType | null
}

export const FormSubmission: React.FC<FormSubmissionProps> = ({
  initialData: formSubmission,
}) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'formSubmission.create')
  const canEdit = can(
    userRoles,
    formSubmission?.user !== user?.id
      ? 'formSubmission.edit.any'
      : 'formSubmission.edit.own'
  )
  const translation: FormSubmissionTranslationSchema =
    formSubmission?.translations?.find(
      (t: FormSubmissionTranslationSchema) => t.lang === locale
    ) ||
    formSubmission?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...formSubmission, translation },
  }
  const actionHandler = formSubmission
    ? updateFormSubmission.bind(null, String(formSubmission.id))
    : createFormSubmission
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
  const title = formSubmission ? 'ویرایش فرم' : 'افزودن فرم'
  const description = formSubmission ? 'ویرایش فرم' : 'افزودن فرم'
  const toastMessage = formSubmission ? 'فرم بروزرسانی شد' : 'فرم اضافه شد'
  const action = formSubmission ? 'ذخیره تغییرات' : 'ذخیره'

  const defaultInitialValue = {
    title: '',
    type: 'formSubmission',
    status: 'active',
    templateFor: ['formSubmission'],
    successMessage: 'پیام شما با موفقیت ارسال شد',
    rows: [],
  }

  console.log('#299 formSubmission:', translation?.content?.rows)
  const onDelete = async () => {
    try {
      setLoading(true)
      deleteFormSubmissionAction([String(formSubmission?.id)])
      router.replace('/dashboard/formSubmissions')
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
      router.replace(`/dashboard/formSubmissions/${state?.values?.id}`)
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
      <BuilderFormSubmission
        title="فرم ساز"
        name="contentJson"
        submitFormSubmissionHandler={dispatch}
        {...(formSubmission || state?.values?.translation?.content
          ? {
              initialContent: {
                ...state?.values?.translation?.content,
              },
            }
          : {
              initialContent: {
                type: 'formSubmission',
                templateFor: ['formSubmission'],
                rows: [],
              },
            })}
      />
    </>
  )
}
