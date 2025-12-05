'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Server, Plug, Mail } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import { updateSettings } from '@/features/settings/actions'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import { Settings } from '../interface'
import { State } from '@/types'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

interface SettingsFormProps {
  settings: Settings
}

export const FormSMS: React.FC<SettingsFormProps> = ({ settings }) => {
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
  if (!canModerate) return <AccessDenied />
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <h3 className="text-2xlg">تنظیمات پیامک فراز اس ام اس</h3>
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* farazsms_apiKey */}
            <Text
              title="کلید دسترسی"
              name="farazsms_apiKey"
              defaultValue={settings?.farazsms?.farazsms_apiKey || ''}
              placeholder=""
              state={state}
              icon={<Server className="w-4 h-4" />}
              description="آدرس سرور SMTP که از هاست یا سرویس ایمیل دریافت می‌کنید."
            />
            {/* patternCode */}
            <Text
              title="کد پترن وریفای"
              name="farazsms_verifyPatternCode"
              defaultValue={
                settings?.farazsms?.farazsms_verifyPatternCode || ''
              }
              placeholder="مثلا:e23c6ytxkg4f5qc"
              state={state}
              icon={<Plug className="w-4 h-4" />}
              description="در متن باید متغییر %code% حتما باشد. پترن نمونه: 
          کد تایید شماره موبایل در زومکشت: %code%"
            />
            {/* from_number */}
            <Text
              title="خط مورد استفاده"
              name="farazsms_from_number"
              defaultValue={settings?.farazsms?.farazsms_from_number || ''}
              placeholder="مثلاً: +983000505"
              state={state}
              icon={<Mail className="w-4 h-4" />}
              description="ارسال پیامک از این شماره انجام می‌شود"
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
