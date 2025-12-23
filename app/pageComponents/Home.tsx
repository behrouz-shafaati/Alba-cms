import 'server-only'
import AlbaFallback from '@/components/AlbaFallback'
import { PageRenderer } from '@/components/builder-canvas/pageRenderer'
import pageCtrl from '@/features/page/controller'

type Props = {
  searchParams?: any
}
export default async function HomePage({ searchParams = {} }: Props) {
  const locale = 'fa'
  const [homePage] = await Promise.all([pageCtrl?.getHomePage()])
  if (homePage != null) {
    return (
      <PageRenderer
        page={homePage}
        locale={locale}
        searchParams={searchParams}
      />
    )
  }
  return <AlbaFallback />
}
