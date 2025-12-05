'use client'
import { useActionState, useEffect, useRef } from 'react'
import { useToast } from '@/hooks/use-toast'
import { createPostComment } from '@/features/post-comment/actions'
import CommentEditor, { CommentEditorRef } from './comment-editor'
import { mutate } from 'swr'
import { usePostCommentStore } from './store/usePostCommentStore'
import { AlertCircleIcon, X } from 'lucide-react'
import { Button } from '@/components/custom/button'
import { Alert, AlertTitle } from '@/components/ui/alert'

interface PostCommentFormProps {
  needLogin?: boolean
  post: any | null
}

const CommentForm: React.FC<PostCommentFormProps> = ({
  needLogin = false,
  post,
}) => {
  const { replayTo, setReplayTo } = usePostCommentStore()
  const { toast } = useToast()
  const initialState = {
    success: false,
    message: null,
    errors: {},
    values: {},
  }

  const formRef = useRef<HTMLFormElement>(null)
  const editorRef = useRef<CommentEditorRef>(null)

  const actionHandler = createPostComment.bind(null, String(post?.id))
  const [state, dispatch, isPending] = useActionState(
    actionHandler as any,
    initialState
  )

  useEffect(() => {
    if (state.message) {
      toast({
        variant: state.success ? 'default' : 'destructive',
        description: state.message,
      })
    }

    if (state.success) {
      setReplayTo(null)
      // بعد از dispatch موفق:
      mutate(`/api/comments?post=${post.id}`)

      // خالی کردن ادیتور
      editorRef.current?.clear()
    }
  }, [state])

  if (!post || post == undefined)
    return (
      <Alert variant="destructive">
        <AlertCircleIcon />
        <AlertTitle>مطلب مربوطه پاک شده است.</AlertTitle>
      </Alert>
    )

  // if (needLogin) {
  //   if (!user)
  //     return <p className="py-2 text-center">برای ارسال نظر لطفا وارد شوید</p>
  //   const canCreate = can(userRoles, 'postComment.create')
  //   if (!canCreate) return <></>
  // }
  return (
    <>
      <form
        action={dispatch}
        ref={formRef}
        className="space-y-8 w-full sticky bottom-0 p-4"
      >
        <input type="hidden" name="locale" value="fa" readOnly />
        <input type="hidden" name="parent" value={replayTo?.id ?? ''} />
        {replayTo && (
          <div className="flex justify-between items-center border md:rounded-2xl py-1 px-3 bg-white dark:bg-neutral-900 md:shadow-sm ">
            <div>پاسخ به {replayTo?.author?.name || 'ناشناس'}</div>
            <Button
              type="button"
              role="button"
              size="icon"
              variant="ghost"
              onClick={() => setReplayTo(null)}
            >
              <X size={16} />
            </Button>
          </div>
        )}
        <CommentEditor
          placeholder="نظر خود را بنویسید..."
          ref={editorRef}
          name="contentJson"
          isPending={isPending}
        />
      </form>
    </>
  )
}

export default CommentForm
