'use client'
import dynamic from 'next/dynamic'
import { BannerGroupFallback } from './BannerGroupFallback'

// کاملاً خارج از باندل اولیه
const AdSlotBlock = dynamic(() => import('./AdSlotBlock'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => (
    <BannerGroupFallback blockData={{ settings: { aspect: '4/1' } }} />
  ),
})

export default function AdSlotBlockLazy_4_1(props) {
  return <AdSlotBlock {...props} />
}
