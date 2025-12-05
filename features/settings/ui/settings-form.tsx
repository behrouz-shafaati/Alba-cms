// 'use client'
// import { useActionState, useEffect, useRef, useState } from 'react'
// import { useParams, useRouter } from 'next/navigation'
// import {
//   Braces as SettingsIcon,
//   Mail as MailIcon,
//   Server,
//   Plug,
//   Mail,
//   Key,
//   Heading1,
//   MessageSquare,
// } from 'lucide-react'
// import { useToast } from '../../../hooks/use-toast'
// import { updateSettings } from '@/features/settings/actions'
// import Text from '../../../components/form-fields/text'
// import SubmitButton  from '../../../components/form-fields/submit-button'
// import { AlertModal } from '../../../components/modal/alert-modal'
// import { PageContent, PageTranslationSchema } from '@/features/page/interface'
// import { Settings } from '../interface'
// import Combobox from '@/components/form-fields/combobox'
// import { Option, State } from '@/types'
// import { HomeIcon } from 'lucide-react'
// import { getTranslation } from '@/lib/utils'
// import Switch from '@/components/form-fields/switch'
// import ProfileUpload from '@/components/form-fields/profile-upload'
// import { useSession } from '@/components/context/SessionContext'
// import { can } from '@/lib/utils/can.client'
// import AccessDenied from '@/components/access-denied'

// interface SettingsFormProps {
//   settings: Settings
//   allPages: PageContent[]
// }

// export const SettingsForm: React.FC<SettingsFormProps> = ({
//   settings,
//   allPages,
// }) => {
//   const locale = 'fa'
//   const { user } = useSession()
//   const userRoles = user?.roles || []

//   const canModerate = can(userRoles, 'settings.moderate.any')
//   const formRef = useRef<HTMLFormElement>(null)
//   const initialState: State = { message: null, errors: {}, success: true }
//   const [state, dispatch] = useActionState(updateSettings as any, initialState)
//   const params = useParams()
//   const router = useRouter()
//   const { toast } = useToast()
//   const [open, setOpen] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [imgLoading, setImgLoading] = useState(false)
//   const title = 'تنظیمات'
//   const description = ''
//   const toastMessage = settings ? ' مطلب بروزرسانی شد' : 'دسته بندی اضافه شد'
//   const action = settings ? 'ذخیره تغییرات' : 'ذخیره'

//   const pagesOptions: Option[] = allPages.map((p: PageContent) => {
//     const translation: PageTranslationSchema = getTranslation({
//       translations: p.translations,
//       locale,
//     })
//     return {
//       value: String(p.id),
//       label: translation?.title,
//     }
//   })

//   const siteInfo = getTranslation({
//     translations: settings?.infoTranslations || [],
//   })

//   const onDelete = async () => {
//     try {
//       setLoading(true)
//       DeleteSettings(settings?.id)
//     } catch (error: any) {}
//   }

//   useEffect(() => {
//     if (state.message && state.message !== null)
//       toast({
//         variant: state.success ? 'default' : 'destructive',
//         description: state.message,
//       })
//   }, [state])

//   const submitManually = () => {
//     if (formRef.current) {
//       formRef.current.requestSubmit() // بهترین راه
//     }
//   }
//   // const defaultC = JSON.parse(
//   //   '{"contentJson":{"type":"doc","content":[{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"سلام"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":null},"content":[{"type":"text","text":"s"}]},{"type":"paragraph","attrs":{"dir":"rtl","textAlign":"left"},"content":[{"type":"text","marks":[{"type":"bold"}],"text":"خوبی"}]}]}}'
//   // )

//   // console.log('@33 settings contentJson: ', settings?.contentJson)
//   if (!canModerate) return <AccessDenied />
//   return (
//     <>
//       <AlertModal
//         isOpen={open}
//         onClose={() => setOpen(false)}
//         onConfirm={onDelete}
//         loading={loading}
//       />

//       <div className=" p-4 md:p-8 pt-6">
//         <div className="flex items-center justify-between">
//           {/* <Heading title={title} description={description} /> */}
//         </div>
//         {/* <Separator /> */}
//         <form action={dispatch} ref={formRef} className="space-y-8 w-full">
//           <h3 className="text-2xlg">عمومی</h3>
//           <div className="md:grid md:grid-cols-3 gap-8">
//             {/* Site title */}
//             <Text
//               title="عنوان سایت"
//               name="site_title"
//               defaultValue={siteInfo?.site_title || ''}
//               placeholder=""
//               state={state}
//               icon={<Heading1 className="w-4 h-4" />}
//               description=""
//             />
//             {/* site introduction */}
//             <Text
//               title="معرفی کوتاه"
//               name="site_introduction"
//               defaultValue={siteInfo?.site_introduction || ''}
//               placeholder=""
//               state={state}
//               icon={<MessageSquare className="w-4 h-4" />}
//               description=""
//             />
//             <ProfileUpload
//               title="نمادک سایت"
//               name="favicon"
//               defaultValue={settings?.favicon}
//               targetFormat="png"
//             />

//             {/* first page */}
//             <Combobox
//               title="صفحه نخست"
//               name="homePageId"
//               defaultValue={String(settings?.homePageId)}
//               options={pagesOptions}
//               placeholder=""
//               state={state}
//               icon={<HomeIcon className="w-4 h-4" />}
//             />

//             {/* desktopHeaderHeight */}
//             <Text
//               title="ارتفاع هدر در دسکتاپ"
//               name="desktopHeaderHeight"
//               defaultValue={settings?.desktopHeaderHeight || ''}
//               placeholder="px"
//               state={state}
//               icon={<MessageSquare className="w-4 h-4" />}
//               description=""
//             />

//             {/* desktopHeaderHeight */}
//             <Text
//               title="ارتفاع هدر در تبلت"
//               name="tabletHeaderHeight"
//               defaultValue={settings?.tabletHeaderHeight || ''}
//               placeholder="px"
//               state={state}
//               icon={<MessageSquare className="w-4 h-4" />}
//               description=""
//             />

//             {/* mobileHeaderHeight */}
//             <Text
//               title="ارتفاع هدر در موبایل"
//               name="mobileHeaderHeight"
//               defaultValue={settings?.mobileHeaderHeight || ''}
//               placeholder="px"
//               state={state}
//               icon={<MessageSquare className="w-4 h-4" />}
//               description=""
//             />

//             {/* default header */}
//             {/* <Combobox
//             title="سربرگ پیش فرض"
//             name="defaultHeaderId"
//             defaultValue={String(settings?.defaultHeaderId)}
//             options={headersOptions}
//             placeholder=""
//             state={state}
//             icon={<HomeIcon className="w-4 h-4" />}
//           /> */}
//           </div>
//           <h3 className="text-2xlg">اعتبارسنجی</h3>
//           <div>
//             <Switch
//               name="commentApprovalRequired"
//               title="نمایش دیدگاه‌ها فقط بعد از تأیید/بررسی"
//               defaultChecked={settings?.commentApprovalRequired ?? true}
//             />
//             <Switch
//               name="emailVerificationRequired"
//               title="تایید مالکیت ایمیل کاربران بررسی شود"
//               defaultChecked={settings?.emailVerificationRequired ?? false}
//             />
//             <Switch
//               name="mobileVerificationRequired"
//               title="تایید مالکیت شماره موبایل کاربران بررسی شود"
//               defaultChecked={settings?.mobileVerificationRequired ?? false}
//             />
//           </div>
//           <h3 className="text-2xlg">تنظیمات ایمیل</h3>
//           <div className="md:grid md:grid-cols-3 gap-8">
//             {/* mail_host */}
//             <Text
//               title="سرور ایمیل (Mail Host)"
//               name="mail_host"
//               defaultValue={settings?.mail_host || ''}
//               placeholder="مثلاً mail.example.com"
//               state={state}
//               icon={<Server className="w-4 h-4" />}
//               description="آدرس سرور SMTP که از هاست یا سرویس ایمیل دریافت می‌کنید."
//             />
//             {/* mail_port */}
//             <Text
//               title="پورت ایمیل (Mail Port)"
//               name="mail_port"
//               defaultValue={settings?.mail_port || ''}
//               placeholder="معمولاً 465 یا 587"
//               state={state}
//               icon={<Plug className="w-4 h-4" />}
//               description="شماره پورتی که برای اتصال به SMTP استفاده می‌شود."
//             />
//             {/* mail_username */}
//             <Text
//               title="نام کاربری ایمیل (Email Username)"
//               name="mail_username"
//               defaultValue={settings?.mail_username || ''}
//               placeholder="مثلاً noreply@example.com"
//               state={state}
//               icon={<Mail className="w-4 h-4" />}
//               description="همان آدرس ایمیلی که برای ارسال استفاده می‌کنید."
//             />
//             {/* mail_password */}
//             <Text
//               title="رمز عبور ایمیل (Email Password)"
//               name="mail_password"
//               defaultValue={settings?.mail_password || ''}
//               placeholder=""
//               state={state}
//               icon={<Key className="w-4 h-4" />}
//               description="رمز عبور یا App Password همان ایمیل."
//             />
//           </div>
//           <h3 className="text-2xlg">تنظیمات پیامک فراز اس ام اس</h3>
//           <div className="md:grid md:grid-cols-3 gap-8">
//             {/* farazsms_apiKey */}
//             <Text
//               title="کلید دسترسی"
//               name="farazsms_apiKey"
//               defaultValue={settings?.farazsms?.farazsms_apiKey || ''}
//               placeholder=""
//               state={state}
//               icon={<Server className="w-4 h-4" />}
//               description="آدرس سرور SMTP که از هاست یا سرویس ایمیل دریافت می‌کنید."
//             />
//             {/* patternCode */}
//             <Text
//               title="کد پترن وریفای"
//               name="farazsms_verifyPatternCode"
//               defaultValue={
//                 settings?.farazsms?.farazsms_verifyPatternCode || ''
//               }
//               placeholder="مثلا:e23c6ytxkg4f5qc"
//               state={state}
//               icon={<Plug className="w-4 h-4" />}
//               description="در متن باید متغییر %code% حتما باشد. پترن نمونه:
// کد تایید شماره موبایل در زومکشت: %code%"
//             />
//             {/* from_number */}
//             <Text
//               title="خط مورد استفاده"
//               name="farazsms_from_number"
//               defaultValue={settings?.farazsms?.farazsms_from_number || ''}
//               placeholder="مثلاً: +983000505"
//               state={state}
//               icon={<Mail className="w-4 h-4" />}
//               description="ارسال پیامک از این شماره انجام می‌شود"
//             />
//           </div>
//           <SubmitButton />
//         </form>
//       </div>
//     </>
//   )
// }

// export function DeleteSettings(id: string) {}
