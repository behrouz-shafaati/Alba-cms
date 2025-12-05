// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'

type Props = {
  initialData: any
}

export const ContentEditor = ({ initialData }: Props) => {
  const { selectedBlock, update } = useBuilderStore()
  return (
    <textarea
      key={`text-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
      defaultValue={selectedBlock?.content.text}
      name="content"
      className="w-full ltr"
      read-only="true"
      onChange={(e) =>
        update(selectedBlock?.id as string, 'content', {
          text: e.target.value,
        })
      }
    />
  )
}
