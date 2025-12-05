'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const SubmitButton = dynamic(() => import('./submit-button'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="mx-1">
      <Skeleton className="h-12 w-full rounded-md" />
    </div>
  ),
})

export default function SubmitButtonLazy(props) {
  return <SubmitButton {...props} />
}
