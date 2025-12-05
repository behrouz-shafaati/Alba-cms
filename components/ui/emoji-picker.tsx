'use client'

import * as React from 'react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Smile } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

interface EmojiPickerProps {
  onSelect: (emoji: string) => void
}

export default function EmojiPicker({ onSelect }: EmojiPickerProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [PickerComponent, setPickerComponent] =
    React.useState<React.ComponentType<any> | null>(null)
  const [emojiData, setEmojiData] = React.useState<any>(null)
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const loadPicker = React.useCallback(async () => {
    if (PickerComponent && emojiData) return

    setIsLoading(true)
    setError(null)

    try {
      // ✅ Picker از npm، Data از CDN
      const [pickerModule, dataResponse] = await Promise.all([
        import('@emoji-mart/react'),
        fetch(
          'https://cdn.jsdelivr.net/npm/@emoji-mart/data@latest/sets/15/native.json'
        ),
      ])

      if (!dataResponse.ok) {
        throw new Error('Failed to fetch emoji data')
      }

      const data = await dataResponse.json()

      setPickerComponent(() => pickerModule.default)
      setEmojiData(data)
    } catch (err) {
      console.error('Failed to load emoji picker:', err)
      setError('خطا در بارگذاری')
    } finally {
      setIsLoading(false)
    }
  }, [PickerComponent, emojiData])

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open)
    if (open) {
      loadPicker()
    }
  }

  const getTheme = () => {
    if (typeof window === 'undefined') return 'light'
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light'
  }

  return (
    <Popover open={isOpen} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          aria-label="انتخاب ایموجی"
          onMouseEnter={loadPicker} // ← Preload on hover
          onFocus={loadPicker} // ← Preload on focus
        >
          <Smile className="h-5 w-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0 w-[352px] h-[435px]" align="start">
        {error ? (
          <div className="w-full h-full flex items-center justify-center text-destructive">
            {error}
          </div>
        ) : isLoading || !PickerComponent || !emojiData ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="space-y-3 p-4 w-full">
              <Skeleton className="h-10 w-full" />
              <div className="grid grid-cols-8 gap-2">
                {Array.from({ length: 40 }).map((_, i) => (
                  <Skeleton key={i} className="h-8 w-8 rounded" />
                ))}
              </div>
            </div>
          </div>
        ) : (
          <PickerComponent
            data={emojiData}
            onEmojiSelect={(emoji: any) => {
              onSelect(emoji.native)
              setIsOpen(false)
            }}
            theme={getTheme()}
            locale="fa"
            previewPosition="none"
            skinTonePosition="search"
          />
        )}
      </PopoverContent>
    </Popover>
  )
}
