import React from 'react'
import { ImageAlba } from '@/components/image-alba'
import { File } from '@/lib/entity/file/interface'
import VideoEmbed from '../video-embed/VideoEmbed'

type PostCoverProps = {
  file: File
  aspectRatio: any | null
  postType: 'article' | 'video'
  primaryVideoEmbedUrl: string | null
  styles?: any
  isLCP: boolean
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

export const PostCover = ({
  file,
  aspectRatio = null,
  postType,
  primaryVideoEmbedUrl,
  styles = {},
  isLCP = true,
  ...props
}: PostCoverProps) => {
  if (postType === 'video') {
    return <VideoEmbed src={primaryVideoEmbedUrl} title="" className="my-4" />
  }
  return file ? (
    <ImageAlba
      file={file}
      showCaption={false}
      style={styles}
      aspectRatio={aspectRatio}
      isLCP={isLCP}
      {...props}
    />
  ) : (
    <></>
  )
}
