import { createCatrgoryBreadcrumb } from '@/lib/utils'
import { Category, CategoryTranslationSchema } from '../category/interface'
import { Option } from '@/types'

export function getTemplateForOptions({
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
    // {
    //   label: 'صفحه نخست',
    //   value: 'firstPage',
    // },
    {
      label: 'خانه‌ی مطالب',
      value: 'blog',
    },
    {
      label: 'مطلب تکی',
      value: 'post',
    },
    {
      label: 'آرشیو مطالب',
      value: 'archive',
    },
    {
      label: 'نویسنده مطالب',
      value: 'author',
    },
    {
      label: 'خانه‌ی دسته بندی مطالب',
      value: 'categories',
    },
    ...categoryOptions,
  ]
  return patternTypeOptions
}
