export const dynamic = 'force-dynamic'
import { Metadata } from 'next'
import VerificationForm from '@/features/verification/ui/verification-form'
import userCtrl from '@/features/user/controller'
import { Settings } from '@/features/settings/interface'
import { getSettings } from '@/features/settings/controller'
import { sendVerificationCode } from '@/features/verification/actions'
import { VerificationPurpose } from '@/features/verification/interface'
import verificationCtrl from '@/features/verification/controller'
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: 'Authentication',
  description: 'Authentication forms built using the components.',
}

export default async function AuthenticationPage({
  searchParams,
}: {
  searchParams: { purpose: VerificationPurpose; user: string }
}) {
  const resolvedSearchParams = await searchParams
  const { purpose, user: userId } = resolvedSearchParams
  const user = await userCtrl.findById({ id: userId })
  if (!user) return <p>کاربر وجود ندارد!</p>
  const settings: Settings = (await getSettings()) as Settings
  const verifyNeed: boolean = await verificationCtrl.verificationRequired({
    user,
  })
  if (!verifyNeed) redirect('/login')
  sendVerificationCode({ user, purpose })
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
      <div className="p-4">
        <VerificationForm settings={settings} user={user} purpose={purpose} />
      </div>
    </div>
  )
}
