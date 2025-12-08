'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const ReplayCOmmentButton = dynamic(() => import('./replay-Button'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <Skeleton className="w-[70px] h-[32px] rounded-md" />,
})

export default function ReplayCOmmentButtonLazy(props) {
  return <ReplayCOmmentButton {...props} />
}
