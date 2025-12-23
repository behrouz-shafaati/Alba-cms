export const dynamic = 'force-static'
// export const dynamicParams = false // صفحه ی جدید با ری ولیدت هم نشان داده نمی شود
export const revalidate = 86400 // 24 hours
// export const dynamic = 'force-dynamic'
import isSearchParams from '@/lib/utils/isSearchParams'
import resolveSearchParams from '@/lib/utils/resolveSearchParams'
import HomePage from '@/pages/Home'
import SinglePage from '@/pages/SinglePage'

interface PageProps {
  params: { lang?: string; slug: string }
}

export default async function Page({ params }: PageProps) {
  let resolvedSearchParams = {}
  const { lang = 'fa', slug: encodeSlug } = await params
  const slug = decodeURIComponent(encodeSlug)
  const flgSearchParam = isSearchParams(slug)

  if (flgSearchParam) {
    resolvedSearchParams = resolveSearchParams(slug)
    return <HomePage searchParams={resolvedSearchParams} />
  }
  return <SinglePage pageSlug={slug} />
}
