import { ChevronLeftIcon } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export type BreadCrumbType = {
  title: string
  link: string
}

type BreadCrumbPropsType = {
  items: BreadCrumbType[]
}

export function BreadCrumb({ items }: BreadCrumbPropsType) {
  return (
    <div className="mb-4 flex items-center space-x-1 text-sm text-muted-foreground">
      {items?.map((item: BreadCrumbType, index: number) => {
        const className =
          index === items.length - 1
            ? 'text-foreground pointer-events-none'
            : 'text-muted-foreground'
        return (
          <React.Fragment key={`${item.title}-${index}`}>
            <ChevronLeftIcon className="h-4 w-4" />
            <Link
              href={item.link}
              className={` 
               font-medium ${className}`}
            >
              {item.title}
            </Link>
          </React.Fragment>
        )
      })}
    </div>
  )
}
