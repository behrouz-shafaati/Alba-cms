'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const AdSlotBlock = dynamic(() => import('./AdSlotBlock'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <div>در حال بارگذاری...</div>,
})

export default function AdSlotBlockLazy(props) {
  return <AdSlotBlock {...props} />
}
