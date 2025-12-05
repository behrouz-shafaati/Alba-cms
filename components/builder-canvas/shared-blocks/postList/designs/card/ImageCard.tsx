import { Skeleton } from '@/components/ui/skeleton'
import { Post, PostTranslationSchema } from '@/features/post/interface'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { timeAgo } from '@/lib/utils'
import { CalendarPlus, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'

import Link from 'next/link'

type Props = {
  post: Post
  options: {
    showExcerpt: boolean
  }
}

const PostImageCard = ({ post, options }: Props) => {
  const locale = 'fa'
  const translationPost: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}

  const translationImage: FileTranslationSchema =
    post.image?.translations?.find(
      (t: FileTranslationSchema) => t.lang === locale
    ) ||
    post.image?.translations[0] ||
    {}

  const imgHeight = 208
  const imgWidth = Math.round(
    (imgHeight * post?.image?.width) / post?.image?.height
  )

  return (
    <div
      key={post.id}
      className="flex-shrink-0 basis-[85vw] sm:basis-[45vw] md:basis-[23vw] xl:basis-[16vw] snap-start"
    >
      <Link href={post.href}>
        <div className="rounded overflow-hidden shadow-lg bg-white dark:bg-gray-900">
          <div className="relative w-full h-52">
            {/* <Image
              src={
                post?.image?.srcMedium ||
                '/assets/image-placeholder-Medium.webp'
              }
              alt={translationImage?.alt || translationImage?.title || 'image'}
              width={imgWidth}
              height={imgHeight}
              sizes="(max-width: 640px) 100vw,
         (max-width: 768px) 50vw,
         33vw"
              style={{ objectFit: 'cover' }}
              placeholder="blur"
              blurDataURL={
                post?.image?.srcSmall || '/assets/image-placeholder-Small.webp'
              }
              loading="lazy"
              decoding="async"
              quality={80}
            /> */}
            <Image
              src={
                post?.image?.srcMedium ||
                '/assets/image-placeholder-Medium.webp'
              }
              sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
              alt={translationImage?.alt || translationImage?.title}
              layout="fill"
              objectFit="cover"
              placeholder="blur"
              blurDataURL={post?.image?.blurDataURL || ''}
            />
          </div>
          <div className="p-4">
            <h3 className="text-sm font-semibold mb-2 leading-5 min-h-[2.5rem] line-clamp-2">
              {translationPost?.title}
            </h3>
            {options?.showExcerpt != false && (
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {translationPost?.excerpt}
              </p>
            )}
            <div className="flex mt-3 text-xs text-gray-400 gap-4">
              {post?.commentsCount && (
                <div className="flex flex-row gap-1 items-center">
                  <MessageCircleMore width={16} /> {post?.commentsCount}
                </div>
              )}
              <div className="flex flex-row gap-1 items-center">
                <CalendarPlus width={16} /> حدود {timeAgo(post?.createdAt)}
              </div>
            </div>
            {/* <div className="mt-3 text-xs text-gray-400">
              توسط {post.author?.name}
            </div> */}
          </div>
        </div>
      </Link>
    </div>
  )
}

export default PostImageCard
