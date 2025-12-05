'use client'
import { Suspense, useActionState, useEffect, useState } from 'react'
import { loginAction } from '@/features/user/actions'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import Text from '@/components/form-fields/text'
import { KeyRound, UserIcon } from 'lucide-react'
import Password from '@/components/form-fields/password'
import SubmitButton from '@/components/form-fields/submit-button'
import { ActionsState } from '@/types'
import Image from 'next/image'
import { getTranslation } from '@/lib/utils'
import ImageAlba from '@/components/image-alba'

function UserAuthFormComponent() {
  const initialState: ActionsState = {
    values: {},
    message: null,
    errors: {},
    success: false,
  }
  const [state, dispatch] = useActionState(loginAction as any, initialState)

  useEffect(() => {
    if (state?.message && state?.message !== null)
      toast({
        variant: state?.success ? 'default' : 'destructive',
        title: '',
        description: state?.message,
      })
  }, [state])

  return (
    <>
      <form action={dispatch} className="space-y-2 w-full">
        {/* Identifier */}
        <Text
          title="ایمیل یا موبایل"
          name="identifier"
          defaultValue={state?.values?.identifier || ''}
          placeholder=""
          state={state}
          icon={<UserIcon className="w-4 h-4" />}
        />

        {/* Password */}
        <Password
          title="رمز ورود"
          name="password"
          placeholder="******"
          defaultValue={state?.values?.password || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />

        <SubmitButton text="ورود" className="w-full" />
      </form>
    </>
  )
}

export default function LoginForm({
  site_title,
  logo,
}: {
  site_title: any
  logo: any
}) {
  return (
    <Suspense fallback={<div className="flex m-auto">Loading...</div>}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col text-center justify-center">
          <Link href={'/'} target="_self" className=" w-20 m-auto">
            {logo && <ImageAlba zoomable={false} file={logo} />}
          </Link>
          <p className="text-sm text-muted-foreground">
            ورود {site_title && ` به ${site_title}`}
          </p>
        </div>
        <UserAuthFormComponent />
        <div className="text-center text-sm">
          حساب کاربری ندارید؟{' '}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            ثبت نام کنید
          </Link>
        </div>
        <div className="text-center text-sm">
          رمز ورود را فراموش کرده‌اید؟{' '}
          <Link
            href="/resetPass"
            className="underline underline-offset-4 hover:text-primary"
          >
            بازنشانی رمز ورود
          </Link>
        </div>
      </div>
    </Suspense>
  )
}
