'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Heading1, Link, MessageSquare } from 'lucide-react'
import { useToast } from '../../../hooks/use-toast'
import { updateSettings } from '@/features/settings/actions'
import Text from '../../../components/form-fields/text'
import SubmitButton from '../../../components/form-fields/submit-button'
import { PageContent, PageTranslationSchema } from '@/features/page/interface'
import { Settings } from '../interface'
import Combobox from '@/components/form-fields/combobox'
import { Option, State } from '@/types'
import { HomeIcon } from 'lucide-react'
import { getTranslation } from '@/lib/utils'
import ProfileUpload from '@/components/form-fields/profile-upload'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'

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
  const initialState: State = { message: null, errors: {}, success: true }
  const [state, dispatch] = useActionState(updateSettings as any, initialState)
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [imgLoading, setImgLoading] = useState(false)
  const title = 'تنظیمات'
  const description = ''
  const toastMessage = settings ? ' مطلب بروزرسانی شد' : 'دسته بندی اضافه شد'
  const action = settings ? 'ذخیره تغییرات' : 'ذخیره'

  const pagesOptions: Option[] = allPages.map((p: PageContent) => {
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
    translations: settings?.infoTranslations || [],
  })
  const pages = getTranslation({
    translations: settings?.pageTranslations || [],
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
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* Site title */}
            <Text
              title="عنوان سایت"
              name="site_title"
              defaultValue={siteInfo?.site_title || ''}
              placeholder=""
              state={state}
              icon={<Heading1 className="w-4 h-4" />}
              description=""
            />
            {/* site introduction */}
            <Text
              title="معرفی کوتاه"
              name="site_introduction"
              defaultValue={siteInfo?.site_introduction || ''}
              placeholder=""
              state={state}
              icon={<MessageSquare className="w-4 h-4" />}
              description=""
            />
            {/* site introduction */}
            <Text
              title="آدرس سایت"
              name="site_url"
              defaultValue={settings?.site_url || ''}
              placeholder=""
              state={state}
              icon={<Link className="w-4 h-4" />}
              description=""
            />

            {/* first page */}
            <Combobox
              title="صفحه نخست"
              name="homePageId"
              defaultValue={String(pages?.homePageId?.id)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />
            {/* terms page */}
            <Combobox
              title="صفحه قوانین"
              name="termsPageId"
              defaultValue={String(pages?.termsPageId?.id)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />
            {/* privacy page */}
            <Combobox
              title="صفحه حریم خصوصی"
              name="privacyPageId"
              defaultValue={String(pages?.privacyPageId?.id)}
              options={pagesOptions}
              placeholder=""
              state={state}
              icon={<HomeIcon className="w-4 h-4" />}
            />

            <ProfileUpload
              title="نمادک سایت"
              name="favicon"
              defaultValue={settings?.favicon}
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
