import { Button } from '@/components/ui/button'
import { usePostCommentStore } from './store/usePostCommentStore'
import { Reply } from 'lucide-react'

type props = {
  postComment: any
}
export default function ReplayCOmmentButton({ postComment }: props) {
  const { setReplayTo } = usePostCommentStore()
  return (
    <Button
      size="sm"
      variant="ghost"
      className="flex gap-1"
      onClick={() => setReplayTo(postComment)}
    >
      <Reply size={16} /> پاسخ
    </Button>
  )
}
