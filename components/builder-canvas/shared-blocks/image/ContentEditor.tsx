// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import FileUpload from '@/components/form-fields/file-upload'
import Switch from '@/components/form-fields/switch'

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
        name="image"
        title="پوستر مطلب"
        maxFiles={1}
        defaultValues={defaultValu}
        updateFileDetailsHandler={(files) => {
          // console.log('#88237 updaTED DATA: ', files)
          update(selectedBlock?.id as string, 'content', files[0])
        }}
        deleteFileHnadler={(fileId) => {
          update(selectedBlock?.id as string, 'content', {
            title: '',
            alt: '',
            description: '',
            src: null,
            href: null,
            target: '_blank',
          })
          requestAnimationFrame(() => {
            savePage?.()
          })
        }}
        showDeleteButton={true}
        allowedFileTypes={['image']}
      />

      <Switch
        name="zoomable"
        title="قابلیت بزرگنمایی تصویر"
        defaultChecked={selectedBlock?.settings?.zoomable ?? false}
        onChange={(values) => {
          update(selectedBlock?.id as string, 'settings', {
            ...selectedBlock?.settings,
            zoomable: values,
          })
        }}
      />
      {/* <code>{JSON.stringify(selectedBlock?.content)}</code> */}
    </>
  )
}
