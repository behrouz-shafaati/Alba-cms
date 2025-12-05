'use client'
import { QueryResponse } from '@/lib/entity/core/interface'
import { PostComment } from '../../interface'
import { Post } from '@/features/post/interface'
import { PostCommentItem } from './post-comment-item'
import { useCustomSWR } from '@/hooks/use-custom-swr'

interface PostCommentTableProps {
  post: Post
  postCommentsResult: QueryResponse<PostComment>
}

export default function PostCommentList({
  post,
  postCommentsResult,
}: PostCommentTableProps) {
  const initialPostComments = postCommentsResult
  const comments = postCommentsResult.data
  const { data: postComments, isLoading } = useCustomSWR({
    url: `/api/comments?post=${post.id}`,
    initialData: initialPostComments,
  })
  return (
    <>
      <div className="">
        {(postComments.data ?? []).map((postComment: PostComment) => {
          return (
            <PostCommentItem key={postComment.id} postComment={postComment} />
          )
        })}
      </div>
    </>
  )
}
