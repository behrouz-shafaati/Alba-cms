'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Server, Plug, Mail, Link } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import { updateSettings } from '@/features/settings/actions'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import { Settings } from '../interface'
import { Option, State } from '@/types'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import FileUpload from '@/components/form-fields/file-upload'
import { CampaignTranslation } from '@/features/campaign/interface'
import { getTranslation } from '@/lib/utils'
import Select from '@/components/form-fields/select'

interface SettingsFormProps {
  settings: Settings
}

export const FormAD: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = can(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: State = { message: null, errors: {}, success: true }
  const [state, dispatch] = useActionState(updateSettings as any, initialState)

  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: state.success ? 'default' : 'destructive',
        description: state.message,
      })
  }, [state])
  if (!canModerate) return <AccessDenied />
  const translation: CampaignTranslation = getTranslation({
    translations: settings?.ad?.translations || [],
  })
  const fallbackBehaviorOptions: Option[] = [
    { label: 'نمایش یک بنر تصادفی', value: 'random' },
    { label: 'نمایش بنر پیش‌فرض', value: 'default_banner' },
    { label: 'عدم نمایش', value: 'hide' },
  ]
  const aspectKeys = ['1/1', '4/1', '10/1', '20/1', '30/1']
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form action={dispatch} ref={formRef} className="space-y-8 w-full">
          <div className="md:grid md:grid-cols-3 gap-8">
            <input type="hidden" name="lang" value="fa" readOnly />

            {/* رفتار در صورت نبود تبلیغ */}
            <Select
              title="رفتار در صورت نبود تبلیغ"
              name="fallbackBehavior"
              placeholder="رفتار در صورت نبود تبلیغ"
              options={fallbackBehaviorOptions}
              defaultValue={settings?.ad?.fallbackBehavior || 'random'}
              icon={<Link className="w-4 h-4" />}
            />

            {/* targetUrl */}
            <Text
              title="لینک مقصد بنرهای پیش فرض"
              name="targetUrl"
              defaultValue={settings?.ad?.targetUrl}
              placeholder="لینک مقصد"
              state={state}
              icon={<Link className="w-4 h-4" />}
            />
          </div>
          <h3>بنرهای پیش‌فرض</h3>
          {/* نمایش لیست بنرها */}
          <div>
            {aspectKeys.map((aspectKey, index) => {
              const ratio = aspectKey.split('/')
              const defaultValu = translation?.banners?.find(
                (b) => b.aspect === aspectKey
              )
              return (
                <section
                  key={index}
                  className="mt-2 rounded-md  p-4 md:mt-0 md:p-6"
                >
                  <input
                    type="hidden"
                    name="banners[][aspect]"
                    value={aspectKey}
                  />
                  <FileUpload
                    title={`نسبت عرض به طول ${ratio[0]}/${ratio[1]}`}
                    name="banners[][file]"
                    state={state}
                    maxFiles={1}
                    allowedFileTypes={['image']}
                    defaultValues={defaultValu?.file ? [defaultValu?.file] : []}
                    onLoading={setLoading}
                  />
                </section>
              )
            })}
          </div>
          <SubmitButton loading={loading} />
        </form>
      </div>
    </>
  )
}
