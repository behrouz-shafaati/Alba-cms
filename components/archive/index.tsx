import { getPosts } from '@/features/post/actions'
import { getAllCategories } from '@/features/category/actions'
import { DesktopFilters } from './DesktopFilters'
import { getAllTags } from '@/features/tag/actions'
import { Option } from '@/types'
import { getTranslation } from '@/lib/utils'
import PostHorizontalCard from '../builder-canvas/shared-blocks/postList/designs/card/ArticalHorizontalCard'
import { MobileFilters } from './MobileFilters'
import Pagination from '../ui/pagination'
import { getSettings } from '@/features/settings/controller'

export default async function ArchivePost({
  page = 1,
  perPage = 6,
  categoryIds = [],
  tagIds = [],
  categorySlugs = [],
  tagSlugs = [],
}: {
  categoryIds?: string[]
  tagIds?: string[]
  categorySlugs?: string[]
  tagSlugs?: string[]
  page?: number
  perPage?: number
}) {
  let defaultSelectedCategories: Option[] = []
  let defaultSelectedTags: Option[] = []
  if (categorySlugs.length || tagSlugs.length) {
    const [defaultCategoriesResult, defaultTagsResult] = await Promise.all([
      getAllCategories({ slug: { $in: categorySlugs } }),
      getAllTags({ slug: { $in: tagSlugs } }),
    ])
    categoryIds = defaultCategoriesResult.data.map((cat: any) => cat.id)
    tagIds = defaultTagsResult.data.map((tag: any) => tag.id)

    defaultSelectedCategories = defaultCategoriesResult.data.map(
      (cat: any) => ({
        label: getTranslation({ translations: cat.translations })?.title,
        value: String(cat.slug),
      })
    )
    defaultSelectedTags = defaultTagsResult.data.map((tag: any) => ({
      label: getTranslation({ translations: tag.translations })?.title,
      value: String(tag.slug),
    }))
  }
  const [siteSettings, result, allCategories, allTags] = await Promise.all([
    getSettings(),
    getPosts({
      filters: { categories: categoryIds, tags: tagIds },
      pagination: { page, perPage },
    }),
    getAllCategories(),
    getAllTags(),
  ])
  const posts = result.data
  const postItems = posts.map((post) => {
    return (
      <PostHorizontalCard
        key={post.id}
        post={post}
        options={{ showExcerpt: true }}
      />
    )
  })

  return (
    <div className="grid grid-cols-4 gap-4 relative">
      <div
        className={`block  px-4 py-2  md:hidden col-span-4 bg-slate-50 dark:bg-slate-950 z-10 sticky`}
        style={{ top: `${siteSettings?.mobileHeaderHeight}px` }}
      >
        <MobileFilters
          allCategories={allCategories}
          allTags={allTags}
          defaultSelectedCategories={defaultSelectedCategories}
          defaultSelectedTags={defaultSelectedTags}
        />
      </div>
      <div className="hidden md:block">
        <DesktopFilters
          siteSettings={siteSettings}
          allCategories={allCategories}
          allTags={allTags}
          defaultSelectedCategories={defaultSelectedCategories}
          defaultSelectedTags={defaultSelectedTags}
        />
      </div>
      <div className="p-2 col-span-4 md:col-span-3 ">
        <div>{postItems}</div>
        <div className="p-4 flex justify-center items-center">
          <Pagination totalPages={result.totalPages} />
        </div>
      </div>
    </div>
  )
}
