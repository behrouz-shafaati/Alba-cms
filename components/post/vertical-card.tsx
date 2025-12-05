import { Post, PostTranslationSchema } from '@/features/post/interface'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { timeAgo } from '@/lib/utils'
import { CalendarPlus, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type VerticalcardProps = {
  post: Post
  className?: string
  options: {
    showExcerpt: boolean
  }
}
export default function VerticalPostCard({
  className = '',
  post,
  options = { showExcerpt: true },
}: VerticalcardProps) {
  const locale = 'fa'
  const translationPost: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations?.[0] ||
    {}

  const translationImage: FileTranslationSchema =
    post.image?.translations?.find(
      (t: FileTranslationSchema) => t.lang === locale
    ) ||
    post.image?.translations?.[0] ||
    {}
  return (
    <div className="embla__slide flex-shrink-0 w-full grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/4 px-2">
      <Link href={post.href}>
        <div
          className={`rounded overflow-hidden bg-white dark:bg-gray-900 ${className}`}
        >
          <div className="relative w-full" style={{ aspectRatio: 1.5 }}>
            <Image
              src={post?.image?.srcMedium || '/image-placeholder-Medium.webp'}
              sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
              alt={translationImage?.alt || translationImage?.title}
              layout="fill"
              objectFit="cover"
              placeholder="blur" //  فعال کردن حالت بلور
              blurDataURL={
                post?.image?.blurDataURL || '/image-placeholder-Small.webp'
              } //  مسیر عکس خیلی کم‌کیفیت (LQIP یا base64)
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
