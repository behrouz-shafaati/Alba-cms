// components/comments/CommentItem.tsx
'use client'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Reply, CheckCircle, XCircle, Trash } from 'lucide-react'
import { useActionState, useEffect, useState, useTransition } from 'react'
import { PostComment } from '../../interface'
import { getTranslation, timeAgo } from '@/lib/utils'
import { usePostCommentStore } from '../store/usePostCommentStore'
import CommentForm from '../comment-form'
import { deletePostCommentAction, updateStatusPostComment } from '../../actions'
import { mutate } from 'swr'
import { useUpdatedUrl } from '@/hooks/use-updated-url'
import { commentsUrl } from '../../utils'
import { useSession } from '@/components/context/SessionContext'
import { can } from '@/lib/utils/can.client'

interface CommentItemProps {
  postComment: PostComment
  depth?: number
}
export function PostCommentItemManage({
  postComment,
  depth = 0,
}: CommentItemProps) {
  const { user } = useSession()

  const canModerate = can(user?.roles || [], 'postComment.moderate.any')
  const { buildUrlWithParams } = useUpdatedUrl()
  const [showReplayForm, setShowReplayForm] = useState(false)
  const [showReplies, setShowReplies] = useState(true)
  const { replayTo, setReplayTo } = usePostCommentStore()
  const content = getTranslation({
    translations: postComment.translations,
    locale: postComment.locale,
  })
  const initialState = {
    message: null,
    errors: {},
    success: true,
  }
  const [isPending, startTransition] = useTransition()
  const [state, dispatch] = useActionState(
    updateStatusPostComment.bind(null, String(postComment.id)) as any,
    initialState
  )

  useEffect(() => {
    if (!isPending) mutate(buildUrlWithParams(commentsUrl))
  }, [isPending])

  return (
    <div className={`mt-4 ${depth > 0 ? 'ml-10 border-r pr-4' : ''}`}>
      <div className="flex gap-3">
        <Avatar>
          <AvatarImage src={postComment.author?.image?.srcSmall || ''} />
          <AvatarFallback>{postComment.author?.name[0] || '?'}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-semibold">
              {postComment.author?.name || 'ناشناس'}
            </span>
            <span className="text-sm text-gray-500">
              {timeAgo(postComment.createdAt)}
            </span>
          </div>
          <div
            className="mt-1 text-gray-700 dark:text-gray-200"
            dangerouslySetInnerHTML={{ __html: content.contentJson }}
          />

          {canModerate && (
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
              <Button
                size="sm"
                variant="ghost"
                className="flex gap-1"
                onClick={() =>
                  startTransition(async () => {
                    try {
                      dispatch({ status: 'approved' })
                    } catch (err) {
                      console.log('#776234 Error: ', err)
                    }
                  })
                }
              >
                <CheckCircle size={16} /> پذیرفتن
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex gap-1"
                onClick={() =>
                  startTransition(async () => {
                    try {
                      await dispatch({ status: 'rejected' })
                      mutate()
                    } catch (err) {
                      console.log('#776234 Error: ', err)
                    }
                  })
                }
              >
                <XCircle size={16} /> نپذیرفتن
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="flex gap-1"
                onClick={() =>
                  startTransition(async () => {
                    try {
                      await deletePostCommentAction([postComment.id])
                      mutate()
                    } catch (err) {
                      console.log('#776234 Error: ', err)
                    }
                  })
                }
              >
                <Trash size={16} /> حذف
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* {showReplies && postComment.replies?.length > 0 && (
        <div className="mt-3">
          {postComment.replies.map((reply, idx) => (
            <PostCommentItemManage
              key={`${reply._id}_${idx}`}
              postComment={reply}
              depth={depth + 1}
            />
          ))}
        </div>
      )} */}
      {replayTo?.id == postComment.id && (
        <div className="mt-2">
          <CommentForm post={postComment.post} />
        </div>
      )}
    </div>
  )
}
