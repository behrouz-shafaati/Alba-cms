'use client'
import { Suspense, useActionState, useEffect } from 'react'
import Link from 'next/link'
import { toast } from '@/hooks/use-toast'
import Text from '@/components/form-fields/text'
import { UserIcon } from 'lucide-react'
import SubmitButton from '@/components/form-fields/submit-button'
import { ActionsState } from '@/types'
import { SendVerifyCodeResetPassAction } from '../actions'

function UserAuthFormComponent() {
  const initialState: ActionsState = {
    values: {},
    message: null,
    errors: {},
    success: false,
  }
  const [state, dispatch] = useActionState(
    SendVerifyCodeResetPassAction as any,
    initialState
  )

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

        <SubmitButton text="ادامه" className="w-full" />
      </form>
    </>
  )
}

export default function ResetPassForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            بازنشانی رمز ورود
          </h1>
          <p className="text-sm text-muted-foreground">
            برای بازنشانی رمز ورود فرم زیر را پر کنید
          </p>
        </div>
        <UserAuthFormComponent />
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
