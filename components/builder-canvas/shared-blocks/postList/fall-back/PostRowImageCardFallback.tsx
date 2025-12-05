import PostImageCardSkeltone from '../../postList.server/designs/card/skeleton/ImageCardSkeleton'

export default function PostRowImageCardFallback() {
  return (
    <div className="flex flex-row w-full overflow-hidden gap-2">
      {' '}
      {new Array(6).fill({}).map((p) => (
        <PostImageCardSkeltone />
      ))}
    </div>
  )
}
