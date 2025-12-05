// ❌ بدون "use client" — این کامپوننت کاملاً Server Component است
import { PostCover } from '@/components/post/cover'
import { PostTitle } from '@/components/post/title'
import { PostExcerpt } from '@/components/post/excerpt'
import PostHorizontalCard from '../card/ArticalHorizontalCard'
import Link from 'next/link'
import getTranslation from '@/lib/utils/getTranslation'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'
import { Block } from '@/components/builder-canvas/types'
import { ScrollArea } from '@/components/ui/scroll-area'

type PostListProps = {
  posts: Post[]
  showMoreHref: string
  blockData: {
    id: string
    type: 'postList'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLDivElement>

export const PostListHeroVertical = ({
  posts,
  showMoreHref,
  blockData,
  ...props
}: PostListProps) => {
  const firstPost = posts[0]
  const t = getTranslation({ translations: firstPost.translations })

  const restPosts = posts.slice(1)

  return (
    <div className="container mx-auto p-4">
      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-[2fr_1fr]
          gap-4
          md:h-[680px]        /* ارتفاع ثابت در دسکتاپ */
        "
      >
        {/* ستون اصلی — همیشه ستون مرجع ارتفاع */}
        <div className="relative overflow-hidden rounded-xl border bg-card">
          <Link href={firstPost.href}>
            <PostCover
              file={firstPost.image}
              postType={firstPost.type}
              primaryVideoEmbedUrl={firstPost.primaryVideoEmbedUrl}
              zoomable={false}
            />
            <PostTitle title={t.title} />
            <PostExcerpt content={t.excerpt} />
          </Link>
        </div>

        {/* ستون لیست — تطابق ارتفاع با چپ + اسکرول اگر بیشتر شد */}
        <div
          className="
            rounded-xl
            border
            bg-card
            overflow-y-auto
          "
        >
          {/* <ScrollArea className="h-500 h-[680px]"> تبدیل به کلاینت کامپوننتش مکیکنه */}
          <div className="divide-y divide-border">
            {restPosts.map((p) => (
              <PostHorizontalCard
                key={p.id}
                post={p}
                options={{
                  showExcerpt:
                    blockData?.settings?.showExcerpt == true ? true : false,
                }}
              />
            ))}
          </div>
          {/* </ScrollArea> */}
        </div>
      </div>
    </div>
  )
}

// 'use client'
// import React, { useEffect, useRef, useState } from 'react'
// import { Post } from '@/features/post/interface'
// import { Option } from '@/types'
// import { getTranslation } from '@/lib/utils'
// import { Block } from '@/components/builder-canvas/types'
// import { ScrollArea } from '@/components/ui/scroll-area'
// import { PostCover } from '@/components/post/cover'
// import { PostTitle } from '@/components/post/title'
// import PostHorizontalCard from '../card/ArticalHorizontalCard'
// import { PostExcerpt } from '@/components/post/excerpt'
// import { useDeviceType } from '@/hooks/use-device-type'
// import Link from 'next/link'

// type PostListProps = {
//   posts: Post[]
//   showMoreHref: string
//   blockData: {
//     id: string
//     type: 'postList'
//     content: {
//       tags: Option[]
//       categories: Option[]
//     }
//     settings: {
//       showArrows: boolean
//       loop: boolean
//       autoplay: boolean
//       autoplayDelay: number
//     }
//   } & Block
// } & React.HTMLAttributes<HTMLDivElement>

// export const PostListHeroVertical = ({
//   posts,
//   showMoreHref,
//   blockData,
//   ...props
// }: PostListProps) => {
//   const mainRef = useRef<HTMLDivElement>(null)
//   const [loadingHeight, setLoadingHeight] = useState<boolean>(true)
//   const [mainHeight, setMainHeight] = useState<number | null>(0)
//   const device = useDeviceType({ initial: 'mobile' })
//   const { settings } = blockData

//   useEffect(() => {
//     if (mainRef.current) {
//       const height = mainRef.current.offsetHeight
//       setMainHeight(height)
//       setLoadingHeight(false)
//     }
//   }, [mainRef])

//   const countOfPosts = posts.length
//   const firstPost = posts[0]
//   const firstPostTranslation = getTranslation({
//     translations: firstPost.translations,
//   })

//   return (
//     <div className="container mx-auto p-4" {...props}>
//       {/* Layout: desktop: 2col | mobile: stacked */}
//       <div className="flex flex-col md:flex-row gap-4">
//         {/* Right column — active item */}
//         <div ref={mainRef} className="md:w-2/3 w-full h-fit overflow-hidden">
//           <Link href={firstPost?.href} className="w-full h-fit">
//             <PostCover
//               file={firstPost.image}
//               postType={firstPost.type}
//               primaryVideoEmbedUrl={firstPost.primaryVideoEmbedUrl}
//               zoomable={false}
//             />
//             <PostTitle title={firstPostTranslation.title} />
//             <PostExcerpt content={firstPostTranslation.excerpt} />
//           </Link>
//         </div>

//         {/* Left column — playlist list */}
//         <div
//           className={`${
//             countOfPosts > 4 ? `h-96` : ``
//           } md:w-1/3 w-full  overflow-hidden`}
//           style={{
//             ...(device !== 'mobile' && {
//               height: mainHeight ? `${mainHeight}px` : 'auto',
//             }),
//           }}
//         >
//           <ScrollArea className="h-full">
//             <div className="divide-y divide-border">
//               {(loadingHeight ? posts.slice(1, 5) : posts.slice(1)).map(
//                 (post) => (
//                   <PostHorizontalCard
//                     key={post.id}
//                     post={post}
//                     options={{
//                       showExcerpt: settings?.showExcerpt == true ? true : false,
//                     }}
//                   />
//                 )
//               )}
//             </div>
//           </ScrollArea>
//         </div>
//       </div>
//     </div>
//   )
// }
