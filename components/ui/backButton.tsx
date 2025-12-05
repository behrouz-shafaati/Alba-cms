import { useRouter } from 'next/navigation'
import { Button } from './button'
import { ChevronRight } from 'lucide-react'

type Props = {
  onClick?: () => void
}

const BackButton = ({ onClick }: Props) => {
  const router = useRouter()
  return (
    <Button
      type="button"
      variant="ghost"
      onClick={() => {
        if (onClick) onClick()
        else router.back()
      }}
    >
      <ChevronRight />
    </Button>
  )
}

export default BackButton
