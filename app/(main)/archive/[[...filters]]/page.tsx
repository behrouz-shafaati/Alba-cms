// /app/archive/[[...filters]]/page.tsx
export const dynamic = 'force-dynamic'
import ArchivePost from '@/components/archive'
import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import { getSettings } from '@/features/settings/controller'
import templateCtrl from '@/features/template/controller'
import { extractFiltersFromParams } from '@/lib/utils'

type Prop = {
  params: { filters?: string[] }
  searchParams: Promise<{
    query?: string
    page?: string
    perPage?: string
  }>
}

export default async function ArchivePage({ params, searchParams }: Prop) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1', perPage = '10' } = resolvedSearchParams
  const filters: Record<string, string[]> = extractFiltersFromParams(
    params.filters
  )
  const [siteSettings, template] = await Promise.all([
    getSettings(),
    templateCtrl.getTemplate({ slug: 'archive' }),
  ])
  if (template) {
    return (
      <>
        <RendererRows
          siteSettings={siteSettings}
          rows={template.content.rows}
          editroMode={false}
          content_all={
            <ArchivePost
              categorySlugs={filters.categories}
              tagSlugs={filters.tags}
              page={parseInt(page)}
              perPage={parseInt(perPage)}
            />
          }
        />
      </>
    )
  }
  return (
    <ArchivePost
      categorySlugs={filters.categories}
      tagSlugs={filters.tags}
      page={parseInt(page)}
      perPage={parseInt(perPage)}
    />
  )
}
