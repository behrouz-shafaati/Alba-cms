'use client'

import { useState } from 'react'
import {
  Facebook,
  Instagram,
  Send as Telegram,
  Link as LinkIcon,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type ShareButtonsProps = {
  url: string
  title?: string
}

export default function ShareButtons({
  url,
  title = 'اشتراک‌گذاری',
}: ShareButtonsProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const shareLinks = {
    telegram: `https://t.me/share/url?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`,
    instagram: `https://www.instagram.com/?url=${encodeURIComponent(url)}`,
  }

  return (
    <div className="flex items-center gap-2 flex-wrap">
      {/* Telegram */}
      <a href={shareLinks.telegram} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon" title="اشتراک‌گذاری در تلگرام">
          <Telegram className="w-4 h-4 text-sky-500" />
        </Button>
      </a>

      {/* Facebook */}
      <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon" title="اشتراک‌گذاری در فیسبوک">
          <Facebook className="w-4 h-4 text-blue-600" />
        </Button>
      </a>

      {/* Instagram (فقط لینک صفحه باز می‌کند) */}
      <a href={shareLinks.instagram} target="_blank" rel="noopener noreferrer">
        <Button variant="ghost" size="icon" title="اشتراک‌گذاری در اینستاگرام">
          <Instagram className="w-4 h-4 text-pink-500" />
        </Button>
      </a>

      {/* Copy link */}
      <Button
        variant="ghost"
        size="icon"
        onClick={handleCopy}
        title="کپی لینک مطلب"
      >
        {copied ? (
          <Check className="w-4 h-4 text-green-500" />
        ) : (
          <LinkIcon className="w-4 h-4" />
        )}
      </Button>
    </div>
  )
}
