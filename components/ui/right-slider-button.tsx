import { ChevronRight } from 'lucide-react'
type Props = {
  scrollNext: () => void
}
const RightSliderButton = ({ scrollNext }: Props) => {
  return (
    <button
      onClick={scrollNext}
      className="absolute top-1/2 right-4 -translate-y-1/2 z-10 bg-black/40 text-white p-1 rounded-full hover:bg-black/70 transition"
    >
      <ChevronRight size={24} />
    </button>
  )
}

export default RightSliderButton
