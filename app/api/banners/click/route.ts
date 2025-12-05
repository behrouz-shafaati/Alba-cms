// /app/api/banners/click/route.ts
import campaignMetricCtrl from '@/features/campaign-metric/controller'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  const { campaignId, slotId, locale } = await req.json()
  if (!campaignId) return NextResponse.json({ ok: false })

  const today = new Date()
  today.setUTCHours(0, 0, 0, 0)

  if (campaignId)
    await campaignMetricCtrl.addClick({ campaignId, slotId, locale })

  return NextResponse.json({ ok: true })
}
