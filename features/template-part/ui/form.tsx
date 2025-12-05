'use client'
import * as z from 'zod'
import { useActionState, useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '@/hooks/use-toast'
import roleCtrl from '@/features/role/controller'
import {
  createTemplatePart,
  deleteTemplatePartAction,
  updateTemplatePart,
} from '../actions'
import { Option } from '@/components/form-fields/combobox'
import { AlertModal } from '@/components/modal/alert-modal'
import BuilderTemplatePart from '@/components/builder-template-part'
import { TemplatePart } from '../interface'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

export const IMG_MAX_LIMIT = 3
const formSchema = z.object({
  title: z.string().min(3, { message: 'عنوان معتبر وارد کنید' }),
})

type TemplatePartFormValues = z.infer<typeof formSchema>

interface TemplatePartFormProps {
  initialData: TemplatePart | null
}

export const Form: React.FC<TemplatePartFormProps> = ({
  initialData: TemplatePart,
}) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'template.create')
  const canEdit = can(
    userRoles,
    TemplatePart?.user !== user?.id ? 'template.edit.any' : 'template.edit.own'
  )
  const initialState = { message: null, errors: {} }
  const actionHandler = TemplatePart
    ? updateTemplatePart.bind(null, String(TemplatePart.id))
    : createTemplatePart
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
  const title = TemplatePart ? 'ویرایش قطعه قالب' : 'افزودن قطعه قالب'
  const description = TemplatePart ? 'ویرایش قطعه قالب' : 'افزودن قطعه قالب'
  const toastMessage = TemplatePart
    ? 'قطعه قالب بروزرسانی شد'
    : 'قطعه قالب اضافه شد'
  const action = TemplatePart ? 'ذخیره تغییرات' : 'ذخیره'

  const defaultInitialValue = {
    title: '',
    type: 'templatePart',
    status: 'active',
    rows: [],
  }

  console.log('#299 TemplatePart:', TemplatePart?.content.rows)
  const onDelete = async () => {
    try {
      setLoading(true)
      deleteTemplatePartAction([String(TemplatePart?.id)])
      router.replace('/dashboard/template-parts')
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
      router.replace(`/dashboard/template-parts/${state?.values?.id}`)
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
      {/* <div className="flex items-center justify-between">
        {/* <Heading title={title} description={description} /> * /}
        {TemplatePart && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div> * /}
      {/* <Separator /> */}
      <BuilderTemplatePart
        initialContent={
          TemplatePart ? TemplatePart.content : defaultInitialValue
        }
        name="contentJson"
        submitFormHandler={dispatch}
      />
    </>
  )
}
