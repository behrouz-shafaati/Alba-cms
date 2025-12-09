import { Taxonomy, TaxonomyType } from './interface'

export function buildTaxonomyHref(taxonomy: Taxonomy, href: string = '') {
  if (!taxonomy) {
    const clean = href.replace(/\/$/, '') // حذف اسلش انتهایی
    return `/${clean}`
  }
  return buildTaxonomyHref(
    taxonomy?.parent,
    (href = `${taxonomy.slug}/${href}`)
  )
}
