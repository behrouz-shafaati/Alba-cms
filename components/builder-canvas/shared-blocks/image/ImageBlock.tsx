// کامپوننت نمایشی بلاک

import React from 'react'
import { Block } from '../../types'
import { computedStyles } from '../../utils/styleUtils'
import Image from 'next/image'
import ImageAlba from '@/components/image-alba'

type TextBlockProps = {
  widgetName: string
  blockData: {
    content: {
      title: string
      alt: string
      description: string
      src: string
      href: string
    }
    type: 'image'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const ImageBlock = ({
  widgetName,
  blockData,
  ...props
}: TextBlockProps) => {
  const { content, settings, styles } = blockData
  props.className = props?.className
    ? `${props?.className} w-full h-auto max-w-full`
    : 'w-full h-auto max-w-full'
  const { width = '', height = '', ...restStyle } = styles || {}
  const { className = '', ...restProps } = props || {}

  const imageElement = (
    <div
      data-image-wrapper
      className={`relative  ${className} `}
      // className={`relative  ${className} aspect-[3.9/1]`}
      {...restProps}
      style={{
        ...computedStyles({ width, height }),
      }}
    >
      {content?.srcSmall ? (
        <ImageAlba file={content} zoomable={settings?.zoomable} />
      ) : (
        // <Image
        //   src={content?.srcMedium}
        //   sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
        //   alt={content?.alt || 'تصویر'}
        //   fill
        //   // {...(!width || !height
        //   //   ? { fill: true }
        //   //   : {
        //   //       width: Number(width),
        //   //       height: Number(height),
        //   //     })}
        //   style={{
        //     ...computedStyles(restStyle),
        //   }}
        //   className="object-cover w-full h-full min-h-4"
        //   placeholder="blur"
        //   blurDataURL={content?.srcSmall}
        // />
        <Image
          src={'/assets/general-img-landscape.png'}
          sizes="(max-width: 640px) 640px, (max-width: 768px) 768px, 1280px"
          alt={content?.alt || 'تصویر'}
          // {...(!width || !height
          //   ? { fill: true }
          //   : {
          //       width: Number(width),
          //       height: Number(height),
          //     })}
          style={{
            ...computedStyles(restStyle),
          }}
          width={250}
          height={250}
          className="object-cover w-full h-full"
        />
      )}
    </div>
  )

  return imageElement
}
