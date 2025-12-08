import { getPosts } from '@/features/post/actions'
import PostHorizontalCard from '@/components/builder-canvas/shared-blocks/postList/designs/card/ArticalHorizontalCard'
import { getTranslation } from '@/lib/utils'
import PostListColumn from '@/components/builder-canvas/shared-blocks/postList/designs/list/PostListColumn'
import TaxonomyDescription from './Description'
import { Taxonomy } from '../../interface'

type Prop = {
  taxonomy: Taxonomy
  slug: string
  page: number
}
export default async function TaxonomyPostList({ taxonomy, slug, page }: Prop) {
  const perPage = 10

  if (!taxonomy) return <>دسته ی مورد نظر یافت نشد!</>
  const [postsResult] = await Promise.all([
    getPosts({
      filters: { taxonomies: [taxonomy.id] },
      pagination: { page, perPage },
    }),
  ])

  const translation = getTranslation({ translations: taxonomy.translations })

  if (postsResult.data.length == 0)
    return (
      <div className="flex p-10 items-center justify-center">
        مطلبی در این دسته بندی ثبت نشده است!
      </div>
    )
  const posts = postsResult.data
  const postItems = posts.map((post) => {
    return (
      <PostHorizontalCard
        key={post.id}
        post={post}
        options={{ showExcerpt: true }}
      />
    )
  })
  const showMoreHref = `/archive/taxonomies/${taxonomy.slug}?page=1&perPage=10`
  return (
    <>
      <PostListColumn
        posts={posts}
        postItems={postItems}
        blockData={{
          settings: { showNewest: false },
          content: { title: `دسته‌ی ${translation.title}` },
        }}
        showMoreHref={showMoreHref}
      />
      <TaxonomyDescription contentJson={translation?.description} />
    </>
  )
}
