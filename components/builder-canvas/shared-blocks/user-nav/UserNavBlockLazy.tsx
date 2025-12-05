'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const UserNavBlock = dynamic(() => import('./UserNavBlock'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="mx-1">
      <Skeleton className="h-6 w-6 rounded-full" />
    </div>
  ),
})

export default function UserNavBlockLazy(props) {
  return <UserNavBlock {...props} />
}
