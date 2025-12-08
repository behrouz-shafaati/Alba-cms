'use client'
import dynamic from 'next/dynamic'
import { Skeleton } from '../ui/skeleton'

// کاملاً خارج از باندل اولیه
const PostMetaData = dynamic(() => import('./meta-data'), {
  ssr: false, // هیچ SSR اتفاق نمی‌افتد
  loading: () => <PostMetaDataFallBack />,
})

export default function PostMetaDataLazy(props) {
  return <PostMetaData {...props} />
}

const PostMetaDataFallBack = () => {
  return (
    <div className=" mb-4">
      <div className="flex gap-2">
        <div>
          <Skeleton className="w-10 h-10 rounded-full" />
        </div>
        <div className="  flex flex-col justify-between">
          <Skeleton className="w-14 h-4 mb-2" />
          <span className="">
            <Skeleton className="w-32 h-4 mb-2" />
          </span>
        </div>
      </div>
    </div>
  )
}
