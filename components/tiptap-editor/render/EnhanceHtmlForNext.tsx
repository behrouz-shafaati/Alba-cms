'use server'
import Link from 'next/link'
import parse, { domToReact, Element } from 'html-react-parser'
import { slugify } from '@/lib/utils'

import { AccordionNode, TNode } from '../type'
import { computedStyles } from '@/components/builder-canvas/utils/styleUtils'
import { Settings } from '@/features/settings/interface'
import { ImageAlba } from '@/components/image-alba'
import VideoEmbed from '@/components/video-embed/VideoEmbed'
import fileCtrl from '@/lib/entity/file/controller'
import AccordionRenderLazy from '../tiptap-renderers/AccordionRenderLazy'
import AdSlotBlockLazy from '@/components/builder-canvas/shared-blocks/AdSlot/AdSlotBlockLazy'

// تابع کمکی: جمع‌آوری همه‌ی نودهای accordion (ترتیب درختی)
function collectAccordions(node: TNode | undefined, out: TNode[] = []) {
  if (!node) return out
  if (node.type === 'accordion' || node.type === 'faq') out.push(node)
  if (node.content && node.content.length) {
    for (const child of node.content) collectAccordions(child, out)
  }
  return out
}
// تابع کمکی: جمع‌آوری همه‌ی نودهای img (ترتیب درختی)
function collectImages(node: TNode | undefined, out: TNode[] = []) {
  if (!node) return out
  if (node.type === 'img' || node.type === 'image') out.push(node)
  if (node.content && node.content.length) {
    for (const child of node.content) collectImages(child, out)
  }
  return out
}

type Props = {
  siteSettings: Settings
  contentJson: string
  HTML_string: string
}
export default async function EnhanceHtmlForNext({
  siteSettings,
  contentJson,
  HTML_string = '',
}: Props) {
  // ✅ اضافه کردن Early Return با Fallback
  // اگر HTML_string معتبر نیست، یک div خالی برگردان
  if (!HTML_string || typeof HTML_string !== 'string') {
    console.warn('⚠️ EnhanceHtmlForNext: HTML_string is empty or invalid', {
      type: typeof HTML_string,
      value: HTML_string,
    })
    return <div className="prose max-w-none" />
  }

  // ✅ اگر contentJson هم خالی باشد
  if (!contentJson || typeof contentJson !== 'string') {
    console.warn('⚠️ EnhanceHtmlForNext: contentJson is empty or invalid')
    return (
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: HTML_string }}
      />
    )
  }

  // 1. JSON پارس شده (doc)
  const doc = JSON.parse(contentJson) as TNode

  // 2. جمع‌آوری آکاردئون‌ها و تصاویر
  const accordions: AccordionNode = collectAccordions(doc) as AccordionNode
  const images: TNode[] = collectImages(doc)

  // 3. Map کردن تصاویر بر اساس ID و fetch از DB برای کسانی که translations ندارن
  const imageMap: Record<string, any> = {}
  await Promise.all(
    images.map(async (img) => {
      const id = img.attrs?.id
      if (!id) return
      if (!img.attrs?.translations) {
        const fileFromDb = await fileCtrl.findById({ id })
        if (fileFromDb) imageMap[id] = fileFromDb
      } else {
        imageMap[id] = {
          ...img.attrs,
        }
      }
    })
  )

  // شمارنده برای نگه داشتن هم‌پوشانی HTML <-> JSON
  let accordionIndex = 0
  return (
    <div className="prose max-w-none">
      {parse(HTML_string, {
        replace(domNode) {
          // console.log('#324 domNode.name: ', domNode.name)
          if (domNode instanceof Element && domNode.name === 'img') {
            const id = domNode.attribs.id
            if (!id) return null
            const fileData = imageMap[id]
            if (!fileData) return null
            return <ImageAlba file={fileData} />
          }

          if (domNode instanceof Element && domNode.name === 'a') {
            const href = domNode.attribs?.href

            if (!href) return null // ✅ اگر href نبود، چیزی رندر نکن

            return (
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                // className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors object-cover"
              >
                {domNode.children?.[0]?.data || href}
              </Link>
            )
          }

          if (domNode instanceof Element && domNode.name === 'ad-slot') {
            const {
              slotid: slotId,
              linkedcampaign: linkedCampaign,
              countofbanners: countOfBanners,
              direction,
              aspect,
              fallbackbehavior: fallbackBehavior,
            } = domNode.attribs
            const blockData = {
              id: slotId,
              content: { linkedCampaign },
              settings: {
                direction,
                countOfBanners,
                placement: 'content',
                aspect,
                fallbackBehavior,
              },
            }

            return <AdSlotBlockLazy widgetName="adSlot" blockData={blockData} />
          }
          // اگر توی renderTiptapJsonToHtml از div با data-type="accordion" استفاده کردی:
          if (
            domNode instanceof Element &&
            (domNode.attribs?.['data-type'] === 'accordion' ||
              domNode.name === 'accordion' ||
              domNode.name === 'faq' ||
              domNode.attribs?.['data-type'] === 'faq')
          ) {
            // می‌گیریم JSON متناظر را از آرایه‌ی قبلاً ساخته شده
            const accNode = accordions[accordionIndex++]

            // پاس دادن JSON به کامپوننت client-side امن است (serializable)
            return <AccordionRenderLazy node={accNode} />
          }

          // اگر توی renderTiptapJsonToHtml از div با data-type="videoEmbed" استفاده کردی:
          if (
            domNode instanceof Element &&
            (domNode.attribs?.['data-type'] === 'videoEmbed' ||
              domNode.name === 'videoEmbed')
          ) {
            // پاس دادن JSON به کامپوننت client-side امن است (serializable)
            return (
              <VideoEmbed
                src={domNode.attribs.src}
                title={domNode.attribs.title}
              />
            )
          }
          // برای اینک عنوان های ایدی بگیرن و بشه از فهرست مطالب بهشون دسترسی داشت
          if (
            domNode instanceof Element &&
            ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(domNode.name)
          ) {
            const text = getTextFromDom(domNode) // این بی‌خطا متن را از داخل strong/mark هم می‌آورد
            // const text = domNode.children?.[0]?.data
            const id = slugify(text)
            const Tag = `${domNode.name}` as keyof JSX.IntrinsicElements

            return (
              <Tag
                key={id}
                id={id}
                dir={domNode.attribs.dir}
                className="[--header-top:var(--header-top-mobile)] sm:[--header-top:var(--header-top-tablet)] md:[--header-top:var(--header-top-desktop)]"
                style={{
                  ...computedStyles({
                    ['--header-top-mobile' as any]: `${
                      siteSettings?.mobileHeaderHeight + 8
                    }px`,
                    ['--header-top-tablet' as any]: `${
                      siteSettings?.tabletHeaderHeight + 8
                    }px`,
                    ['--header-top-desktop' as any]: `${
                      siteSettings?.desktopHeaderHeight + 8
                    }px`,
                    scrollMarginTop: 'var(--header-top)',
                  }),
                  ...parseStyleString(domNode.attribs.style),
                }}
              >
                {domToReact(domNode.children)}{' '}
                {/* این تگ‌های داخلی مثل <strong> را به React تبدیل می‌کند */}
              </Tag>
            )
          }
        },
      })}
    </div>
  )
}

// helper: متن را از یک node HTML (htmlparser2-like) به صورت بازگشتی می‌گیرد
const visited = new WeakSet()

function getTextFromDom(node: any): string {
  if (!node || typeof node !== 'object') return ''
  if (visited.has(node)) return '' // جلوگیری از حلقه‌ی بازگشتی
  visited.add(node)

  if (node.type === 'text') return node.data || ''
  if (Array.isArray(node.children)) {
    return node.children.map(getTextFromDom).join('')
  }
  return ''
}

// helper برای تبدیل استایل رشته‌ای به object
function parseStyleString(styleString?: string): Record<string, string> {
  if (!styleString) return {}
  return styleString.split(';').reduce((acc, item) => {
    const [key, value] = item.split(':').map((x) => x?.trim())
    if (key && value) {
      // تبدیل مثلاً "text-align" → "textAlign"
      const camelKey = key.replace(/-([a-z])/g, (_, char) => char.toUpperCase())
      acc[camelKey] = value
    }
    return acc
  }, {} as Record<string, string>)
}
