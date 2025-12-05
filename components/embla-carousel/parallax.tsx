'use client'
// کامپوننت نمایشی بلاک
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import Autoplay from 'embla-carousel-autoplay'
import LeftSliderButton from '@/components/ui/left-slider-button'
import RightSliderButton from '@/components/ui/right-slider-button'
import { EmblaOptionsType, EmblaPluginType } from 'embla-carousel'

type PropType = {
  slides: any[]
  options?: EmblaOptionsType
  plugins?: EmblaPluginType[]
  showArrows?: boolean
}

export const EmblaCarouselParallax = ({
  slides,
  options,
  plugins,
  showArrows = true,
  ...props
}: PropType) => {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      dragFree: false,
      direction: 'rtl',
      ...options,
    },
    [
      Autoplay({
        playOnInit: true,
        delay: 5000,
        stopOnInteraction: false,
      }),
      ...plugins,
    ]
  )

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
    ? `parallax ${props?.className}`
    : 'parallax'

  const { onClick, ...restProps } = props

  return (
    <div {...props} {...(onClick ? { onClick } : {})}>
      <div className="embla relative w-full min-h-10  overflow-hidden">
        <div className={`embla__viewport`} ref={emblaRef}>
          <div className="embla__container  flex">{slides}</div>
        </div>
        {/* دکمه‌ها */}
        {showArrows && (
          <>
            <LeftSliderButton scrollPrev={scrollPrev} />
            <RightSliderButton scrollNext={scrollNext} />
          </>
        )}
      </div>
    </div>
  )
}
