export type GetPostCommentIdsResponse = {
  success: boolean
  total: number
  ids: number[]
}

export type wpPostCommentResult = {
  success: boolean
  data: WpPostComment
}

export type WpPostComment = {
  wpId: number
  post_wpId: number
  parent_wpId: number | null
  user_wpId: number
  author_name: string
  author_email: string
  author_url: string | null
  author_ip: string
  content: string
  status: WpPostCommentStatus
  date: string
}

/**
 * وضعیت‌های پست در وردپرس
 */
export type WpPostCommentStatus = 'approved' | 'pending'
