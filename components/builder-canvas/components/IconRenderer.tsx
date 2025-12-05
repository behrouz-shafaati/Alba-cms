'use client'

import { useState, useEffect } from 'react'

interface DynamicIconProps {
  name: string
  className?: string
  size?: number
  strokeWidth?: number
}

export default function DynamicIcon({
  name,
  className = '',
  size = 20,
  strokeWidth = 2,
}: DynamicIconProps) {
  const [svgContent, setSvgContent] = useState<string | null>(null)

  useEffect(() => {
    if (!name) return

    const kebab = name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()

    fetch(`https://unpkg.com/lucide-static@latest/icons/${kebab}.svg`)
      .then((res) => (res.ok ? res.text() : null))
      .then((svg) => {
        if (!svg) {
          setSvgContent(null)
          return
        }

        // ✅ پاکسازی و تنظیم SVG
        let processed = svg
          // حذف width و height موجود
          .replace(/\s(width|height)="[^"]*"/g, '')
          // حذف style موجود
          .replace(/\sstyle="[^"]*"/g, '')
          // اضافه کردن attributes جدید
          .replace(
            '<svg',
            `<svg width="${size}" height="${size}" style="min-width:${size}px;min-height:${size}px" stroke-width="${strokeWidth}"`
          )

        setSvgContent(processed)
      })
      .catch(() => setSvgContent(null))
  }, [name, size, strokeWidth])

  if (!svgContent) {
    return (
      <span
        className={className}
        style={{
          display: 'inline-block',
          width: size,
          height: size,
          borderRadius: 4,
        }}
      />
    )
  }

  return (
    <span
      className={className}
      style={{
        display: 'inline-flex',
        lineHeight: 0,
      }}
      dangerouslySetInnerHTML={{ __html: svgContent }}
    />
  )
}
