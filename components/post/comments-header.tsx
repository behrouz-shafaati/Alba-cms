import { MessageCircle } from 'lucide-react'

export const CommentsHeader = () => {
  return (
    <div className="relative z-10 px-6 py-8">
      <div className="flex items-center justify-center gap-3 mb-3">
        <div className="p-3 bg-primary/20 rounded-full text-primary">
          <MessageCircle className="w-7 h-7" />
        </div>
        <h2 className=" font-bold text-black dark:text-white tracking-wide">
          دیدگاه شما چیه؟
        </h2>
      </div>

      <p className="text-sm text-gray-700 dark:text-gray-300 max-w-md mx-auto leading-relaxed">
        نظرت برامون خیلی ارزشمنده! تجربه یا دیدگاهت رو درباره این مطلب بنویس 🌱
      </p>
    </div>
  )
}
