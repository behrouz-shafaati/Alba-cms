import HelloUser from '@/components/HelloUser'
import StatCard from '@/components/stateCard'
import { Card } from '@/components/ui/card'
import LastPostComments from '@/features/post-comment/ui/last-post-comments'
import { commentsUrl } from '@/features/post-comment/utils'
import LastPosts from '@/features/post/ui/last-alticles'
import { getStats } from '@/features/settings/controller'
import { can } from '@/lib/utils/can.client'
import { FileText, MessageSquare, User } from 'lucide-react'
import { getSession } from '@/lib/auth'
import LastForms from '@/features/form/ui/last-forms'

export default async function page() {
  const locale = 'fa'
  const { user } = await getSession()
  const stats = await getStats()
  const userRoles = user?.roles || []
  const canViewPost = can(userRoles, 'post.view.any')
  const canViewUser = can(userRoles, 'user.view.any')
  const canViewPostComment = can(userRoles, 'postComment.view.any')
  return (
    <>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <HelloUser />
        <div className="grid grid-cols-1 sm:grid-cols-2  lg:grid-cols-4 gap-4">
          {canViewPost && (
            <StatCard
              title="تعداد مطالب"
              value={stats.totalPosts}
              icon={<FileText />}
            />
          )}
          {canViewPost && (
            <StatCard
              title="مطالب منتشر شده این هفته"
              value={stats.publishedWeek}
              icon={<FileText />}
            />
          )}
          {canViewUser && (
            <StatCard
              title="تعداد کاربران"
              value={stats.totalUsers}
              icon={<User />}
            />
          )}
          {canViewPostComment && (
            <StatCard
              title="نظرات در انتظار"
              value={stats.pendingComments}
              icon={<MessageSquare />}
            />
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-1  lg:grid-cols-2 gap-4">
          {canViewPost && (
            <Card className="p-4">
              <LastPosts query={''} page={Number(page)} />
            </Card>
          )}
          {canViewPostComment && (
            <Card className="p-4">
              <LastPostComments
                filters={{ status: 'pending' }}
                refetchDataUrl={`${commentsUrl}?page=1&status=pending`}
                page={Number(page)}
              />
            </Card>
          )}
          {canViewPostComment && (
            <Card className="p-4">
              <LastForms filters={{ status: 'unread' }} page={Number(page)} />
            </Card>
          )}
        </div>
      </div>
    </>
  )
}
