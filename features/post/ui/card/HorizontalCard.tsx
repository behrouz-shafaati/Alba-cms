// components/HorizontalCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type HorizontalCardProps = {
  imageUrl?: string
  title: string
  excerpt: string
  href: string
}

export default function HorizontalCard({
  imageUrl,
  title,
  excerpt,
  href,
}: HorizontalCardProps) {
  return (
    <Card className="w-full flex flex-col sm:flex-row overflow-hidden rounded-xl shadow-sm break-inside-avoid">
      {imageUrl && (
        <div className="relative h-48 sm:h-auto sm:w-48 flex-shrink-0">
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        </div>
      )}
      <CardContent className="p-4 flex flex-col gap-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground line-clamp-3">{excerpt}</p>
        <Button asChild className="mt-auto w-fit">
          <Link href={href}>ادامه مطلب</Link>
        </Button>
      </CardContent>
    </Card>
  )
}
