// import { cookies } from 'next/headers'
// import { decrypt } from '@/lib/auth'
import { NextResponse } from 'next/server'
import { parseQuery } from '@/lib/utils'
import postCommentCtrl from '@/features/post-comment/controller'

export async function GET(req: Request) {
  try {
    const query = parseQuery(req)

    //   const cookieStore = await cookies()
    // const session = cookieStore.get('session')?.value
    // if (!session) {
    //   return Response.json(null)
    // }
    // return Response.json(await decrypt(session))

    const commentsResult = await postCommentCtrl.find(query, false)
    return NextResponse.json(commentsResult)
  } catch (err) {
    console.error('Error fetching comments:', err)
    return NextResponse.json(
      { error: 'Failed to fetch comments' },
      { status: 500 }
    )
  }
}
