'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { getEmbedUrl } from '../utils'
import { ToggleGroupItem } from '@/components/ui/toggle-group'
import { Video } from 'lucide-react'

export function AddVideoButton({ editor }: { editor: any }) {
  const [open, setOpen] = useState(false)
  const [url, setUrl] = useState('')

  const insertVideo = () => {
    const embedUrl = getEmbedUrl(url)
    if (!embedUrl) {
      alert('لینک معتبر نیست.')
      return
    }

    editor
      .chain()
      .focus()
      .insertContent({
        type: 'videoEmbed',
        attrs: {
          src: embedUrl,
        },
      })
      .run()
    setUrl('')
    setOpen(false)
  }

  window.insertVideo = insertVideo

  return (
    <>
      <ToggleGroupItem
        aria-label="Add video"
        value="link"
        onClick={() => setOpen(true)}
        title="ویدئو"
      >
        <Video />
      </ToggleGroupItem>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>افزودن ویدئو</DialogTitle>
          </DialogHeader>

          <Input
            placeholder="لینک YouTube یا Aparat را وارد کنید"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />

          <DialogFooter>
            <Button onClick={insertVideo}>افزودن</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
