// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import Select from '@/components/form-fields/select'
import { useDebouncedCallback } from 'use-debounce'
import Checkbox from '@/components/form-fields/checkbox'

const columnOptions = [
  {
    label: '12',
    value: '12',
  },

  {
    label: '6-6',
    value: '6-6',
  },

  {
    label: '4-8',
    value: '4-8',
  },
  {
    label: '3-9',
    value: '3-9',
  },
  {
    label: '9-3',
    value: '9-3',
  },
  {
    label: '8-4',
    value: '8-4',
  },

  {
    label: '2-2-8',
    value: '2-2-8',
  },
  {
    label: '8-2-2',
    value: '8-2-2',
  },
  {
    label: '4-4-4',
    value: '4-4-4',
  },
  {
    label: '3-6-3',
    value: '3-6-3',
  },
  {
    label: '2-8-2',
    value: '2-8-2',
  },
  {
    label: '1-10-1',
    value: '1-10-1',
  },
  {
    label: '3-3-3-3',
    value: '3-3-3-3',
  },
]
const ContentEditor = () => {
  const { updateRowColumns, update, selectedBlock } = useBuilderStore()

  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )
  console.log(
    '#345 selectedBlock?.settings?.responsiveDesign:',
    selectedBlock?.settings?.responsiveDesign
  )
  return (
    <>
      <Select
        key={`block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
        title="چینش ستون"
        name="rowColumns"
        defaultValue={selectedBlock.settings.rowColumns}
        options={columnOptions}
        placeholder="چینش ستون"
        onChange={(value) => {
          updateRowColumns(selectedBlock.id as string, value)
          debouncedUpdate(selectedBlock.id as string, 'settings', {
            ...selectedBlock?.settings,
            rowColumns: value,
          })
        }}
      />

      {/* responsive design  */}

      <Checkbox
        name="responsiveDesign"
        title="طراحی ریسپانسیو"
        defaultChecked={selectedBlock?.settings?.responsiveDesign ?? true}
        onChange={(value: boolean) => {
          debouncedUpdate(selectedBlock?.id as string, 'settings', {
            ...selectedBlock?.settings,
            responsiveDesign: value,
          })
        }}
      />
      {/* sticky  */}

      <Checkbox
        name="sticky"
        title="چسبان"
        defaultChecked={selectedBlock?.settings?.sticky ?? false}
        onChange={(value: boolean) => {
          debouncedUpdate(selectedBlock?.id as string, 'settings', {
            ...selectedBlock?.settings,
            sticky: value,
          })
        }}
      />
    </>
  )
}

export default ContentEditor
