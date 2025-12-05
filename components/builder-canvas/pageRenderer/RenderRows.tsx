'use server'
// رندر کردن بلاک‌ها از روی JSON
// RenderRows.tsx
import React from 'react'
import type { Row } from '@/components/builder-canvas/types'
import {
  combineClassNames,
  computedStyles,
  getVisibilityClass,
} from '../utils/styleUtils'
import RenderBlock from './RenderBlock'
import { Settings } from '@/features/settings/interface'

type Props = {
  siteSettings: Settings
  editroMode: boolean
  rows: Row[]
  pageSlug: string | null
  categorySlug: string | null
  searchParams?: any
  [key: string]: any // اجازه props داینامیک مثل content_1, content_2
}

const RendererRows = async ({
  siteSettings,
  editroMode = false,
  rows,
  pageSlug,
  categorySlug,
  searchParams = {},
  ...rest
}: Props) => {
  // فیلتر کردن propsهایی که content_ شروع میشن
  const contents = Object.entries(rest)
    .filter(([key]) => key.startsWith('content_'))
    .map(([key, value]) => ({
      key, // مثل "content_main" یا "content_title"
      node: value as React.ReactNode,
    }))
  const contentProps = contents.reduce((acc, { key, node }) => {
    acc[key] = node
    return acc
  }, {} as Record<string, React.ReactNode>)
  return (
    <>
      {rows?.map((row) => {
        const visibility = row.styles?.visibility
        const className = getVisibilityClass(visibility, { display: 'grid' })
        let stickyClass = ''
        // این نوع چسبان فقط مخصوص ردیف است صله ی آن تا بالای ویو پورت همیشه صفر است. تنها یک ردیف این قابلیت را باید داشته باشد
        if (row?.settings?.sticky || false) stickyClass = 'sticky top-0 z-50'
        return (
          <div
            data-row
            key={row.id}
            style={{ ...computedStyles(row.styles) }}
            className={`grid grid-cols-12 gap-4 ${combineClassNames(
              row.classNames || {}
            )} ${className} ${stickyClass} `}
          >
            {row.columns.map((col) => {
              const visibilityClassName = getVisibilityClass(
                col.styles?.visibility,
                { display: col.settings?.display }
              )
              delete col.settings?.visibility
              // as default columns content is sticky
              col.settings = { sticky: true, ...col?.settings }
              const responsiveDesign = row?.settings?.responsiveDesign ?? true
              const classBaseOnResponsiveDesign = responsiveDesign
                ? `col-span-12 md:col-span-${col.width}`
                : `col-span-${col.width} md:col-span-${col.width}`

              return (
                <div
                  data-column
                  key={col.id}
                  className={`relative  ${classBaseOnResponsiveDesign} ${combineClassNames(
                    col.classNames || {}
                  )} ${visibilityClassName}`}
                  style={{
                    ...computedStyles(col.styles),
                    ...computedStyles(col.settings),
                  }}
                >
                  <div
                    data-block-wrapper
                    //When the row is sticky don't need sticky column
                    {...(row?.settings?.sticky || col.settings?.sticky == false
                      ? {}
                      : {
                          className:
                            'w-full sticky [--header-top:var(--header-top-mobile)] sm:[--header-top:var(--header-top-tablet)] md:[--header-top:var(--header-top-desktop)]',
                        })}
                    style={{
                      ...computedStyles({
                        ...col.styles,
                        top: 'var(--header-top)',
                        ['--header-top-mobile' as any]: `${siteSettings?.mobileHeaderHeight}px`,
                        ['--header-top-tablet' as any]: `${siteSettings?.tabletHeaderHeight}px`,
                        ['--header-top-desktop' as any]: `${siteSettings?.desktopHeaderHeight}px`,
                      }),
                      ...computedStyles(col.settings),
                    }}
                  >
                    {col.blocks.map((el: any, index: number) => {
                      return (
                        <RenderBlock
                          siteSettings={siteSettings}
                          key={el.id}
                          item={el}
                          editroMode={editroMode}
                          pageSlug={pageSlug}
                          categorySlug={categorySlug}
                          searchParams={searchParams}
                          {...contentProps}
                        />
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>
        )
      })}
    </>
  )
}
export default RendererRows
