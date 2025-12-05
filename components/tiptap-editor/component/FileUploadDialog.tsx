import FileUpload from '@/components/form-fields/file-upload'
import { Button } from '@/components/ui/button'

import { ScrollArea } from '@/components/ui/scroll-area'

type FileUploadDialogProps = {
  open: boolean
  onClose: (open: boolean) => void
  fileUploadSettings: any
}

export default function FileUploadDialog({
  open,
  onClose,
  fileUploadSettings,
}: FileUploadDialogProps) {
  return (
    <div
      id="file-upload-root"
      style={{ display: open ? 'block' : 'none' }}
      className="fixed inset-0 bg-black bg-opacity-50 w-[100vw] h-[100vh] z-20 md:p-4 overflow-auto"
    >
      <div className="w-[100vw] h-[100vh] md:w-[90vw] md:h-[90vh] relative  mx-auto bg-white dark:bg-neutral-800 p-4 rounded-lg shadow-lg grid-cols-1 auto-rows-max">
        <Button
          className="absolute top-4 left-4 z-[21]"
          variant="outline"
          size="icon"
          onClick={() => onClose(false)}
        >
          ✕
        </Button>
        <ScrollArea className="px-6 pb-16 h-full ">
          <FileUpload
            key={
              fileUploadSettings.defaultFiles?.map((f) => f.id).join(',') ||
              'empty'
            } // 👈 تغییر باعث remount میشه
            attachedTo={fileUploadSettings.attachedFilesTo}
            name={fileUploadSettings.name}
            title="رسانه های مطلب"
            responseHnadler={fileUploadSettings.responseFileUploadHandler}
            ref={fileUploadSettings?.fileUploadRef}
            showDeleteButton={false}
            defaultValues={fileUploadSettings.defaultFiles}
            {...(fileUploadSettings.onChangeFiles
              ? { onChange: fileUploadSettings.onChangeFiles }
              : {})}
            {...(fileUploadSettings.updateFileDetailsHandler
              ? {
                  updateFileDetailsHandler:
                    fileUploadSettings.updateFileDetailsHandler,
                }
              : {})}
            onLoading={fileUploadSettings?.onLoading}
            allowedFileTypes={['image']}
          />
        </ScrollArea>
      </div>
    </div>
  )
}
