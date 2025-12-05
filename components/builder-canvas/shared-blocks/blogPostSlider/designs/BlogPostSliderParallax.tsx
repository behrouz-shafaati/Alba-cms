'use client'
// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../../types'
import Image from 'next/image'
import Link from 'next/link'
import Autoplay from 'embla-carousel-autoplay'
import { Post, PostTranslationSchema } from '@/features/post/interface'
import { Option } from '@/types'
import { FileTranslationSchema } from '@/lib/entity/file/interface'
import { EmblaCarouselParallax } from '@/components/embla-carousel/parallax'
import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'

type BlogPostSliderProps = {
  options?: EmblaOptionsType
  pluginsConfig?: Object
  posts: Post[]
  blockData: {
    id: string
    type: 'blogPostSlider'
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
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

const BlogPostSliderParallax = ({
  options,
  pluginsConfig,
  posts,
  blockData,
  ...props
}: BlogPostSliderProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
  const plugins: EmblaPluginType[] = [Autoplay(pluginsConfig)]
  const postSlids = posts.map((post) => {
    const translationPost: PostTranslationSchema =
      post?.translations?.find(
        (t: PostTranslationSchema) => t.lang === locale
      ) ||
      post?.translations[0] ||
      {}

    const translationImage: FileTranslationSchema =
      post.image?.translations?.find(
        (t: FileTranslationSchema) => t.lang === locale
      ) ||
      post.image?.translations[0] ||
      {}

    return (
      <div
        key={post.id}
        className="embla__slide flex-shrink-0 w-full grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 py-4"
      >
        <div className="embla__parallax rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-900 ">
          <div className="embla__parallax__layer  flex-[0_0_100%] aspect-[3/2] sm:aspect-[16/11] lg:aspect-[21/14]">
            <Link href={post.href} className="">
              <Image
                className="embla__slide__img embla__parallax__img "
                src={post?.image?.srcMedium || '/image-placeholder-Medium.webp'}
                sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
                alt={translationImage?.alt || translationImage?.title}
                layout="fill"
                objectFit="cover"
                placeholder="blur" //  فعال کردن حالت بلور
                blurDataURL={post?.image?.blurDataURL || ''} //  مسیر عکس خیلی کم‌کیفیت (LQIP یا base64)
              />

              {/* overlay گرادینت تاریک از پایین */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent pointer-events-none " />

              {/* متن روی تصویر */}
              <div className="absolute bottom-0 w-full text-center p-4 text-gray-100 font-semibold z-10">
                {translationPost?.title}
              </div>
            </Link>
          </div>
        </div>
      </div>
    )
  })
  return (
    <EmblaCarouselParallax
      slides={postSlids}
      options={options}
      plugins={plugins}
      showArrows={settings?.showArrows}
      {...props}
    />
  )
}

export default BlogPostSliderParallax
