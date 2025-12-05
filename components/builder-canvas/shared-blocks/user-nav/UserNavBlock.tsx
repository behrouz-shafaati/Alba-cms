// // کامپوننت نمایشی بلاک
//UserNavBlock.tsx
'use client'
import React, { useEffect, useState } from 'react'
import { Block } from '../../types'
import { UserNav } from './UserNav'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CircleUserRound } from 'lucide-react'
import { Skeleton } from '@/components/ui/skeleton'

type props = {
  blockData: {
    content: {}
    type: 'userNav'
    settings: {}
  } & Block
} & React.HTMLAttributes<HTMLParagraphElement> // ✅ اجازه‌ی دادن onclick, className و ...

const UserNavBlock = ({ blockData, ...props }: props) => {
  const [loading, setLoading] = useState(true)
  const [session, setSession] = useState(null)
  // const { user } = useSession()
  const { content } = blockData
  useEffect(() => {
    fetch('/api/session')
      .then((res) => res.json())
      .then((data) => {
        setSession(data)
        setLoading(false)
      })
  }, [])
  console.log('#session:', session)
  if (loading) {
    return (
      <div {...props}>
        <Skeleton className="h-6 w-6 rounded-full" />
      </div>
    )
  }
  if (!session) {
    return (
      <Link href={`/login`} {...props}>
        <Button variant={'ghost'} className="p-0">
          <CircleUserRound />
        </Button>
      </Link>
    )
  }
  return <UserNav blockData={blockData} user={session?.user} {...props} />
}
export default UserNavBlock
