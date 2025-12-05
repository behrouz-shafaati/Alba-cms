import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Combobox, { Option } from '@/components/form-fields/combobox'
import {
  Category,
  CategoryTranslationSchema,
} from '@/features/category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import { getTemplateForOptions } from '@/features/template/utils'

const TemplateTypeSettings = ({
  allCategories,
}: {
  allCategories: Category[]
}) => {
  const locale = 'fa'
  const { update, getJson } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )
  const patternTypeOptions = getTemplateForOptions({ allCategories })

  if (JSON.parse(getJson())?.templateFor)
    return (
      <Combobox
        title="برای بخش"
        name="templateFor"
        defaultValue={JSON.parse(getJson())?.templateFor[0] || 'allPages'}
        options={patternTypeOptions}
        placeholder="برای"
        // onChange={(e) => debouncedUpdate(null, 'templateFor', e.target.value)}
        disabled={true}
      />
    )

  return <></>
}

export default TemplateTypeSettings
