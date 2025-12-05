import { HeadingIcon } from 'lucide-react'
import Text from '@/components/form-fields/text'
import { PageContent } from './types'
import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Combobox, { Option } from '@/components/form-fields/combobox'

const PageTypeSettings = ({
  allTemplates,
}: {
  allTemplates: PageContent[]
}) => {
  const { update, getJson } = useBuilderStore()
  const parsedJson = JSON.parse(getJson())
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )
  const templatesOptions: Option[] = [
    {
      value: '__none__',
      label: 'بدون قالب',
    },

    ...allTemplates.map((t: PageContent) => ({
      value: String(t.id),
      label: String(t.title),
    })),
  ]
  return (
    <>
      <Text
        title="نامک"
        name="slug"
        defaultValue={parsedJson.slug || ''}
        placeholder="نامک"
        icon={<HeadingIcon className="h-4 w-4" />}
        className=""
        onChange={(e) => debouncedUpdate(null, 'slug', e.target.value)}
      />
      <Combobox
        title="قالب"
        name="template"
        defaultValue={parsedJson.template || '__none__'}
        options={templatesOptions}
        placeholder="قالب"
        onChange={(e) => debouncedUpdate(null, 'template', e.target.value)}
      />
    </>
  )
}

export default PageTypeSettings
