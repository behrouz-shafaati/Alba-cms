// components/VerticalCard.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

type VerticalCardProps = {
  imageUrl?: string
  title: string
  excerpt: string
  href: string // URL of the post
}

export default function VerticalCard({
  imageUrl,
  title,
  excerpt,
  href,
}: VerticalCardProps) {
  return (
    <Card className="w-full max-w-sm overflow-hidden flex flex-col rounded-xl shadow-sm break-inside-avoid">
      {imageUrl && (
        <div className="relative w-full aspect-[2/1]">
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
