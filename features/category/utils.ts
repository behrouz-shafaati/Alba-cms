import { Category } from './interface'

export function buildCategoryHref(category: Category, href: string = '') {
  if (!category) {
    const clean = href.replace(/\/$/, '') // حذف اسلش انتهایی
    return `/category/${clean}`
  }
  return buildCategoryHref(
    category?.parent,
    (href = `${category.slug}/${href}`)
  )
}
