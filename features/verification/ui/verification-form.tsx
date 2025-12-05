'use client'
import { Suspense, useActionState, useEffect, useState } from 'react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import SubmitButton from '@/components/form-fields/submit-button'
import { ActionsState } from '@/types'
import { User } from '@/features/user/interface'
import OTP from '@/components/form-fields/otp'
import { EditEmailButton } from './editEmailButton'
import { Settings } from '@/features/settings/interface'
import {
  updateVerificationEmail,
  updateVerificationMobile,
  verifyCodeAction,
} from '../actions'
import { VerificationPurpose } from '../interface'
import { EditMobileButton } from './editMobileButton'

type Props = {
  settings: Settings
  user: User
  purpose: VerificationPurpose
}

function VerificationFormComponent({ settings, user, purpose }: Props) {
  const initialState: ActionsState = {
    values: {},
    message: null,
    errors: {},
    success: false,
  }

  const [state, dispatch] = useActionState(
    verifyCodeAction as any,
    initialState
  )
  const [email, setEmail] = useState(user?.email || '')
  const [mobile, setMobile] = useState(user?.mobile || '')
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

  const approveChangeEmail = async (email: string) => {
    const r = await updateVerificationEmail({
      userId: user.id,
      email,
      purpose,
    })
    setCustomState(r)
    if (r?.success) {
      setEmail(email)
    }
  }
  const approveChangeMobile = async (mobile: string) => {
    const r = await updateVerificationMobile({
      userId: user.id,
      mobile,
      purpose,
    })
    setCustomState(r)
    if (r?.success) {
      setMobile(mobile)
    }
  }

  const emailDescription = (
    <div className="flex items-center ">
      <p className=" text-sm m-0">کد تایید ایمیل به آدرس {email} ارسال شد.</p>
      <EditEmailButton
        approveChangeEmail={approveChangeEmail}
        state={customState}
      />
    </div>
  )
  const mobileDescription = (
    <div className="flex items-center ">
      <p className="text-sm m-0">
        کد تایید موبایل به شماره {user?.mobile} ارسال شد.
      </p>
      <EditMobileButton
        approveChangeMobile={approveChangeMobile}
        state={customState}
      />
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
          name="email"
          type="text"
          value={email}
          readOnly
          className="hidden"
        />
        <input
          name="mobile"
          type="text"
          value={mobile}
          readOnly
          className="hidden"
        />
        {settings?.emailVerificationRequired && !user.emailVerified && (
          <OTP
            title="کد تایید ایمیل"
            name="emailVerification"
            state={state}
            length={6}
            description={emailDescription}
          />
        )}

        {settings?.mobileVerificationRequired && !user.mobileVerified && (
          <OTP
            title="کد تایید موبایل"
            name="mobileVerification"
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

export default function VerificationForm({ settings, user, purpose }: Props) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            تایید اطلاعات
          </h1>
          <p className="text-sm text-muted-foreground">
            تایید کنید مالک شما هستید{' '}
          </p>
        </div>
        <VerificationFormComponent
          settings={settings}
          user={user}
          purpose={purpose}
        />
        <div className="text-center text-sm">
          حساب کاربری ندارید؟{' '}
          <Link
            href="/signup"
            className="underline underline-offset-4 hover:text-primary"
          >
            ثبت نام کنید
          </Link>
        </div>
      </div>
    </Suspense>
  )
}
