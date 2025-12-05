import { Post } from '../../interface'
import Pagination from '@/components/ui/pagination'
import PostHorizontalCard from '@/components/builder-canvas/shared-blocks/postList/designs/card/ArticalHorizontalCard'
import Search from '@/components/ui/search'
import { getSettings } from '@/features/settings/controller'

type Props = {
  query: string
  postResult: {
    data: Post[]
    totalPages: number
  }
}

export default async function SearchPage({ query = '', postResult }: Props) {
  const siteSettings = await getSettings()
  const postItems = postResult.data.map((post) => {
    return (
      <PostHorizontalCard
        key={post.id}
        post={post}
        options={{ showExcerpt: true }}
        query={query}
      />
    )
  })

  return (
    <div className="flex flex-col">
      {/* <BreadCrumb items={pageBreadCrumb} /> */}
      <div
        className="sticky top-[var(--header-top)] flex flex-col items-center gap-4 p-4 bg-background z-30
  [--header-top:var(--header-top-mobile)] sm:[--header-top:var(--header-top-tablet)] md:[--header-top:var(--header-top-desktop)]"
        style={{
          ['--header-top-mobile' as any]: `${siteSettings?.mobileHeaderHeight}px`,
          ['--header-top-tablet' as any]: `${siteSettings?.tabletHeaderHeight}px`,
          ['--header-top-desktop' as any]: `${siteSettings?.desktopHeaderHeight}px`,
        }}
      >
        <Search placeholder="جستجو کنید ..." className="w-full md:w-1/2" />
      </div>
      <div className="p-2 col-span-4 md:col-span-3 ">
        <div className=" flex flex-col m-auto justify-center w-full md:w-2/6">
          {postItems}
        </div>
        <div className="p-4 flex justify-center items-center">
          <Pagination totalPages={postResult.totalPages} />
        </div>
      </div>
    </div>
  )
}
