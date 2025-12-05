'use client'

import React, { useEffect, useRef, useState } from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlayCircle, CheckCircle } from 'lucide-react'
import Image from 'next/image'
import clsx from 'clsx'
import VideoEmbed from '../video-embed/VideoEmbed'
import { useDeviceType } from '@/hooks/use-device-type'

type VideoItem = {
  id: string
  title: string
  thumbnail: string
  src: string
  duration?: string
}

type VideoPlaylistProps = {
  videos: VideoItem[]
}

export default function VideoEmbedPlaylist({ videos }: VideoPlaylistProps) {
  const [current, setCurrent] = useState(videos[0])
  const countOfVideios = videos.length
  // for list height
  const mainRef = useRef<HTMLDivElement>(null)
  const [loadingHeight, setLoadingHeight] = useState<boolean>(true)
  const [mainHeight, setMainHeight] = useState<number | null>(0)
  const device = useDeviceType({ initial: 'mobile' })

  useEffect(() => {
    if (mainRef.current) {
      const height = mainRef.current.offsetHeight
      setMainHeight(height)
      setLoadingHeight(false)
    }
  }, [mainRef])
  return (
    <div className="container mx-auto p-4">
      {/* Layout: desktop: 2col | mobile: stacked */}
      <div className="flex flex-col md:flex-row gap-4">
        {/* Right column — active item */}
        <div ref={mainRef} className="md:w-2/3 w-full h-fit overflow-hidden">
          <VideoEmbed src={current.src} title={current.title} />
        </div>
        {/* Left column — playlist list */}
        <div
          className={`${
            countOfVideios > 4 ? `h-96` : ``
          } md:w-1/3 w-full  overflow-hidden border`}
          style={{
            ...(device !== 'mobile' && {
              height: mainHeight ? `${mainHeight}px` : 'auto',
            }),
          }}
        >
          <ScrollArea
            className=""
            style={{ position: 'relative', height: '100%' }}
          >
            <div className="divide-y divide-border">
              {(loadingHeight ? videos.slice(0, 5) : videos).map((video) => (
                <button
                  key={video.id}
                  onClick={() => setCurrent(video)}
                  className={clsx(
                    'flex items-center gap-3 p-3 w-full text-right transition-all hover:bg-muted/40',
                    current.id === video.id && 'bg-muted'
                  )}
                >
                  <div className="relative w-24 h-16 flex-shrink-0 rounded-md overflow-hidden">
                    <Image
                      src={video.thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-col justify-center flex-1 min-w-0">
                    <span className="text-sm font-medium line-clamp-1">
                      {video.title}
                    </span>
                    {video.duration && (
                      <span className="text-xs text-muted-foreground">
                        {video.duration}
                      </span>
                    )}
                  </div>
                  {current.id === video.id ? (
                    <CheckCircle className="text-primary w-4 h-4 flex-shrink-0" />
                  ) : (
                    <PlayCircle className="text-muted-foreground w-4 h-4 flex-shrink-0" />
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}
