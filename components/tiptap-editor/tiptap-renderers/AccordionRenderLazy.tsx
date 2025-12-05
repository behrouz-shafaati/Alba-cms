'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const Accordion = dynamic(() => import('./AccordionRenderer'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <div>در حال بارگذاری...</div>,
})

export default function AccordionRenderLazy(props) {
  return <Accordion {...props} />
}
