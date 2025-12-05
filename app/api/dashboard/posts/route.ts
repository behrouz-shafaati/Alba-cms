import { NextResponse } from 'next/server'
import { parseQuery } from '@/lib/utils'
import postCtrl from '@/features/post/controller'

export async function GET(req: Request) {
  try {
    const query = parseQuery(req)

    const postResult = await postCtrl.find(query)
    return NextResponse.json(postResult)
  } catch (err) {
    console.error('Error fetching comments:', err)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
