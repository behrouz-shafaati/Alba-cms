// app/api/file/[...path]/route.ts
import { NextResponse } from 'next/server'
import { createReadStream, existsSync, statSync } from 'fs'
import { join } from 'path'
import mime from 'mime'

export async function GET(
  req: Request,
  { params }: { params: { path: string[] } }
) {
  try {
    const { path } = await params // <<— درباره این خط پایین‌تر توضیح دادم
    const filePath = join(process.cwd(), 'uploads', ...path)

    if (!existsSync(filePath)) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 })
    }

    const mimeType = mime.getType(filePath) || 'application/octet-stream'
    const stat = statSync(filePath)

    return new NextResponse(createReadStream(filePath) as any, {
      headers: {
        'Content-Type': mimeType,
        'Content-Length': stat.size.toString(),
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}
