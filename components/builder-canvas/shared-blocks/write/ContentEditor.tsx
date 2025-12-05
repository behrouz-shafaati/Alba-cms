// پنل تنظیمات برای این بلاک
import React from 'react'
import { useBuilderStore } from '../../store/useBuilderStore'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import TiptapEditorLazy from '@/components/tiptap-editor/TiptapEditorLazy'

type Props = {
  initialData: any
}

export const ContentEditor = ({ initialData }: Props) => {
  const { selectedBlock, update } = useBuilderStore()
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          ویرایش نوشته
        </Button>
      </DialogTrigger>
      <DialogContent className="mb-8  grid-cols-1 auto-rows-max min-w-[calc(100vw-2rem)]">
        <DialogHeader>
          <DialogTitle>ویرایش نوشته</DialogTitle>
          <DialogDescription>
            متن طولانی بنویسد، آکاردئون، فیلم، عکس یا جدول بسازید.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-4rem)] w-full overflow-auto pb-12 px-4">
          {/* contentJson */}
          <TiptapEditorLazy
            // attachedFilesTo={[
            //   { feature: 'post', id: post?.id || null },
            // ]}
            name="contentJson"
            defaultContent={
              selectedBlock?.content?.json
                ? JSON.parse(selectedBlock?.content?.json)
                : {}
            }
            // onChangeFiles={submitManually}
            className="h-full"
            onChange={(content) =>
              update(selectedBlock?.id as string, 'content', {
                json: content,
              })
            }
          />
          <div className="h-4"></div>
        </ScrollArea>
        <DialogFooter className="fixed bottom-0 w-full p-4">
          <DialogClose asChild>
            <Button variant="outline">بستن</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )

  // <writearea
  //   key={`write-block-${selectedBlock.id}`} //  باعث میشه فرم کاملاً ری‌ست و رندر بشه
  //   defaultValue={selectedBlock?.content.write}
  //   name="content"
  //   className="w-full ltr"
  //   read-only="true"
  //   onChange={(e) =>
  //     update(selectedBlock?.id as string, 'content', {
  //       write: e.target.value,
  //     })
  //   }
  // />
}
