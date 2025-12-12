import replaceInternalLinks, {
  LinkReplacerConfig,
} from './replaceInternalLinks'

/**
 * جایگزینی همه لینک‌های داخلی در یک متن HTML
 */
export default function replaceLinksInHtml(
  html: string,
  config: LinkReplacerConfig
): string {
  if (!html) return html

  // الگوی پیدا کردن href در تگ‌های a
  const hrefPattern = /(<a\s+[^>]*href\s*=\s*["'])([^"']+)(["'][^>]*>)/gi

  return html.replace(hrefPattern, (match, prefix, url, suffix) => {
    const newUrl = replaceInternalLinks(url, config)
    return `${prefix}${newUrl}${suffix}`
  })
}

/**
 * جایگزینی همه لینک‌های داخلی در یک متن HTML (شامل src تصاویر)
 */
function replaceAllLinksInHtml(
  html: string,
  config: LinkReplacerConfig
): string {
  if (!html) return html

  // جایگزینی href
  let result = html.replace(
    /(<a\s+[^>]*href\s*=\s*["'])([^"']+)(["'])/gi,
    (match, prefix, url, suffix) => {
      return `${prefix}${replaceInternalLinks(url, config)}${suffix}`
    }
  )

  // جایگزینی src (برای تصاویر)
  result = result.replace(
    /(<img\s+[^>]*src\s*=\s*["'])([^"']+)(["'])/gi,
    (match, prefix, url, suffix) => {
      return `${prefix}${replaceInternalLinks(url, config)}${suffix}`
    }
  )

  // جایگزینی srcset
  result = result.replace(
    /(srcset\s*=\s*["'])([^"']+)(["'])/gi,
    (match, prefix, srcset, suffix) => {
      const newSrcset = srcset
        .split(',')
        .map((part: string) => {
          const [url, size] = part.trim().split(/\s+/)
          const newUrl = replaceInternalLinks(url, config)
          return size ? `${newUrl} ${size}` : newUrl
        })
        .join(', ')
      return `${prefix}${newSrcset}${suffix}`
    }
  )

  return result
}
