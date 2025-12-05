'use client'
// کامپوننت نمایشی بلاک
import React, { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import { Post } from '@/features/post/interface'
import LeftSliderButton from '@/components/ui/left-slider-button'
import RightSliderButton from '@/components/ui/right-slider-button'
import { Option } from '@/types'
import { Badge } from '@/components/ui/badge'
import { CalendarPlus, ChevronLeft } from 'lucide-react'
import { buildUrlFromFilters, timeAgo } from '@/lib/utils'
import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'
import { Block } from '@/components/builder-canvas/types'
import VerticalPostCard from '@/components/post/vertical-card'
import Autoplay from 'embla-carousel-autoplay'

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

const BlogPostSliderSimple = ({
  options,
  pluginsConfig,
  posts,
  blockData,
  ...props
}: BlogPostSliderProps) => {
  const locale = 'fa'
  const { content, settings } = blockData

  const plugins: EmblaPluginType[] = [Autoplay(pluginsConfig)]
  const [emblaRef, emblaApi] = useEmblaCarousel(options, plugins)

  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    emblaApi.on('select', onSelect)
    onSelect()
  }, [emblaApi, onSelect])
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  const { onClick, ...restProps } = props
  const postSlids = posts.map((post, index) => {
    return (
      <VerticalPostCard
        key={index}
        post={post}
        options={settings}
        className={'shadow'}
      />
    )
  })
  const filters = {
    tags: content?.tags?.map((tag) => tag.slug) || [],
    categories: content?.categories?.map((category) => category.slug) || [],
  }
  const archiveUrl = buildUrlFromFilters(filters)
  return (
    <div
      className="embla relative w-full min-h-10  overflow-hidden  py-6"
      {...(onClick ? { onClick } : {})}
    >
      <div className="flex flex-row justify-between pb-2 ">
        <div className="border-r-4 border-primary">
          <span className="block px-4">{content.title}</span>
        </div>
        {settings?.showMoreLink != false && (
          <Link
            href={`archive/${archiveUrl}?page=1&perPage=${posts.length || 6}`}
            className="text-xs text-gray-600 font-normal flex flex-row items-center gap-2"
          >
            <span>مشاهده همه</span>
            <ChevronLeft size={20} />
          </Link>
        )}
      </div>
      {content?.tags?.length > 0 && (
        <div className="p-4 flex flex-row gap-2">
          {content?.tags?.map((tag: Option) => {
            return (
              <Link key={tag.slug} href={`archive/tags/${tag.slug}`}>
                <Badge
                  variant="outline"
                  className="p-2 text-xs text-gray-600 font-normal"
                >
                  {tag.label}
                </Badge>
              </Link>
            )
          })}
        </div>
      )}
      <div className={`embla__viewport mt-2`} ref={emblaRef}>
        <div className="embla__container  flex">{postSlids}</div>
      </div>
      {/* دکمه‌ها */}
      {settings?.showArrows && (
        <>
          <LeftSliderButton scrollPrev={scrollPrev} />
          <RightSliderButton scrollNext={scrollNext} />
        </>
      )}
    </div>
  )
}

export default BlogPostSliderSimple
