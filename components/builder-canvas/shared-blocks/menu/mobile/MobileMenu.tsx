import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { MenuIcon } from 'lucide-react'
import MobileMenuList from './MobileMenuList'

type Props = {
  items: any
}

export default function MobileMenu({ items }: Props) {
  return (
    <div className="md:hidden">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <MenuIcon className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="p-4 overflow-y-auto ">
          <MobileMenuList items={items} />
        </SheetContent>
      </Sheet>
    </div>
  )
}
