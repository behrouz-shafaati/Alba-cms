import highlightText from '@/components/highlight-text'
import { Separator } from '@/components/ui/separator'
import { Post, PostTranslationSchema } from '@/features/post/interface'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { timeAgo } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'

type Props = {
  post: Post
  options: {
    showExcerpt: boolean
  }
  query?: string
}

const PostHorizontalSmallCard = ({ post, options, query = '' }: Props) => {
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
  return (
    <Link key={post.id} href={post.href} className="group">
      <div className="grid grid-cols-[72px_1fr] items-center md:items-start py-2 gap-2">
        {/* تصویر */}
        <div className="relative w-full h-full  aspect-square md:aspect-[4/3] overflow-hidden rounded-sm">
          {post?.image?.srcSmall && (
            <Image
              src={post?.image?.srcMedium || '/image-placeholder-Medium.webp'}
              alt={translationImage?.alt || translationImage?.title}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 112px, (max-width: 768px) 200px, 300px"
              placeholder="blur"
              blurDataURL={
                post?.image?.srcSmall || '/image-placeholder-Small.webp'
              }
            />
          )}
        </div>

        {/* عنوان */}
        <div className="ps-1 flex items-center md:items-start">
          <h3 className="text-xs font-semibold mb-1 leading-5 min-h-[1.5rem] line-clamp-2 transition-all group-hover:text-primary">
            {highlightText(translationPost.title, query)}
          </h3>
        </div>

        {/* اطلاعات پایین (تاریخ و دیدگاه) */}
        {/* <div className="flex text-xs h-full text-gray-400 gap-4 md:col-start-1 md:self-end px-2">
          {post?.commentsCount && (
            <>
              <div className="flex items-center gap-1">
                {/* <MessageCircleMore width={14} /> {post.commentsCount} * /}
                {post?.commentsCount} دیدگاه
              </div>
              <Separator orientation="vertical" />
            </>
          )}
          <div className="flex items-center gap-1">
            {/* <CalendarPlus width={14} /> حدود {timeAgo(post?.createdAt)} * / }
            حدود {timeAgo(post?.createdAt)}
          </div>
        </div> */}
      </div>
    </Link>
  )
}

export default PostHorizontalSmallCard
