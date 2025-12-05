export const dynamic = 'force-static'
// export const dynamic = 'force-dynamic'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/features/page/controller'
import { pickLocale, SUPPORTED_LANGUAGE } from '@/lib/utils'
import { notFound } from 'next/navigation'

export async function generateStaticParams() {
  return pageCtrl.generateStaticParams()
}

interface PageProps {
  params: { lang?: string; slug: string }
  searchParams: Promise<{
    tag?: string
  }>
}

export default async function Page({ params, searchParams }: PageProps) {
  const { lang = 'fa', slug: encodeSlug } = await params
  const slug = decodeURIComponent(encodeSlug)

  // const resolvedSearchParams = {}
  const resolvedSearchParams = await searchParams
  // const { tag } = resolvedSearchParams
  // زبان پیش‌فرض
  const locale = pickLocale(lang)

  const [pageResult] = await Promise.all([
    pageCtrl.find({ filters: { slug: slug } }),
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
        searchParams={resolvedSearchParams}
        pageSlug={slug || ''}
      />
    )
}
