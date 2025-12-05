'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Server, Plug, Mail, Key } from 'lucide-react'
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

export const FormEmail: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = can(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: State = { message: null, errors: {}, success: true }
  const [state, dispatch] = useActionState(updateSettings as any, initialState)

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
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
          <h3 className="text-2xlg">تنظیمات ایمیل</h3>
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* mail_host */}
            <Text
              title="سرور ایمیل (Mail Host)"
              name="mail_host"
              defaultValue={settings?.mail_host || ''}
              placeholder="مثلاً mail.example.com"
              state={state}
              icon={<Server className="w-4 h-4" />}
              description="آدرس سرور SMTP که از هاست یا سرویس ایمیل دریافت می‌کنید."
            />
            {/* mail_port */}
            <Text
              title="پورت ایمیل (Mail Port)"
              name="mail_port"
              defaultValue={settings?.mail_port || ''}
              placeholder="معمولاً 465 یا 587"
              state={state}
              icon={<Plug className="w-4 h-4" />}
              description="شماره پورتی که برای اتصال به SMTP استفاده می‌شود."
            />
            {/* mail_username */}
            <Text
              title="نام کاربری ایمیل (Email Username)"
              name="mail_username"
              defaultValue={settings?.mail_username || ''}
              placeholder="مثلاً noreply@example.com"
              state={state}
              icon={<Mail className="w-4 h-4" />}
              description="همان آدرس ایمیلی که برای ارسال استفاده می‌کنید."
            />
            {/* mail_password */}
            <Text
              title="رمز عبور ایمیل (Email Password)"
              name="mail_password"
              defaultValue={settings?.mail_password || ''}
              placeholder=""
              state={state}
              icon={<Key className="w-4 h-4" />}
              description="رمز عبور یا App Password همان ایمیل."
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
