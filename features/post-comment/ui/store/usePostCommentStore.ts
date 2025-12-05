import { create } from 'zustand'
import { PostComment } from '../../interface'

type State = {
  replayTo: PostComment | null
  setReplayTo: (postComment: PostComment | null) => void
  getReplayTo: () => PostComment | null
}

export const usePostCommentStore = create<State>((set, get) => ({
  replayTo: null,
  setReplayTo: (postComment) => set({ replayTo: postComment }),
  getReplayTo: () => {
    return get().replayTo
  },
}))
