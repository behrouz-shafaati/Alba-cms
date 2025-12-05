// /lib/bannerManager.ts
// Client-side only. Uses an in-memory window variable so it's cleared on refresh/navigation.

import { FallbackBehaviorType } from '@/features/campaign/interface'

type AdSlotCallback = (data: BannerData | null) => void
type AdSlotData = {
  cb: AdSlotCallback
  aspect: string
  placement: string
  linkedCampaign: string | null
  fallbackBehavior: FallbackBehaviorType
}

export type BannerData = {
  slotId: string
  file: File | null
  // you can expand this shape: imageUrl, html, target, alt, width, height ...
  html?: string
  imageUrl?: string
  alt?: string
  targetUrl: string
  campaignId: string | null
}

declare global {
  interface Window {
    __BANNER_MANAGER__?: BannerManager
  }
}

export class BannerManager {
  private slots: Record<string, AdSlotData> = {}
  private timer: number | null = null
  private maxWaitTimer: number | null = null
  private maxWaitMs = 1000 // حداکثر زمانی که منتظر می‌مانیم
  private debounceMs = 200 // debounce بعد از آخرین register
  private isFetching = false
  private sendedAlready: string[] = [] //کمپین هایی که از قبل در صفحه وجود دارند

  static getInstance(): BannerManager {
    if (typeof window === 'undefined') {
      throw new Error('BannerManager is client-only')
    }

    const currentPath = window.location.pathname

    // اگر instance از قبل هست ولی مسیر عوض شده → پاکش کن و جدید بساز
    if (
      window.__BANNER_MANAGER__ &&
      window.__BANNER_MANAGER__._lastPath !== currentPath
    ) {
      window.__BANNER_MANAGER__?.clear()
      delete window.__BANNER_MANAGER__
    }

    // اگر هنوز وجود نداره → بسازش
    if (!window.__BANNER_MANAGER__) {
      const manager = new BannerManager()
      manager._lastPath = currentPath // مسیر فعلی رو نگه می‌داریم
      window.__BANNER_MANAGER__ = manager

      // cleanup on page unload/navigation
      window.addEventListener('beforeunload', () => {
        window.__BANNER_MANAGER__?.clear()
      })

      // حذف flush در زمان مخفی شدن تب (فقط هنگام بستن تب پاک شود)
      window.addEventListener('pagehide', () => {
        window.__BANNER_MANAGER__?.flushImmediately()
      })

      // optional: if you want to flush when page becomes hidden | وقتی تب hidden میشه (مثلاً کاربر میره تب دیگه)
      // document.addEventListener('visibilitychange', () => {
      //   if (document.visibilityState === 'hidden') {
      //     window.__BANNER_MANAGER__?.flushImmediately()
      //   }
      // })
    }
    return window.__BANNER_MANAGER__
  }

  register({
    id,
    aspect,
    placement,
    linkedCampaign,
    fallbackBehavior,
    cb,
  }: {
    id: string
    aspect: string
    placement: string
    linkedCampaign: string | null
    fallbackBehavior: FallbackBehaviorType
    cb: AdSlotCallback
  }) {
    this.slots[id] = { aspect, placement, linkedCampaign, fallbackBehavior, cb }
    this.scheduleFetch()
  }

  unregister(id: string) {
    delete this.slots[id]
  }

  private scheduleFetch() {
    // reset debounce
    if (this.timer) {
      clearTimeout(this.timer)
    }
    this.timer = window.setTimeout(() => {
      this.flush()
    }, this.debounceMs)

    // start maxWait if not already started
    if (!this.maxWaitTimer) {
      this.maxWaitTimer = window.setTimeout(() => {
        this.flush()
      }, this.maxWaitMs)
    }
  }

  // flush (async) - main batch fetch
  private async flush() {
    if (this.isFetching) return
    // clear timers
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.maxWaitTimer) {
      clearTimeout(this.maxWaitTimer)
      this.maxWaitTimer = null
    }

    const ids = Object.keys(this.slots)
    if (!ids.length) return

    this.isFetching = true
    try {
      const res = await fetch('/api/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slots: this.slots,
          page: window.location.pathname, // 👈 آدرس صفحه فعلی
          sendedAlready: this.sendedAlready,
        }),
      })
      if (!res.ok) {
        console.error('banner batch fetch failed', await res.text())
        // fallback: per-id fetch
        // await this.fetchIndividually(ids)
        return
      }

      const payload: { banners: BannerData[]; sendedAlready: string[] } =
        await res.json()

      this.sendedAlready = payload.sendedAlready
      // map by id
      const map = new Map(payload.banners.map((b) => [b.slotId, b]))

      // distribute results, if a slot missing -> null
      ids.forEach((id) => {
        const cb = this.slots[id].cb
        const data = map.get(id) ?? null
        try {
          cb?.(data)
        } catch (err) {
          console.error('banner callback error', err)
        }
      })

      // if some ids not returned, try individual fetches for them
      const missing = ids.filter((id) => !map.has(id))
      if (missing.length) {
        // await this.fetchIndividually(missing)
      }
    } catch (err) {
      console.error('banner fetch error', err)
      // fallback: per-id
      // await this.fetchIndividually(Object.keys(this.slots))
    } finally {
      this.isFetching = false
    }
  }

  // immediate flush (used on visibilitychange or manual)
  async flushImmediately() {
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.maxWaitTimer) {
      clearTimeout(this.maxWaitTimer)
      this.maxWaitTimer = null
    }
    await this.flush()
  }

  // fallback: try per-id fetch (robustness)
  // private async fetchIndividually(ids: string[]) {
  //   await Promise.all(
  //     ids.map(async (id) => {
  //       try {
  //         const r = await fetch('/api/banners/' + encodeURIComponent(id))
  //         if (!r.ok) {
  //           this.slots[id]?.(null)
  //           return
  //         }
  //         const data: BannerData = await r.json()
  //         this.slots[id]?.(data)
  //       } catch (err) {
  //         console.error('individual banner fetch failed', id, err)
  //         this.slots[id]?.(null)
  //       }
  //     })
  //   )
  // }

  // clear in-memory state
  clear() {
    this.slots = {}
    if (this.timer) {
      clearTimeout(this.timer)
      this.timer = null
    }
    if (this.maxWaitTimer) {
      clearTimeout(this.maxWaitTimer)
      this.maxWaitTimer = null
    }
    this.isFetching = false
  }
}
