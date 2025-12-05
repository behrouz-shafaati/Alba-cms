// app/api/debug/static-check/route.ts
import { NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'

export async function GET() {
  const buildDir = path.join(process.cwd(), '.next')

  // بررسی فایل‌های static
  const staticPages: string[] = []
  const serverPages: string[] = []

  try {
    // فایل‌های prerendered
    const prerenderManifest = JSON.parse(
      fs.readFileSync(path.join(buildDir, 'prerender-manifest.json'), 'utf-8')
    )

    staticPages.push(...Object.keys(prerenderManifest.routes || {}))

    return NextResponse.json({
      success: true,
      staticPagesCount: staticPages.length,
      staticPages: staticPages.slice(0, 20), // فقط 20 تا
      message:
        staticPages.length > 0
          ? '✅ صفحات Static وجود دارند'
          : '❌ هیچ صفحه Static ای وجود ندارد',
    })
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: 'Could not read build manifest',
      tip: 'Make sure you run this on production build',
    })
  }
}
