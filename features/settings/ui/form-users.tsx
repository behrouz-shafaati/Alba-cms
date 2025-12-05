'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ShieldQuestionIcon } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import { updateSettings } from '@/features/settings/actions'
import SubmitButton from '../../../components/form-fields/submit-button'
import { Settings } from '../interface'
import { Option, State } from '@/types'
import MultipleSelector from '../../../components/form-fields/multiple-selector'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import { Role } from '@/features/role/interface'
import roleCtrl from '@/features/role/controller'

interface FormProps {
  settings: Settings
}

export const FormUsers: React.FC<FormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const loginedUserRoles = user?.roles || []

  const canModerate = can(loginedUserRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: State = { message: null, errors: {}, success: true }
  const [state, dispatch] = useActionState(updateSettings as any, initialState)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = 'تنظیمات'
  const description = ''
  const toastMessage = settings ? ' مطلب بروزرسانی شد' : 'دسته بندی اضافه شد'

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: state.success ? 'default' : 'destructive',
        description: state.message,
      })
  }, [state])
  if (!canModerate) return <AccessDenied />

  const allRoles: Role[] = roleCtrl.getRoles()
  const roleOptions: Option[] = allRoles.map((role) => ({
    label: role.title,
    value: role.slug,
  }))
  const userRoles: Option[] = Array.isArray(settings.user?.defaultRoles)
    ? settings.user?.defaultRoles.map((slug: string) => {
        const findedRole: Role | undefined = allRoles.find(
          (role: Role) => role.slug == slug
        )
        return { label: findedRole?.title, value: slug }
      })
    : []

  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Roles */}
            <MultipleSelector
              title="نقش پیش فرض کاربر"
              name="defaultRoles"
              defaultValues={userRoles}
              placeholder="نقش پیش فرض را انتخاب کنید"
              state={state}
              defaultSuggestions={roleOptions}
              icon={<ShieldQuestionIcon className="w-4 h-4" />}
              className="col-span-3 lg:col-span-1"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
