// components/comments/CommentItem.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { MessageSquare, ThumbsUp, ThumbsDown, Reply } from 'lucide-react'
import { useState } from 'react'
import { PostComment } from '../../interface'
import { getTranslation, timeAgo } from '@/lib/utils'
import { usePostCommentStore } from '../store/usePostCommentStore'

interface CommentItemProps {
  postComment: PostComment
  depth?: number
}

export function PostCommentItem({ postComment, depth = 0 }: CommentItemProps) {
  const [showReplies, setShowReplies] = useState(true)
  const { setReplayTo } = usePostCommentStore()
  const content = getTranslation({
    translations: postComment.translations,
    locale: postComment.locale,
  })

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-10 border-r pr-4' : ''}`}>
      <div className="flex flex-col gap-3">
        <div className="flex gap-2">
          <Avatar>
            <AvatarImage src={postComment.author?.image?.srcSmall || ''} />
            <AvatarFallback>
              {postComment.author?.name[0] || '?'}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col justify-between gap-1">
            <span className="text-sm font-semibold">
              {postComment.author?.name || 'ناشناس'}
            </span>
            <span className="text-xs font-thin text-gray-500">
              {timeAgo(postComment.createdAt)}
            </span>
          </div>
        </div>
        <div className="flex-1 ps-4">
          <div
            className="mt-1 text-gray-700 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: content.contentJson }}
          />

          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            {/* <Button size="sm" variant="ghost" className="flex gap-1">
              <ThumbsUp size={16} /> 23
            </Button>
            <Button size="sm" variant="ghost" className="flex gap-1">
              <ThumbsDown size={16} /> 5
            </Button> */}
            <Button
              size="sm"
              variant="ghost"
              className="flex gap-1"
              onClick={() => setReplayTo(postComment)}
            >
              <Reply size={16} /> پاسخ
            </Button>
          </div>
        </div>
      </div>

      {showReplies && postComment.replies?.length > 0 && (
        <div className="mt-3">
          {postComment.replies.map((reply, idx) => (
            <PostCommentItem
              key={`${reply._id}_${idx}`}
              postComment={reply}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  )
}
