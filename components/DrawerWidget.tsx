import { Button } from './ui/button'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from './ui/drawer'

type DrawerWidgetProps = {
  triggerLabel: any
  title?: any
  description?: any
  content: any
  onApproveLabel?: any
  onApprove?: () => void
}

export function DrawerWidget({
  triggerLabel,
  title,
  description,
  content,
  onApproveLabel,
  onApprove,
}: DrawerWidgetProps) {
  return (
    <Drawer>
      {triggerLabel && (
        <DrawerTrigger asChild>
          <Button variant="outline">{triggerLabel}</Button>
        </DrawerTrigger>
      )}
      <DrawerContent>
        <div className="mx-auto w-full max-w-sm">
          <DrawerHeader>
            {title && <DrawerTitle>{title}</DrawerTitle>}
            {description && (
              <DrawerDescription>{description}</DrawerDescription>
            )}
          </DrawerHeader>
          <div className="p-4 pb-0">{content}</div>
          <DrawerFooter>
            {onApprove !== undefined && onApproveLabel && (
              <Button type="button" role="button">
                {onApproveLabel}
              </Button>
            )}
            <DrawerClose asChild>
              <Button variant="outline" type="button" role="button">
                بستن
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
