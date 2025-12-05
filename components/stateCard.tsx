import React from 'react'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowUp, ArrowDown } from 'lucide-react'

interface StatCardProps {
  title: string
  value: number | string
  delta?: number // percent change e.g. +12 or -3
  description?: string // small subtitle under the title
  icon?: React.ReactNode
  className?: string
}

export default function StatCard({
  title,
  value,
  delta,
  description,
  icon,
  className,
}: StatCardProps) {
  const deltaIsPositive = typeof delta === 'number' ? delta > 0 : undefined

  return (
    <Card
      className={cn('p-4 flex items-center justify-between gap-4', className)}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-lg bg-muted/60 flex items-center justify-center">
          {icon}
        </div>
        <div>
          <CardHeader className="p-0">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {description && (
              <div className="text-xs text-muted-foreground">{description}</div>
            )}
          </CardHeader>
          <CardContent className="p-0 mt-2">
            <div className="text-2xl font-semibold">{value}</div>
          </CardContent>
        </div>
      </div>

      <div className="text-right">
        {typeof delta === 'number' ? (
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'inline-flex items-center gap-1 px-2 py-1 rounded text-sm font-medium',
                deltaIsPositive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              )}
            >
              {deltaIsPositive ? (
                <ArrowUp size={14} />
              ) : (
                <ArrowDown size={14} />
              )}
              <span>{Math.abs(delta)}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              نسبت به هفته قبل
            </div>
          </div>
        ) : (
          <div className="text-xs text-muted-foreground">&nbsp;</div>
        )}
      </div>
    </Card>
  )
}

// -----------------------
// Example usage (copy to your dashboard page)
// -----------------------
/*
import DashboardStatCard from '@/components/DashboardStatCard'
import { FileText, Eye, MessageSquare, User, Clock } from 'lucide-react'

export default function DashboardOverview({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <DashboardStatCard title="کل مطالب" value={stats.totalPosts} icon={<FileText />} delta={5} />
      <DashboardStatCard title="مطالب منتشر شده امروز" value={stats.publishedToday} icon={<FileText />} />
      <DashboardStatCard title="بازدید امروز" value={stats.viewsToday} icon={<Eye />} delta={-2} />
      <DashboardStatCard title="نظرات در انتظار" value={stats.pendingComments} icon={<MessageSquare />} />
    </div>
  )
}
*/
