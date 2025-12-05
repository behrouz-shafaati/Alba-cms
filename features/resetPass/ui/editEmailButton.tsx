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
  approveChangeEmail: (value: string) => void
  state: any
}

export function EditEmailButton({ approveChangeEmail, state }: Props) {
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState<string>('')
  return (
    <>
      <Button
        role="button"
        type="button"
        size="sm"
        aria-label="Edit Email"
        onClick={() => setOpen(true)}
        variant="link"
      >
        ویرایش ایمیل
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>ویرایش ایمیل</DialogTitle>
          </DialogHeader>

          <Text
            title="ایمیل"
            name="editEmail"
            type="email"
            placeholder="ایمیل را وارد کنید"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            state={state}
          />

          <DialogFooter className="flex gap-2">
            <Button variant="ghost" onClick={() => setOpen(false)}>
              بستن
            </Button>
            <Button onClick={() => approveChangeEmail(email)}>تایید</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
