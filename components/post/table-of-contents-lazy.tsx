'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const TableOfContents = dynamic(() => import('./table-of-contents'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="mx-1">
      <Skeleton className="h-[60px] my-4 w-full rounded-md" />
    </div>
  ),
})

export default function TableOfContentsLazy(props) {
  return <TableOfContents {...props} />
}
