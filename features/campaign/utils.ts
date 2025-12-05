import { Option } from '@/types'
import { Category, CategoryTranslationSchema } from '../category/interface'
import { createCatrgoryBreadcrumb } from '@/lib/utils'

export function getGoalCampaignOptions({
  allCategories,
  locale = 'fa',
}: {
  allCategories: Category[]
  locale?: string
}): Option[] {
  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    const translation: CategoryTranslationSchema =
      category?.translations?.find(
        (t: CategoryTranslationSchema) => t.lang === locale
      ) ||
      category?.translations[0] ||
      {}
    return {
      value: `category-${String(category.id)}`,
      label: 'دسته‌ی ' + createCatrgoryBreadcrumb(category, translation?.title),
    }
  })
  const patternTypeOptions = [
    {
      label: 'تمام صفحات',
      value: 'allPages',
    },
    ...categoryOptions,
  ]
  return patternTypeOptions
}
