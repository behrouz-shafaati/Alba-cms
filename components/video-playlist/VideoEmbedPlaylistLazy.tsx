'use client'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const VideoEmbedPlaylist = dynamic(() => import('./VideoEmbedPlaylist'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <p>Lazy loading video play list</p>,
})

export default function VideoEmbedPlaylistLazy(props) {
  return <VideoEmbedPlaylist {...props} />
}
