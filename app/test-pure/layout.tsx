import { HydrationDebug } from '@/components/debug/HydrationDebug'

// app/test-pure/layout.tsx
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <body>{children}</body>
    </html>
  )
}
