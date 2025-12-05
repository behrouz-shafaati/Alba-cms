'use client'
import { Skeleton } from '@/components/ui/skeleton'
import dynamic from 'next/dynamic'

// کاملاً خارج از باندل اولیه
const BlogPostSliderParallax = dynamic(
  () => import('./BlogPostSliderParallax'),
  {
    ssr: false, // هیچ SSR اتفاق نمی‌افتد
    loading: () => (
      <div className="flex flex-row w-full overflow-hidden gap-2">
        {' '}
        {new Array(6).fill({}).map((p) => (
          <div className="embla__slide flex-shrink-0 w-full grow-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 py-4">
            <div className="embla__parallax rounded-xl overflow-hidden shadow-md bg-white dark:bg-gray-900 ">
              <div className="embla__parallax__layer  flex-[0_0_100%] aspect-[3/2] sm:aspect-[16/11] lg:aspect-[21/14]">
                <Skeleton className="w-full h-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    ),
  }
)

export default function BlogPostSliderParallaxLazy(props) {
  return <BlogPostSliderParallax {...props} />
}
