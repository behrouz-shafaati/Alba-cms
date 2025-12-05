import { PostComment } from './interface'

export const commentsUrl = `/api/dashboard/comments`
export function buildCommentTree(
  comments: PostComment[],
  parentId: string | null = null
): PostComment[] {
  const commentsTree = comments
    .filter((c) => String(c.parent) === String(parentId))
    .map((c) => ({
      ...c,
      replies: buildCommentTree(comments, c.id),
    }))
  return commentsTree
}
