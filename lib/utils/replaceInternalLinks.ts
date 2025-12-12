export interface LinkReplacerConfig {
  oldDomains: string[] // دامنه‌های قدیمی (مثل: example.com, www.example.com)
  newBaseUrl: string // آدرس جدید (مثل: https://newsite.com)
}

/**
 * بررسی و جایگزینی لینک‌های داخلی با آدرس جدید
 */
export interface LinkReplacerConfig {
  newBaseUrl: string
  oldDomains: string[] // می‌تواند URL کامل باشد مثل 'http://localhost/jewellery'
}

export interface LinkReplacerConfig {
  newBaseUrl: string
  oldDomains: string[]
}

export default function replaceInternalLinks(
  url: string,
  config: LinkReplacerConfig
): string {
  // اگر لینک خالی یا نامعتبر بود
  if (!url || typeof url !== 'string') {
    return url
  }

  const trimmedUrl = url.trim()

  // لینک‌های خاص → بدون تغییر
  if (
    trimmedUrl.startsWith('#') ||
    trimmedUrl.startsWith('javascript:') ||
    trimmedUrl.startsWith('mailto:') ||
    trimmedUrl.startsWith('tel:')
  ) {
    return url
  }

  // 🎯 ساده: هر oldDomain را با newBaseUrl جایگزین کن
  let result = trimmedUrl
  for (const oldDomain of config.oldDomains) {
    result = result.replace(oldDomain, config.newBaseUrl)
  }

  return result
}
