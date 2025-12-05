'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useToast } from '../../../hooks/use-toast'
import { updateSettings } from '@/features/settings/actions'
import SubmitButton from '../../../components/form-fields/submit-button'
import { Settings } from '../interface'
import { State } from '@/types'
import Switch from '@/components/form-fields/switch'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

interface SettingsFormProps {
  settings: Settings
}

export const FormValidation: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = can(userRoles, 'settings.moderate.any')
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

  const submitManually = () => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }
  if (!canModerate) return <AccessDenied />
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <div>
            <Switch
              name="commentApprovalRequired"
              title="نمایش دیدگاه‌ها فقط بعد از تأیید/بررسی"
              defaultChecked={settings?.commentApprovalRequired ?? true}
            />
            <Switch
              name="emailVerificationRequired"
              title="تایید مالکیت ایمیل کاربران بررسی شود"
              defaultChecked={settings?.emailVerificationRequired ?? false}
            />
            <Switch
              name="mobileVerificationRequired"
              title="تایید مالکیت شماره موبایل کاربران بررسی شود"
              defaultChecked={settings?.mobileVerificationRequired ?? false}
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
