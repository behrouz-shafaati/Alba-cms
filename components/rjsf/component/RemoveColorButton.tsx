'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RemoveColorButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /**
   * کلاس tailwind برای swatch (مثلاً "bg-gray-500" یا "bg-red-400").
   * اگر ندادید، یک پس‌زمینه خنثی نمایش داده می‌شود.
   */
  swatchClass?: string
}

/**
 * دکمه حذف رنگ — بدون متن، فقط آیکون/مربع رنگی + خط قرمز اریب
 */
export function RemoveColorButton({
  swatchClass,
  className,
  ...props
}: RemoveColorButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'relative w-10 h-10 p-0 flex items-center justify-center overflow-visible',
        className
      )}
      aria-label="Remove color"
      {...props}
    >
      {/* برای صفحه‌خوان‌ها */}
      <span className="sr-only">Remove color</span>

      {/* مربع رنگ (swatch) */}
      <div className="relative w-6 h-6 rounded-sm overflow-hidden flex-shrink-0">
        {/* رنگ واقعی */}
        <div
          className={cn(
            'absolute inset-0',
            swatchClass ?? 'bg-gray-200 dark:bg-gray-700'
          )}
          aria-hidden
        />

        {/* خط اریب قرمز — اندازه و زاویه با inline style برای دقت */}
        <div
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{
            width: '120%',
            transform: 'translate(-50%, -50%) rotate(-25deg)',
          }}
        >
          <div className="h-[2px] w-full bg-red-600 rounded-full shadow-sm" />
        </div>
      </div>
    </Button>
  )
}
