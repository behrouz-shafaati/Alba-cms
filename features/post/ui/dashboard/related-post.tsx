import { getTranslation } from '@/lib/utils'
import { Post } from '../../interface'
import { useEffect, useState } from 'react'
import { getPosts } from '../../actions'
import { CopyButton } from '@/components/ui/shadcn-io/copy-button'
import { Card } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

type Props = {
  post: Post
  className?: string
}

export default function RelatedPostsDashboard({ post, className = '' }: Props) {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchData = async () => {
      if (post) {
        const r = await getPosts({
          filters: { categories: { $in: post.categories } },
        })
        setPosts(r?.data)
      }
    }
    fetchData()
  }, [])
  if (posts.length == 0) return <></>
  return (
    <Card className={`${className}`}>
      <div className=" border-b p-4">پیشنهادات پیوند</div>
      <ScrollArea className="md:h-[calc(100vh/3)] ">
        {posts.map((post: Post, idx: number) => {
          const t = getTranslation({ translations: post.translations })
          return (
            <div
              className="flex justify-between items-center gap-2 px-4 py-1"
              key={idx}
            >
              <p className="m-0">{t?.title}</p>

              <CopyButton
                variant={'ghost'}
                type="button"
                content={post?.href}
                onCopy={() => console.log('Link copied!')}
                size="sm"
                title="کپی لینک"
              />
            </div>
          )
        })}
      </ScrollArea>
    </Card>
  )
}
