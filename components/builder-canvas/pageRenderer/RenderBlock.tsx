'use server'
import { registerAllBlocks } from '@/lib/block/register-all-blocks.server'
import { getBlockRegistry } from '@/lib/block/singletonBlockRegistry'
import { Block } from '../types'
import { combineClassNames, getVisibilityClass } from '../utils/styleUtils'
import { Settings } from '@/features/settings/interface'

type RestProps = Record<string, unknown>

type RenderBlockProp = {
  siteSettings: Settings
  editroMode: boolean
  item: Block
  pageSlug: string | null
  categorySlug: string | null
  searchParams?: any
}
const RenderBlock = async ({
  siteSettings,
  editroMode = false,
  item,
  pageSlug,
  categorySlug,
  searchParams = {},
  ...rest
}: RenderBlockProp) => {
  // فقط در سرور اجرا می‌شود
  registerAllBlocks()
  const blocks = await getBlockRegistry() // برای محتوا دار بودن این برای رسیدن به این کامپوننت هیچ کامپوننتی نباید از use client‌ استفاده کرده باشد

  const visibility = item.styles?.visibility
  const className = getVisibilityClass(visibility)

  const block = blocks[item.type]
  const Component = block?.Renderer
  if (Component) {
    if (item.type.startsWith('content_')) {
      const node = extractNode(rest, item.type) // محتوای مورد نظر از پراپ های ارسال شده استخراج میشود
      if (node)
        return (
          <>
            <Component
              siteSettings={siteSettings}
              blockData={item}
              className={`${className} ${combineClassNames(
                item.classNames || {}
              )}`}
              content={node} // به ویژگی content جهت نمایش در جایگاه مورد نظر پاس داده میشود
              pageSlug={pageSlug}
              categorySlug={categorySlug}
              searchParams={searchParams}
            />
          </>
        )
    }
    if (item.type === 'templatePart') {
      return (
        <>
          <Component
            siteSettings={siteSettings}
            blockData={item}
            className={`${className} ${combineClassNames(
              item.classNames || {}
            )}`}
            {...rest} // 👈 همه content_all به صورت داینامیک پاس داده میشه
            pageSlug={pageSlug}
            categorySlug={categorySlug}
            searchParams={searchParams}
          />
        </>
      )
    }

    return (
      <>
        <Component
          siteSettings={siteSettings}
          blockData={item}
          className={`${className} ${combineClassNames(item.classNames || {})}`}
          pageSlug={pageSlug}
          categorySlug={categorySlug}
          searchParams={searchParams}
        />
      </>
    )
  }
  return <p>رندر بلاک {item.type} ناموفق بود</p>
  // }
}

export default RenderBlock

function extractNode(rest: RestProps, key: string): React.ReactNode | null {
  if (!key.startsWith('content_')) return null
  const value = rest[key]
  if (!value) return null
  return value as React.ReactNode
}
