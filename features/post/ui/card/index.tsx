import { Post, PostTranslationSchema } from '../../interface'
import VerticalCard from './VerticalCard'
import HorizontalCard from './HorizontalCard'
import { createPostHref } from '../../utils'

type Props = {
  locale?: string
  post: Post
  variant?: 'Horizon' | 'Vertical'
}

const PostCard = ({ post, variant = 'Vertical', locale = 'fa' }: Props) => {
  const translation: PostTranslationSchema =
    post?.translations?.find((t: PostTranslationSchema) => t.lang === locale) ||
    post?.translations[0] ||
    {}
  const cardProps = {
    imageUrl: post?.image?.srcMedium,
    title: translation?.title,
    excerpt: translation?.excerpt,
    slug: post.slug,
    href: createPostHref(post),
  }
  return variant === 'Horizon' ? (
    <HorizontalCard {...cardProps} />
  ) : (
    <VerticalCard {...cardProps} />
  )
}

export default PostCard
