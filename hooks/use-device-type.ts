import { useEffect, useState } from 'react'

type Props = {
  initial?: 'desktop' | 'tablet' | 'mobile'
}

export function useDeviceType({ initial = 'desktop' }: Props = {}) {
  const [device, setDevice] = useState<'desktop' | 'tablet' | 'mobile'>(initial)

  useEffect(() => {
    if (typeof window === 'undefined') return // جلوگیری از خطای SSR
    const update = () => {
      if (window.matchMedia('(max-width: 640px)').matches) setDevice('mobile')
      else if (window.matchMedia('(max-width: 1024px)').matches)
        setDevice('tablet')
      else setDevice('desktop')
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return device
}
