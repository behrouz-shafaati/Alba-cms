'use client'

import { MoveLeft, MoveRight } from 'lucide-react'
import clsx from 'clsx'
import Link from 'next/link'
import { generatePagination } from '@/lib/utils'
import { usePathname, useSearchParams } from 'next/navigation'
import { LinkButton } from './link-button'
import { Button } from './button'
import { Suspense } from 'react'

function PaginationComponent({ totalPages }: { totalPages: number }) {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentPage = Number(searchParams.get('page')) || 1

  const createPageURL = (pageNumber: number | string) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    return `${pathname}?${params.toString()}`
  }
  // NOTE: comment in this code when you get to this point in the course

  const allPages = generatePagination(currentPage, totalPages)

  return (
    <>
      {/* NOTE: comment in this code when you get to this point in the course */}

      <div className="inline-flex gap-1">
        {currentPage > 1 && (
          <PaginationArrow
            direction="left"
            href={createPageURL(currentPage - 1)}
            isDisabled={currentPage <= 1}
          />
        )}

        <div className="flex -space-x-px gap-1">
          {allPages.map((page, index) => {
            let position: 'first' | 'last' | 'single' | 'middle' | undefined

            if (index === 0) position = 'first'
            if (index === allPages.length - 1) position = 'last'
            if (allPages.length === 1) position = 'single'
            if (page === '...') position = 'middle'

            return (
              <PaginationNumber
                key={page}
                href={createPageURL(page)}
                page={page}
                position={position}
                isActive={currentPage === page}
              />
            )
          })}
        </div>

        {currentPage < totalPages && (
          <PaginationArrow
            direction="right"
            href={createPageURL(currentPage + 1)}
            isDisabled={currentPage >= totalPages}
          />
        )}
      </div>
    </>
  )
}

function PaginationNumber({
  page,
  href,
  isActive,
  position,
}: {
  page: number | string
  href: string
  position?: 'first' | 'last' | 'middle' | 'single'
  isActive: boolean
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center text-sm border',
    {
      'rounded-r-md': position === 'first' || position === 'single',
      'rounded-l-md': position === 'last' || position === 'single',
      'z-10 bg-blue-600 border-blue-600 text-white': isActive,
      'hover:bg-gray-100': !isActive && position !== 'middle',
      'dark:hover:bg-gray-800': !isActive && position !== 'middle',
      'text-gray-300': position === 'middle',
    }
  )

  return isActive || position === 'middle' ? (
    <Button>{page}</Button>
  ) : (
    <LinkButton href={href} className={className} variant="outline" size="sm">
      {page}
    </LinkButton>
  )
}

function PaginationArrow({
  href,
  direction,
  isDisabled,
}: {
  href: string
  direction: 'left' | 'right'
  isDisabled?: boolean
}) {
  const className = clsx(
    'flex h-10 w-10 items-center justify-center rounded-md border',
    {
      'pointer-events-none text-gray-300': isDisabled,
      'dark:hover:bg-gray-800': !isDisabled,
      'hover:bg-gray-100': !isDisabled,
      'ml-2 md:mr-4': direction === 'right',
      'mr-2 md:ml-4': direction === 'left',
    }
  )

  const icon =
    direction === 'right' ? (
      <MoveLeft className="w-4" />
    ) : (
      <MoveRight className="w-4" />
    )

  return isDisabled ? (
    <div className={className}>{icon}</div>
  ) : (
    <Link className={className} href={href}>
      {icon}
    </Link>
  )
}

export default function Pagination({ totalPages }: { totalPages: number }) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaginationComponent totalPages={totalPages} />
    </Suspense>
  )
}
