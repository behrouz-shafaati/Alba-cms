// app/components/FastLink.tsx
import Link from 'next/link'

export function FastLink({ prefetch = false, ...props }: any) {
  return <Link prefetch={prefetch} {...props} />
}
