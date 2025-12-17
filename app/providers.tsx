'use client'

import { ThemeProvider } from '@/components/context/theme-provider'
import ToasterLazy from '@/components/ui/toasterLazy'

interface ProvidersProps {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
      <ToasterLazy />
    </ThemeProvider>
  )
}
