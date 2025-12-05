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
import Text from '@/components/form-fields/text'

type Props = {
  approveChangeMobile: (value: string) => void
  state: any
}

export function EditMobileButton({ approveChangeMobile, state }: Props) {
  const [open, setOpen] = useState(false)
  const [mobile, setMobile] = useState<string>('')
  return (
    <>
      <Button
        role="button"
        type="button"
        size="sm"
        aria-label="Edit Mobile"
        onClick={() => setOpen(true)}
        variant="link"
      >
        ویرایش موبایل
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش شماره موبایل</DialogTitle>
          </DialogHeader>

          <Text
            title="موبایل"
            name="editMobile"
            type="text"
            placeholder="موبایل را وارد کنید"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            state={state}
          />

          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              بستن
            </Button>
            <Button onClick={() => approveChangeMobile(mobile)}>تایید</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
