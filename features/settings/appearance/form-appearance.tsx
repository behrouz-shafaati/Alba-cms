'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { MessageSquare } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import { State } from '@/types'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import { updateAppearanceSettings } from './actions'

interface FormProps {
  settings: Settings
}

export const FormAppearance: React.FC<FormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = can(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: State = {
    values: settings?.appearance,
    message: null,
    errors: {},
    success: true,
  }
  const [state, dispatch] = useActionState(
    updateAppearanceSettings as any,
    initialState
  )
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
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* desktopHeaderHeight */}
            <Text
              title="ارتفاع هدر در دسکتاپ"
              name="desktopHeaderHeight"
              defaultValue={state?.values?.desktopHeaderHeight || ''}
              placeholder="px"
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />

            {/* desktopHeaderHeight */}
            <Text
              title="ارتفاع هدر در تبلت"
              name="tabletHeaderHeight"
              defaultValue={state?.values?.tabletHeaderHeight || ''}
              placeholder="px"
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />

            {/* mobileHeaderHeight */}
            <Text
              title="ارتفاع هدر در موبایل"
              name="mobileHeaderHeight"
              defaultValue={state?.values?.mobileHeaderHeight || ''}
              placeholder="px"
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />
          </div>
          <SubmitButton />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
