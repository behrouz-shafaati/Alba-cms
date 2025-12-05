// components/debug/HydrationDebug.tsx
'use client'

import { useEffect } from 'react'

export function HydrationDebug() {
  useEffect(() => {
    const now = performance.now()
    console.log(`⚡ Hydration completed at: ${Math.round(now)}ms`)

    // Check for hydration errors
    const hydrationTime = now - performance.timing.responseEnd
    console.log(`⚡ Time since HTML received: ${Math.round(hydrationTime)}ms`)

    // Log all resources
    const resources = performance.getEntriesByType('resource')
    const jsResources = resources.filter((r) => r.name.includes('.js'))
    console.table(
      jsResources.map((r) => ({
        name: r.name.split('/').pop(),
        duration: Math.round(r.duration),
        size: r.transferSize,
      }))
    )
  }, [])

  return null
}
