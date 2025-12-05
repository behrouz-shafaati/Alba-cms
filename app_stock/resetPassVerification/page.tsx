export const dynamic = 'force-dynamic'
import { Metadata } from 'next'
import userCtrl from '@/features/user/controller'
import { Settings } from '@/features/settings/interface'
import { getSettings } from '@/features/settings/controller'
import ResetPassVerificationForm from '@/features/resetPass/ui/resetPass-verification-form'

export const metadata: Metadata = {
  title: 'بازنشانی رمز ورود',
  description: 'بازنشانی رمز ورود',
}

export default async function Page({
  searchParams,
}: {
  searchParams: { identifier: string; user: string }
}) {
  const resolvedSearchParams = await searchParams
  const { identifier, user: userId } = resolvedSearchParams
  const purpose = 'password_reset'
  const user = await userCtrl.findById({ id: userId })
  if (!user) return <p>کاربر وجود ندارد!</p>
  const settings: Settings = (await getSettings()) as Settings
  return (
    <div className="relative h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
        <div className="absolute inset-0 bg-zinc-900" />
        <div className="relative z-20 flex items-center text-lg font-medium">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mr-2 h-6 w-6"
          >
            <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
          </svg>
          تکنوآفرین
        </div>
        <div className="relative z-20 mt-auto">
          <blockquote className="space-y-2">
            <p className="text-lg">
              &ldquo;تلاشی در راه افزایش رفاه و میزان بهره وری کسب و
              کارها&rdquo;
            </p>
            {/* <footer className="text-sm">بهروز شفاعتی</footer> */}
          </blockquote>
        </div>
      </div>
      <div className="p-4 lg:p-8 h-full flex items-center">
        <ResetPassVerificationForm
          settings={settings}
          user={user}
          purpose={purpose}
          identifier={identifier}
        />
      </div>
    </div>
  )
}
