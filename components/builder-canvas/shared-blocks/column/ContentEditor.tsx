// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'

const ContentEditor = () => {
  const { updateRowColumns, update, selectedBlock } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )

  return (
    <></>
    // <Select
    //   key={`block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
    //   title="چینش ستون"
    //   name="rowColumns"
    //   defaultValue={selectedBlock.settings.rowColumns}
    //   options={columnOptions}
    //   placeholder="چینش ستون"
    //   onChange={(value) => {
    //     updateRowColumns(selectedBlock.id as string, value)
    //     debouncedUpdate(selectedBlock.id as string, 'settings', {
    //       rowColumns: value,
    //     })
    //   }}
    // />
  )
}

export default ContentEditor
