import { useBuilderStore } from '../builder-canvas/store/useBuilderStore'
import { useDebouncedCallback } from 'use-debounce'
import Combobox, { Option } from '@/components/form-fields/combobox'
import { Category } from '@/features/category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'

const TemplateTypeSettings = ({
  allCategories,
}: {
  allCategories: Category[]
}) => {
  const { update, getJson } = useBuilderStore()
  const debouncedUpdate = useDebouncedCallback(
    (id, key, form) => update(id, key, form),
    400
  )
  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    return {
      value: `category-${String(category.id)}`,
      label:
        'خانه‌ی دسته‌ی ' + createCatrgoryBreadcrumb(category, category.title),
    }
  })
  const patternTypeOptions = [
    {
      label: 'تمام صفحات',
      value: 'allPages',
    },
    // {
    //   label: 'صفحه نخست',
    //   value: 'firstPage',
    // },
    {
      label: 'خانه‌ی مطالب',
      value: 'blogs',
    },
    {
      label: 'مطلب تکی',
      value: 'blog',
    },
    {
      label: 'خانه‌ی دسته بندی مطالب',
      value: 'categories',
    },
    ...categoryOptions,
  ]
  return (
    <Combobox
      title="برای"
      name="templateFor"
      defaultValue={JSON.parse(getJson()).templateFor || 'allPages'}
      options={patternTypeOptions}
      placeholder="برای"
      onChange={(e) => debouncedUpdate(null, 'templateFor', e.target.value)}
    />
  )
}

export default TemplateTypeSettings
