'use client'

import { Search as SeachIcon } from 'lucide-react'
import { useSearchParams, usePathname, useRouter } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Suspense, useTransition } from 'react'
import { Input } from './input'
import SpinIcon from '../icon/spin'

function SearchComponent({
  placeholder,
  className = '',
}: {
  placeholder: string
  className?: string
}) {
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const [isPending, startTransition] = useTransition()
  const { replace } = useRouter()

  const handleSearch = useDebouncedCallback((term) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', '1')
    if (term) {
      params.set('query', term)
    } else {
      params.delete('query')
    }
    startTransition(() => {
      replace(`${pathname}?${params.toString()}`)
    })
  }, 700)

  return (
    <div className={`relative flex flex-1 flex-shrink-0 ${className}`}>
      <label htmlFor="search" className="sr-only">
        جستجو
      </label>
      <div className="relative w-full">
        {!isPending && (
          <SeachIcon className="absolute right-3 top-5 h-[18px] w-[18px] -translate-y-1/2 text-gray-500 peer-focus:text-gray-900" />
        )}
        {isPending && (
          <SpinIcon className="absolute  right-3 top-3 flex items-center justify-center h-[18px] w-[18px] animate-spin text-gray-700" />
        )}
        <Input
          name="search"
          id="search"
          className={`peer block w-full rounded-md border py-[9px] pr-10 text-sm outline-2`}
          placeholder={placeholder}
          onChange={(e) => {
            handleSearch(e.target.value)
          }}
          defaultValue={searchParams.get('query')?.toString()}
        />
      </div>
    </div>
  )
}

export default function Search({
  placeholder,
  className = 'md:max-w-md',
}: {
  placeholder: string
  className?: string
}) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchComponent placeholder={placeholder} className={className} />
    </Suspense>
  )
}
