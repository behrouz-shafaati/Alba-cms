'use client'
import { useActionState, useCallback, useEffect, useRef, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Braces as PostIcon,
  Mail as MailIcon,
  Target,
  Trash,
  Video as VideoIcon,
} from 'lucide-react'
// import { Separator } from "@/components/ui/separator";
import { Heading } from '@/components/ui/heading'
// import FileUpload from "@/components/FileUpload";
import { useToast } from '../../../hooks/use-toast'
import {
  createPost,
  deletePostsAction,
  updatePost,
} from '@/features/post/actions'
import Text from '../../../components/form-fields/text'
import { AlertModal } from '../../../components/modal/alert-modal'
import FileUpload from '../../../components/form-fields/file-upload'
import Select from '../../../components/form-fields/select'
import Combobox from '@/components/form-fields/combobox'
import {
  Category,
  CategoryTranslationSchema,
} from '@/features/category/interface'
import { Option } from '@/types'
import { createCatrgoryBreadcrumb } from '@/lib/utils'
import { Braces as CategoryIcon } from 'lucide-react'
// import TagInput from '@/components/form-fields/TagInput'
import { searchTags } from '@/features/tag/actions'
import { Tag, TagTranslationSchema } from '@/features/tag/interface'
import MultipleSelec from '@/components/form-fields/multiple-selector'
import Link from 'next/link'
import { createPostHref } from '../utils'
import SubmitButton from '@/components/form-fields/submit-button'
import StickyBox from 'react-sticky-box'
import RelatedPostsDashboard from './dashboard/related-post'
import SeoSnippetForm from './dashboard/seo-snippet-form'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'
import AccessDenied from '@/components/access-denied'
import { getEmbedUrl } from '@/components/tiptap-editor/utils'
import VideoEmbed from '@/components/video-embed/VideoEmbed'
import { searchCategories } from '@/features/category/actions'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'

interface PostFormProps {
  initialData: any | null
  allCategories: Category[]
}

export const PostForm: React.FC<PostFormProps> = ({
  initialData: post,
  allCategories,
}) => {
  const locale = 'fa'
  const { user } = useSession()
  const userRoles = user?.roles || []

  const canCreate = can(userRoles, 'post.create')
  const canEdit = can(
    userRoles,
    post?.author?.id !== user?.id ? 'post.edit.any' : 'post.edit.own'
  )
  const canDelete = can(
    userRoles,
    post?.author?.id !== user?.id ? 'post.delete.any' : 'post.delete.own'
  )
  const canPublish = can(
    userRoles,
    post?.author?.id !== user?.id ? 'post.publish.any' : 'post.publish.own'
  )

  const translation: any =
    post?.translations?.find((t: any) => t.lang === locale) ||
    post?.translations[0] ||
    {}
  const initialState = {
    message: null,
    errors: {},
    values: { ...post, translation },
  }

  const formRef = useRef<HTMLFormElement>(null)

  const actionHandler = post
    ? updatePost.bind(null, String(post.id))
    : createPost
  const [state, dispatch] = useActionState(actionHandler as any, initialState)
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showPrimaryVideoError, setShowPrimaryVideoError] = useState(false)
  const [primaryVideoEmbedUrl, setPrimaryVideoEmbedUrl] = useState(
    state.values?.primaryVideoEmbedUrl || ''
  )
  useEffect(() => {
    if (state.message && state.message !== null) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        description: state.message,
      })
    }
  }, [state])

  if ((post && !canEdit) || !canCreate) return <AccessDenied />

  const title = post ? 'ویرایش  مطلب' : 'افزودن مطلب'
  const description = post ? (
    <Link target="_blank" href={createPostHref(post)}>
      مشاهده مطلب
    </Link>
  ) : (
    'افزودن مطلب'
  )

  const categoryOptions: Option[] = allCategories.map((category: Category) => {
    const translation: any =
      category?.translations?.find((t: any) => t.lang === locale) ||
      category?.translations[0] ||
      {}
    return {
      value: String(category.id),
      label: createCatrgoryBreadcrumb(category, translation?.title),
    }
  })

  const statusOptions = [
    ...(canPublish ? [{ label: 'منتشر شود', value: 'published' }] : []),
    {
      label: 'پیش نویس',
      value: 'draft',
    },
  ]
  const onDelete = async () => {
    try {
      setLoading(true)
      const deleteResult = await deletePostsAction(post?.id)
      if (deleteResult?.success) router.replace('/dashboard/posts')
      else {
        setOpen(false)
        setLoading(false)
        toast({
          variant: deleteResult?.success ? 'default' : 'destructive',
          description: deleteResult?.message,
        })
      }
    } catch (error: any) {}
  }

  const handleChangePrimaryVideo = (url: string) => {
    const embedUrl = getEmbedUrl(url)
    if (!embedUrl) {
      setPrimaryVideoEmbedUrl('')
      setShowPrimaryVideoError(true)
      return
    }
    setPrimaryVideoEmbedUrl(embedUrl)
  }

  const submitManually = useCallback(() => {
    if (formRef.current) {
      formRef.current.requestSubmit() // بهترین راه
    }
  }, [])
  const categoriesArray = Array.isArray(state.values?.categories)
    ? state.values?.categories
    : []
  const tagsArray = Array.isArray(state.values?.tags) ? state.values?.tags : []

  return (
    <>
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {post && canDelete && (
          <>
            <AlertModal
              isOpen={open}
              onClose={() => setOpen(false)}
              onConfirm={onDelete}
              loading={loading}
            />
            <Button
              disabled={loading}
              variant="destructive"
              size="sm"
              onClick={() => setOpen(true)}
            >
              <Trash className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      {/* <Separator /> */}
      <form action={dispatch} ref={formRef} className="space-y-8 w-full">
        {/* Product Media image */}
        <div className=" md:grid md:grid-cols-12 gap-8">
          <input
            type="text"
            name="lang"
            className="hidden"
            value="fa"
            readOnly
          />

          <div className="col-span-12 md:col-span-9">
            {/* Title */}
            <Text
              title="عنوان"
              name="title"
              defaultValue={state?.values?.translation?.title || ''}
              placeholder="عنوان"
              state={state}
              icon={<PostIcon className="w-4 h-4" />}
            />
            {/* contentJson */}
            <TiptapEditorLazy
              attachedFilesTo={[{ feature: 'post', id: post?.id || null }]}
              name="contentJson"
              defaultContent={
                post ? JSON.parse(state?.values?.translation?.contentJson) : {}
              }
              onChangeFiles={submitManually}
              className="h-full"
              onLoading={setLoading}
            />
            <SeoSnippetForm
              defaultValues={state?.values || {}}
              className="mt-6"
            />
            {/* Meta Description */}
            <div className="space-y-1 mt-6">
              <Label htmlFor="metaDescription">اسکیما JSON</Label>
              <Textarea
                id="jsonLd"
                name="jsonLd"
                defaultValue={state?.values?.jsonLd || ''}
                rows={10}
                placeholder={`{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "عنوان مطلب",
  "author": {
    "@type": "Person",
    "name": "Behrouz Shafaati"
  }
}`}
              />
            </div>
          </div>
          <div className="relative col-span-12 md:col-span-3 gap-2">
            <StickyBox offsetBottom={0}>
              <SubmitButton
                loading={loading}
                text="ذخیره مطلب"
                className="my-4 w-full"
              />
              {/* status */}
              <Select
                title="وضعیت"
                name="status"
                defaultValue={state?.values?.status || 'draft'}
                options={statusOptions}
                placeholder="وضعیت"
                state={state}
                icon={<MailIcon className="w-4 h-4" />}
              />
              {/* category */}
              <Combobox
                title="دسته اصلی"
                name="mainCategory"
                defaultValue={state.values?.mainCategory?.id || null}
                options={categoryOptions}
                placeholder="دسته اصلی"
                state={state}
                icon={<CategoryIcon className="w-4 h-4" />}
                fetchOptions={searchCategories}
              />
              {/* categories */}
              <MultipleSelec
                title="سایر دسته‌ها"
                name="categories"
                defaultValues={
                  categoriesArray.map((category: Category) => {
                    const translation: CategoryTranslationSchema =
                      category?.translations?.find(
                        (t: CategoryTranslationSchema) => t.lang === locale
                      ) ||
                      category?.translations[0] ||
                      {}
                    return { label: translation?.title, value: category.id }
                  }) || []
                }
                placeholder="دسته‌ها را وارد کنید..."
                state={state}
                defaultSuggestions={categoryOptions}
                onSearch={searchCategories}
                // icon={ShieldQuestionIcon}
                // maxSelected={1}
              />
              {/* tags */}
              <MultipleSelec
                title="برچسب ها"
                name="tags"
                defaultValues={
                  tagsArray.map((tag: Tag) => {
                    const translation: TagTranslationSchema =
                      tag?.translations?.find(
                        (t: CategoryTranslationSchema) => t.lang === locale
                      ) ||
                      tag?.translations[0] ||
                      {}
                    return { label: translation?.title, value: tag.id }
                  }) || []
                }
                placeholder="برچسب ها را وارد کنید..."
                state={state}
                onSearch={searchTags}

                // icon={ShieldQuestionIcon}
              />
              {/* <TagInput
                name="tags"
                title="برچسب ها"
                placeholder="برچسب ها را وارد کنید..."
                defaultValues={
                  tagsArray.map((tag: Tag) => {
                    const translation: TagTranslationSchema =
                      tag?.translations?.find(
                        (t: CategoryTranslationSchema) => t.lang === locale
                      ) ||
                      tag?.translations[0] ||
                      {}
                    return { label: translation?.title, value: tag.id }
                  }) || []
                }
                fetchOptions={searchTags}
              /> */}
              <FileUpload
                name="image"
                title="پوستر مطلب"
                maxFiles={1}
                defaultValues={state.values?.image || null}
                onChange={submitManually}
                onLoading={setLoading}
                allowedFileTypes={['image']}
              />
              <Text
                name="primaryVideo"
                title="فیلم اصلی مطلب"
                description="لینک صفحه ی آپارات یا یوتیوب"
                defaultValue={state.values?.primaryVideo || ''}
                icon={<VideoIcon className="w-4 h-4" />}
                className="mt-8"
                onChange={(e) => {
                  handleChangePrimaryVideo(e.target.value)
                }}
              />
              <input
                name="primaryVideoEmbedUrl"
                type="hidden"
                value={primaryVideoEmbedUrl}
              />
              {primaryVideoEmbedUrl && primaryVideoEmbedUrl != '' && (
                <VideoEmbed
                  src={primaryVideoEmbedUrl}
                  title={state?.values?.translation?.title || ''}
                />
              )}
              <RelatedPostsDashboard post={post} className="my-4" />
              <div className="h-2"></div>
            </StickyBox>
          </div>
          <div className="col-span-12 md:col-span-9"></div>
          <div className="col-span-12 md:col-span-3"></div>
        </div>
      </form>
    </>
  )
}
