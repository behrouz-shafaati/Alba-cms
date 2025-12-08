import { ChevronLeftIcon } from 'lucide-react'
import React from 'react'
import { FastLink } from './FastLink'

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
            <FastLink
              href={item.link}
              className={` 
               font-medium ${className}`}
            >
              {item.title}
            </FastLink>
          </React.Fragment>
        )
      })}
    </div>
  )
}
