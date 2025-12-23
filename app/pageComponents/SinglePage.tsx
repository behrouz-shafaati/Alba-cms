import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/features/page/controller'
import { pickLocale, SUPPORTED_LANGUAGE } from '@/lib/utils'
import { notFound } from 'next/navigation'

interface PageProps {
  pageSlug: string
  searchParams?: Record<string, string>
  lang?: string
}

export default async function SinglePage({
  pageSlug,
  searchParams = {},
  lang = 'fa',
}: PageProps) {
  // زبان پیش‌فرض
  const locale = pickLocale(lang)

  const [pageResult] = await Promise.all([
    pageCtrl.find({ filters: { slug: pageSlug } }),
  ])

  if (pageResult?.data.length == 0) {
    notFound()
  }

  // this is a page
  if (pageResult?.data[0])
    return (
      <PageRenderer
        page={pageResult?.data[0]}
        locale={locale}
        searchParams={searchParams}
        pageSlug={pageSlug || ''}
      />
    )
}
