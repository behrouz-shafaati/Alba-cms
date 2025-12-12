'use client'
import { useActionState, useEffect, useRef, useState } from 'react'
import { Server, Plug, Mail, Key } from 'lucide-react'
import { State } from '@/types'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import { Settings } from '@/features/settings/interface'
import { useToast } from '@/hooks/use-toast'
// import { startEmigrationAction, testConnectionAction } from '../actions'
import Text from '@/components/form-fields/text'
import { Button } from '@/components/custom/button'
import {
  startUserMigration,
  testWPConnectionAction,
} from '../actions/user-migration-actions'
import { decodeUnicodeMessage } from '@/lib/utils/decode-unicode'
import {
  startConvertHtymlToJson,
  startTaxonomyMigration,
} from '../actions/taxonomy-migration-actions'
import { startPostMigration } from '../posts/post-migration-actions'

interface SettingsFormProps {
  settings: Settings
}

export const FormWPEmigration: React.FC<SettingsFormProps> = ({ settings }) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canModerate = can(userRoles, 'settings.moderate.any')
  const formRef = useRef<HTMLFormElement>(null)
  const initialState: State = {
    message: null,
    errors: {},
    testConnectionSuccess: null,
  }
  const [state, setState] = useState<State>(initialState)

  // const [state, dispatch] = useActionState(
  //   testConnectionAction as any,
  //   initialState
  // )

  const handleTestConnection = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    // اگر داده‌ای نیاز دارید اضافه کنید
    // formData.append('key', 'value')

    const result = await testWPConnectionAction(state, formData)
    setState(result)
    console.log('handleTestConnection result :', result)
    setLoading(false)
  }
  const handleStartEmigration = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    // اگر داده‌ای نیاز دارید اضافه کنید
    // formData.append('key', 'value')

    const result = await startUserMigration(state, formData, { batchSize: 50 })
    setState((s) => ({ ...s, ...result }))
    console.log('handleStartEmigration result :', result)
    setLoading(false)
  }
  const handleStartTaxonomyEmigration = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    // اگر داده‌ای نیاز دارید اضافه کنید
    // formData.append('key', 'value')

    const result = await startTaxonomyMigration(state, formData, {
      batchSize: 50,
    })
    setState((s) => ({ ...s, ...result }))
    console.log('handleStartEmigration result :', result)
    setLoading(false)
  }
  const handleStartPostEmigration = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()
    const formData = new FormData(formRef.current!)
    formData.append('newBaseUrl', window.location.origin.replace(/\/+$/, ''))

    const result = await startPostMigration(state, formData, {
      batchSize: 50,
    })
    setState((s) => ({ ...s, ...result }))
    console.log('handleStartEmigration result :', result)
    setLoading(false)
  }
  const handleTestHtmlToTipTap = async (e: React.FormEvent) => {
    setLoading(true)
    e.preventDefault()

    const formData = new FormData(formRef.current!)
    formData.append('newBaseUrl', window.location.origin)

    const result = await startConvertHtymlToJson(formData)
    setState((s) => ({ ...s, ...result }))

    console.log('ConvertHtymlToJson result:', result)
    console.log(
      'ConvertHtymlToJson result jsonContent:',
      JSON.parse(result?.data?.jsonContent)
    )

    setLoading(false)
  }

  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const title = 'تنظیمات'
  const description = ''
  const toastMessage = settings ? ' مطلب بروزرسانی شد' : 'دسته بندی اضافه شد'
  useEffect(() => {
    if (state.message && state.message !== null)
      toast({
        variant: state?.testConnectionSuccess ? 'default' : 'destructive',
        description: decodeUnicodeMessage(state?.message || ''),
      })
    console.log('#state 5678 :', state)
  }, [state])
  if (!canModerate) return <AccessDenied />
  return (
    <>
      <div className=" p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between">
          {/* <Heading title={title} description={description} /> */}
        </div>
        {/* <Separator /> */}
        <form ref={formRef} className="space-y-8 w-full">
          <h3 className="text-2xlg">مهاجرت از ورد پرس</h3>
          <p>
            توجه: برای مهاجرت موفق از ورد پرس باید پایگاه داده ی شما کاملا خالی
            باشد. به عبارت دیگر بعد از بالا آمدن سایت اولین کاری که انجام مید
            هید انجام مهاجرت باشد.
          </p>
          <div className="md:grid md:grid-cols-3 gap-8">
            {/* baseUrl */}
            <Text
              title="baseUrl"
              name="baseUrl"
              defaultValue={state?.values?.baseUrl || ''}
              placeholder=""
              state={state}
              icon={<Server className="w-4 h-4" />}
              description=""
            />
            {/* apiKey */}
            <Text
              title="apiKey"
              name="apiKey"
              defaultValue={state?.values?.apiKey || ''}
              placeholder=""
              state={state}
              icon={<Key className="w-4 h-4" />}
              description=""
            />
          </div>
          <div className="flex flex-row gap-2">
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleTestConnection}
            >
              تست اتصال
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleStartEmigration}
            >
              شروع مهاجرت
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleStartTaxonomyEmigration}
            >
              شروع مهاجرت تاکسونومی
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleStartPostEmigration}
            >
              شروع مهاجرت مطالب
            </Button>
            <Button
              loading={loading}
              type="button"
              role="button"
              onClick={handleTestHtmlToTipTap}
            >
              تست تبدیل HTML به TipTap
            </Button>
          </div>

          <TestConnectionReport data={state?.data} />
        </form>
      </div>
    </>
  )
}

const TestConnectionReport = ({ data }: any) => {
  const { connected, message } = data || {}
  if (connected == null) return null
  if (!connected) {
    return (
      <div className="mt-4 p-4 bg-red-100 text-red-800 rounded">
        {decodeUnicodeMessage(message)}
      </div>
    )
  }
  return (
    <div className="mt-4 p-4 bg-green-100 text-green-800 rounded">
      {decodeUnicodeMessage(message)}
    </div>
  )
}
