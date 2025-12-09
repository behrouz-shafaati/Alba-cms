import { Skeleton } from '@/components/ui/skeleton'

const ArticalHorizontalCardSkeleton = () => {
  const locale = 'fa'

  return (
    <div className="grid grid-cols-[1fr_7rem] md:grid-cols-[1fr_200px] items-center md:items-start border-b py-2 gap-2">
      {/* عنوان و توضیح */}
      <div className="p-2">
        <h3 className="text-sm font-semibold mb-1 leading-5 min-h-[2.5rem] line-clamp-2">
          <Skeleton className="w-[55%] h-6" />
        </h3>
        <Skeleton className="w-full h-6" />
      </div>

      {/* تصویر */}
      <div className="relative w-full h-full min-h-28 aspect-square md:aspect-[4/3] md:row-span-2 overflow-hidden rounded-sm">
        <Skeleton className="w-full h-full" />
      </div>

      {/* اطلاعات پایین (تاریخ و دیدگاه) */}
      <div className="flex text-xs h-full text-gray-400 gap-4 md:col-start-1 md:self-end px-2">
        <Skeleton className="w-6 h-6" />
        <Skeleton className="w-6 h-6 ps-4" />
      </div>
    </div>
  )
}

export default ArticalHorizontalCardSkeleton
