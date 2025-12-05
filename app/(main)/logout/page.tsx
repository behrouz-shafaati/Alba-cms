'use client'
import { useEffect } from 'react'

export default function Page() {
  useEffect(() => {
    const logout = async () => {
      await fetch('/api/logout', {
        method: 'POST',
      })
      window.location.href = '/login' // یا هر صفحه‌ای که می‌خوای
    }
    logout()
  }, [])
}
