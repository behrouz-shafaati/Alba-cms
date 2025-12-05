import { BreadCrumb, BreadCrumbType } from '@/components/breadcrumb'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { PostComment, PostCommentTranslationSchema } from '../../interface'
import { formatToJalali, getReadingTime } from '@/features/post/utils'
import { getTranslation, timeAgo } from '@/lib/utils'
import { ImageAlba } from '@/components/image-alba'

type props = {
  locale?: string
  breadcrumbItems: BreadCrumbType[]
  postComment: PostComment
}

const SinglePageBlog = ({
  breadcrumbItems,
  postComment,
  locale = 'fa',
}: props) => {
  const translation: PostCommentTranslationSchema = getTranslation({
    translations: postComment?.translations,
  })
  const jalaliDate = formatToJalali(postComment.createdAt)
  let imageCoverTranslation = {}
  // تبدیل contentJson به متن ساده
  const json = JSON.parse(translation?.contentJson)
  console.log('#3387 postComment content: ', postComment)
  const plainText =
    json.content
      ?.filter((block: any) => block.type === 'paragraph')
      ?.map((block: any) =>
        block.content?.map((c: any) => c.text || '').join('')
      )
      .join('\n') || ''

  const readingDuration = getReadingTime(plainText)
  if (postComment?.image)
    imageCoverTranslation = getTranslation({
      translations: postComment?.image?.translations,
    })
  return (
    <div className=" max-w-4xl m-auto text-justify">
      <div className="flex-1 space-y-4 p-5">
        <BreadCrumb items={breadcrumbItems} />
      </div>

      {postComment?.image && (
        <ImageAlba file={postComment?.image} showCaption={false} />
      )}
      <h2>{translation?.title}</h2>
      <div className="text-sm text-gray-500 mb-4">
        {postComment?.user && (
          <>
            <span>نویسنده: {postComment?.user.name}</span>
            <span className="mx-2">|</span>
          </>
        )}
        <span>{timeAgo(postComment.createdAt)}</span>
        <span className="mx-2">|</span>
        <span>زمان مطالعه: {readingDuration}</span>
      </div>
      <RenderedHtml contentJson={translation?.contentJson} />
    </div>
  )
}

export default SinglePageBlog
