import RendererRows from '@/components/builder-canvas/pageRenderer/RenderRows'
import PostList from '@/features/post/ui/list'
import DefaultPageBlog from '@/features/post/ui/page'
import { getSettings } from '@/features/settings/controller'
import templateCtrl from '@/features/template/controller'

interface PageProps {
  searchParams: Promise<{
    query?: string
    page?: string
  }>
}

export default async function Page({ searchParams }: PageProps) {
  const resolvedSearchParams = await searchParams
  const { query = '', page = '1' } = resolvedSearchParams

  const [siteSettings, template] = await Promise.all([
    getSettings(),
    templateCtrl.getTemplate({ slug: 'blog' }),
  ])
  if (template) {
    return (
      <>
        <RendererRows
          siteSettings={siteSettings}
          rows={template.content.rows}
          editroMode={false}
          content_all={<PostList page={Number(page)} query={query} />}
        />
      </>
    )
  }
  return <DefaultPageBlog query={query} page={page} />
}
