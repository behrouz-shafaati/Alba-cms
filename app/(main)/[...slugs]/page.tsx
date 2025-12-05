// // پس من اصلا از اول باید بجای export const dynamic = 'force-static' export const dynamic = 'auto' میزاشتم. اصلا دنبال همین بودم. چون من تو کدم یهو گفتم تمام صفحات revalidate بشن اما چون از export const dynamic = 'force-static' در همون لحظه میخاسته همه رو بسازه و کش کنه که سیستم میترکیده. اما همینو اگکه بکنم export const dynamic = 'auto' و اعلام کنم همه revalidate شدن دیگه در همون لحظه همه رو نمیسازه و کش نمیکنه.

// // export const dynamic = 'auto'
export const dynamic = 'force-static'
// export const dynamic = 'force-dynamic'

import React, { cache } from 'react'
import postCtrl from '@/features/post/controller'
import { notFound } from 'next/navigation'
import templateCtrl from '@/features/template/controller'
import { Post, PostTranslationSchema } from '@/features/post/interface'
import {
  createPostHref,
  generateFAQSchema,
  generatePostSchema,
  getReadingTime,
  buildBreadcrumbsArray,
} from '@/features/post/utils'

import type { Metadata } from 'next'
import RenderedHtml from '@/components/tiptap-editor/render/RenderedHtml.server'
import { generateTableOfContents } from '@/components/tiptap-editor/utils'
import { QueryResponse } from '@/lib/entity/core/interface'
import { PostComment } from '@/features/post-comment/interface'
import { getPostCommentsForClient } from '@/features/post-comment/actions'
import { getSettings } from '@/features/settings/controller'
import DefaultSinglePageBlog from '@/features/post/ui/page/single'
import RendererTemplate from '@/components/builder-canvas/templateRender/RenderTemplate.server'
import PostCommentListLazy from '@/features/post-comment/ui/list/PostCommentListLazy'
import TableOfContentsLazy from '@/components/post/table-of-contents-lazy'
import getTranslation from '@/lib/utils/getTranslation'

interface PageProps {
  params: Promise<{ slugs: string[] }>
  searchParams: Promise<{
    tag?: string
  }>
}

export async function generateStaticParams() {
  return postCtrl.generateStaticParams()
}

// ✅ Cache کردن کوئری پست - فقط یک بار اجرا میشه
const getPostBySlug = cache(async (slug: string) => {
  const result = await postCtrl.find({
    filters: { slug: decodeURIComponent(slug) },
  })
  return result?.data[0] || null
})

// ✅ Cache کردن template
const getCachedTemplate = cache(async () => {
  return templateCtrl.getTemplate({ slug: 'post' })
})

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const slug = slugs[slugs.length - 1]
  let findResult = null
  // ✅ استفاده از cached function
  const [post, siteTitle] = await Promise.all([
    getPostBySlug(slug),
    getSettings('site_title') as Promise<string>,
  ])
  ;[findResult] = await Promise.all([
    postCtrl.find({ filters: { slug: decodeURIComponent(slug) } }),
  ])
  if (!post || post == undefined) {
    return {
      title: 'صفحه یافت نشد',
      description: 'محتوای درخواستی موجود نیست',
    }
  }
  const href = createPostHref(post?.mainCategory)
  const translation: PostTranslationSchema = getTranslation({
    translations: post?.translations,
  })

  return {
    title: translation?.seoTitle || translation.title,
    description: translation?.metaDescription || translation?.excerpt,
    alternates: {
      canonical: href,
    },
    openGraph: {
      locale: 'fa_IR', // 👈 زبان/منطقه
      type: 'article',
      title: translation?.seoTitle || translation.title,
      description: translation?.metaDescription || translation?.excerpt,
      url: href,
      siteName: siteTitle,
      images: [
        {
          url: post?.image?.srcMedium,
          width: 600,
          height: 315,
          alt: translation?.seoTitle || translation.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: translation?.seoTitle || translation.title,
      description: translation?.metaDescription || translation?.excerpt,
      images: [post?.image?.srcMedium],
    },
  }
}

export default async function Page({ params, searchParams }: PageProps) {
  const locale = 'fa'
  const resolvedParams = await params
  const { slugs } = resolvedParams
  const slug = slugs[slugs.length - 1]

  // const resolvedSearchParams = {}
  const resolvedSearchParams = await searchParams
  // const { tag } = resolvedSearchParams

  const [post, template, siteSettings] = await Promise.all([
    getPostBySlug(slug), // از cache میاد اگه قبلاً در metadata گرفته شده
    getCachedTemplate(),
    getSettings(),
  ])

  if (!post) {
    notFound()
  }

  const postCommentsResult: QueryResponse<PostComment> =
    await getPostCommentsForClient({
      filters: { post: post.id },
    })

  // const href = createPostHref(post.mainCategory)
  const translation: PostTranslationSchema = getTranslation({
    translations: post?.translations,
  })

  // تبدیل contentJson به متن ساده
  const json = JSON.parse(translation?.contentJson)
  const plainText =
    json.content
      ?.filter((block: any) => block.type === 'paragraph')
      ?.map((block: any) =>
        block.content?.map((c: any) => c.text || '').join('')
      )
      .join('\n') || ''

  const readingDuration = getReadingTime(plainText)

  const metadata = {
    author: post?.user,
    createdAt: post.createdAt,
    readingDuration,
  }

  // ساخت TOC سمت سرور
  const toc = generateTableOfContents(JSON.parse(translation?.contentJson))
  const breadcrumbItems = buildBreadcrumbsArray(post)

  const postSchema = generatePostSchema({ post, locale: 'fa' })
  const faqSchema = generateFAQSchema(translation.contentJson)

  const writeJsonLd = () => (
    <>
      {postSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(postSchema) }}
        />
      )}

      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      {translation?.jsonLd && translation?.jsonLd == '' && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: translation?.jsonLd }}
        />
      )}
    </>
  )

  if (post.status !== 'published')
    return (
      <div className="h-screen w-full flex justify-center items-center align-middle">
        مطلب هنوز منتشر نشده است!
      </div>
    )
  if (template)
    return (
      <>
        {writeJsonLd()}
        <>
          <RendererTemplate
            template={template}
            siteSettings={siteSettings}
            pageSlug={slug}
            categorySlug={post?.mainCategory?.slug || null}
            searchParams={resolvedSearchParams}
            editroMode={false}
            content_all={
              <DefaultSinglePageBlog
                siteSettings={siteSettings}
                post={post}
                breadcrumbItems={breadcrumbItems}
                readingDuration={readingDuration}
                tableOfContent={<TableOfContentsLazy toc={toc} />}
                comments={
                  <PostCommentListLazy
                    post={post}
                    postCommentsResult={postCommentsResult}
                  />
                }
              />
            }
            content_post_title={translation?.title}
            content_post_cover={{
              image: post?.image ?? null,
              postType: post?.type ?? 'article',
              primaryVideoEmbedUrl: post?.primaryVideoEmbedUrl ?? null,
            }}
            content_post_share={{
              url: `${siteSettings?.site_url ?? ''}${post?.href}`,
              title: translation?.title ?? '',
            }}
            content_post_tags={{
              tags: post?.tags ?? [],
            }}
            content_post_author_card={{
              author: post?.author ?? null,
            }}
            content_post_metadata={metadata}
            content_post_breadcrumb={breadcrumbItems}
            content_post_content={
              <RenderedHtml contentJson={translation?.contentJson} />
            }
            content_post_tablecontent={<TableOfContentsLazy toc={toc} />}
            content_post_comments={
              <PostCommentListLazy
                post={post}
                postCommentsResult={postCommentsResult}
              />
            }
            content_post_comment_form={{ post }}
          />
        </>
      </>
    )

  return (
    <>
      {writeJsonLd()}
      <>
        <DefaultSinglePageBlog
          searchParams={resolvedSearchParams}
          post={post}
          siteSettings={siteSettings}
          breadcrumbItems={breadcrumbItems}
          readingDuration={readingDuration}
          tableOfContent={<TableOfContentsLazy toc={toc} />}
          comments={
            <PostCommentListLazy
              post={post}
              postCommentsResult={postCommentsResult}
            />
          }
        />
      </>
    </>
  )
}
