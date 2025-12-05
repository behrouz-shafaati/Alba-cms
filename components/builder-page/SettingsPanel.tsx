import { HeadingIcon, MailIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { useDebouncedCallback } from 'use-debounce'
import { Category } from '@/features/category/interface'
import Select from '@/components/form-fields/select'
import PageTypeSettings from './PageTypeSettings'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { PageContent } from './types'

type SettingsPanelProp = {
  allTemplates: PageContent[]
  allCategories: Category[]
}

function SettingsPanel({ allCategories, allTemplates }: SettingsPanelProp) {
  const { update, getJson } = useBuilderStore()
  const document = JSON.parse(getJson())
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )

  const statusOptions = [
    {
      label: 'انتشار',
      value: 'published',
    },
    {
      label: 'پیش نویس',
      value: 'draft',
    },
  ]

  const pageTypeOptions = [
    {
      label: 'برگه',
      value: 'page',
    },
    {
      label: 'قالب',
      value: 'template',
    },
  ]
  return (
    <>
      <input type="text" name="lang" className="hidden" value="fa" readOnly />
      <Text
        title="عنوان"
        name="title"
        defaultValue={JSON.parse(getJson()).title || ''}
        placeholder="عنوان"
        icon={<HeadingIcon className="h-4 w-4" />}
        className=""
        onChange={(e) => debouncedUpdate(null, 'title', e.target.value)}
      />

      <PageTypeSettings allTemplates={allTemplates} />

      <Select
        title="وضعیت"
        name="status"
        defaultValue={JSON.parse(getJson()).status || ''}
        options={statusOptions}
        placeholder="وضعیت"
        icon={<MailIcon className="w-4 h-4" />}
        onChange={(value) => debouncedUpdate(null, 'status', value)}
      />
    </>
  )
}

export default SettingsPanel
