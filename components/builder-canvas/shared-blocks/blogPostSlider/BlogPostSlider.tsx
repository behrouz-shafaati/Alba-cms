// کامپوننت نمایشی بلاک
import React from 'react'
import { Block } from '../../types'
import { Post } from '@/features/post/interface'
import { Option } from '@/types'

import { EmblaOptionsType } from 'embla-carousel'
import BlogPostSliderParallaxLazy from './designs/BlogPostSliderParallaxLazy'
import BlogPostSliderSimpleLazy from './designs/BlogPostSliderSimpleLazy'

type BlogPostSliderProps = {
  posts: Post[]
  blockData: {
    id: string
    type: 'blogPostSlider'
    content: {
      tags: Option[]
      categories: Option[]
    }
    settings: {
      design: 'simple' | 'parallax'
      showArrows: boolean
      loop: boolean
      autoplay: boolean
      autoplayDelay: number
    }
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const BlogPostSlider = ({
  posts,
  blockData,
  ...props
}: BlogPostSliderProps) => {
  const locale = 'fa'
  const { content, settings } = blockData
  const OPTIONS: EmblaOptionsType = {
    dragFree: settings?.dragFree == false ? false : true,
    loop: settings?.loop,
    direction: settings?.rtl ? 'rtl' : 'ltr',
  }

  const pluginsConfig = {
    playOnInit: settings?.autoplay == false ? false : true,
    delay: settings?.delay * 1000 || 5000,
    stopOnInteraction: false,
  }

  switch (settings?.design) {
    case 'parallax':
      return (
        <BlogPostSliderParallaxLazy
          pluginsConfig={pluginsConfig}
          options={OPTIONS}
          posts={posts}
          blockData={blockData}
          {...props}
        />
      )
    default:
      return (
        <BlogPostSliderSimpleLazy
          pluginsConfig={pluginsConfig}
          options={OPTIONS}
          posts={posts}
          blockData={blockData}
          {...props}
        />
      )
  }
}
