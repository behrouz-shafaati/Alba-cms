'use client'
import { Suspense, useActionState, useEffect, useState } from 'react'
import { signUpAction } from '@/features/user/actions'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import Text from '@/components/form-fields/text'
import { KeyRound, MailIcon, PhoneIcon, UserIcon } from 'lucide-react'
import Password from '@/components/form-fields/password'
import SubmitButton from '@/components/form-fields/submit-button'
import { ActionsState } from '@/types'
import ImageAlba from '@/components/image-alba'
import { File } from '@/lib/entity/file/interface'

function UserAuthFormComponent() {
  const initialState: ActionsState = {
    message: null,
    errors: {},
    success: false,
  }
  const [loading, setLoading] = useState(false)
  const [state, dispatch] = useActionState(signUpAction as any, initialState)

  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: state.success ? 'default' : 'destructive',
        title: '',
        description: state.message,
      })
  }, [state])

  return (
    <div>
      <form action={dispatch} className="space-y-2 w-full">
        {/* First Name */}
        <Text
          title="نام"
          name="firstName"
          defaultValue={state.values?.firstName || ''}
          placeholder="نام"
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />
        {/* Last Name */}
        <Text
          title="نام خانوادگی"
          name="lastName"
          defaultValue={state.values?.lastName || ''}
          placeholder="نام خانوادگی"
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />
        {/* Email */}
        <Text
          title="ایمیل"
          name="email"
          defaultValue={state.values?.email || ''}
          placeholder="ایمیل"
          state={state}
          icon={<MailIcon className="w-4 h-4" />}
        />
        {/* Mobile */}
        <Text
          title="موبایل"
          name="mobile"
          defaultValue={state.values?.mobile || ''}
          placeholder="موبایل"
          state={state}
          icon={<PhoneIcon className="w-4 h-4" />}
        />
        {/* Password */}
        <Password
          autoComplete="off"
          title="رمز ورود"
          name="password"
          placeholder="******"
          defaultValue={state.values?.password || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />
        {/* Confirm Password Field */}
        <Password
          title="تایید رمز ورود"
          name="confirmPassword"
          placeholder="******"
          defaultValue={state.values?.confirmPassword || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />

        <SubmitButton text="ثبت نام" className="w-full" />
        {/* <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">یا</span>
        </div>
      </div>
      <GitHubSignInButton /> */}
      </form>
    </div>
  )
}

type props = {
  termsPageHref: string
  privacyPageHref: string
  site_title?: string
  logo?: File
}

export default function SignupForm({
  termsPageHref,
  privacyPageHref,
  site_title,
  logo,
}: props) {
  return (
    <>
      <Suspense fallback={<div className="flex m-auto">Loading...</div>}>
        <div className="mx-auto flex w-full flex-col  space-y-6 sm:w-[350px] ">
          <div className="flex flex-col text-center ">
            <Link href={'/'} target="_self" className=" w-20 m-auto">
              {logo && <ImageAlba zoomable={false} file={logo} />}
            </Link>
            <p className="text-sm text-muted-foreground">
              عضویت {site_title && ` در ${site_title}`}
            </p>
          </div>
          <UserAuthFormComponent />
          <div className="text-center text-sm">
            حساب کاربری دارید؟{' '}
            <Link
              href="/login"
              className="underline underline-offset-4 hover:text-primary"
            >
              وارد شوید
            </Link>
          </div>
          <p className="px-8 text-center text-sm text-muted-foreground">
            با کلیک بر روی ادامه، با{' '}
            <Link
              href={termsPageHref}
              className="underline underline-offset-4 hover:text-primary"
            >
              قوانین سایت
            </Link>{' '}
            و{' '}
            <Link
              href={privacyPageHref}
              className="underline underline-offset-4 hover:text-primary"
            >
              حریم خصوصی
            </Link>{' '}
            موافقت می کنید.
          </p>
        </div>
      </Suspense>
    </>
  )
}
