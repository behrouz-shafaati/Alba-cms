'use client'
import { Suspense, useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import SubmitButton from '@/components/form-fields/submit-button'
import { ActionsState } from '@/types'
import { User } from '@/features/user/interface'
import OTP from '@/components/form-fields/otp'
import { Settings } from '@/features/settings/interface'
import { VerificationPurpose } from '@/features/verification/interface'
import { detectIdentifierType } from '@/lib/utils'
import Password from '@/components/form-fields/password'
import { KeyRound } from 'lucide-react'
import { resetPassVerifyCodeAction } from '../actions'

type Props = {
  settings: Settings
  user: User
  purpose: VerificationPurpose
  identifier: string
}

function VerificationFormComponent({
  settings,
  user,
  purpose,
  identifier,
}: Props) {
  const identifierType = detectIdentifierType(identifier)
  const initialState: ActionsState = {
    values: {},
    message: null,
    errors: {},
    success: false,
  }

  const [state, dispatch] = useActionState(
    resetPassVerifyCodeAction as any,
    initialState
  )
  const [customState, setCustomState] = useState({})
  useEffect(() => {
    if (state?.message && state?.message !== null)
      toast({
        variant: state?.success ? 'default' : 'destructive',
        title: '',
        description: state?.message,
      })
  }, [state])
  useEffect(() => {
    if (customState?.message && customState?.message !== null)
      toast({
        variant: customState?.success ? 'default' : 'destructive',
        title: '',
        description: customState?.message,
      })
  }, [customState])

  const emailDescription = (
    <div className="flex items-center ">
      <p className=" text-sm m-0">
        کد تایید ایمیل به آدرس {identifier} ارسال شد.
      </p>
      {/* <EditEmailButton
        approveChangeEmail={approveChangeEmail}
        state={customState}
      /> */}
    </div>
  )
  const mobileDescription = (
    <div className="flex items-center ">
      <p className="text-sm m-0">
        کد تایید موبایل به شماره {identifier} ارسال شد.
      </p>
      {/* <EditMobileButton
        approveChangeMobile={approveChangeMobile}
        state={customState}
      /> */}
    </div>
  )
  return (
    <>
      <form action={dispatch} className="space-y-2 w-full">
        <input
          name="userId"
          type="text"
          value={user?.id}
          readOnly
          className="hidden"
        />
        <input
          name="purpose"
          type="text"
          value={purpose}
          readOnly
          className="hidden"
        />
        <input
          name="identifier"
          type="text"
          value={identifier}
          readOnly
          className="hidden"
        />

        {/* Password */}
        <Password
          title="رمز ورود جدید"
          name="password"
          placeholder="******"
          defaultValue={state.values?.password || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />
        {/* Confirm Password Field */}
        <Password
          title="تایید رمز ورود جدید"
          name="confirmPassword"
          placeholder="******"
          defaultValue={state.values?.confirmPassword || ''}
          description={''}
          state={state}
          icon={<KeyRound className="w-4 h-4" />}
        />

        {identifierType == 'email' && (
          <OTP
            title="کد تایید ایمیل"
            name="verification"
            state={state}
            length={6}
            description={emailDescription}
          />
        )}

        {identifierType == 'mobile' && (
          <OTP
            title="کد تایید موبایل"
            name="verification"
            placeholder="******"
            description={mobileDescription}
            state={state}
            length={6}
          />
        )}

        <SubmitButton text="ارسال" className="w-full" />
      </form>
    </>
  )
}

export default function ResetPassVerificationForm({
  settings,
  user,
  purpose,
  identifier,
}: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            بازنشانی رمز ورود
          </h1>
          <p className="text-sm text-muted-foreground"> </p>
        </div>
        <VerificationFormComponent
          settings={settings}
          user={user}
          purpose={purpose}
          identifier={identifier}
        />
        <div className="text-center text-sm">
          رمز ورود را دارید؟{' '}
          <Link
            href="/login"
            className="underline underline-offset-4 hover:text-primary"
          >
            وارد شوید
          </Link>
        </div>
      </div>
    </Suspense>
  )
}
