import Image from 'next/image'
import Link from 'next/link'
// سیستمی سبک، آزاد، مطمئن و قدرتمند برای سفر طولانی مدیریت محتوا»
export default function AlbaFallback() {
  return (
    <div className="flex items-center justify-center min-h-screen px-4 text-white bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      <div className="text-center">
        {/* لوگو جایگزین میشه */}
        <div>
          <Image
            alt="ALBA CMS"
            src="./alba-white.svg"
            height={200}
            width={200}
            className="mx-auto "
          />
        </div>

        {/* عنوان اصلی */}
        <h1 className="text-5xl font-bold tracking-wide sm:text-6xl">
          ALBA CMS
        </h1>

        {/* توضیح کوتاه */}
        <p className="mt-4 text-lg text-gray-400">
          Fly Beyond Limits
          <br />
          <Link className="mt-6 text-primary underline" href={`/dashboard`}>
            Login to admin panel
          </Link>
        </p>
      </div>
    </div>
  )
}
