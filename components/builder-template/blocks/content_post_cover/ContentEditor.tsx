// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'

type Props = {
  initialData: any
}

export const ContentEditor = ({ initialData }: Props) => {
  const { selectedBlock, update } = useBuilderStore()
  return <></>
}
