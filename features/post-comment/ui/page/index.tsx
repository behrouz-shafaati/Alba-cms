import PostCommentList from '../list'

type props = {
  query: string
  page?: string | number
}

export default function DefaultPageBlog({ page, query }: props) {
  return (
    <div className="w-full m-auto">
      <div className="aspect-[4/1] text-center flex items-center justify-center flex-col bg-slate-50 dark:bg-slate-900 rounded-2xl m-4">
        <h1 className="scroll-m-20 text-center text-4xl font-extrabold tracking-tight text-balance">
          مطالب
        </h1>
      </div>
      <PostCommentList page={Number(page)} query={query} />
    </div>
  )
}
