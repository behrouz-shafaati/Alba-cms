import { Post, PostTranslationSchema } from '@/features/post/interface'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { timeAgo } from '@/lib/utils'
import { CalendarPlus, MessageCircleMore } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  post: Post
  direction?: 'row' | 'column'
  options?: {
    showExcerpt?: boolean
    showCreatedAt?: boolean
    titleClasses?: string
    aspectRatio?: string
  }
}

const PostOverlayCard = ({ post, direction = 'row', options }: Props) => {
  const locale = 'fa'
  const {
    showExcerpt = true,
    showCreatedAt = true,
    titleClasses = '',
    aspectRatio = '3 / 2',
  } = options || {}
  const translationPost: PostTranslationSchema =
    post?.translations?.find((t) => t.lang === locale) ||
    post?.translations?.[0] ||
    ({} as PostTranslationSchema)

  const translationImage: FileTranslationSchema =
    post?.image?.translations?.find((t) => t.lang === locale) ||
    post?.image?.translations?.[0] ||
    ({} as FileTranslationSchema)

  return (
    <Link
      href={post.href}
      key={post.id}
      className={`group relative block overflow-hidden rounded-lg shadow-md transition-all duration-500 ${
        direction === 'row'
          ? 'basis-[85vw] sm:basis-[45vw] md:basis-[30vw] xl:basis-[23vw] h-56 flex-shrink-0 snap-start'
          : ''
      }`}
      style={direction === 'column' ? { aspectRatio: aspectRatio } : undefined}
    >
      {/* تصویر پس‌زمینه */}
      <Image
        src={post?.image?.srcMedium || '/image-placeholder-Medium.webp'}
        alt={translationImage?.alt || translationImage?.title || ''}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-110"
        sizes="(max-width: 640px) 640px, (max-width: 1024px) 1024px, 1280px"
      />

      {/* ماسک تیره */}
      <div className="absolute inset-0 bg-black/60 transition-all duration-500 group-hover:bg-black/40" />

      {/* محتوای کارت */}
      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center p-4 text-white transition-all duration-500">
        <h3
          className={`text-2xl font-semibold leading-6 mb-2 line-clamp-2 group-hover:text-white/90 ${titleClasses} py-2`}
        >
          {translationPost?.title}
        </h3>

        {showExcerpt && translationPost?.excerpt && (
          <p className="text-xs text-gray-200/90 line-clamp-2 mb-4 max-w-md group-hover:text-gray-100">
            {translationPost?.excerpt}
          </p>
        )}

        <div className="flex items-center gap-4 text-[11px] text-gray-300 group-hover:text-gray-200">
          {post?.commentsCount > 0 && (
            <div className="flex items-center gap-1">
              <MessageCircleMore width={14} /> {post.commentsCount}
            </div>
          )}
          {showCreatedAt && post?.createdAt && (
            <div className="flex items-center gap-1">
              <CalendarPlus width={14} /> حدود {timeAgo(post.createdAt)}
            </div>
          )}
        </div>
      </div>
    </Link>
  )
}

export default PostOverlayCard
