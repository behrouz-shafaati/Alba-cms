import Link from 'next/link'
import { Frown } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="flex h-full flex-col items-center justify-center gap-2">
      <Frown className="w-10 text-gray-400" />
      <h2 className="text-xl font-semibold">404 وجود ندارد!</h2>
      <p>برکه ی مورد تقاضا یافت نشد.</p>
      <Link
        href="/dashboard/users"
        className="mt-4 rounded-md bg-blue-500 px-4 py-2 text-sm text-white transition-colors hover:bg-blue-400"
      >
        بازگشت
      </Link>
    </main>
  )
}
