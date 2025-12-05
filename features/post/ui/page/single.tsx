import { BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { Post, PostTranslationSchema } from '../../interface'
import { getTranslation } from '@/lib/utils'
import { PostCover } from '@/components/post/cover'
import { PostBreadcrumb } from '@/components/post/breadcrumb'
import { PostComments } from '@/components/post/comments'
import { PostCommentForm } from '@/components/post/comment-form'
import { PostContent } from '@/components/post/content'
import { PostMetaData } from '@/components/post/meta-data'
import { PostTitle } from '@/components/post/title'
import ShareButtons from '@/components/share/share-buttons'
import { Settings } from '@/features/settings/interface'
import { PostTags } from '@/components/post/tags'
import { PostAuthorCard } from '@/components/post/author-card'
import { CommentsHeader } from '@/components/post/comments-header'

type props = {
  locale?: string
  siteSettings: Settings
  breadcrumbItems: BreadCrumbType[]
  post: Post
  readingDuration: number
  tableOfContent?: any
  comments?: any
  searchParams?: any
}

const SinglePageBlog = ({
  breadcrumbItems,
  post,
  siteSettings,
  locale = 'fa',
  readingDuration,
  tableOfContent = null,
  comments = null,
  searchParams = {},
}: props) => {
  const translation: PostTranslationSchema = getTranslation({
    translations: post?.translations,
  })

  return (
    <div className=" max-w-4xl m-auto text-justify p-2">
      <PostBreadcrumb content={breadcrumbItems} />

      {post?.image && (
        <PostCover
          file={post?.image}
          postType={post?.type ?? null}
          primaryVideoEmbedUrl={post?.primaryVideoEmbedUrl ?? null}
        />
      )}
      <div className="flex flex-col md:flex-row items-center justify-center md:justify-between overflow-hidden">
        <PostMetaData
          author={post?.user}
          createdAt={post.createdAt}
          readingDuration={readingDuration}
        />
        <ShareButtons
          url={`${siteSettings.site_url}${post.href}`}
          title={translation?.title}
        />
      </div>
      <PostTitle title={translation?.title} />

      {tableOfContent}
      <PostContent
        content={<RenderedHtml contentJson={translation?.contentJson} />}
      />
      <PostTags tags={post.tags} />
      <PostAuthorCard author={post.author} />
      <div>
        <CommentsHeader />
        {comments && <PostComments content={comments} />}
        <PostCommentForm post={post} />
      </div>
    </div>
  )
}

export default SinglePageBlog
