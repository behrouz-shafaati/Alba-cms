// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '@/components/builder-canvas/store/useBuilderStore'
import FileUpload from '@/components/form-fields/file-upload'

type Props = {
  initialData: any
  savePage: () => void
}

export const ContentEditor = ({ initialData, savePage }: Props) => {
  const { selectedBlock, update } = useBuilderStore()
  const defaultValu =
    selectedBlock?.content?.srcMedium !== null ? selectedBlock?.content : null
  return (
    <>
      <FileUpload
        key={`image-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        name="images"
        title="انتخاب تصاویر"
        defaultValues={defaultValu}
        // responseHnadler={(file: any) => {
        //   console.log('# 9784 on change file:', file)
        //   update(selectedBlock?.id as string, 'content', [
        //     ...selectedBlock?.content,
        //     file,
        //   ])
        // }}
        updateFileDetailsHandler={(files) => {
          update(selectedBlock?.id as string, 'content', files)
        }}
        deleteFileHnadler={(fileId) => {
          update(
            selectedBlock?.id as string,
            'content',
            selectedBlock?.content.filter((img) => img.id !== fileId)
          )
          requestAnimationFrame(() => {
            savePage?.()
          })
        }}
        showDeleteButton={true}
      />
    </>
  )
}
