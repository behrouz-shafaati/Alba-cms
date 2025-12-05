// ورودی اصلی صفحه‌ساز (ترکیب درگ‌اند‌دراپ و بلاک رندر)
'use client'
import dynamic from 'next/dynamic'
import { Content } from './types'

const Builder = dynamic(() => import('./components/Builder'), {
  ssr: false, // مهم: جلوگیری از رندر سمت سرور
})

type BuilderCanvasProp = {
  title: string
  name: string
  submitFormHandler: any
  initialContent?: Content
  settingsPanel: React.ReactNode
  newBlocks?: any
}

export default function BuilderCanvas({
  title,
  initialContent,
  name,
  submitFormHandler,
  settingsPanel,
  newBlocks = [],
}: BuilderCanvasProp) {
  return (
    <Builder
      name={name}
      submitFormHandler={submitFormHandler}
      initialContent={initialContent}
      settingsPanel={settingsPanel}
      newBlocks={newBlocks}
    />
  )
}
