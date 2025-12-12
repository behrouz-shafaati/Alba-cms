export type GetPostIdsResponse = {
  success: boolean
  data: {
    post_type: 'post'
    status: 'any'
    total: number
    ids: number[]
  }
}

export type WpPost = {
  wpId: number
  post_type: 'post'
  title: string
  slug: string
  content: string
  excerpt: string
  status: WpPostStatus
  author_wpId: number
  created_at: string
  updated_at: string
  published_at: string
  comment_status: boolean
  ping_status: boolean
  menu_order: number
  comment_count: number
  featured_image: {
    wpId: number
    url: string
    alt: string
    title: string
    caption: string
    mime_type: 'image/webp'
    width: number
    height: number
    filesize: number
  }
  categories: { primary_wpId: number; all_wpIds: number[] }
  tags_wpIds: number[]
  seo: {
    title: string
    description: string
    focus_keyword: string
    canonical_url: string
    og_title: string
    og_description: string
    og_image: string
    twitter_title: string
    twitter_description: string
    robots: { noindex: boolean; nofollow: boolean }
    source_plugin: string
  }
  meta: {
    _thumbnail_id: string
    _edit_last: string
    _edit_lock: string
    _wp_page_template: string
  }
}

/**
 * وضعیت‌های پست در وردپرس
 */
export type WpPostStatus =
  | 'publish'
  | 'draft' // پیش‌نویس
  | 'pending' //در انتظار بررسی
  | 'private' // خصوصی → منتشرشده (با دسترسی محدود)
  | 'future' // زمان‌بندی شده
  | 'trash' //زباله‌دان
  | 'auto-draft' //پیش‌نویس خودکار
  | 'inherit' // ارثی (برای revision ها)
