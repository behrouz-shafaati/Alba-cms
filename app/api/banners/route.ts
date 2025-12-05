// /app/api/banners/route.ts
import postCtrl from '@/features/post/controller'
import campaignCtrl from '@/features/campaign/controller'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

type BannerData = {
  id: string
  imageUrl?: string
  html?: string
  alt?: string
}

export async function POST(req: Request) {
  try {
    const h = await headers()
    const referer = h.get('referer') || ''

    // استخراج فقط path از referer
    let refererPath = ''
    try {
      refererPath = new URL(referer).pathname
    } catch {
      refererPath = referer // fallback
    }

    const body = await req.json()
    console.log('#99999999999999999999999999999 body:', body)

    // انتخاب مسیر اصلی: از body یا از referer
    const rawPath = body?.page || refererPath

    // Decode مسیر برای فارسی و یونیکد
    const decodedPath = decodeURIComponent(rawPath)
    console.log('🔹 requested from decodedPath:', decodedPath)

    // ✅ گرفتن آخرین بخش مسیر (slug)
    const parts = decodedPath.split('/').filter(Boolean) // حذف اسلش‌های خالی
    const slug = parts.at(-1) || '' // آخرین بخش آدرس

    console.log('🔹 requested from slug:', slug)

    const results = await campaignCtrl.getBanners({
      adSlots: body.slots,
      originPostSlug: slug,
      sendedAlready: body.sendedAlready,
      locale: 'fa',
    })
    return NextResponse.json(results, { status: 200 })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ error: 'invalid' }, { status: 400 })
  }
}
