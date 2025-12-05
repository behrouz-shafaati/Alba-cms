'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const TiptapEditor = dynamic(() => import('./index'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <div className="py-2">
      <Skeleton className="w-6 h-12 rounded-full" />
    </div>
  ),
})

export default function TiptapEditorLazy(props) {
  return <TiptapEditor {...props} />
}
