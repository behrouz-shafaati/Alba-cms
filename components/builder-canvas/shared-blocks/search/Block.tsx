'use client'

import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { Button } from '@/components/ui/button'
import { MoveLeft, Search as SearchIcon, X } from 'lucide-react'
import { computedStyles } from '../../utils/styleUtils'
import Link from 'next/link'
import PostHorizontalCard from '../postList/designs/card/ArticalHorizontalCard'
import { getPosts } from '@/features/post/actions'
import { ScrollArea } from '@/components/ui/scroll-area'
import Text from '@/components/form-fields/text'
import { useDebouncedCallback } from 'use-debounce'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog'

type Props = {
  blockData: {
    content: {}
    type: 'search'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement>

const SearchBlock = ({ blockData, ...props }: Props) => {
  const locale = 'fa'
  const [open, setOpen] = useState(false)
  const [postResults, setPostResults] = useState<any>({})
  const [loading, setLoading] = useState(false)
  const [query, setQuery] = useState('')

  const debouncedSearch = useDebouncedCallback(async (q: string) => {
    if (!query) {
      setPostResults({})
      return
    }

    const fetchPosts = async () => {
      setLoading(true)
      try {
        const postResults = await getPosts({
          filters: { query },
          pagination: { page: 1, perPage: 10 },
        })
        setPostResults(postResults)
      } catch (err) {
        console.log('Search error:', err)
      }
      setLoading(false)
    }

    fetchPosts()
  }, 700)

  // گرفتن نتایج هر وقت query تغییر کرد
  useEffect(() => {
    debouncedSearch(query)
  }, [query])

  //  حالت خالی (بدون query)
  const EmptyQueryView = () => (
    <div className="flex flex-col items-center justify-center h-[60vh] text-center text-muted-foreground">
      <div>
        <SearchIcon size={60} className="opacity-50" />
      </div>
      <p className="mt-4 text-lg">عبارتی را در بخش جستجو وارد کنید...</p>
    </div>
  )

  //  حالت Loading
  const LoadingView = () => (
    <div className="flex justify-center items-center h-[40vh]">
      <div className="w-10 h-10 rounded-full border-4 border-primary border-t-transparent animate-spin" />
    </div>
  )

  //  بخش نتایج
  const ResultsList = () => (
    <div className="p-2 col-span-4 md:col-span-3">
      <div className="flex flex-col m-auto  w-full space-y-4">
        {(postResults?.data || []).map((post, idx) => {
          return (
            <div key={post.id}>
              <PostHorizontalCard
                query={query}
                post={post}
                options={{ showExcerpt: true }}
              />
            </div>
          )
        })}
      </div>

      {/* صفحه‌بندی */}
      <div className="p-4 flex justify-center items-center">
        <Link
          href={`/search?page=${1}&perPage=10&query=${query}`}
          className="text-xs text-gray-600 dark:text-gray-300 font-normal flex flex-row items-center gap-2 w-full text-center justify-center p-4"
        >
          <span>مشاهده نتایج بیشتر</span>
          <MoveLeft size={20} className="text-primary" />
        </Link>
      </div>
    </div>
  )

  return (
    <>
      <Dialog open={open} onOpenChange={() => setOpen(false)}>
        <DialogContent className={``}>
          <div className="flex flex-col">
            <div className="flex flex-row items-center gap-4 p-4 justify-between">
              <Text
                value={query}
                name="search"
                title=""
                icon={<SearchIcon className="w-4 h-4" />}
                placeholder="جستجو کنید ..."
                className="w-full "
                onChange={(e) => setQuery(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setOpen(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex flex-col m-auto justify-center w-full h-[90vh] md:h-[75vh]">
              {!query ? (
                <EmptyQueryView />
              ) : loading ? (
                <LoadingView />
              ) : postResults?.data?.length === 0 ? (
                <EmptyQueryView />
              ) : (
                <ResultsList />
              )}
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>

      <Button
        variant="ghost"
        size="icon"
        style={{
          ...computedStyles(blockData?.styles || {}),
        }}
        className={`${blockData?.classNames?.manualInputs || ''}`}
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="w-4 h-4" />
      </Button>
    </>
  )
}

export default SearchBlock
