// کامپوننت نمایشی بلاک
'use client'
import React, { useCallback } from 'react'
import { Block } from '../../types'
import computedStyles from '../../utils/computedStyles'
import Image from 'next/image'
import Link from 'next/link'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import { FileDetails } from '@/lib/entity/file/interface'
import LeftSliderButton from '@/components/ui/left-slider-button'
import RightSliderButton from '@/components/ui/right-slider-button'
import EmptyBlock from '../../components/EmptyBlock'
import getTranslation from '@/lib/utils/getTranslation'

type ImageSliderBlockProps = {
  widgetName: string
  blockData: {
    content: [
      {
        title: string
        alt: string
        description: string
        src: string
        href: string
      }
    ]
    type: 'imageSlider'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ImageSliderBlock = ({
  widgetName,
  blockData,
  ...props
}: ImageSliderBlockProps) => {
  const { content, settings, styles } = blockData
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      direction: 'rtl',
    },
    [Autoplay({ playOnInit: true, delay: settings?.delay * 1000 || 3000 })]
  )

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])

  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'

  if (content.length == 0)
    return <EmptyBlock widgetName={widgetName} {...props} />
  const { onClick, ...restProps } = props
  const images = content.map((img: FileDetails, i: number) => {
    const Translation = getTranslation({ translations: img?.translations })
    const isLCP = i === 0

    const imageElement = (
      <Image
        src={img.srcMedium || '/assets/general-img-landscape.png'}
        sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
        alt={Translation?.alt || 'تصویر'}
        //   fill
        width={0}
        height={0}
        // sizes="100vw"
        style={{
          objectFit: 'contain',
          ...computedStyles(styles),
        }}
        priority={isLCP} // برای تصویر LCP
        loading={isLCP ? 'eager' : 'lazy'}
        className="block w-full h-auto"
        placeholder="blur"
        blurDataURL={img?.blurDataURL}
        {...props}
      />
    )
    return img.href ? (
      <div className="relative min-w-full" key={i}>
        <Link href={img.href} target="_blank" rel="noopener noreferrer">
          {imageElement}
        </Link>
      </div>
    ) : (
      <div className="relative min-w-full" key={i}>
        {imageElement}
      </div>
    )
  })

  return (
    <div className="relative w-full min-h-10" {...(onClick ? { onClick } : {})}>
      <div className={`overflow-hidden`} ref={emblaRef}>
        <div className="flex">{images}</div>
      </div>
      {/* دکمه‌ها */}
      <LeftSliderButton scrollPrev={scrollPrev} />
      <RightSliderButton scrollNext={scrollNext} />
    </div>
  )
}
