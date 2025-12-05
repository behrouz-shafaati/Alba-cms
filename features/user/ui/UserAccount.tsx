'use client'

import React, { useState } from 'react'
import { Settings } from '@/features/settings/interface'
import { User } from '@/features/user/interface'
import { Menu } from 'lucide-react'
import { AccountUserForm } from './account-user-form'

type UserPanelProps = {
  user: User
  lodginedUser: User | null
  siteSettings?: Settings
}

type Section = 'profile' | 'orders' | 'favorites' | 'addresses'

export const UserAccount = ({
  user,
  lodginedUser,
  siteSettings,
}: UserPanelProps) => {
  const [activeSection, setActiveSection] = useState<Section>('profile')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const sections: { key: Section; label: string }[] = [
    { key: 'profile', label: 'اطلاعات کاربری' },
    // { key: 'orders', label: 'سفارشات من' },
    // { key: 'favorites', label: 'علاقه‌مندی‌ها' },
    // { key: 'addresses', label: 'آدرس‌ها' },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case 'profile':
        return <AccountUserForm user={user} lodginedUser={lodginedUser} />
      case 'orders':
        return <div>لیست سفارشات</div>
      case 'favorites':
        return <div>محصولات مورد علاقه</div>
      case 'addresses':
        return <div>آدرس‌های ثبت شده</div>
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col md:flex-row min-h-[80vh] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      {/* منوی کناری */}
      <aside className="w-full md:w-64 border-b md:border-b-0  border-gray-200 dark:border-gray-700">
        {/* موبایل: دکمه منو */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <span className="font-semibold text-lg">منوی حساب</span>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
          >
            <Menu />
          </button>
        </div>

        {/* لیست منو */}
        <nav
          className={`flex-col md:flex block ${
            mobileMenuOpen ? 'flex' : 'hidden'
          }`}
        >
          {sections.map((section) => (
            <button
              key={section.key}
              onClick={() => setActiveSection(section.key)}
              className={`w-full text-start px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-800 transition
                ${
                  activeSection === section.key
                    ? 'bg-gray-200 dark:bg-gray-800 font-semibold'
                    : ''
                }`}
            >
              {section.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* بخش اصلی */}
      <main className="flex-1 p-6">{renderSection()}</main>
    </div>
  )
}
