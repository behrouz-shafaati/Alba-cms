'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Heading1, Link, MessageSquare } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import { PageContent, PageTranslationSchema } from '@/features/page/interface'
import Combobox from '@/components/form-fields/combobox'
import { Option, State } from '@/types'
import { HomeIcon } from 'lucide-react'
import { getTranslation } from '@/lib/utils'
import ProfileUpload from '@/components/form-fields/profile-upload'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import { updateGeneralSettings } from './actions'

interface FormGeneralProps {
  settings: Settings
  allPages: PageContent[]
}

export const FormGeneral: React.FC<FormGeneralProps> = ({
  settings,
  allPages,
}) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = can(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: State = {
    values: settings?.general,
    message: null,
    errors: {},
    success: true,
  }
  const [state, dispatch] = useActionState(
    updateGeneralSettings as any,
    initialState
  )
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = 'تنظیمات'
  const description = ''
  const toastMessage = settings ? ' مطلب بروزرسانی شد' : 'دسته بندی اضافه شد'
  const action = settings ? 'ذخیره تغییرات' : 'ذخیره'

  const pagesOptions: Option[] = allPages?.map((p: PageContent) => {
    const translation: PageTranslationSchema = getTranslation({
      translations: p.translations,
      locale,
    })
    return {
      value: String(p.id),
      label: translation?.title,
    }
  })
  const siteInfo = getTranslation({
    translations: state?.values?.translations || [],
  })
  const pages = getTranslation({
    translations: state?.values?.translations || [],
  })

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
          <input type="hidden" name="locale" value="fa" readOnly />
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Site title */}
            <Text
              title="عنوان سایت"
              name="site_title"
              defaultValue={
                state?.values?.site_title || siteInfo?.site_title || ''
              }
              placeholder=""
              state={state}
              icon={<Heading1 className="w-4 h-4" />}
              description=""
            />
            {/* site introduction */}
            <Text
              title="معرفی کوتاه"
              name="site_introduction"
              defaultValue={
                state?.values?.site_introduction ||
                siteInfo?.site_introduction ||
                ''
              }
              placeholder=""
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />
            {/* site introduction */}
            <Text
              title="آدرس سایت"
              name="site_url"
              defaultValue={settings?.general?.site_url || ''}
              placeholder=""
              state={state}
              icon={<Link className="w-4 h-4" />}
              description=""
            />

            {/* first page */}
            <Combobox
              title="صفحه نخست"
              name="homePageId"
              defaultValue={String(pages?.homePageId)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />
            {/* terms page */}
            <Combobox
              title="صفحه قوانین"
              name="termsPageId"
              defaultValue={String(pages?.termsPageId)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />
            {/* privacy page */}
            <Combobox
              title="صفحه حریم خصوصی"
              name="privacyPageId"
              defaultValue={String(pages?.privacyPageId)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />

            <ProfileUpload
              title="نمادک سایت"
              name="favicon"
              defaultValue={settings?.general?.faviconDetails}
              targetFormat="png"
            />
            {/* default header */}
            {/* <Combobox
            title="سربرگ پیش فرض"
            name="defaultHeaderId"
            defaultValue={String(settings?.defaultHeaderId)}
            options={headersOptions}
            placeholder=""
            state={state}
            icon={<HomeIcon className="w-4 h-4" />}
          /> */}
          </div>
          <SubmitButton loading={imgLoading} />
        </form>
      </div>
    </>
  )
}

export function DeleteSettings(id: string) {}
